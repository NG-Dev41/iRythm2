import { Injectable, OnDestroy } from '@angular/core';

import { Observable, of, Subscription } from 'rxjs';
import { Canvas } from 'fabric/fabric-impl';
import { fabric } from 'fabric';

import {
    IEcgCaliperAction,
    IEcgCaliperActionChannel,
    IEcgControllerInit,
    IEcgGainChangeChannel,
    IEcgHighlighterMovingChannel
} from 'app/modules/ecg/interfaces';
import {
    EcgCaliperActionType,
    EcgChannelKey,
    EcgComponentKey,
    EcgLineActionType,
    EcgStripType,
    EcgStripChannelKey,
    EcgViewType
} from 'app/modules/ecg/enums';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';
import { RecordSidebarService } from 'app/features/record/services/record-sidebar.service';
import { EcgBaseController } from 'app/modules/ecg/services/controller/base/ecg-base-controller.service';
import { EcgDto } from 'app/modules/ecg/services/dto/ecg/ecg-dto.service';
import { EcgStripConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-strip-config-dto.service';
import { EcgNotifier } from 'app/modules/ecg/services/notifier/ecg/ecg-notifier.service';
import { EcgStripUtils } from 'app/modules/ecg/services/utils/ecg-strip-utils.service';
import { EcgStripNotifier } from 'app/modules/ecg/components/children/strip/services/notifier/ecg-strip-notifier.service';
import { EcgStripControllerFactory } from './ecg-strip-controller-factory.service';
import { EcgLineController } from '../../../../../../../services/controller/line-controller/ecg-line-controller.service';
import { EcgBeatController } from '../../../../../../../services/controller/beat-controller/ecg-beat-controller.service';
import { EcgHighlighterRenderer } from './highlighter/ecg-highlighter-renderer.service';
import { EcgCaliperRenderer } from './caliper/ecg-caliper-renderer.service';


/**
 * Commander/Delegator/Master
 * Top level strip controller
 */
@Injectable()
export class EcgStripController extends EcgBaseController implements OnDestroy {

    // Flag to determine if config has been loaded
    public configReady: boolean = false;

    // Strip child controllers
    public controllers: Map<String, EcgBaseController> = new Map<string, EcgBaseController>();

    // we will hold references to all the Observable subscriptions here so that we may manage them easily
    private allSubscriptions: Subscription = new Subscription();


    /**
     * Ctor
     */
    public constructor(
        public dto: EcgDto,
        private notifier: EcgNotifier,
        private stripNotifier: EcgStripNotifier,
        private controllerFactory: EcgStripControllerFactory,
        private stripConfig: EcgStripConfigDto,
        private stripUtils: EcgStripUtils,
        private recordSidebarService: RecordSidebarService,
        private ecgConfig: EcgConfigDto
    ) {
        super();
        this.setComponentKey();
    }


    /**
     * Merge user config with default config.
     *
     * Init/Calculate any config properties need by the canvas element
     * to render correctly. Additionally
     *
     * Canvas Container, Canvas Obj, Canvas BG height/width
     *
     * @param {IEcgConfigStrip} configs
     */
    public processConfig(): void {

        if (!this.stripConfig.ct.html) this.stripConfig.ct.html = {};

        // Calculate various global configuration properties
        // NOTE: It is important the order in which the config properties are calculated
        // -------------------------------------------------------------------------------------------

	    this.stripConfig.ct.global.region = this.stripUtils.getRegionKey();

        // Determine if we're showing beats or not
        this.stripConfig.ct.beats.show = this.stripUtils.calcShowBeats();

        // Get number of seconds being shown in the strip/line
        this.stripConfig.ct.global.numSecondsViewable = this.stripUtils.calcNumSecondsViewable();

        // Get total number of seconds represented by the ecg sample data
        // TODO: We may want to move this higher up in the chain of command
        this.stripConfig.ct.global.numTotalSeconds = this.stripUtils.calcNumTotalSeconds();

        // Get resolution scale
        this.stripConfig.ct.global.resolutionScale = this.stripUtils.calcResolutionScale();

        // Calculate overflow width
        this.stripConfig.ct.global.overflowWidth = this.stripUtils.calcOverflowWidth();

        // Get total canvas height
        //this.stripConfig.ct.global.height = this.stripUtils.calcGlobalHeight();

	    this.stripConfig.ct.line.height = (this.stripConfig.ct.global.height / this.stripUtils.calcNumRows()) - ((this.stripConfig.ct.beats.showLines) ? this.stripConfig.ct.beats.lineHeight : 0);

        // Finally set the flag that the config init is done
        // This flag is used in the template to allow the canvas to render
        // Can't let it render until all the config is ready to go
        this.configReady = true;
    }

    /**
     * Init Top Level Window Functionality:
     *
     * @return {Observable<IEcgControllerInit>}
     */
    public init(): Observable<IEcgControllerInit> {
        // Init listeners
        this.initListeners();

        // Init child canvas renderer controllers
        this.initStripControllers();

        return of({
            success: true,
        });
    }

    /**
     * Inits notification channel listeners
     */
    private initListeners(): void {
        this.gainListener();
        this.highlighterListener();
        this.initCaliperListener();
    }

    /**
     * If this is the parent strip...
     * Listen for position notifications from the highlighter
     * and adjust the parent line
     */
    private highlighterListener(): void {

        // Only parent strip listens to highlighter movements
        if (this.stripConfig.ct.global.type === EcgStripType.PARENT) {
            this.allSubscriptions.add(this.notifier.listen(EcgChannelKey.HIGHLIGHTER_MOVING).subscribe((data: IEcgHighlighterMovingChannel) => {
                // Notification of the child window highlighter movement received
                // Move parent line to the same location
                this.stripConfig.ct.html.scrollContainer.scrollTo({
                    left: data.x,
                    behavior: data.parentScrollBehavior,
                });
            }));
        }
    }

    /**
     * Listens for changes to gain. Applies to parent strip only.
     * This method should fire for both parent and child strips
     */
    private gainListener(): void {

        // When user modifies the gain - we only want the Parent strip to respond to this
        if (this.stripConfig.ct.global.type === EcgStripType.PARENT) {
            // List for messages over the GAIN_CHANGE channel
            this.allSubscriptions.add(this.notifier.listen(EcgChannelKey.GAIN_CHANGE).subscribe((data: IEcgGainChangeChannel) => {
                // Now send a message to the LineController that the lines need to be rerendered
                this.notifier.send(EcgChannelKey.LINE_RENDER_ACTION, {
                    actions: [
                        {
                            type: EcgLineActionType.LOAD_POINTS,
                        },
                    ],
                });
            }));
        }
    }

    /**
     * Listens for the user setting the caliper edges
     * Exists to pass the edges to the ECG controller
     * @private
     */
    private initCaliperListener(): void {

        this.allSubscriptions.add(this.stripNotifier.listen(EcgStripChannelKey.CALIPER_ACTION).subscribe((data: IEcgCaliperActionChannel) => {
            data.actions.forEach((action: IEcgCaliperAction) => {
                switch (action.type) {
                    case EcgCaliperActionType.PAINT_INTERVAL:
                        // Comment (May need to revisit this approach)
                        this.recordSidebarService.enablePaintingStrip();
                        // sets the intervals on the recordDto
                        this.recordSidebarService.setIntervals(action?.paintInterval.left, action?.paintInterval.right);
                }
            });
        }));
    }

    /**
     * Sets canvas related elements onto the stripConfig.
     *
     * @param {HTMLElements} elements
     */
    public setHtmlElements(elements: {
        bgImg?: HTMLImageElement;
        canvas: HTMLCanvasElement;
        scrollContainer?: HTMLElement;
        positioner?: HTMLElement;
    }): void {
        // Main ecg lines canvas/container/and canvas image
        this.stripConfig.ct.html.baseHtmlCanvas = elements.canvas;
        this.stripConfig.ct.html.canvas = this.initFabricCanvas(elements.canvas);
        this.stripConfig.ct.html.scrollContainer = elements.scrollContainer;
        this.stripConfig.ct.html.positioner = elements.positioner;
        this.stripConfig.ct.html.bgImg = elements.bgImg;
    }

    /**
     * Method will init all necessary strip child controllers.
     * Only child controllers should be canvas related controllers
     *
     * @param {EcgStripControllerFactory} factory
     */
    public initStripControllers(): void {
        this.registerController(this.controllerFactory.getLineController(), 'line');
        this.registerController(this.controllerFactory.getBeatsController(), 'beats');
        this.registerController(this.controllerFactory.getHighlighterRenderer(), 'highlighter');
        this.registerController(this.controllerFactory.getCaliperRenderer(), 'caliper');
    }

    /**
     * Method registers/merges config/and inits chld controllers.
     * TODO: If we really want to lock things down the configKey should be an enum that maps to config objects.
     *
     * @param {EcgBaseController} controller
     * @param {string}            configKey
     */
    private registerController(controller: EcgBaseController, configKey: string): void {

        // 'line' key gets special treatment
        if (configKey === 'line' || this.stripConfig.ct[configKey]?.show) {
            this.controllers.set(configKey, controller);
            controller.init();
        }
    }

    /**
     * Sets fabric canvas object onto the config object.
     * TODO: Should we move this to EcgStripUtils?
     *
     * @param {HTMLCanvasElement} canvas
     */
    private initFabricCanvas(canvas: HTMLCanvasElement): Canvas {

        return new fabric.Canvas(canvas, {
            targetFindTolerance: 10,
            selection: false,

            // Required so that clicking an object doesn't automatically move it's z-index to the front
            preserveObjectStacking: true,

            // Canvas background is a configurable property - but just in case one is NOT supplied
            // default it to the darker more common background
            // Example  of a strip needing a different bgColor is the additional strips which need a white background
            backgroundColor: (this.stripConfig.ct.global.bgColor) ? this.stripConfig.ct.global.bgColor : '#111'
            // backgroundColor: 'transparent',
            // backgroundImage: '/assets/img/additional-strip-bg-27x27.png'
        });
    }

    /**
     * Set component key
     */
    protected setComponentKey(): void {
        this.componentKey = EcgComponentKey.STRIP;
    }

    public ngOnDestroy(): void {
        this.destroy();
    }

    public destroy(): void {
        // unsubscribes to all child subscriptions added to this global subscription object
        this.allSubscriptions.unsubscribe();

        // we must manually call destroy() because the controllers were not provided by the framework in this case
        // so ngOnDestroy() methods in these services will not automatically fire
        for (let [key, value] of this.controllers) {
            value.destroy();
        }
    }
}

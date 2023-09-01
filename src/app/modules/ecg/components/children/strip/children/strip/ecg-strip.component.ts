import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { RecordSessionEditService } from 'app/features/record/services/record-service.service';
import { RecordSidebarService } from 'app/features/record/services/record-sidebar.service';
import { EcgListNotifier } from 'app/modules/ecg/components/list/services/notifier/ecg-list-notifier.service';
import {
    EcgComponentState,
    EcgChannelKey,
    EcgLineActionType,
    EcgBeatRenderActionType,
    EcgListChannelKey,
    EcgResetViewType,
    EcgStripChannelKey,
    EcgCaliperActionType,
    EcgViewType
} from 'app/modules/ecg/enums';
import {
	IEcgCardConfig, IEcgConfigStrip, IEcgControllerInit, IEcgEpisodeInterval, IEcgListContextMenuAction, EcgNonScrollableContentActionType,
	IEpisodeDataRegion
} from 'app/modules/ecg/interfaces';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';
import { EcgDto } from 'app/modules/ecg/services/dto/ecg/ecg-dto.service';
import { EcgStripConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-strip-config-dto.service';
import { EcgNotifier } from 'app/modules/ecg/services/notifier/ecg/ecg-notifier.service';
import { EcgStripUtils } from 'app/modules/ecg/services/utils/ecg-strip-utils.service';
import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';
import { EcgStripNotifier } from '../../services/notifier/ecg-strip-notifier.service';
import { EcgStripControllerFactory } from './services/controller/ecg-strip-controller-factory.service';
import { EcgStripController } from './services/controller/ecg-strip-controller.service';
import { RhythmSortType } from 'app/features/record/services/enums/rhythm-sort-type.enum';


@Component({
    selector: 'app-ecg-strip',
    templateUrl: './ecg-strip.component.html',
    styleUrls: ['./ecg-strip.component.scss'],
    providers: [
        EcgStripController,
        EcgStripControllerFactory,
        EcgStripNotifier,
        EcgStripConfigDto,
        EcgStripUtils
    ],
})
export class EcgStripComponent implements AfterViewInit, OnDestroy {
    // for showing sortType bubbles
    @Input() public ecgCardConfig: IEcgCardConfig;

    public RhythmSortType = RhythmSortType;

    private _config: IEcgConfigStrip;

    // Config input obj
    @Input()
    public set config(config: IEcgConfigStrip) {
        if (config) this.loadConfigSubject.next(config);
    }

    public get config() {
        return this._config;
    }

    // CSS Class to be applied to top level strip container (parent vs child)
    // TODO: This will probably be a temp solution until we get the grids completely figured out
    @Input() public cssContainerClass: string;

    @ViewChild('ecgCanvas')
    private htmlCanvas: ElementRef<HTMLCanvasElement>;

    @ViewChild('outerContainer')
    private outerContainer: ElementRef<HTMLDivElement>;

    @ViewChild('ecgCanvasContainer')
    private canvasContainer: ElementRef<HTMLElement>;

    @ViewChild('ecgLineBackgroundImg')
    private ecgLineBackgroundImg: ElementRef<HTMLImageElement>;

    @ViewChild('scrollContainer')
    private scrollContainer: ElementRef<HTMLDivElement>;

    @ViewChild('positioner')
    private positioner: ElementRef<HTMLDivElement>;

    // For use in the template
    public EcgComponentState = EcgComponentState;

    // For use in template
    public EcgViewType = EcgViewType;

    public ctrlKey: boolean = false;

    readonly observer = new ResizeObserver((entries) => {
        this.resizeSubject.next(1);
    });

    private resizeSubject: Subject<any> = new Subject();

    private initialRender: boolean = true;

    private loadConfigSubject: ReplaySubject<IEcgConfigStrip> = new ReplaySubject(1);

    private loadConfigTimeout: ReturnType<typeof setTimeout>;

    private subscriptions = new Subscription();


    /**
     * Ctor
     *
     * @param {EcgStripController}       public  controller
     * @param {EcgUtils}                 public  ecgUtils
     * @param {EcgStripUtils}            public  stripUtils
     * @param {EcgStripConfigDto}        public  stripConfig
     * @param {EcgConfigDto}             public  globalConfig
     * @param {RecordSidebarService}     public  sidebarService
     * @param {RecordSessionEditService} public  sessionEditService
     * @param {EcgListNotifier}          public  ecgListNotifier
     * @param {EcgNotifier}              public  ecgNotifier
     * @param {EcgDto}                   private dto
     * @param {ChangeDetectorRef}        private cdRef
     * @param {EcgStripNotifier}         private ecgStripNotifier
     */
    public constructor(
        public controller: EcgStripController,
        public ecgUtils: EcgUtils,
        public stripUtils: EcgStripUtils,
        public stripConfig: EcgStripConfigDto,
        public globalConfig: EcgConfigDto,
        public sidebarService: RecordSidebarService,
        public sessionEditService: RecordSessionEditService,
        public ecgListNotifier: EcgListNotifier,
        public ecgNotifier: EcgNotifier,
        private dto: EcgDto,
        private cdRef: ChangeDetectorRef,
        private ecgStripNotifier: EcgStripNotifier
    ) {}


    /**
     * Resizes the container to fit in the outer container dimensions
     * @private
     */
    private setCanvasDimensions(): void {

        if (this.stripConfig?.ct?.html?.canvas && this.outerContainer?.nativeElement) {
            // When setting dimensions, if there is a tileTop value reduce height by same amount
            let dimensions = {
                width: this.outerContainer.nativeElement.clientWidth,
                height: this.outerContainer.nativeElement.clientHeight - (this.config.global.tileTop ?? 0),
            };

            this.stripConfig.ct.html.canvas.setDimensions(dimensions);
            this.stripConfig.ct.html.canvas.requestRenderAll();
        }

    }

    /**
     * OnInit
     */
    public ngAfterViewInit(): void {
        this.initListeners();
    }

    /**
     * OnDestroy
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        this.loadConfigSubject.unsubscribe();
        this.resizeSubject.unsubscribe();
        this.observer.unobserve(this.outerContainer.nativeElement);
        clearTimeout(this.loadConfigTimeout);
    }

    private initListeners(): void {
        this.subscriptions.add(this.loadConfigSubject.subscribe((config: IEcgConfigStrip) => {
            if (this.initialRender) {
                this.setConfig(config);
                this.initialRender = false;
                this.cdRef.detectChanges();

                this.loadConfigTimeout = setTimeout(() => {
                    // All config and html elements are loaded - render the strip
                    const controllerSubscription = this.controller.init().subscribe((response: IEcgControllerInit) => {
                        this.ecgUtils.ready(this.controller);
                        this.scrollToSubRegion();
                    });

                    this.subscriptions.add(controllerSubscription);
                }, 0);
            } else {
                this.setConfig(config);

                this.ecgNotifier.send(EcgChannelKey.LINE_RENDER_ACTION, {
                    actions: [
                        {
                            type: EcgLineActionType.PROCESS_EPISODE_LINES,
                        },
                        {
                            type: EcgLineActionType.LOAD_POINTS,
                        },
                        {
                            type: EcgLineActionType.RENDER,
                        },
                    ],
                });

                this.ecgNotifier.send(EcgChannelKey.BEAT_RENDER_ACTION, {
                    actions: [
                        {
                            type: EcgBeatRenderActionType.RENDER,
                        },
                    ],
                });

                this.reloadCanvas();
            }
        }));

        // Lines flash when resizing without the debounce time
        this.subscriptions.add(this.resizeSubject.pipe(debounceTime(0)).subscribe(() => {
            this.reloadCanvas();
        }));

        this.observer.observe(this.outerContainer.nativeElement);

    }
    /**
     * Scrolls to the SubRegion left index, if Subregion is present
     * @private
     */
    private scrollToSubRegion(): void {
        if (this.stripConfig.ct.global.subRegion) {
            let region = this.dto.regions[this.stripUtils.getRegionKey()];
            if (region['preComputedSubRegionList']) {
                let typedRegion = region as IEpisodeDataRegion;
                let subRegionInterval: IEcgEpisodeInterval = typedRegion.preComputedSubRegionList.find(
                    (subRegion) => subRegion.subRegion === this.stripConfig.ct.global.subRegion
                ).interval;

                let subRegionLeftX = this.stripUtils.calcEcgLineX(
                    this.stripUtils.getLocalArrayIndex(subRegionInterval.startIndex)
                );

                this.config.html.scrollContainer.scrollTo({
                    left: Math.round(subRegionLeftX),
                });
            }
        }
    }

    /**
     * Sets and does processing for new config
     * @param config
     * @private
     */
    private setConfig(config: IEcgConfigStrip) {
        if (this.config) {
            config.html = this.config.html;
        }

        this._config = config;

        // Set/Merge strip configuration
        const [width, height] = [this.positioner.nativeElement.offsetWidth, this.positioner.nativeElement.offsetHeight];
        this.stripConfig.setConfig(this.config, width, height);

        // Adjust top property of positioner if tileTop value is set
        this.positioner.nativeElement.style.setProperty(
            'top',
            config.global.tileTop ? config.global.tileTop.toString() + 'px' : ''
        );

        // Process strip config properties - logic needed before we access/render the canvaslocal
        this.controller.processConfig();

        // Set additional html elements onto controller
        // TODO: Need to set up some sort of DOM element polling system
        if (this.initialRender) {
            this.controller.setHtmlElements({
                canvas: this.htmlCanvas.nativeElement,
                scrollContainer: this.scrollContainer.nativeElement,
                positioner: this.positioner.nativeElement,
            });
        }

        this.setCanvasDimensions();
    }

    /**
     * Manipulates the canvas on a scroll event to move objects into view.
     *
     * @param $event
     */
    public onScroll($event: Event): void {
        let scScrollLeft: number = this.stripConfig.ct.html.scrollContainer.scrollLeft;

        // Since the canvas is no longer the same size as the scroll container, the canvas would be scrolled out of view
        // to fix this, we apply a transformation to the canvas to keep it into view
        // We use translate instead of setting attr.left because it is more performant
        this.stripConfig.ct.html.positioner.style.transform = `translate(${scScrollLeft}px, 0)`;

        this.stripConfig.ct.html.canvas.viewportTransform[4] = -scScrollLeft;

        this.stripConfig.ct.html.canvas.setViewportTransform(this.stripConfig.ct.html.canvas.viewportTransform);
    }

    /**
     * Check if user is in multi-select edit session
     * @param event
     */
    public isMultiSelect(event: MouseEvent): void {
        this.ctrlKey = event.ctrlKey;
    }

    /**
     * Disables painting and commits edit session
     */
    public disablePaintingCommitEditSession(): void {
        if (!this.ctrlKey) {
            this.ecgListNotifier.send(EcgListChannelKey.CONTEXT_MENU, {
                action: IEcgListContextMenuAction.UPDATE_HIGHLIGHTING,
                highlightedIntervals: new Set<IEcgEpisodeInterval>(),
            });

            // reset/clear caliper once user clicks to end edit session
            this.ecgStripNotifier.send(EcgStripChannelKey.CALIPER_ACTION, {
                actions: [{ type: EcgCaliperActionType.RESET_CALIPER }],
            });
        }

        // disable painting
        this.sidebarService.disablePaintingStrip();

        // check if doNotCommit flag is on before committing
        if (!this.sessionEditService.doNotCommit && !this.config.global.disableEditSessionCommitting) {
            this.sessionEditService.commitEditSession();
        } else {
            // reset doNotCommit flag
            this.sessionEditService.doNotCommit = false;
        }
    }

    private reloadCanvas(): void {
        if (!this.config) return;
        this.setCanvasDimensions();

        const [width, height] = [this.positioner.nativeElement.offsetWidth, this.positioner.nativeElement.offsetHeight];
        this._config.width = width;
        this._config.global.height = height;

        this.controller.processConfig();

        this.ecgNotifier.send(EcgChannelKey.NON_SCROLLABLE_CONTENT, {
            actions: [
                {
                    type: EcgNonScrollableContentActionType.RENDER_ALL,
                },
            ],
        });

        this.ecgNotifier.send(EcgChannelKey.RESET_VIEW, {
            resetViewState: EcgResetViewType.WINDOW_RESIZED,
        });

        this.scrollToSubRegion();

        if (this.config?.html?.canvas) {
            this.config.html.canvas.renderAll();
        }
    }
}

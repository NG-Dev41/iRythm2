import { Injectable, OnDestroy } from '@angular/core';

import { fromEvent, Observable, of, Subscription } from 'rxjs';
import { fabric } from 'fabric';
import { IEvent, Rect } from 'fabric/fabric-impl';

import { EcgStripNotifier } from 'app/modules/ecg/components/children/strip/services/notifier/ecg-strip-notifier.service';
import { EcgChannelKey, EcgResetViewType, EcgComponentKey } from 'app/modules/ecg/enums';
import { IEcgControllerInit, IEcgResetViewChannel } from 'app/modules/ecg/interfaces';
import { EcgBaseController } from 'app/modules/ecg/services/controller/base/ecg-base-controller.service';
import { EcgDto } from 'app/modules/ecg/services/dto/ecg/ecg-dto.service';
import { EcgStripConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-strip-config-dto.service';
import { EcgNotifier } from 'app/modules/ecg/services/notifier/ecg/ecg-notifier.service';
import { EcgStripUtils } from 'app/modules/ecg/services/utils/ecg-strip-utils.service';


@Injectable()
export class EcgHighlighterRenderer extends EcgBaseController implements OnDestroy {

    // Highlighter fabric/canvas object
    public highlighter: Rect;

    // Used to keep track of the previous overflow line scroll x position
    // This allows us to know which direction the highlighter is moving (left/right)
    private previousScrollX: number = null;

    // Flag to send or not send a notification over the RESET_VIEW channel
    private doSendChangeNotification: boolean;

    // Window scroll observable
    private $windowScroll;

    private resetViewSubs: Subscription = new Subscription();
    private highlighterStartTimeout: ReturnType<typeof setTimeout>;


    /**
     * Ctor
     *
     * @param {EcgStripConfigDto} private config
     * @param {EcgDto}            private dto
     * @param {EcgStripNotifier}  private stripNotifier
     * @param {EcgStripUtils}     private utils
     * @param {EcgNotifier}       private notifier
     */
    public constructor(
        private config: EcgStripConfigDto,
        private dto: EcgDto,
        private stripNotifier: EcgStripNotifier,
        private utils: EcgStripUtils,
        private notifier: EcgNotifier,
    ) {
        super();
        this.setComponentKey();
    }


    /**
     * Init highlighter
     *
     * @return {Observable<IEcgControllerInit>}
     */
    public init(): Observable<IEcgControllerInit> {

        this.config.ct.highlighter.width = this.utils.calcHighlighterWidth();

        this.initListeners();
        this.renderHighlighter();
        this.initHighlighterStartPosition();
        this.bindHighlighterEvents();

    	return of({
    		success: true
    	});
    }


    /**
     * Init Listeners
     */
    private initListeners(): void {
        this.resetViewListener();
    }


    /**
     * Listens for command to reset the view
     */
    private resetViewListener(): void {

        // Listen on the reset view channel
       this.resetViewSubs = this.notifier
            .listen(EcgChannelKey.RESET_VIEW)
            .subscribe((data: IEcgResetViewChannel) => {

                // Reset view
                switch(data.resetViewState) {
                    case EcgResetViewType.RESET:

                        this.removeHighlighterEvents();
                        this.initHighlighterStartPosition();
                        this.bindHighlighterEvents();
                        break;

	                case EcgResetViewType.WINDOW_RESIZED:
		                this.config.ct.highlighter.width = this.utils.calcHighlighterWidth();
		                this.renderHighlighter();
		                this.removeHighlighterEvents();
		                this.initHighlighterStartPosition();
		                this.bindHighlighterEvents();
						break;
                }
            });
    }


    /**
     * Sets the initial position of the highlighter and child/mini line scroll position.
     */
    private initHighlighterStartPosition(skip = false): void {

        // Toggle change flag - don't want to send a notification on initial load
        this.doSendChangeNotification = false;

        // Move highlighter into starting position
        this.processHighlighterMove(this.getHighlighterStartPosition());

        // Scroll the child/mini line to center
        this.scrollChildWindow(this.getWindowStartPosition());

        // Turn flag back on so that scroll/highlighter movement changes are sent out
       this.highlighterStartTimeout = setTimeout(() => {
            this.doSendChangeNotification = true;
        }, 100);
    }


    /**
     * Method renders the fabric/canvas highlighter object.
     */
    public renderHighlighter(): void {
		if(this.highlighter) this.config.ct.html.canvas.remove(this.highlighter);

        // Make fabric.Rect object for the highlighter
        this.highlighter = new fabric.Rect({
            lockMovementY: true,
            top: 0,
            left: 0,
            height: this.config.ct.line.height,
            width: this.config.ct.highlighter.width,
            fill: this.config.ct.highlighter.bgColor,
            selectable: true,
            hasControls: false,
            hasBorders: false,
            hoverCursor: 'default',
            moveCursor: 'default'
        });

        // Add highlighter to canvas
        this.config.ct.html.canvas.add(this.highlighter);
        this.config.ct.html.canvas.bringToFront(this.highlighter);
    }


    /**
     * Bind highlighter related events
     */
    private bindHighlighterEvents(): void {

        // First bind mouse:down event
        this.config.ct.html.canvas.on('mouse:down', (e: IEvent<MouseEvent>) => {

            this.processHighlighterMove(e.e.offsetX, 'smooth');

            // Bind mouse:up to remove the mouse:move event
            this.config.ct.html.canvas.on('mouse:up', (e: IEvent<MouseEvent>) => {
                this.config.ct.html.canvas.off('mouse:move');
            });

            // Bind mouse:move to track highlighter movement
            this.config.ct.html.canvas.on('mouse:move', (e: IEvent<MouseEvent>) => {
                this.processHighlighterMove(e.e.offsetX);
            });
        });


        // Watch mini/child line for scrolling - if scrolling/scrolled this is considered a view change
        this.$windowScroll = fromEvent(this.config.ct.html.scrollContainer, 'scroll')
            .subscribe((event: MouseEvent) => {
                this.sendChangeNotification(this.doSendChangeNotification);
            });
    }


    /**
     * Remove highlighter events
     */
    private removeHighlighterEvents(): void {
        this.config.ct.html.canvas.off('mouse:move');
        this.config.ct.html.canvas.off('mouse:down');
        this.config.ct.html.canvas.off('mouse:up');
        this.$windowScroll.unsubscribe();
    }


    /**
     * Processes a mouse event on the strip canvas.
     * Moves the highlighter to the event position (click || move)
     * ReRenders
     * Sends notification that highlighter has moved.
     *
     * @param {IEvent<MouseEvent>} e
     */
    private processHighlighterMove(offsetX: number, scrollBehavior: 'smooth' | 'auto' = 'auto'): void {

        // Init some vars.
        const highlighterHalfWidth: number = this.config.ct.highlighter.width / 2;
        const offsetPlusScrollLeft: number = offsetX + this.config.ct.html.scrollContainer.scrollLeft;

        // Calculate the left x position to move the highlighter to
        let xCoord: number = Math.round(offsetPlusScrollLeft - highlighterHalfWidth);

        this.highlighter.left = xCoord;
        this.highlighter.setCoords();

        // Update if null
        if(this.previousScrollX === null) {
            this.previousScrollX = xCoord;
        }

        // Convience var for highlighter left edge x position
        const highlighterLeftPlusScrollLeft: number = (<any>this.highlighter).lineCoords.bl.x + this.config.ct.html.scrollContainer.scrollLeft;
        let scrollTo: number = null;

        // Check if moving left
        if(highlighterLeftPlusScrollLeft < this.previousScrollX) {

            // ---- HIGHLIGHTER MOVING LEFT ----------------------------------------

            // Check if the left edge of the highlighter is off the screen to the left and moving into the overflow area
            // If so - set our new overflow container scroll position
            if((<any>this.highlighter).lineCoords.bl.x <= -1) {
                scrollTo = Math.round(this.config.ct.html.scrollContainer.scrollLeft - ((<any>this.highlighter).lineCoords.bl.x * -1));
            }
        }

        // Check if moving right
        else
        if(highlighterLeftPlusScrollLeft > this.previousScrollX) {

            // ---- HIGHLIGHTER MOVING RIGHT ----------------------------------------

            // Check if the right edge of the highlighter is off the screen to the right and moving into the overflow area
            // If so - set our new overflow container scroll position
            if((<any>this.highlighter).lineCoords.br.x >= this.config.ct.width) {
                scrollTo = Math.round(this.config.ct.html.scrollContainer.scrollLeft + ((<any>this.highlighter).lineCoords.br.x - this.config.ct.width))
            }
        }

        // Make the mini line overflow container scroll if necessary
        if(scrollTo !== null) {
            this.config.ct.html.scrollContainer.scrollTo({
                left: scrollTo
            });
        }

        // Assign previous scroll value to determine on next movent if we're going left or right
        this.previousScrollX = highlighterLeftPlusScrollLeft;
        this.config.ct.html.canvas.renderAll();

        // Calc parent left position
        const parentLeft = Math.round(((offsetPlusScrollLeft - highlighterHalfWidth) * this.config.ct.parent.global.resolutionScale) / this.config.ct.global.resolutionScale);

        // Send notification that highlighter has moved
        this.notifier.send(EcgChannelKey.HIGHLIGHTER_MOVING, {
            x: parentLeft,
            parentScrollBehavior: scrollBehavior
        });

        // Send notification that view has changed
        this.sendChangeNotification(this.doSendChangeNotification);
    }


    /**
     * Sends notification that line/scrolling view has changed
     */
    private sendChangeNotification(doSendChangeNotification): void {

        if(doSendChangeNotification === true) {
            this.notifier.send(EcgChannelKey.RESET_VIEW, {
                resetViewState: EcgResetViewType.CHANGED
            });
        }
    }


    /**
     * Returns highlighter start position
     *
     * @return {number}
     */
    private getHighlighterStartPosition(): number {

        const episodeStart = this.utils.getLocalArrayIndex(this.dto.data.episode.interval.startIndex);
        const episodeEnd = this.utils.getLocalArrayIndex(this.dto.data.episode.interval.endIndex);
        let episodeMiddle = ((episodeStart + episodeEnd) / 2) * this.config.ct.global.resolutionScale;

        return episodeMiddle - this.config.ct.html.scrollContainer.scrollLeft;
    }


    /**
     * Returns line starting position.
     *
     * @return {number}
     */
    private getWindowStartPosition(): number {
        return Math.round((this.config.ct.global.overflowWidth - this.config.ct.width) / 2);
    }


    /**
     * Scrolls mini/child line to the specified scrollTo index.
     *
     * @param {number} scrollTo
     */
    private scrollChildWindow(scrollTo: number): void {
        this.config.ct.html.scrollContainer.scrollTo({
            left: scrollTo
        });
    }


    /**
     * Set component key
     */
    protected setComponentKey(): void {
        this.componentKey = EcgComponentKey.HIGHLIGHTER;
    }

    public ngOnDestroy(): void{
        this.destroy();
    }


    public destroy(): void {
        this.resetViewSubs.unsubscribe();
        clearTimeout(this.highlighterStartTimeout);
    }
}

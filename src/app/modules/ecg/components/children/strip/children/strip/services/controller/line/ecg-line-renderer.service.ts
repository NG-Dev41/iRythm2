import { Injectable, OnDestroy } from '@angular/core';

import { Observable, of, Subscription } from 'rxjs';
import { fabric } from 'fabric';
import { Polyline } from 'fabric/fabric-impl';

import {
	IEcgControllerInit, IEcgLineAction, IEcgLineActionChannel, IEcgSampleCursorResult, IEpisodeDataRegion,
    ISurroundingEpisode,
} from 'app/modules/ecg/interfaces';
import { EcgChannelKey, EcgComponentKey, EcgLineActionType, EcgViewType } from 'app/modules/ecg/enums';
import { RhythmTypeMeta } from 'app/commons/constants/rhythms.const';
import { EcgBaseController } from 'app/modules/ecg/services/controller/base/ecg-base-controller.service';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';
import { EcgDto } from 'app/modules/ecg/services/dto/ecg/ecg-dto.service';
import { EcgStripConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-strip-config-dto.service';
import { EcgNotifier } from 'app/modules/ecg/services/notifier/ecg/ecg-notifier.service';
import { EcgStripUtils } from 'app/modules/ecg/services/utils/ecg-strip-utils.service';


export interface PolyLinePoint {
    x: number;
    y: number;
}


@Injectable()
export class EcgLineRenderer extends EcgBaseController implements OnDestroy {

    private ecgLines: Polyline[] = [];

    private ecgEpisodeLines: Array<ISurroundingEpisode> = [];

    private ecgPoints: Array<PolyLinePoint> = [];

    private region: IEpisodeDataRegion | IEcgSampleCursorResult;

    private lineRenderSubs: Subscription;


    /**
     * Ctor
     */
    public constructor(
        private globalConfig: EcgConfigDto,
        private config: EcgStripConfigDto,
        private dto: EcgDto,
        private notifier: EcgNotifier,
        private utils: EcgStripUtils
    ) {
        super();
        this.setComponentKey();
    }


    /**
     * Set component key
     */
    protected setComponentKey(): void {
        this.componentKey = EcgComponentKey.WINDOW;
    }


    /**
     * Init Top Level Window Functionality:
     * Ideally this logic should only be run once
     *
     * @param  {IEcgConfigWindow}               config
     * @return {Observable<IEcgControllerInit>}
     */
    public init(): Observable<IEcgControllerInit> {

        this.region = this.dto.regions[this.utils.getRegionKey()];

        // Init listeners
        this.initListeners();
        this.loadPoints();
        this.loadEpisodeLines();
        this.renderBackgroundImage();

        return of({
            success: true
        });
    }


    /**
     * Init Listeners
     */
    private initListeners(): void {

        // Render action
        this.lineRenderSubs = this.notifier
            .listen(EcgChannelKey.LINE_RENDER_ACTION)
            .subscribe((data: IEcgLineActionChannel) => {

                // Loop over the array of actions received and process each
                // The order actions are sent is important...i think
                data.actions.forEach((action: IEcgLineAction) => {

                    switch(action.type) {

                        // Load ecg points
                        case EcgLineActionType.LOAD_POINTS:
                            this.loadPoints();
                            break;

                        // Load ecg episodes
                        case EcgLineActionType.LOAD_EPISODES:
                            this.loadEpisodeLines();
                            break;

	                    case EcgLineActionType.RENDER:
		                    this.renderLines();
		                    break;
                    }
                });


                // Render ecg lines/background
                // This always needs to happen (as of now) so no point in having it as action type
                this.renderBackgroundImage();
            });
    }


    /**
     * Renders the background image of the canvas
     * @private
     */
    private renderBackgroundImage(): void {

        // In order to improve performance, we render certain objects of the canvas to a background image located behind the canvas.
        // This is done so that they don't get redrawn when the canvas gets refreshed, minimizing compute cycles.
        // Actions that trigger redrawing include moving the calipers, and scrolling the canvas.
        // This is especially important for the ECG Polylines, as they are too large to fit into the fabric cache,
        // thus get completely recalculated and redrawn on each refresh.

        /*
        // Save the normal canvas width so we can restore it later
        let normalCanvasWidth = this.config.ct.html.canvas.width;
        let normalScrollLeft = this.config.ct.html.scrollContainer.scrollLeft;

        this.config.ct.html.scrollContainer.scrollLeft = 0;

        // Remove old image background if it exists
        // this.config.ct.html.bgImg.src = '';

        // Hide all currently visible objects so they don't get included in screenshot.
        // Set dirty to true so fabric renderer knows to re-render them
        let visibleObjects = this.config.ct.html.canvas.getObjects().filter(object => object.visible);
        visibleObjects.forEach(object => {object.visible = false; object.dirty = true;});

        // Reset viewport transform, otherwise part of canvas will be scrolled out of view
        let previousViewportTransform = this.config.ct.html.canvas.viewportTransform[4];
        this.config.ct.html.canvas.viewportTransform[4] = 0;

        // Resize canvas to full size for screenshot
        this.config.ct.html.canvas.setWidth(this.config.ct.global.overflowWidth);
        this.config.ct.html.canvas.calcOffset();
        */

        // Add lines to canvas
        this.renderLines();

        // Turn canvas into image element for background
        // NOTE: This is faster than this.stripConfig.ct.html.canvas.toDataUrl();
        // setTimeout(() => this.config.ct.html.baseHtmlCanvas.toBlob((blob: Blob) => {

        //     /*
        //     // Turn blob into image
        //     this.config.ct.html.bgImg.onload = () => {

        //         URL.revokeObjectURL(this.config.ct.html.bgImg.src);

        //         // Certain components/controllers can't do their jobs until
        //         // the bg image has been loaded - send notification that it's loaded
        //         this.notifier.send(EcgChannelKey.LINE_IMAGE_LOADED, {
        //             loaded: true
        //         });
        //     }
        //     this.config.ct.html.bgImg.src = URL.createObjectURL(blob);
        //     */

        //     // Remove lines from the background of the canvas
        //     // this.removeLines();

        //     // Restore viewport transform to scroll position
        //     this.config.ct.html.canvas.viewportTransform[4] = previousViewportTransform;

        //     // Restore original canvas size
        //     this.config.ct.html.canvas.setWidth(normalCanvasWidth);
        //     this.config.ct.html.canvas.calcOffset();

        //     this.config.ct.html.scrollContainer.scrollLeft = normalScrollLeft;

        //     // Restore all objects to be visible.
        //     visibleObjects.forEach(object => {object.visible = true; object.dirty = true; });
        // }), 0);
    }


    /**
     * Create ecg points array
     */
    private loadPoints(): void {

	    this.region = this.dto.regions[this.utils.getRegionKey()];

        this.ecgPoints = this.region.ecgSampleList.map((dp: number, i: number) => {
            return {
                x: this.utils.calcEcgLineX(i),
                y: this.utils.calcEcgLineY(dp, i)
            }
        });
	}


    /**
     * Create array of episodes
     */
    private loadEpisodeLines(): void {

        this.ecgEpisodeLines = [];
        this.ecgEpisodeLines = this.globalConfig.ct.global.episodes.get(this.utils.getRegionKey());

		if(!this.ecgEpisodeLines) {
            this.ecgEpisodeLines = [];
        }
    }


    /**
     * Render ecg lines
     */
    public renderLines(): void {

		this.loadEpisodeLines();

        // Remove current lines drawn on the canvas before re renderig
        this.removeLines();

        // Create new array of ecg lines
        this.ecgLines = new Array<Polyline>();

        // Array of fabric polylines used to render out the ecg line
        let polyLine: Polyline;
        let polyLineSlice;

        // Loop over the episodes and create the canvas ecg lines
        for(const surEpisode of this.ecgEpisodeLines) {

            // TODO: How can we dynamically add multiple rows for ECG data that needs to wrap
            // This is specifically for Additonal Strips

            // Setting the color to use when we paint the ecg line
            // If this is the 'Addtional Strip' view force the line color to black - otherwise use the rhythm type color
            const strokeColor: string = (this.globalConfig.ct.viewType === EcgViewType.ADDITIONAL_STRIP) ? '#000000' : RhythmTypeMeta[surEpisode.rhythmType].color;

			// If there are multiple rows, than we need to further break the lines down so that they fit in to each row instead of spanning multiple
	        if(this.config.ct.global?.rowIntervals?.length > 0) {

				// Loop over each interval of the rowIntervals to render each segment of the line across multiple rows
				for(let interval of this.config.ct.global.rowIntervals) {

					// If the episode ends before the row starts, then no part of the line is in the row, so continue to next interval
					if(this.utils.getLocalArrayIndex(interval.endIndex) < this.utils.getLocalArrayIndex(surEpisode.interval.startIndex)) continue;

					// Set the end index to be no greater than the row end index
					let endIndex = Math.min(this.utils.getLocalArrayIndex(interval.endIndex), this.utils.getLocalArrayIndex(surEpisode.interval.endIndex));

					// Set the start index to be no greater than the row start index
					let startIndex = Math.max(this.utils.getLocalArrayIndex(interval.startIndex), this.utils.getLocalArrayIndex(surEpisode.interval.startIndex));
					let slice = this.ecgPoints.slice(startIndex, endIndex);

					// Create the line
					polyLine = new fabric.Polyline(slice, {
						stroke: strokeColor,
						fill: 'transparent',
						strokeWidth: 1,
						objectCaching: false,
						strokeMiterLimit: .1,
						perPixelTargetFind: true,
						selectable: false,
						hoverCursor: this.dto.data.episode.interval.startIndex === surEpisode.interval.startIndex  ? 'pointer' : 'default'
					});

					// Add to add line to polyline array for later use
					this.ecgLines.push(polyLine);

					// Add the line to our canvas
					this.config.ct.html.canvas.add(polyLine);

					// If the episode ends before reaching the end of the row, then break because the line is finished rendering
					if(this.utils.getLocalArrayIndex(interval.endIndex) !== endIndex) break;
				}

	        } else {

		        // Slice out the episode line
		        polyLineSlice = this.ecgPoints.slice(this.utils.getLocalArrayIndex(surEpisode.interval.startIndex), this.utils.getLocalArrayIndex(surEpisode.interval.endIndex));

		        // Create the fabric polyline
		        polyLine = new fabric.Polyline(polyLineSlice, {
			        stroke: strokeColor,
			        fill: 'transparent',
			        strokeWidth: 1,
			        objectCaching: false,
			        strokeMiterLimit: .1,
			        perPixelTargetFind: true,
			        selectable: false,
			        hoverCursor: this.dto.data.episode.interval.startIndex === surEpisode.interval.startIndex  ? 'pointer' : 'default'
		        });

		        // Add to add line to polyline array for later use
		        this.ecgLines.push(polyLine);

		        // Add the line to our canvas
		        this.config.ct.html.canvas.add(polyLine);
	        }
        }
    }


    /**
     * Removes ecg lines from the canas
     */
    public removeLines(): void {
        this.ecgLines?.forEach((line: Polyline) => this.config.ct.html.canvas.remove(line));
    }

    public ngOnDestroy(): void{
        this.destroy();
    }

    public destroy(): void{
        this.lineRenderSubs.unsubscribe();
    }

}

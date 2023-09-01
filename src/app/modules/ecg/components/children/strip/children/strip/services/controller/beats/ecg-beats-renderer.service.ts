import { Injectable, OnDestroy } from '@angular/core';

import { Observable, of, Subscription } from 'rxjs';
import { Group, Rect, IEvent } from 'fabric/fabric-impl';
import { fabric } from 'fabric';

import { MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { IRHYTHM_COLORS } from 'app/commons/enums/common.enum';
import { MARK_ECTOPIC_BLANK_BEATS_WARNING } from 'app/commons/constants/common.const';
import { HRBarActionType } from 'app/commons/constants/rhythms.const';
import { RecordChannelKey, RecordChannelAction } from 'app/features/record/services/enums/channel.enum';
import { IHRBarActionChannel, IRecordMarkEctopyChannel, IRecordActionChannel } from 'app/features/record/services/interfaces/channel.interface';
import { RecordNotifier } from 'app/features/record/services/notifiers/record-notifier.service';
import {
	IEpisodeDataRegion, IEcgControllerInit, IEcgBeatRenderActionChannel, IEcgBeatRenderAction, IEcgBeat, IEcgSampleCursorResult
} from 'app/modules/ecg/interfaces';
import { EcgBaseController } from 'app/modules/ecg/services/controller/base/ecg-base-controller.service';
import { EcgController } from 'app/modules/ecg/services/controller/ecg/ecg-controller.service';
import { EcgDto } from 'app/modules/ecg/services/dto/ecg/ecg-dto.service';
import { EcgStripConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-strip-config-dto.service';
import { EcgNotifier } from 'app/modules/ecg/services/notifier/ecg/ecg-notifier.service';
import { EcgStripUtils } from 'app/modules/ecg/services/utils/ecg-strip-utils.service';
import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';
import { EctopicType, EctopicTypeMeta, OptionalBeatAttributes } from 'app/commons/constants/ectopics.const';
import { EcgComponentKey, EcgChannelKey, EcgBeatRenderActionType, EcgRhythmTypeEdit, EcgBeatActionType, EcgBeatType } from 'app/modules/ecg/enums';
import { EcgStripNotifier } from 'app/modules/ecg/components/children/strip/services/notifier/ecg-strip-notifier.service';
import { IHeaderNotifyAction } from 'app/commons/interfaces/channel.interface';
import { PageChannelKey, PageNotifier } from 'app/commons/services/notifiers/page-notifier.service';

@Injectable()
export class EcgBeatsRenderer extends EcgBaseController implements OnDestroy {

    public beatBlocks: Array<Group>;
    public beatLines: Array<Group>;
    public blankBeats: Array<Rect> = [];
    public beatTicks: Array<Group>;
    public firstLastBeatBlocks: Array<Rect>;
    public beatCaliper: Rect;

    public region: IEpisodeDataRegion | IEcgSampleCursorResult;

    // Whether the user is currently making an HR bar caliper
    private isConstructingCaliper: boolean = false;

    private selectedHRBarAction: HRBarActionType = HRBarActionType.BLANK_BEATS;
    private selectedEctopicType: EctopicType;

	private caliperOriginLeft: number = -1;
	private caliperOriginRow: number = 0;
	private calipers: Rect[] = [];

    private snackBarRef: MatSnackBarRef<SimpleSnackBar>;

    private allSubscriptions: Subscription = new Subscription();

    /**
     * Ctor
     */
    public constructor(
        private config: EcgStripConfigDto,
        private dto: EcgDto,
        private recordNotifier: RecordNotifier,
        private pageNotifier: PageNotifier,
        private stripNotifier: EcgStripNotifier,
        private stripUtils: EcgStripUtils,
        public notifier: EcgNotifier,
        private utils: EcgUtils,
    ) {
        super();
        this.setComponentKey();
    }


    /**
     * Set component key
     */
    protected setComponentKey(): void {
        this.componentKey = EcgComponentKey.STRIP_BEATS;
    }


    /**
     * Init
     *
     * @return {Observable<IEcgControllerInit>}
     */
    public init(): Observable<IEcgControllerInit> {

        // Due to the refactoring of the analyze endpoint we need to access the region
        // TODO: This will probably need to be modified in that all regions can potentially be set once on ecg init
        this.region = this.dto.regions[this.stripUtils.getRegionKey()];

        this.renderBlocksAndTicks();
        this.renderBlankBeats();
        this.renderBeatCaliper();

        this.initListeners();

        return of({
            success: true
        });
    }


    /**
     * Renders objects that make up the beat blocks/beat ticks
     */
    public renderBlocksAndTicks(): void {

	    this.region = this.dto.regions[this.stripUtils.getRegionKey()];

        // Render beat ticks
        if(this.config.ct.beats.showTicks) {
            this.renderBeatTicks();
        }

        // Render beat blocks
        if(this.config.ct.beats.showLines) {
            this.renderBeatBlocks();
        }
    }


    /**
     * Init beat bar related listeners
     */
    private initListeners(): void {

        // Listen for commands to rerender the beat blocks
        this.allSubscriptions.add(this.notifier
            .listen(EcgChannelKey.BEAT_RENDER_ACTION)
            .subscribe((data: IEcgBeatRenderActionChannel) => {
                data.actions.forEach((action: IEcgBeatRenderAction) => {
                    switch (action.type) {
                        case EcgBeatRenderActionType.RENDER:
                            this.renderBlocksAndTicks();
                            this.renderBlankBeats(true);
                            break;
                    }
                });
            }));


        // Listen for changes from the left nav HR Bar actions
        this.allSubscriptions.add(this.recordNotifier.listen(RecordChannelKey.HR_BAR_ACTION).subscribe((data: IHRBarActionChannel) => {
            this.selectedHRBarAction = data.selectedAction;
        }));

        // Listen for changes from the left nav mark ectopy component. where the user selects an ectopic type
        this.allSubscriptions.add(this.recordNotifier.listen(RecordChannelKey.MARK_ECTOPY).subscribe((data: IRecordMarkEctopyChannel) => {
            this.selectedEctopicType = data.ectopicType;
        }));

        // clear out the selectedEctopic type after an ectopy is marked
        this.allSubscriptions.add(this.recordNotifier.listen(RecordChannelKey.ACTION).subscribe((data: IRecordActionChannel) => {
            if(data.action === RecordChannelAction.ECTOPY_MARKED){
                this.selectedEctopicType = null;
            }
        }));

    }

    /**
     * Renders the caliper for the HR bar. Run once on init
     */
    private renderBeatCaliper(): void {

        // Make fabric.Rect object for caliper
        this.beatCaliper = new fabric.Rect({
            lockMovementY: true,
            lockMovementX: true,
            hasControls: false,
            hasRotatingPoint: false,
            hasBorders: false,
            height: this.config.ct.beats.lineHeight,
            width: 0,
            left: 0,
            fill: 'rgba(173, 240, 249, .25)'
        });

        // Make it so you can not resize vertically/diagonally and can not rotate caliper
        this.beatCaliper.setControlsVisibility({
            bl: false,
            br: false,
            tl: false,
            tr: false,
            mt: false,
            mb: false,
        });

        //this.bindBeatCaliperEvents();

		this.bindBeatCaliperEventsRows();

        // Add caliper to canvas
        this.config.ct.html.canvas.add(this.beatCaliper);
        this.config.ct.html.canvas.bringToFront(this.beatCaliper);
    }

	private bindBeatCaliperEventsRows(): void {
		// Bind mouse down to creating caliper
		this.config.ct.html.canvas.on('mouse:down', (event) => {

			// If we don't bringToFront on mousedown then the calipers appear behind the block/line it starts at
			this.beatCaliper.bringToFront();

			//Only looking for events in the top HR bar
			if(event.absolutePointer.y % (this.config.ct.line.height + this.config.ct.beats.lineHeight) > this.config.ct.beats.lineHeight) return;

			// Move caliper to click location and start constructing caliper
			if (this.caliperOriginLeft === -1) {

				// Set caliper starting point
				this.caliperOriginLeft = event.absolutePointer.x;
				this.caliperOriginRow = Math.floor(event.absolutePointer.y / (this.config.ct.line.height + this.config.ct.beats.lineHeight));
			}
		});

		// Bind mouse move to constructing caliper
		this.config.ct.html.canvas.on('mouse:move', (event) => {

			//Only looking for events in the top HR bar
			if(event.absolutePointer.y % (this.config.ct.line.height + this.config.ct.beats.lineHeight) > this.config.ct.beats.lineHeight) return;

			if(this.caliperOriginLeft >= 0) {

				// Minimum mouse movement required to draw the caliper
				if(Math.abs(this.caliperOriginLeft - event.absolutePointer.x) > 5 && !this.isConstructingCaliper) {

					this.isConstructingCaliper = true;

					// Cursor override on the canvas level while in our caliper select state, fabric won't update the mouse while left click is being held:
					const upperCanvas = this.config.ct.html.positioner.children[0].children[1];
					(upperCanvas as HTMLCanvasElement).style.cursor = 'pointer';
				}
			}

			if(!this.isConstructingCaliper) return;
			let rowNum = Math.floor(event.absolutePointer.y / (this.config.ct.line.height + this.config.ct.beats.lineHeight));
			rowNum = Math.max(Math.min(rowNum, this.stripUtils.calcNumRows() - 1), 0);
			this.setCaliperRows(event.absolutePointer.x, rowNum);
		});

		// Bring mouse up to stop re-sizing caliper
		this.config.ct.html.canvas.on('mouse:up:before', (event) => {
			//Only looking for events in the top HR bar while constructing a caliper

			if(!this.isConstructingCaliper) return;

			// Turn the event.absolutePointer.x and caliperRow into a front-end index value;
			const caliperStartFrontIndex = this.stripUtils.calcDataPoint(this.caliperOriginLeft, this.caliperOriginRow);
			const caliperStartEndIndex = this.stripUtils.calcDataPoint(event.absolutePointer.x, Math.floor(event.absolutePointer.y / (this.config.ct.line.height + this.config.ct.beats.lineHeight)));

			// Convert the front-end index values into backend values, and send them through the beat-action channel
			this.notifier.send(EcgChannelKey.BEAT_ACTION, {
				actions: [
					{
						rhythmTypeEdit: this.getEcgRhythmTypeEdit(),
						type: this.getEcgBeatActionType(),
						frontIndexes: [caliperStartFrontIndex, caliperStartEndIndex],
						backIndexes: [Math.round(this.utils.getBackendArrayIndex(caliperStartFrontIndex, this.stripUtils.getRegionKey())), Math.round(this.utils.getBackendArrayIndex(caliperStartEndIndex, this.stripUtils.getRegionKey()))]
					}
				]
			});

			// Reset the calipers after beat-action is dispatched
			this.resetCalipers();
		});
	}

	/**
	 * Build calipers to a given mouseLocation and rowNumber
	 * @param mouseX
	 * @param rowNumber
	 * @private
	 */
	private setCaliperRows(mouseX: number, rowNumber: number) {
		let canvas = this.config.ct.html.canvas;

		// Reset the calipers to base state
		for( let i = 0; i < this.stripUtils.calcNumRows(); i++ ) {
			if( this.calipers[i] ) {
				this.calipers[i].width = 0;
				this.calipers[i].left = 0;
			} else {
				this.calipers[i] = new fabric.Rect( {
					lockMovementY: true,
					hasRotatingPoint: false,
					hasBorders: false,
					height: this.config.ct.beats.lineHeight,
					width: 0,
					left: 0,

					// TODO: We really need to get this beat/line offset into a global property/calcOffset() method
					top: ((i) * this.config.ct.beats.lineHeight) + (i * this.config.ct.line.height),
					fill: 'rgba(173, 240, 249, .25)'
				} );

				this.calipers[i].setControlsVisibility({
					bl: false,
					br: false,
					tl: false,
					tr: false,
					mt: false,
					mb: false,
				});

				canvas.add(this.calipers[i]);
			}
		}

		// Painting ahead of origin row
		if(rowNumber > this.caliperOriginRow) {
			// Set origin row to fill out the remainder of the row that is after the originLeft
			this.calipers[this.caliperOriginRow].left = this.caliperOriginLeft;
			this.calipers[this.caliperOriginRow].width = this.config.ct.width - this.caliperOriginLeft;

			// Set calipers to completely fill rows between originRow and the newRow
			for(let i = this.caliperOriginRow + 1; i < rowNumber; i++) {
				this.calipers[i].width = this.config.ct.width;
			}

			// Set caliper in the new row to fill out the area behind the new mouseX
			this.calipers[rowNumber].width = mouseX;

		// Painting behind origin row
		} else if(rowNumber < this.caliperOriginRow) {
			// Set origin row to fill out the remainder of the row that is after the newLeft
			this.calipers[rowNumber].left = mouseX;
			this.calipers[rowNumber].width = this.config.ct.width - mouseX;

			// Set caliper to completely fill rows between newRow and the originRow
			for(let i = rowNumber + 1; i < this.caliperOriginRow; i++) {
				this.calipers[i].width = this.config.ct.width;
			}

			// Set caliper in the originRow to fill out the area behind the new mouseX
			this.calipers[this.caliperOriginRow].width = this.caliperOriginLeft;

		// Painting on same row as origin
		} else if(rowNumber === this.caliperOriginRow) {
			// Set caliper to fill out area between originLeft and newLeft
			if(mouseX < this.caliperOriginLeft) {
				this.calipers[this.caliperOriginRow].left = mouseX;
				this.calipers[this.caliperOriginRow].width = this.caliperOriginLeft - mouseX;
			} else {
				this.calipers[this.caliperOriginRow].left = this.caliperOriginLeft;
				this.calipers[this.caliperOriginRow].width = mouseX - this.caliperOriginLeft;
			}
		}

		// Set flags to re-render calipers
		for(let caliper of this.calipers) {
			caliper.dirty = true;
			caliper.setCoords();
			this.config.ct.html.canvas.bringToFront(caliper);
		}

		this.config.ct.html.canvas.renderAll();

		for(let caliper of this.calipers) {
			caliper.dirty = false;
		}
	}


    /**
     * Resets the calipers to a non-visible state
     * @private
     */
    private resetCalipers(): void {

	    this.caliperOriginLeft = -1;
	    this.caliperOriginRow = 0;

	    for(let caliper of this.calipers) {
		    caliper.width = 0;
		    caliper.left = 0;
			caliper.dirty = true;
			caliper.setCoords();
	    }

        this.config.ct.html.canvas.requestRenderAll();
    }

    /**
     * Renders the beat blocks but NOT the beat ticks
     */
    private renderBeatBlocks(): void {

        // Remove old beat blocks
        this.removeBeatBlocks();

        // Get num beats for ease of access
        const numBeats = this.region.beatList.length;

		// Create beat block and line objects
        for(let i = 0; i < this.region.beatList.length - 1; i++) {
	        const beat:IEcgBeat = this.region.beatList[i];

            if(i !== numBeats - 1) {
                // Create beat block and bind events
                let block = this.createBeatBlockObject(i, beat);
                this.beatBlocks.push(block);
                this.config.ct.html.canvas.add(block);
                this.bindBeatBlockEvents(block);
            }

            // Create beat lines and bind events
            let line = this.createBeatLineObject(i, beat);
            this.bindBeatLineEvents(line, i);
            this.beatLines.push(line);
            this.config.ct.html.canvas.add(line);
        }
    }

    /**
     * Removes beat blocks
     */
    private removeBeatBlocks(): void {

        // Remove beat blocks/lines from canvas
        let canvas = this.config.ct.html.canvas;
        this.firstLastBeatBlocks?.forEach(block => canvas.remove(block));
        this.beatBlocks?.forEach(block => canvas.remove(block));
        this.beatLines?.forEach(line => canvas.remove(line));

        // Clear beat block/line arrays
        this.firstLastBeatBlocks = [];
        this.beatBlocks = [];
        this.beatLines = [];
    }

    /**
     * Creates fabric.Group object representing a beat block.
     *
     * @param i
     * @private
     */
    private createBeatBlockObject(i: number,  beat: IEcgBeat): Group {
	    let localI = this.stripUtils.getLocalArrayIndex(beat.index)
	    let renderHeight = ( this.stripUtils.calcRowIndex(localI) * this.config.ct.line.height)
		    + this.stripUtils.calcBeatHeightOffset(localI)
	        - this.config.ct.beats.lineHeight;

        let heartRate = this.stripUtils.calcHeartRate(i, this.region.beatList) + '';
        let curBeatX = this.stripUtils.calcEcgLineX(this.stripUtils.getLocalArrayIndex(this.region.beatList[i].index));
        let nextBeatX = this.stripUtils.calcEcgLineX(this.stripUtils.getLocalArrayIndex(this.region.beatList[i + 1].index ));

		if(nextBeatX < curBeatX) nextBeatX = this.config.ct.width;

        // Rectangle that goes behind the beatText
        let beatRect =  new fabric.Rect({
	        top: renderHeight,
            left: curBeatX,
            width: nextBeatX - curBeatX,
            height: this.config.ct.beats.lineHeight,
            fill: this.config.ct.beats.lineBgColor
        });

        // Text that tells heart rate of the beat block
        let beatText = new fabric.Text(this.stripUtils.isBeatArtifactOrBlank(this.region.beatList[i]) ? '' : heartRate, {
	        top: renderHeight + this.config.ct.beats.lineHeight / 2,
            left: (curBeatX + nextBeatX) / 2,
            fontFamily: 'arial',
            fontSize: 14,
            textAlign: 'center',
            originX: 'center',
            originY: 'center',
            fill: this.config.ct.beats.lineTextColor
        });

        // Combine beatText and beatRect into group for unified settings and event handling
        let beatBlockObject = new fabric.Group([beatRect, beatText], {
            selectable: true,
            hasControls: false,
            lockMovementY: true,
            lockMovementX: true,
            hasBorders: false,
            hoverCursor: 'url(\'/assets/img/cursor/pointer-plus.png\') 6 0, default',
            perPixelTargetFind: true
        });

        return beatBlockObject;
    }


    /**
     * Binds events to beat blocks.
     * Add beat.
     *
     * @param {Group | Rect} block
     */
    public bindBeatBlockEvents(block: Group | Rect): void {
        // Block mouse over show add beat line
        block.on('mouseover', (event: IEvent<MouseEvent>) => {
            this.config.ct.beats.addLineElement.style.display = 'block';
        });

        // Block mouse out hide add beat line
        block.on('mouseout', (event: IEvent<MouseEvent>) => {
            this.config.ct.beats.addLineElement.style.display = 'none';
        });

        // Block Mouse move - align add beat line with mouse movement
        block.on('mousemove', (event: IEvent<MouseEvent>) => {
            // If we're in a caliper select we don't want the beat add line to appear
            if(this.isConstructingCaliper && this.config.ct.beats.addLineElement.style.display === 'block') {
                this.config.ct.beats.addLineElement.style.display = 'none';
                return;
            }

            this.config.ct.beats.addLineElementLeft = event.e.offsetX;
			this.config.ct.beats.addLineElementTop = event.e.offsetY - (event.e.offsetY % (this.config.ct.line.height + this.config.ct.beats.lineHeight)) + this.config.ct.beats.lineHeight;

        });

        block.on('mouseup', (event: IEvent<MouseEvent>) => {
            this.resetCalipers();
            if(this.isConstructingCaliper) {
                //Turn off caliper construction in block/line mouseup - these are fired after the canvas mouseup event so need to be here
                this.isConstructingCaliper = false;
                return;
            }

            // Get the click position and convert it to the equivalent backend index position
            let newBeatX = (event.e.x - this.config.ct.html.scrollContainer.getBoundingClientRect().left + this.config.ct.html.scrollContainer.scrollLeft);
            newBeatX = newBeatX / this.config.ct.global.resolutionScale;

            this.config.ct.beats.addLineElement.style.display = 'none';

            // Send notification to add new beat
            this.notifier.send(EcgChannelKey.BEAT_ACTION, {
                actions: [
                    {
                        rhythmTypeEdit: EcgRhythmTypeEdit.INSERT_PEAK,
                        type: EcgBeatActionType.ADD,
                        frontIndexes: [newBeatX, newBeatX],
                        backIndexes: [Math.round(this.utils.getBackendArrayIndex(newBeatX, this.config.ct.global.region)), Math.round(this.utils.getBackendArrayIndex(newBeatX, this.config.ct.global.region))]
                    }
                ]
            });
        });
    }


    /**
     * Binds selected/click event to line objects that will send a message out
     * using the EcgNotifier to notify of the delete action.
     *
     * @param {Group}  line
     * @param {number} index Frontend beatList array index
     */
    private bindBeatLineEvents(line: Group, index: number): void {

        // Capture line selection...aka click event...aka hacky
        line.on('mouseup', (event: IEvent<MouseEvent>) => {
            this.resetCalipers();
            if(this.isConstructingCaliper) {
                //Turn off caliper construction in block/line mouseup - these are fired after the canvas mouseup event so need to be here
                this.isConstructingCaliper = false;
                return;
            }
            // Send notification to add remove beat
            // This message is primarly intercepted by the EcgController
            this.notifier.send(EcgChannelKey.BEAT_ACTION, {
                actions: [
                    {
                        rhythmTypeEdit: EcgRhythmTypeEdit.DELETE_PEAK,
                        type: EcgBeatActionType.REMOVE,
                        frontIndexes: [index, index],
                        backIndexes: [this.region.beatList[index].index, this.region.beatList[index].index]
                    }
                ]
            });
        });
    }


    /**
     * Create fabric.Group object representing a beat line
     * @param i
     */
    private createBeatLineObject(i: number,  beat: IEcgBeat): Group {
	    let localI = this.stripUtils.getLocalArrayIndex(beat.index)
	    let curBeatIndex = this.stripUtils.calcEcgLineX(localI);
	    let renderHeight = ( this.stripUtils.calcRowIndex(localI) * this.config.ct.line.height)
		    + this.stripUtils.calcBeatHeightOffset(localI)
		    - this.config.ct.beats.lineHeight;

        let curBeat = this.region.beatList[i] as IEcgBeat;

        // To make the beat line easier to select, we draw an "invisible" box behind the beat line to expand the click area
        let beatLineSelectorBox = new fabric.Rect({
            left: curBeatIndex,
            originX: 'center',
            width: 20,
            height: this.config.ct.beats.lineHeight,
            fill: this.config.ct.beats.lineBgColor
        });

        // Make the beat line Object
        let beatLine = new fabric.Line([curBeatIndex, 0 , curBeatIndex, this.config.ct.beats.lineHeight], {
            stroke: curBeat.beatType === EcgBeatType.ECTOPY ? EctopicTypeMeta[curBeat.ectopicType].color : this.config.ct.beats.lineColor
        });

        // Combine the beatLineSelectorBox and Beat line into a group
        let beatLineObject = new fabric.Group([beatLineSelectorBox, beatLine], {
			top: renderHeight,
            selectable: true,
            hasControls: false,
            lockMovementY: true,
            lockMovementX: true,
            hasBorders: false,
            perPixelTargetFind: true,
            hoverCursor: 'url(\'/assets/img/cursor/pointer-minus.png\') 6 0, default'
        });

        return beatLineObject;
    }


    /**
     * Renders beat ticks to canvas
     */
    public renderBeatTicks(): void {

        // Remove old beat ticks
        this.removeBeatTicks();

        for(let i = 0; i < this.region.beatList.length - 1; i++) {

            const beat:IEcgBeat = this.region.beatList[i];

            let tick = this.createBeatTickObject(beat, i);
            this.beatTicks.push(tick);
            if(this.config.ct.beats.showLines){
                this.bindBeatTickEvents(tick, i);
            }
            this.config.ct.html.canvas.add(tick);

        }

    }

    /**
     * Creates a fabric.group object representing a beat tick
     * @param beat
     * @param i
     * @private
     */
    private createBeatTickObject(beat: IEcgBeat, i: number): Group {

		let localI = this.stripUtils.getLocalArrayIndex(beat.index)
        let curBeatIndex = this.stripUtils.calcEcgLineX(localI);
        let renderHeight = ( this.stripUtils.calcRowIndex(localI) * this.config.ct.line.height)
	        + this.stripUtils.calcBeatHeightOffset(localI)
	        + this.config.ct.beats.tickTop;

        // To make the beat tick easier to select, we draw an "invisible" box behind the beat tick to expand the click area
        let beatTickSelectorBox = new fabric.Rect({
            left: curBeatIndex,
            originX: 'center',
            width: 7,
            height: (renderHeight + this.config.ct.beats.tickHeight) - 42,
            fill: 'rgba(0, 0, 0, 0)',
            top: 43
        });

        // Make the beat line Object
        const isEctopicBeat: boolean = beat.beatType === EcgBeatType.ECTOPY;
        let beatTick =  new fabric.Line([ curBeatIndex, renderHeight, curBeatIndex, renderHeight +
                            (isEctopicBeat && this.config.ct.beats.ectopicTickHeight ? this.config.ct.beats.ectopicTickHeight : this.config.ct.beats.tickHeight) ], {
            stroke: isEctopicBeat ?  EctopicTypeMeta[beat.ectopicType].color : this.config.ct.beats.tickColor,
            selectable: false,
            originX:'center',
            strokeWidth: isEctopicBeat && this.config.ct.beats.ectopicStrokeWidth ? this.config.ct.beats.ectopicStrokeWidth : 1
        });

        // Combine the beatTickSelectorBox and Beat tick into a group
        let beatTickObject = new fabric.Group([beatTick, beatTickSelectorBox], {
            selectable: false,
            hasControls: false,
            lockMovementY: true,
            lockMovementX: true,
            originX: 'center',
            hasBorders: false,
            perPixelTargetFind: true,
            hoverCursor: 'default'
        });

        return beatTickObject;
    }



    /**
     * determines whether or not an ectopy that is to be marked contains blanked beats
     * @param startIndex
     * @param numBeatsToMark
     * @private
     */
    private ectopyContainsBlankBeats(startIndex: number, numBeatsToMark: number): boolean {

        let result = false;

        // get a shallow copy of the region we want to inspect
        const beatsToMarkArray = this.region.beatList.slice(startIndex, ( startIndex + numBeatsToMark ));

        const beatsToMarkHasBlanks = beatsToMarkArray.find((beat: IEcgBeat) => beat.blankProxy);

       if(beatsToMarkHasBlanks){
          this.pageNotifier.send(PageChannelKey.HEADER_NOTIFY, {
            action: IHeaderNotifyAction.ADD,
            snackbars: [
                {
                    text: MARK_ECTOPIC_BLANK_BEATS_WARNING,
                    textColor: IRHYTHM_COLORS.ERROR_RED_TEXT,
                    backgroundColor: IRHYTHM_COLORS.ERROR_RED_BG
                }
            ]
        });

           result = true;
       // if we are ok now we want to clear out any lingering snackbars
       } else if(this.snackBarRef) {
            this.snackBarRef.dismiss();
       }

       return result;
    }

    /**
     * determines whether or not an ectopy can be marked
     * @param startIndex
     * @param numBeatsToMark
     * @private
     */
    private canMarkEctopy(startIndex: number, numBeatsToMark: number): boolean {

        const startingBeat = this.region.beatList[startIndex];
        const endingBeat = this.region.beatList[startIndex + (numBeatsToMark - 1)] || null;

        if(!endingBeat) {
            return false;
        }

        switch (numBeatsToMark) {

            case 1:

                //if we are only marking one beat we only need to see if it has any other references. If it does, then that means we
                //would be breaking up the integrity of some other group which we will not allow
                if(startingBeat.ectopicOtherPeakIndexes &&
                    startingBeat.ectopicOtherPeakIndexes.length) {
                    return false;
                }

                break;
            case 2:

                //if there are no other references in the starting beat
                if(!startingBeat.ectopicOtherPeakIndexes) {
                    //we can see here that the ending beat is part of another group
                    if(endingBeat.ectopicOtherPeakIndexes && endingBeat.ectopicOtherPeakIndexes.length) {
                        return false;
                    }
                }

                //if the starting beat is part of a previous ectopic grouping, we cannot allow because it will
                // break up the integrity of the previous ectopic grouping
                const previousBeat = this.region.beatList[startIndex - 1] || null;
                if(previousBeat
                    && previousBeat.ectopicOtherPeakIndexes
                    && previousBeat.ectopicOtherPeakIndexes.length
                    && previousBeat.ectopicOtherPeakIndexes.includes(startingBeat.index)) {

                    return false;
                }

                const subsequentBeat = this.region.beatList[startIndex + numBeatsToMark] || null;

                //now we need to check if the ending beat has any references to beats beyond the scope of the change
                if(subsequentBeat &&
                    endingBeat.ectopicOtherPeakIndexes
                    && endingBeat.ectopicOtherPeakIndexes.length
                    && endingBeat.ectopicOtherPeakIndexes.includes(subsequentBeat.index)) {

                    return false;
                }

            case 3:

                const middleBeatEcgIndex = this.region.beatList[startIndex + 1].index;

                // if there are no references in the starting beat
                if(!startingBeat.ectopicOtherPeakIndexes) {

                    //we can see here that the ending beat is part of another group
                    if(endingBeat.ectopicOtherPeakIndexes && endingBeat.ectopicOtherPeakIndexes.length) {

                        //here we are looking for the case where the middle beat is the start of a couplet
                        // in this case we can allow it because we will cleanly overwrite the existing couplet
                        // from beginning to end
                        if(endingBeat.ectopicOtherPeakIndexes.length === 1
                            && endingBeat.ectopicOtherPeakIndexes.includes(middleBeatEcgIndex)) {
                            return true;
                        } else {
                            // here we know that the ending beat is referring to other beats beyond the index of this change.
                            // so we will not allow
                            return false;
                        }

                    }
                }

                // if the starting has references to other beats
                if(startingBeat.ectopicOtherPeakIndexes
                    && startingBeat.ectopicOtherPeakIndexes.length) {

                    //if the starting beat is part of a previous ectopic grouping, we cannot allow because it will
                    // break up the integrity of the previous ectopic grouping
                    const previousBeat = this.region.beatList[startIndex - 1] || null;
                    if(previousBeat
                        && previousBeat.ectopicOtherPeakIndexes
                        && previousBeat.ectopicOtherPeakIndexes.length
                        && previousBeat.ectopicOtherPeakIndexes.includes(startingBeat.index)) {

                        return false;
                    }

                    const subsequentBeat = this.region.beatList[startIndex + numBeatsToMark] || null;

                    //now we need to check if the ending beat has any references to beats beyond the scope of the change
                    if(subsequentBeat &&
                        endingBeat.ectopicOtherPeakIndexes
                        && endingBeat.ectopicOtherPeakIndexes.length
                        && endingBeat.ectopicOtherPeakIndexes.includes(subsequentBeat.index)) {

                        return false;
                    }

                }

        }


        return true;
    }


    private bindBeatTickEvents(tick: Group, index: number): void {

        //handlers
        tick.on('mousedown', (event: IEvent<MouseEvent>) => {

                // don't do anything unless the user has selected an ectopic type from the left hand nav
                if(this.selectedEctopicType) {

                    const numBeatsToMark: number = EctopicTypeMeta[this.selectedEctopicType].numberOfBeats;

                    if(!this.ectopyContainsBlankBeats(index, numBeatsToMark) && this.canMarkEctopy(index, numBeatsToMark)) {

                        const previousEctopicType: string = this.region.beatList[index][OptionalBeatAttributes.ECTOPIC_TYPE];

                        const action =  {
                            type: EcgBeatActionType.MARK_ECTOPY,
                            rhythmTypeEdit: EctopicTypeMeta[this.selectedEctopicType].rhythmTypeEdit,
                            selectedPeaks: [this.region.beatList[index].index],
                            newEctopicType: this.selectedEctopicType,
                            beatListIndex: index,
                            numBeatsToMark: numBeatsToMark
                        };

                        // only if the beat was previously marked as ectopic should we provide this
                        if(previousEctopicType){
                            action[OptionalBeatAttributes.ECTOPIC_TYPE] = previousEctopicType;
                        }

                        // Send notification to mark the ectopy
                        // This message is primarily intercepted by the EcgController
                        this.notifier.send(EcgChannelKey.BEAT_ACTION, {
                            actions: [action]
                        });

                        // send out a notification so the left nav can de-select the selected ectopy entry
                        this.recordNotifier.send(RecordChannelKey.ACTION, {action: RecordChannelAction.ECTOPY_MARKED});

                        // clear out the selectedEctopicType because the requirement specifies that only one ectopy may be
                        // be marked per click from the left nav
                        this.selectedEctopicType = null;


                    }
                }
            }
        );

        tick.on('mouseover', (event: IEvent<MouseEvent>) => {
            // only show a cursor if the user is marking an ectopy
            // if the selectedEctopicType cannot be set on the hovered tick, then we will show the 'not-allowed' cursor
            if(this.selectedEctopicType){
                const numBeatsToMark: number = EctopicTypeMeta[this.selectedEctopicType].numberOfBeats;
                const cursorType = this.canMarkEctopy(index,numBeatsToMark) ? 'pointer' : 'not-allowed';
                tick.set('hoverCursor', cursorType);
            }
        });
    }


    /**
     * Removes beat ticks from canvas and clears beat tick array
     */
    public removeBeatTicks(): void {
        this.beatTicks?.forEach(tick => this.config.ct.html.canvas.remove(tick));
        this.beatTicks = [];
    }

    /**
     * Creates a rect visualizing a blank beat
     */
    private createBlankBeat(beat: IEcgBeat): Rect {
	    let localI = this.stripUtils.getLocalArrayIndex(beat.index)
	    let renderHeight = ( this.stripUtils.calcRowIndex(localI) * this.config.ct.line.height)
		    + this.stripUtils.calcBeatHeightOffset(localI)
		    + this.config.ct.beats.tickTop;

        //Calc start and ending position based on provided beat
        let startX = this.stripUtils.calcEcgLineX(this.stripUtils.getLocalArrayIndex(beat.index));
        let endX;

        //If it's the last beat in the strip, use the end of the strip as endX
        const nextBeat = this.region.beatList[this.region.beatList.indexOf(beat) + 1]
        if (nextBeat) {
            endX = this.stripUtils.calcEcgLineX(this.stripUtils.getLocalArrayIndex(nextBeat.index));
        } else {
            endX = this.stripUtils.calcEcgLineX(this.stripUtils.getLocalArrayIndex(this.region.interval.endIndex));
        }

        return new fabric.Rect({
            hasControls: false,
            lockMovementY: true,
            lockMovementX: true,
            selectable: false,
            hoverCursor: 'default',
            hasBorders: false,
            left: startX + 10,
            width: (endX - startX) - 20,
            top: renderHeight + 19,
            height: 11,
            fill: '#748189'
        });
    }

    /**
     * Renders blank beats to canvas
     * @param {boolean} removeExisting
     */
    public renderBlankBeats(removeExisting?: boolean): void {

        if (!this.config.ct.parent) {
            // Remove old blank beats
            if (removeExisting) {
                this.removeBlankBeats();
            }

            // Create new blank beat objects
            this.region.beatList.forEach((beat) => {
                if (beat.blankProxy) {
                    let blankBeatBlock = this.createBlankBeat(beat);
                    this.blankBeats.push(blankBeatBlock);
                    this.config.ct.html.canvas.add(blankBeatBlock);
                }
            });
        }
    }

    /**
     * Removes blanked beat rects from canvas
     */
    public removeBlankBeats(): void {
        this.blankBeats?.forEach(beat => this.config.ct.html.canvas.remove(beat));
        this.blankBeats = [];
    }

    /**
     * Returns the EcgRhythmTypeEdit that maps to the currently selected HR Bar Action
     * @return {EcgRhythmTypeEdit}
     */
    private getEcgRhythmTypeEdit(): EcgRhythmTypeEdit {
        switch (this.selectedHRBarAction) {
            case HRBarActionType.BLANK_BEATS:
                return EcgRhythmTypeEdit.BLANK_HR_REGION_CREATE;
            case HRBarActionType.UNBLANK_BEATS:
                return EcgRhythmTypeEdit.BLANK_HR_REGION_DELETE;
            case HRBarActionType.CONVERT_TO_NORMAL:
                return EcgRhythmTypeEdit.MARK_NORMAL_PEAK;
            case HRBarActionType.ADD_BEATS:
                return EcgRhythmTypeEdit.INSERT_CONSTANT_RATE_PEAKS;
            case HRBarActionType.REMOVE_BEATS:
                return EcgRhythmTypeEdit.DELETE_PEAK;
        }
    }

    /**
     * Returns the EcgBeatActionType that maps to the currently selected HR Bar Action
     * @return {EcgBeatActionType}
     */
        private getEcgBeatActionType(): EcgBeatActionType {
            switch (this.selectedHRBarAction) {
                case HRBarActionType.BLANK_BEATS:
                    return EcgBeatActionType.BLANK;
                case HRBarActionType.UNBLANK_BEATS:
                    return EcgBeatActionType.BLANK;
                case HRBarActionType.CONVERT_TO_NORMAL:
                    return EcgBeatActionType.MARK_NORMAL;
                case HRBarActionType.ADD_BEATS:
                    return EcgBeatActionType.ADD_AVG;
                case HRBarActionType.REMOVE_BEATS:
                    return EcgBeatActionType.REMOVE;
            }
        }

        public ngOnDestroy(): void {
            this.destroy();
        }

    destroy(): void {
        // will unsubscribe() from itself and all child subscriptions
        this.allSubscriptions.unsubscribe();
    }
}

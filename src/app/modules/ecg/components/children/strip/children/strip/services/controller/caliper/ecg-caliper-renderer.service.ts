import { Observable, of, Subject, Subscription } from 'rxjs';
import { fabric } from 'fabric';
import { IEvent, Rect } from 'fabric/fabric-impl';

import { IEcgCaliperAction, IEcgCaliperActionChannel, IEcgControllerInit } from 'app/modules/ecg/interfaces';
import { EcgCaliperActionType, EcgComponentKey, EcgStripChannelKey } from 'app/modules/ecg/enums';
import { EcgBaseController } from 'app/modules/ecg/services/controller/base/ecg-base-controller.service';
import { EcgDto } from 'app/modules/ecg/services/dto/ecg/ecg-dto.service';
import { EcgStripConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-strip-config-dto.service';
import { EcgStripUtils } from 'app/modules/ecg/services/utils/ecg-strip-utils.service';
import { EcgStripNotifier } from '../../../../../services/notifier/ecg-strip-notifier.service';
import { throttleTime } from 'rxjs/operators';
import { EcgUtils } from '../../../../../../../../services/utils/ecg-utils.service';


export class EcgCaliperRenderer extends EcgBaseController {
	
    // Whether the user is constructing caliper coordinates/dimensions after caliper is set to zero
    // (or is being constructed for the first time)
    private isConstructingCaliper: boolean = false;
	 
	private isNonPaintInteraction: boolean = false;

	private calipers: Rect[] = [];
	
	// The edge that the caliper began constructing at
	private caliperOriginLeft: number = 0;
	private caliperOriginRow: number = 0;
	
	private drawCaliperRows: Subject<IEvent<MouseEvent>> = new Subject<IEvent<MouseEvent>>();

    private caliperActionSubs: Subscription;


    /**
     * Ctor
     *
     * @param {EcgStripConfigDto} private config
     * @param {EcgDto}            private dto
     * @param {EcgStripNotifier}  private notifer
     */
    public constructor(
        private config: EcgStripConfigDto,
        private dto: EcgDto,
        private notifer: EcgStripNotifier,
        private stripUtil: EcgStripUtils,
	    private util: EcgUtils
    ) {
        super();
        this.setComponentKey();
    }

    /**
     * Set component key
     */
    protected setComponentKey(): void {
        this.componentKey = EcgComponentKey.CALIPER;
    }


    /**
     * Init Top Level Window Functionality:
     *
     *
     * @return {Observable<IEcgControllerInit>}
     */
    public init(): Observable<IEcgControllerInit> {
		
        // Init Logic
        this.initListeners();

        // Render
        this.render();

    	return of({
    		success: true
    	});
    }


    /**
     * Init Listeners
     */
    private initListeners(): void {

        // Render action
        this.caliperActionSubs = this.notifer
            .listen(EcgStripChannelKey.CALIPER_ACTION)
            .subscribe((data: IEcgCaliperActionChannel) => {

                // Loop over the array of actions received and process each
                // The order actions are sent is important...i think
                data.actions.forEach((action: IEcgCaliperAction) => {

                    switch(action.type) {

                        // Reset caliper
                        case EcgCaliperActionType.RESET_CALIPER:
                            this.resetCalipers();
                            break;

                    }
                });
            });
    }

    /**
     * Renders the caliper to the canvas
     *
     */
    public render(): void {
	    for( let i = 0; i < this.stripUtil.calcNumRows(); i++ ) {
		    if( this.calipers[i] ) {
			    this.calipers[i].width = 0;
			    this.calipers[i].left = 0;
		    } else {
			    this.calipers[i] = new fabric.Rect( {
				    lockMovementY: true,
				    lockMovementX: true,
				    hasRotatingPoint: false,
				    hasBorders: false,
				    height: this.config.ct.line.height,
				    width: 0,
				    left: 0,
					hoverCursor: 'pointer',
				    // TODO: We really need to get this beat/line offset into a global property/calcOffset() method
				    top: ((i + 1) * this.config.ct.beats.lineHeight) + ( i * this.config.ct.line.height ),
				    fill: 'rgba(173, 240, 249, .25)'
			    } );
		    }
		
		    this.calipers[i].setControlsVisibility( {
			    bl: false,
			    br: false,
			    tl: false,
			    tr: false,
			    mtr: false,
			    mt: false,
			    mb: false,
			    ml: false,
			    mr: false
		    } );
		
		    this.config.ct.html.canvas.add( this.calipers[i] );
	    }
	    
	    this.drawCaliperRows.pipe(throttleTime(1000/60)).subscribe((e) => {
			let rowNum = Math.floor(e.absolutePointer.y / (this.config.ct.line.height + this.config.ct.beats.lineHeight));
		    rowNum = Math.max(Math.min(rowNum, this.stripUtil.calcNumRows() - 1), 0);
			
			let mouseXLocation = Math.max(Math.min(e.absolutePointer.x, this.config.ct.width + this.config.ct.html.scrollContainer.scrollLeft), 0);
		    this.setCaliperRows(mouseXLocation, rowNum)
	    });
		
		this.bindEventsRows();
    }
	private bindEventsRows(): void {
		// Bind mouse down to creating caliper
		this.config.ct.html.canvas.on('mouse:down', (event: IEvent<MouseEvent>) => {
			
			// If clicking on something (like the beat blocks or marking an ectopic), don't fire this event
			if (event.target && event.target.hoverCursor !== "default" ) {
				this.isNonPaintInteraction = true;
				return;
			} 

			this.isNonPaintInteraction = false;
			
			// Exclude events in the top HR bar
			//if (event.absolutePointer.y < this.config.ct.beats.lineHeight) return;
			if(event.absolutePointer.y % (this.config.ct.line.height + this.config.ct.beats.lineHeight) < this.config.ct.beats.lineHeight) return;
			
			// Move caliper to click location and start constructing caliper
			if (this.calipers.map(caliper => caliper.left).reduce((totalLeft, curLeft) => totalLeft + curLeft) === 0 )  {
				
				// Set caliper starting point
				this.caliperOriginRow = Math.floor(event.absolutePointer.y / (this.config.ct.line.height + this.config.ct.beats.lineHeight));
				this.caliperOriginLeft = event.absolutePointer.x;
				
				// Begin constructing caliper
				this.isConstructingCaliper = true;
				// If caliper already exists, reset it
			} else {
				this.resetCalipers();
			}
		});
		
		// Bind mouse move to constructing caliper
		this.config.ct.html.canvas.on('mouse:move', (event: IEvent<MouseEvent>) => {
			if(!this.isConstructingCaliper) return;
			this.drawCaliperRows.next(event);
		});
		
		// Bing mouse up to stop re-sizing caliper
		this.config.ct.html.canvas.on('mouse:up', (event: IEvent<MouseEvent>) => {
			
			// Exclude events in the top HR bar
			if(event.absolutePointer.y % (this.config.ct.line.height + this.config.ct.beats.lineHeight) < this.config.ct.beats.lineHeight) return;
			
			// Set in mouse:down, true if doing non-paint events like marking an ectopic
			if(this.isNonPaintInteraction) return;

			// Stop constructing caliper
			this.isConstructingCaliper = false;
			
			// Tell canvas that caliper coordinates / dimensions have changed, and to re-render
			this.config.ct.html.canvas.requestRenderAll();
			
			let endRow = Math.floor(event.absolutePointer.y / (this.config.ct.line.height + this.config.ct.beats.lineHeight));
			let endLeft = event.absolutePointer.x;
			
			let [leftDP, rightDP] = [this.stripUtil.calcDataPoint(this.caliperOriginLeft, this.caliperOriginRow), this.stripUtil.calcDataPoint(endLeft, endRow)]
			
			// Notify the ecg-component of a paint action
			this.notifer.send(EcgStripChannelKey.CALIPER_ACTION, {actions: [
					{
						type: EcgCaliperActionType.PAINT_INTERVAL,
						paintInterval: {
							left: this.util.getBackendArrayIndex(Math.min(leftDP, rightDP), this.stripUtil.getRegionKey()),
							right: this.util.getBackendArrayIndex(Math.max(leftDP, rightDP), this.stripUtil.getRegionKey())
						},
					}]
			});
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
		for( let i = 0; i < this.calipers.length; i++ ) {
			if( this.calipers[i] ) {
				this.calipers[i].width = 0;
				this.calipers[i].left = 0;

			} else {
				this.calipers[i] = new fabric.Rect( {
					lockMovementY: true,
					lockMovementX: true,
					hasRotatingPoint: false,
					hasBorders: false,
					height: this.config.ct.line.height,
					width: 0,
					left: 0,
					hoverCursor: 'pointer',
					
					// TODO: We really need to get this beat/line offset into a global property/calcOffset() method
					top: this.stripUtil.calcBeatHeightOffset( i ) + ( i * this.config.ct.line.height ),
					fill: 'rgba(173, 240, 249, .25)'
				} );
				
				canvas.add( this.calipers[i] );
			}
			
			
			this.calipers[i].setControlsVisibility( {
				bl: false,
				br: false,
				tl: false,
				tr: false,
				mtr: false,
				mt: false,
				mb: false,
				ml: false,
				mr: false
			} );
		}
		
		// Painting ahead of origin row
		if(rowNumber > this.caliperOriginRow) {
			// Set origin row to fill out the remainder of the row that is after the originLeft
			this.calipers[this.caliperOriginRow].left = this.caliperOriginLeft;
			this.calipers[this.caliperOriginRow].width = this.config.ct.width - this.caliperOriginLeft;
			this.calipers[this.caliperOriginRow].setControlsVisibility({
				ml: true
			})
			
			// Set calipers to completely fill rows between originRow and the newRow
			for(let i = this.caliperOriginRow + 1; i < rowNumber; i++) {
				this.calipers[i].width = this.config.ct.width;
			}
			
			// Set caliper in the new row to fill out the area behind the new mouseX
			this.calipers[rowNumber].width = mouseX
			this.calipers[rowNumber].setControlsVisibility({
				mr: true
			})
			
		// Painting behind origin row
		} else if(rowNumber < this.caliperOriginRow) {
			// Set origin row to fill out the remainder of the row that is after the newLeft
			this.calipers[rowNumber].left = mouseX;
			this.calipers[rowNumber].width = this.config.ct.width - mouseX;
			this.calipers[rowNumber].setControlsVisibility({
				ml: true
			})
			
			// Set caliper to completely fill rows between newRow and the originRow
			for(let i = rowNumber + 1; i < this.caliperOriginRow; i++) {
				this.calipers[i].width = this.config.ct.width;
			}
			
			// Set caliper in the originRow to fill out the area behind the new mouseX
			this.calipers[this.caliperOriginRow].width = this.caliperOriginLeft;
			this.calipers[this.caliperOriginRow].setControlsVisibility({
				mr: true
			})
			
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
			
			this.calipers[this.caliperOriginRow].setControlsVisibility({
				ml: true,
				mr: true
			})
			
			this.calipers[this.caliperOriginRow].lockMovementX = false;
			this.calipers[this.caliperOriginRow].hoverCursor = "move";
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
     * Resets the caliper to a non-visible state
     * @private
     */
    private resetCalipers(): void {
	
	
	    for(let caliper of this.calipers) {
		    // set the horizontal scale of the caliper to 1
		    caliper.scaleX = 1;
		
		    // Reset caliper coordinates
		    caliper.left = 0;
		    caliper.width = 0;
		
		    // If constructing caliper, stop
		    this.isConstructingCaliper = false;
		
		    // Tell canvas that calipers were moved and to re-render
		    caliper.dirty = true;
		    caliper.setCoords();
	    }
	    this.config.ct.html.canvas.requestRenderAll();
    }

    destroy(): void {
        this.caliperActionSubs.unsubscribe();
    }
}

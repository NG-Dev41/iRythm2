import { Injectable, OnDestroy } from '@angular/core';

import { Observable, of } from 'rxjs';

import { IEcgControllerInit } from 'app/modules/ecg/interfaces';
import { EcgComponentKey, EcgViewType } from 'app/modules/ecg/enums';
import { EcgBaseController } from 'app/modules/ecg/services/controller/base/ecg-base-controller.service';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';
import { EcgStripConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-strip-config-dto.service';


@Injectable()
export class EcgAxisGridController extends EcgBaseController implements OnDestroy{

    // Array of vertical line spacing
    // TODO: Vertical lines are overly complex. Can be better.
	public verticalGridLines: Array<Array<number>>;

    // Array of horizontal line spacing
    public horizontalGridLines: Array<number>;


    /**
     * Ctor
     */
    public constructor(
        public config: EcgStripConfigDto,
        public globalConfig: EcgConfigDto
    ) {
        super();
        this.setComponentKey();
    }

    /**
     * Init
     *
     * @return {Observable<IEcgControllerInit>}
     */
    public init(): Observable<IEcgControllerInit> {

	    // Init Logic
        this.generateVerticalGridLines();

        if(this.globalConfig.ct.viewType === EcgViewType.ADDITIONAL_STRIP) {
            this.generateHorizontalGridLines();
        }

        return of({
            success: true
        });
    }


    /**
     * Generates horizontal grid lines for strip.
     *
     * TODO: This is the incorrect horizontal/vertical axis grid implementation for additonal strips.
     * They need to be rendered to scale.
     * "Each grid square should be scaled to represent 0.2 seconds of time (200 ms),
     * such that two boxes truly represent 400 ms and 5 boxes represent 1 second of duration."
     *
     * Ticket: https://jira.irhythmtech.org/browse/CLIN-302
     * Psuedocode: https://jira.irhythmtech.org/browse/CLIN-302?focusedCommentId=767202&page=com.atlassian.jira.plugin.system.issuetabpanels%3Acomment-tabpanel#comment-767202
     *
     */
    public generateHorizontalGridLines(): void {

        this.horizontalGridLines = new Array<number>();

        for(let i = this.config.ct.axisGrid.xAxisLineFrequency; i < 200; i += this.config.ct.axisGrid.xAxisLineFrequency) {
            this.horizontalGridLines.push(i);
        }
    }


	/**
	 * Generates horizontal grid lines for strip
	 */
	public generateVerticalGridLines(): void {

		this.verticalGridLines = [];

		let numRows = 1;
		if(this.config.ct.global.rowIntervals) {
            numRows = this.config.ct.global.rowIntervals.length;
        }

		// Initialize array for every row
		for(let i = 0; i < numRows; i++) {
			this.verticalGridLines[i] = [];
		}

		let i = this.config.ct.axisGrid.xAxisLineFrequency;

		// Add lines to each rowArray
		while(i < this.config.ct.width) {
			this.verticalGridLines.forEach(gridLinesArray => gridLinesArray.push(i));
			i += this.config.ct.axisGrid.xAxisLineFrequency
		}
	}


    /**
     * Set component key
     */
    protected setComponentKey(): void {
        this.componentKey = EcgComponentKey.STRIP_AXIS_GRID;
    }


    public ngOnDestroy(): void{
      this.destroy();
    }


    public destroy(): void {}
}

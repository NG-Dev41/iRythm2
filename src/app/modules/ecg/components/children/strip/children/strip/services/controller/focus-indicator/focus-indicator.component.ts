import { Component, OnInit } from '@angular/core';
import { EcgConfigDto } from '../../../../../../../../services/dto/ecg/ecg-config-dto.service';
import { EcgStripConfigDto } from '../../../../../../../../services/dto/ecg/ecg-strip-config-dto.service';
import { EcgStripUtils } from '../../../../../../../../services/utils/ecg-strip-utils.service';
import { EcgComponentState } from 'app/modules/ecg/enums';

@Component({
    selector: 'app-focus-indicator',
    templateUrl: './focus-indicator.component.html',
    styleUrls: ['./focus-indicator.component.scss'],
})
export class FocusIndicatorComponent implements OnInit {
    public left: number;
    public top: number;
    public width: number;

    // The distance between the bottom of the focus container and the bottom of the row
    readonly FOCUS_LINE_TOP_OFFSET = 10;

    // Offset the top of the container by the height of the focus-container
    // If not done, than it will be too low
    readonly FOCUS_LINE_HEIGHT_OFFSET = 24;

    // For use in the template
    public EcgComponentState = EcgComponentState;

    constructor(public config: EcgConfigDto, public stripConfig: EcgStripConfigDto, public stripUtils: EcgStripUtils) {}

    public ngOnInit(): void {
        let totalNumSecondsOfStrip = this.stripConfig.ct.focusIndicator.duration;
		
		if(!this.stripConfig.ct.global.rowIntervals) return;
		
		// Get the start and end datapoint of the focus indicator
        let totalStartIndex = this.stripConfig.ct.global.rowIntervals[0].startIndex;
        let totalEndIndex = this.stripConfig.ct.global.rowIntervals.slice(-1)[0].endIndex;
		
        let dpPerSecond = (totalEndIndex - totalStartIndex) / totalNumSecondsOfStrip;

        // Focus line is 16 seconds wide
        let centered16SecondsStart = Math.round(totalStartIndex + dpPerSecond * (totalNumSecondsOfStrip / 2 - 8));
        let centered16SecondsEnd = Math.round(totalStartIndex + dpPerSecond * (totalNumSecondsOfStrip / 2 + 8));

		// Convert the datapoint values into screen pixel values
        let rowIndex = this.stripUtils.calcRowIndex(this.stripUtils.getLocalArrayIndex(centered16SecondsStart));
        let leftIndex = this.stripUtils.calcEcgLineX(this.stripUtils.getLocalArrayIndex(centered16SecondsStart));
        let rightIndex = this.stripUtils.calcEcgLineX(this.stripUtils.getLocalArrayIndex(centered16SecondsEnd));

        this.left = leftIndex;
        this.width = rightIndex - leftIndex;
        this.top =
            (this.stripConfig.ct.line.height + this.stripConfig.ct.beats.lineHeight) * (rowIndex + 1) -
            this.FOCUS_LINE_TOP_OFFSET -
            this.FOCUS_LINE_HEIGHT_OFFSET;
    }
}

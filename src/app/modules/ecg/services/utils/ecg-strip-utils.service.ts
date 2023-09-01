import { Injectable } from '@angular/core';

import { IEcgBeat, RegionType, IEcgEpisodeInterval, IEpisodeDataRegion } from 'app/modules/ecg/interfaces';
import { EcgBeatType } from 'app/modules/ecg/enums';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';
import { EcgDto } from 'app/modules/ecg/services/dto/ecg/ecg-dto.service';
import { EcgStripConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-strip-config-dto.service';


@Injectable()
export class EcgStripUtils {

	public constructor(
        private config: EcgConfigDto,
        public stripConfig: EcgStripConfigDto,
        private dto: EcgDto
    ) {}

	public getRegionKey(): string {

		if(this.stripConfig.ct.global.sampleCursorResultKey) {
			return this.stripConfig.ct.global.sampleCursorResultKey;
		}
        else
        if(this.stripConfig.ct.global.region) {
			return this.stripConfig.ct.global.region;
		}
        else {
			return RegionType.DEFAULT_SAMPLES;
		}
	}

	/**
	 * Returns true if user input wants to show beat ticks or blocks
	 *
	 * @return {boolean}
	 */
    public calcShowBeats(): boolean {
        return (this.stripConfig.ct.beats.showTicks || this.stripConfig.ct.beats.showLines);
    }


    /**
     * Calculates the number of seconds that will be shown on the strip line.
     * If the this.stripConfig.ct.numSecondsViewable is already set that means it was set via user input and we'll use that.
     * Otherwise we calculate num seconds by canvas width by the ecgSampleRate returned by API
     *
     * @return {number}
     */
    public calcNumSecondsViewable(): number {
    	return Math.round((this.stripConfig.ct.global.forcedNumSecondsViewable)
    		? this.stripConfig.ct.global.forcedNumSecondsViewable
    		: (this.stripConfig.ct.width / this.dto.data.metaData.ecgSampleRate));
    }


    /**
     * Calc total number of seconds represented by the entire array of sample data.
     *
     * @return {number} Num seconds
     */
    public calcNumTotalSeconds(): number {
        const region = this.dto.regions[this.stripConfig.ct.global.region];
        return Math.round(region.ecgSampleList.length / this.dto.data.metaData.ecgSampleRate);
    }


    /**
     * Calculates and returns the resolution scale.
     *
     * @return {number}
     */
    public calcResolutionScale(): number {
		let region = this.dto.regions[this.stripConfig.ct.global.region];

		if(this.stripConfig.ct.global?.rowIntervals?.length > 0) {
			return this.stripConfig.ct.width / (this.stripConfig.ct.global.rowIntervals[0].endIndex - this.stripConfig.ct.global.rowIntervals[0].startIndex);
		}

		if(this.stripConfig.ct.global.subRegion && region['preComputedSubRegionList']) {
			let typedRegion = region as IEpisodeDataRegion;
			let subRegionInterval: IEcgEpisodeInterval = typedRegion.preComputedSubRegionList.find(
				subRegion => subRegion.subRegion === this.stripConfig.ct.global.subRegion ).interval;

			return this.stripConfig.ct.width / (subRegionInterval.endIndex - subRegionInterval.startIndex);
		}

    	return (this.stripConfig.ct.global.numSecondsViewable)
    		? (this.stripConfig.ct.width / this.dto.data.metaData.ecgSampleRate / this.stripConfig.ct.global.numSecondsViewable)
    		: 1;
    }


    /**
     * Calculates entire height of the canvas.
     * Window height + beat block height if beat blocks are being shown.
     *
     * @return {number}
     */
    public calcGlobalHeight(): number {
    	return this.stripConfig.ct.line.height + ((this.stripConfig.ct.beats.showLines) ? this.stripConfig.ct.beats.lineHeight : 0);
    }


    /**
     * Calculate canvas/container overflow width.
     * TODO: Revisit this to make sure it's correct.
     *
     * @return {number}
     */
    public calcOverflowWidth(): number {
        const region = this.dto.regions[this.stripConfig.ct.global.region];
    	return Math.round((this.stripConfig.ct.global.resolutionScale * region.ecgSampleList.length));
    }


    /**
     * Calculates y position of an ecg sample point.
     *
     * @param  {number} samplePoint
     * @param  {number} gain
     * @return {number}
     */
    public calcEcgLineY(samplePoint: number, pointIndex: number): number {

	    // Divide short by millivolt (value per mv) 1147 <XT>
	    const rowIndex = this.calcRowIndex(pointIndex);

	    // The height of the rows above it (Or just the height of the beatblocks, if the rowIndex is 0)
	    const rowHeightOffset = (rowIndex * this.stripConfig.ct.line.height)  + this.calcBeatHeightOffset(pointIndex);

	    samplePoint = (samplePoint / this.dto.data.metaData.valuePermv);
		const containerHalfHeight = (this.stripConfig.ct.line.height / 2);
	    const gain = this.config.ct.gain.selectedGainValue;

		// If the Y value of a line is too high or low, it will overflow into the row above/beneath it, so we cap the value at the top/bottom of the line height area
		let minRowIndexHeight = rowIndex * (this.stripConfig.ct.line.height + this.stripConfig.ct.beats.lineHeight) + this.stripConfig.ct.beats.lineHeight - 1;
		let maxRowIndexHeight = rowIndex * (this.stripConfig.ct.line.height + this.stripConfig.ct.beats.lineHeight) + this.stripConfig.ct.line.height + this.stripConfig.ct.beats.lineHeight + 1;

	    // Convert differently based on negative/positive value
	    if(samplePoint < 0) {
		    return Math.min(
				Math.round((samplePoint * containerHalfHeight * gain) * -1 + rowHeightOffset + containerHalfHeight)
			    , maxRowIndexHeight
		    );
	    }
	    else {
		    return Math.max(
				Math.round((containerHalfHeight +  rowHeightOffset - (samplePoint * containerHalfHeight * gain)))
			    , minRowIndexHeight
		    );
	    }
    }

    public calcBeatHeightOffset(pointIndex: number): number {
		if(!this.stripConfig.ct.beats.showLines) this.stripConfig.ct.beats.lineHeight = 0;
		return (this.calcRowIndex(pointIndex) + 1) * this.stripConfig.ct.beats.lineHeight;
    }


    /**
     * Calculates x position of an ecp sample point.
     *
     * @param  {number} samplePoint
     * @param  {number} gain
     * @return {number}
     */
    public calcEcgLineX(pointIndex: number): number {
		let rowIntervals = this.stripConfig.ct.global.rowIntervals;
		let calcIndex = pointIndex;

		// If row intervals are present, offset for the rowStartIndex
		if(rowIntervals) {
			let intervalStartIndex = rowIntervals[this.calcRowIndex(pointIndex)].startIndex;
			calcIndex = pointIndex - intervalStartIndex + this.dto.regions[this.getRegionKey()].interval.startIndex;
		}

	    return Math.round(calcIndex * this.stripConfig.ct.global.resolutionScale);
    }


	/**
	 * Calcs a datapoint (frontend array index) from an x location on the canvas
	 *
	 * @param xCoord
	 * @param rowIndex
	 */
	public calcDataPoint(xCoord: number, rowIndex?: number): number {
		let dpOffset = rowIndex ? this.getLocalArrayIndex(this.stripConfig.ct.global.rowIntervals[rowIndex].startIndex) : 0;
		return dpOffset + Math.round(xCoord / this.stripConfig.ct.global.resolutionScale);
    }


    /**
     * Returns the index of an ecg point in the front end array.
     * Pass the index as it relates to the backend array.
     *
     * TODO: I've moved this method to EcgUtils - needs to be removed from here but it's being
     * referenced in quite a few places and i'm too lazy to do it right now.
     *
     * @param  {number} backendIndex
     * @return {number}
     */
    public getLocalArrayIndex(backendIndex: number): number {
        const region = this.dto.regions[this.getRegionKey()];
        return (backendIndex - region.interval.startIndex);
    }


    /**
     * Calculates the width of the highlighter.
     * Highlighter should be a width that matches the number of seconds
     * being shown in the parent line.
     *
     * @return {number} Width
     */
    public calcHighlighterWidth(): number {
        return Math.round((this.stripConfig.ct.parent.global.numSecondsViewable /
            this.stripConfig.ct.global.numSecondsViewable *
	        this.stripConfig.ct.width));
    }


    /**
     * Calcultes the center index of strip sample points
     *
     * @return {number}
     */
    public calcWindowCenterIndex(): number {
        const region = this.dto.regions[this.getRegionKey()];
        return ((this.getLocalArrayIndex(region.interval.startIndex)) +
        (this.getLocalArrayIndex(region.interval.endIndex))) / 2;
    }


    /**
     * Calculates center of index of where to move highlighter to...if you want to center it.
     *
     * @return {number}
     */
    public calcHighlighterCenterX(): number {
        return (this.calcWindowCenterIndex() * this.stripConfig.ct.global.resolutionScale) -
        (this.stripConfig.ct.highlighter.width / 2);
    }


    /**
     * Calculates the width of the primary episode indicator.
     *
     * @return {number}
     */
    public calcPrimaryIndicatorLeftX(): number {
        const region = this.dto.regions[this.getRegionKey()];
        return (this.dto.data.episode.interval.startIndex - region.interval.startIndex) *
        this.stripConfig.ct.global.resolutionScale;
    }


    /**
     * Calculates the left x position for the primary episode indicator to line up with the primary episode.
     *
     * @return {number}
     */
    public calPrimaryIndicatorWidth(): number {
        return (this.dto.data.episode.interval.startIndex - this.dto.data.episode.interval.endIndex) *
        this.stripConfig.ct.global.resolutionScale * -1;
    }

    /**
     * Given start + end frontend indices, return the beats that fall within that range
     *
     * @param {number} leftIndex
     * @param {number} rightIndex
     * @param {IEcgBeat[]} beatList
     * @return {IEcgBeat[]}
     */
    public findBeatsInRange(leftIndex: number, rightIndex: number, beatList: IEcgBeat[]): IEcgBeat[] {
        const closestIndexBelow = beatList.findIndex(({ index }) => this.getLocalArrayIndex(index) >= leftIndex);
        const closestIndexAbove = beatList.findIndex(({ index }) => this.getLocalArrayIndex(index) > rightIndex);

        //Shallow copy, modifications to items in beatList still affected
        return beatList.slice(closestIndexBelow, closestIndexAbove);
    }

    /**
     * Given a frontend index, find the nearest beat immediately to the left or right of that index
     *
     * @param {number} index
     * @param {IEcgBeat[]} beatList
     * @param {'left' | 'right'} direction
     * @return {IEcgBeat}
     */
    public findNearestBeat(selectIndex: number, beatList: IEcgBeat[], direction: 'left' | 'right'): IEcgBeat {
        let nearestBeatIndex;
        if (direction === 'left') {
            nearestBeatIndex = beatList.findIndex(({ index }) => this.getLocalArrayIndex(index) >= selectIndex) - 1;
        } else {
            nearestBeatIndex = beatList.findIndex(({ index }) => this.getLocalArrayIndex(index) >= selectIndex);
        }

        return beatList[nearestBeatIndex];
    }

    /**
     * Calculates heart rate and returns the value.
     *
     * @param  {number} beatIndex
     * @param {IEcgBeat[]} beatList
     * @return {number}
     */
    public calcHeartRate(beatIndex: number, beatList: IEcgBeat[], skipRound?: boolean): number {
        const region = this.dto.regions[this.getRegionKey()];

        const sampleRate = this.dto.data.metaData.ecgSampleRate;
        const indexOffset = region.interval.startIndex;
        const peak1 = (beatList[beatIndex].index - indexOffset);
        const peak2 = beatList[beatIndex +  1].index - indexOffset;

        const finalHR = 60 * sampleRate / (peak2 - peak1);
        return skipRound ? finalHR : Math.round(finalHR);
    }

    /**
     * Average heart rate of beatsToCalc that are a subset of regionBeatList
     *
     * @param {IEcgBeat[]} beatsToCalc
     * @param {IEcgBeat[]} regionBeatList
     * @return {number}
     */
    public calcAvgHeartRate(beatsToCalc: IEcgBeat[], regionBeatList: IEcgBeat[]): number {
        const HRSum = beatsToCalc.reduce((currSum: number, currentBeat: IEcgBeat) => currSum + this.calcHeartRate(regionBeatList.indexOf(currentBeat), regionBeatList, true), 0);
        return HRSum / beatsToCalc.length;
    }

    /**
     * Convert index range to time (in seconds)
     *
     * @param {number} leftIndex
     * @param {number} rightIndex
     * @return {number}
     */
    public getTimeInterval(leftIndex: number, rightIndex: number): number {
        return (rightIndex - leftIndex) / this.dto.data.metaData.ecgSampleRate;
    }

    /**
     * Blank beats are denoted in the backend by an insertion of a beat in front of the existing beat with beatType of BLANK.
     * If there is a blank beat after a beat in the incoming beatlist, we remove that blank beat and set blankProxy to true
     * so that we don't have to deal with these extra blank beats on the frontend
     *
     * @param {IEcgBeat[]} beatList
     * @return {IEcgBeat[]}
     */
       public processBlankBeats(beatList: IEcgBeat[]): IEcgBeat[] {
        beatList.forEach(beat => {
            if (beatList[beatList.indexOf(beat) + 1] && beatList[beatList.indexOf(beat) + 1].beatType === EcgBeatType.BLANK) {
                beat.blankProxy = true;
            }
        });

        return beatList.filter((beat) => beat.beatType !== EcgBeatType.BLANK);
    }

	/**
	 * Gets the total number of rows present in the strip
	 */
	public calcNumRows(): number {
		   return this.stripConfig.ct.global.rowIntervals ? this.stripConfig.ct.global.rowIntervals.length : 1;
	}

	/**
	 * Calcs the row index for a given datapoint index
	 * @param dpIndex
	 */
	public calcRowIndex(dpIndex: number): number {
		   let rowIntervals = this.stripConfig.ct.global.rowIntervals;

		   if(!rowIntervals) return 0;

		   let startIndex = rowIntervals[0].startIndex;
		   let rowIndex = rowIntervals.findIndex(interval => {
			   return interval.startIndex <= dpIndex + startIndex && interval.endIndex >= dpIndex + startIndex;
		   });

		   if(rowIndex === -1) return 0;
		   return rowIndex;

	}

    /**
     * @param {IEcgBeat} beat
     * @return {boolean}
     */
    public isBeatArtifact(beat: IEcgBeat): boolean {
        return !beat.effective;
    }

    public beatListHasArtifact(beats: IEcgBeat[]): boolean {
        return beats.some((beat: IEcgBeat) => this.isBeatArtifact(beat));
    }

    public isBeatArtifactOrBlank(beat: IEcgBeat): boolean {
        return this.isBeatArtifact(beat) || beat.blankProxy;
    }

    /**
     * Every beat w/ ectopicOtherPeakIndexes prop needs to have those indexes in the selection for the method to return true
     *
     * @param {IEcgBeat[]} selectedBeats
     * @return {boolean}
     */
    public isEntireEctopyRangeSelected(selectedBeats: IEcgBeat[]): boolean {
        return selectedBeats.every((beat: IEcgBeat) => {
            if (beat.ectopicOtherPeakIndexes) {
                return beat.ectopicOtherPeakIndexes.every((index: number) => selectedBeats.find((beat: IEcgBeat) => beat.index === index));
            }

            return true;
        });
    }
}



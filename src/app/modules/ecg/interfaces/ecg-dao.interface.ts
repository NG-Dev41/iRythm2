// ----------------------------------------------------------
// DAO RELATED INTERFACES ------------------------------------------------
// ----------------------------------------------------------

import { EctopicType } from 'app/commons/constants/ectopics.const';
import { GenericHttpResponse } from 'app/commons/constants/endpoint-url.const';
import { RhythmType } from 'app/commons/constants/rhythms.const';
import {
    EcgRhythmTypeEdit,
    EcgCursorType,
    EcgBeatType
} from 'app/modules/ecg/enums';
import { IRecordMetricsResponse } from 'app/features/record/services/interfaces/record-metrics.interface';
import { RhythmSortType } from 'app/features/record/services/enums/rhythm-sort-type.enum';
import { IAdditionalStripsResponse } from 'app/commons/services/dao/additional-strips-dao.service';


/**
 * EcgAnalyzerDao analyze request/input params
 */
export interface IEcgAnalyzerAnalyzeRequest {

    ecgSerialNumber?: string;

    rhythmRequest?: IRhythmRequest;

    ectopicRequest?: {
        ectopicType: EctopicType;
    };

	mdnRequest?: IMdnRequest;

    heatMapRequest?: {
        rhythmType: RhythmType;
        heatMapConfiguration: IRhythmRequestConfiguration;
    };

	symptomaticRequest?: ISymptomaticRequest;
}

export interface IMdnRequest {
	rhythmType: RhythmType;
}

export interface ISymptomaticRequest {
	rhythmType: RhythmType;
	symptomaticRequestConfiguration: {
		requestPagination?: IRequestPagination;
	}
}

export interface IRhythmRequest {
	rhythmType: RhythmType;
	rhythmRequestConfiguration?: IRhythmRequestConfiguration;
}

interface TopSortSummary {
	sortType: RhythmSortType;
	intervalList: IEcgEpisodeInterval[];
}

export interface IHeatMapResponse {
	heatMapSummaryMetrics: IHeatMapSummaryMetrics;
    heatMapGrid: IHeatMapCell[][];
    heatMapComputedBound: IHeatMapComputedBound;
    episodeIntervalGroupList: IEcgEpisodeInterval[];
	heatMapMetadata: {
		topSortSummaryList: TopSortSummary[];
	};
}

export interface IHeatMapSummaryMetrics {
	totalEpisodeCount: number;
	averageHeartRate: number;
	longestEpisodeDuration: number;
	shortestEpisodeDuration: number;
	fastestEpisodeRate: number;
	slowestEpisodeRate: number;
	fastestAverageEpisodeRate: number;
	slowestAverageEpisodeRate: number;
}

export interface IHeatMapComputedBound {
    gridMinBoundX: number;
    gridMaxBoundX: number;
    gridMaxBoundY: number;
    gridMinBoundY: number;
    cellDurationSize: number;
    cellBeatSize: number;
}

export interface IHeatMapCell {
    locationX: number;
    locationY: number;
    count: number;
    episodesList: IEpisode[];
}

/**
 * EcgAnalyzerDao analyze IRhythmRequestConfiguration params
 */
export interface IRhythmRequestConfiguration {
    requestPagination?: IRequestPagination;
    requestFilter?: IRequestFilter;
    requestSort?: {
        sortType: RhythmSortType
    };
}


/**
 * EcgAnalyzerDao analyze response
 */
export interface IEcgAnalyzerAnalyzeResponse extends GenericHttpResponse {

    ecgMetaData: IEcgBaseMetaData;

    rhythmResponse: IRhythmResponse;

    currentEditsResponse?: IEcgCurrentEditsResponse;

    heatMapResponse?: IHeatMapResponse;

	symptomaticResponse?: IRhythmResponse;

	mdnResponse: IRhythmResponse;
}


export interface IRhythmResponse {
	rhythmType: RhythmType;
	episodeList: Array<IEpisode>;
	rhythmRequestConfigurationResult: {
		episodeFilteredCount: number;
		episodeMatchingCount: number;
		episodePaginationCount: number;
		episodeTotalCount: number;
	}
}

/**
 * Episode DAta
 */
export interface IEpisode {
    rhythmType: RhythmType;
    averageHR: number;
    beats: number;
    confidence: number;
    episodeDuration: number;
    minHR: number;
    maxHR: number;
    interval: IEcgEpisodeInterval;
    dataRegionList?: Array<IEpisodeDataRegion>;
    symptomatic: boolean;
    mdNotification: string;

    // Addition Strip Data
    additionalStrip?: IAdditionalStrip;
}



export interface IEpisodeDataRegion {
    regionType: RegionType;
    ecgSampleList: Array<number>;
    beatList: Array<IEcgBeat>;
    interval: IEcgEpisodeInterval;
    preComputedSubRegionList: Array<{
        subRegion: SubRegion;
        interval: IEcgEpisodeInterval;
    }>;

    surroundingEpisodeList: Array<ISurroundingEpisode>;
}

export interface ISurroundingEpisode {
    rhythmType: RhythmType;
    interval: IEcgEpisodeInterval;
}

export enum SubRegion {
	NEXT_8_SECONDS_FROM_CENTER= 'NEXT_8_SECONDS_FROM_CENTER',
	PREVIOUS_8_SECONDS_FROM_CENTER='PREVIOUS_8_SECONDS_FROM_CENTER',
	CENTERED_ON_8_SECONDS='CENTERED_ON_8_SECONDS',
	CENTERED_ON_15_SECONDS='CENTERED_ON_15_SECONDS',
	CENTERED_ON_16_SECONDS='CENTERED_ON_16_SECONDS',
	CENTERED_ON_30_SECONDS='CENTERED_ON_30_SECONDS',
	CENTERED_ON_60_SECONDS='CENTERED_ON_60_SECONDS',
	CENTERED_ON_90_SECONDS='CENTERED_ON_90_SECONDS'
}

export enum RegionType {
    DEFAULT_SAMPLES = 'DEFAULT_SAMPLES',
    ONSET = 'ONSET',
    OFFSET = 'OFFSET',
    MIN = 'MIN',
    MAX = 'MAX'
}

export interface IEcgUndoEditResponse extends GenericHttpResponse {
    currentEditsResponse?: IEcgCurrentEditsResponse;
}


/**
 * Describes request to undo an edit
 */
export interface IEcgUndoEditRequest {
    checksum?: number;
    undoId: number;
    ecgSerialNumber: string;
}

/**
 * Interface describing current edits
 */
export interface IEcgCurrentEditsResponse {
    checksum?: number;
    recentEditList?: Array<IEcgCurrentEdit>;
}


/**
 * Interface describing props of a CurrentEditsResponse obj
 */
export interface IEcgCurrentEdit {
    editDate: Date;
    undoId: number;
    description: string;
}


/**
 * Interface describing ecg data intervals
 *
 */
export interface IEcgEpisodeInterval {
    startIndex: number;
    endIndex: number;
}

/**
 * Interface describing base ecg meta data returned from API
 */
export interface IEcgBaseMetaData {
    ecgSampleRate: number;
    availableSamples: number;
    filename: string;
    serialNumber: string;
    valuePermv: number;
}


export interface IRequestPagination {
    offset: number;
    limit: number;
}

export interface IRequestFilter {
    durationInSecondsLessThan: number;
}

/**
 * EcgOnDemandLoaderService config props
 */
export interface IEcgAnalyzerLoaderConfig {

    serialNumber: string;
    rhythmTypes: Array<RhythmType>;

    // Number of results to load per request
    limit: number;
}

/**
 * Interface describing observable response from EcgOnDemandLoaderService.newEcgNotifier$
 */
export interface IEcgAnalyzerLoaderResponse {
    currentEditsResponse: IEcgCurrentEditsResponse;
    episode: IEpisode;
    metaData: IEcgBaseMetaData;
}


/**
 *  Describes params availabe to the POST /edit url
 *  Essentially an ecg serial number and a list of edits
 */
export interface IEcgEditRequest {
    ecgSerialNumber: String;
    ecgRangeEditList: IEcgRangeEdit[];
    heatMapRequest?: {
        rhythmType: RhythmType;
        heatMapConfiguration: IRhythmRequestConfiguration;
    }
}


/**
 *  Describes an edit on a distinct range within an ECG strip
 */
export interface IEcgRangeEdit {
	rhythmTypeEdit: EcgRhythmTypeEdit;
	newRhythmType?: RhythmType;
	startIndex?: number;
	endIndex?: number;
	paintModeEdit?: boolean;
	selectedPeaks?: Array<number>;
	newEctopicType?: EctopicType;
	ectopicType?: EctopicType;
	blankBeatsRequest?: IEcgBlankBeatsRequest;
}

export interface IEcgBlankBeatsRequest {
	rhythmType?: RhythmType,
	blankBeatsRequestType: BlankBeatsRequestType;
	interval: IEcgEpisodeInterval;
}

export enum BlankBeatsRequestType {
	FASTEST='FASTEST',
	SLOWEST='SLOWEST',
	SPECIFIC_REGION='SPECIFIC_REGION'
}


/**
 * Describes raw response returned from the POST /edit url
 */
export interface IEcgEditResponse extends GenericHttpResponse {
    currentEditsResponse: IEcgCurrentEditsResponse;
    potentialImpactedEpisodeList: Array<IEcgPotentialEpisode>;
    heatMapResponse: IHeatMapResponse;
	stripResponse: IStripResponse;
	navigationMetricsResponse: IRecordMetricsResponse;
    metrics: any;
}

export interface IStripResponse {
	overlappingStripsList : IOverlappingStrip[];
	savedAdditionalStrips: IAdditionalStripResponse;
	newlyGeneratedAdditionalStrips: IAdditionalStripResponse;
}

export interface IAdditionalStripResponse {
	additionalStripList: IAdditionalStrip[];
	overlappyingStripsList: IOverlappingStrip[];
	additionalStripConfigurationResult: {
		additionalStripTotalCount: number;
		additionalStripPaginationCount: number;
	}
}

export interface IOverlappingStrip {
	stripIdList: number[]
}

export interface IAdditionalStrip {
	id: number;
	productInstanceId: number;
	startDateTime: number;
	duration: number;
	interval: IEcgEpisodeInterval;
	prePopulatedHeadingTitle: string;
	subTitle: string;
	ruleId: string;
	displayRuleId: string;
	ruleDescription: string;
	mdNotification: string;
	additionalStripDisplayResolutionType: additionalStripDisplayResolutionTypeEnum;
	sequence: number;
	dataRegion: IEpisodeDataRegion;
}

// TODO: Naming should follow our standard enum naming convention
export enum additionalStripDisplayResolutionTypeEnum {
	EIGHT_SEC = 'EIGHT_SEC',
	THIRTY_SEC = 'THIRTY_SEC',
	ONE_MINUTE = 'ONE_MINUTE'
}

/**
 * Interface describing properties of a PotentialEpisode
 * TODO: Can this be combined with the Episode defined in
 * ecg-strip-model
 */
export interface IEcgPotentialEpisode {
    rhythmType: RhythmType;
    ecgSampleList: number[];
    ecgSampleListStartIndex: number;
    ecgSampleListEndIndex: number;
    beatList: IEcgBeat[];
    interval: IEcgEpisodeInterval;
    episodeDuration: number;
    beats: number;
    confidence: number;
    maxHR: number;
    minHR: number;
    averageHR: number;
}




/**
 * Interface describing heart beat
 */
export interface IEcgBeat {
    index: number;
    beatType?: EcgBeatType;
    ectopicType?: EctopicType;
    ectopicOtherPeakIndexes?: Array<number>;
    //False if beat is part of an artifact or blanked, otherwise true:
    effective: boolean;
    //Note: blankProxy is FE only property, backend doesn't utilize this
    blankProxy?: boolean;
}

export interface IEcgSampleCursorResult {
    cursorType: EcgCursorType;
    cursorIndex: number;
    ecgSampleList: Array<number>;
	beatList: IEcgBeat[];
	interval: IEcgEpisodeInterval;
	surroundingEpisodeList: ISurroundingEpisode[];
	surroundingAdditionalStripList: IAdditionalStrip[];
}

export interface IEcgSampleRangeResult {
    ecgSampleList: Array<number>;
    startIndex: number;
    endIndex: number;
}

export interface IEcgReadSampleResponse extends GenericHttpResponse {
    ecgSerialNumber: string;
    sampleCursorResultList: Array<IEcgSampleCursorResult>;
    sampleRangeResultList: Array<IEcgSampleRangeResult>;
}

export interface IEcgReadSampleCursorTask {
    cursorIndex: number;
    durationInSeconds: number;
    cursorType: EcgCursorType;
}

export interface IEcgReadSampleRangeTask {
    startIndex: number;
    endIndex: number;
}

export interface IEcgReadSampleRequest {
    ecgSerialNumber: string;
    sampleReadCursorTaskList?: Array<IEcgReadSampleCursorTask>;
    sampleReadRangeTaskList?: Array<IEcgReadSampleCursorTask>;
}

// episodeInterval and toBlankBeatIndexList can be used interchangeably, don't need both in one request
export interface IBlankBeatsRequest {
    blankBeatsRequestType: BlankBeatsRequestType,
    interval: IEcgEpisodeInterval
}

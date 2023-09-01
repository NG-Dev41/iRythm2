import { EctopicType } from 'app/commons/constants/ectopics.const';
import { RhythmType } from 'app/commons/constants/rhythms.const';
import {
	IEcgAnalyzerAnalyzeRequest, IEcgAnalyzerAnalyzeResponse, IEcgEditResponse, IEcgEpisodeInterval, IEcgMetaData,
	IEcgRangeEdit, IEpisode, RegionType
} from 'app/modules/ecg/interfaces';
import { IAdditionalStripsResponse } from 'app/commons/services/dao/additional-strips-dao.service';
import {
    EcgComponentKey,
    EcgComponentState,
    EcgBeatActionType,
    EcgChannelKey,
    EcgLineActionType,
    EcgEpisodeType,
    EcgStripChannelKey,
    EcgMinMaxType,
    EcgExpandViewType,
    EcgResetViewType,
    EcgListChannelKey,
    EcgListActionType,
    EcgBeatRenderActionType,
    EcgCaliperActionType,
    EcgDaoChannelKey,
    EcgRhythmTypeEdit
} from 'app/modules/ecg/enums';


/**
 * EcgChannelData type matching ChannelKeys to their appropriate data interfaces.
 */
export type EcgChannelData = {
    [EcgChannelKey.COMPONENT_STATE]?: IEcgComponentStateChannel;
    [EcgChannelKey.GAIN_CHANGE]?: IEcgGainChangeChannel;
    [EcgChannelKey.MIN_MAX]?: IEcgToggleMinMaxChannel;
    [EcgChannelKey.EXPAND_VIEW]?: IEcgToggleExpandChannel;
    [EcgChannelKey.CONVERT_ARTIFACT]?: IEcgConvertArtifactChannel;
    [EcgChannelKey.CONVERT_SINUS]?: IEcgConvertSinusChannel;
    [EcgChannelKey.RESET_VIEW]?: IEcgResetViewChannel;
    [EcgChannelKey.ACTION_MENU]?: IEcgActionMenuChannel;
    [EcgChannelKey.BEAT_ACTION]?: IEcgBeatActionChannel;
    [EcgChannelKey.BEAT_RENDER_ACTION]?: IEcgBeatRenderActionChannel;
    [EcgChannelKey.LINE_RENDER_ACTION]?: IEcgLineActionChannel;
    [EcgChannelKey.HIGHLIGHTER_MOVING]?: IEcgHighlighterMovingChannel;
    [EcgChannelKey.MOVE_HIGHLIGHTER]?: IEcgMoveHighlighterChannel;
    [EcgChannelKey.LINE_IMAGE_LOADED]?: IEcgLineImageLoadedChannel;
    [EcgChannelKey.PAINT_INTERVAL]?: IEcgPaintIntervalChannel;
	[EcgChannelKey.NON_SCROLLABLE_CONTENT]?: IEcgNonScrollableContentChannel
};

export type EcgDaoChannelData = {
    [EcgDaoChannelKey.DAO_EDIT]?: IEcgDaoEditChannel;
	[EcgDaoChannelKey.ANALYZE]?: IEcgAnalyzeChannel;
}

/**
 * Channel Name - Each Key of the ChannelData type.
 */
export type EcgChannelName = keyof EcgChannelData;


/**
 * ChannelData type matching ChannelKeys to their appropriate data interfaces.
 */
export type EcgStripChannelData = {
    [EcgStripChannelKey.CALIPER_ACTION]?: IEcgCaliperActionChannel;
};


/**
 * Channel Name - Each Key of the ChannelData type.
 */
export type EcgStripChannelName = keyof EcgStripChannelData;


/**
 * ChannelData type matching ChannelKeys to their appropriate data interfaces.
 */
export type EcgListChannelData = {
    [EcgListChannelKey.ACTION]?: IEcgListActionData;
    [EcgListChannelKey.BEAT_ACTION]?: IEcgBeatActionChannel;
    [EcgListChannelKey.LINE_ACTION]?: IEcgLineActionChannel;
	[EcgListChannelKey.CONTEXT_MENU]?: IEcgListContextMenuChannel;
};

/**
 * Channel Name - Each Key of the ChannelData type.
 */
export type EcgListChannelName = keyof EcgListChannelData;

export type EcgDaoChannelName = keyof EcgDaoChannelData;


/**
 * Interface for data when the highlighter is moving
 */
export interface IEcgHighlighterMovingChannel {
    x: number;
    parentScrollBehavior: 'smooth' | 'auto';
}


export interface IEcgLineImageLoadedChannel {
    loaded: boolean;
}

/**
 * Interface for data when parent components want to move the highlighter
 */
export interface IEcgMoveHighlighterChannel {
    x: number;
}


/**
 * List action interface
 */
export interface IEcgListActionData {
    actionType?: EcgListActionType;
    episodeToCopyDataFrom?: IEpisode;
    primaryEpisodeInterval?: IEcgEpisodeInterval;
    newEpisodeInterval?: IEcgEpisodeInterval;
    newEpisodeRhythmType?: RhythmType;
    metaData?: IEcgMetaData;
	region?: string
}


/**
 * Component State Channel
 */
export interface IEcgComponentStateChannel {
    state: EcgComponentState;
    component: EcgComponentKey;
}


/**
 * Convert to artifact channel data
 */
export interface IEcgConvertArtifactChannel {
}


/**
 * Convert to sinus channel data
 */
export interface IEcgConvertSinusChannel {
}

/**
 * Edit bar channel data
 */
export interface IEcgEditBarChannel {
    rhythmType: keyof typeof RhythmType | undefined;
}

export interface IEcgListContextMenuChannel {
	action: IEcgListContextMenuAction;
	intervalToUpdate?: IEcgEpisodeInterval;
	highlightedIntervals?: Set<IEcgEpisodeInterval>;
	contextMenuClickEvent?: MouseEvent;
}

export enum IEcgListContextMenuAction {
	ADD,
	REMOVE,
	TOGGLE,
	CLEAR,
	UPDATE_HIGHLIGHTING,
	OPEN_CONTEXT_MENU
}


/**
 * Convert to sinus channel data
 */
export interface IEcgDaoEditChannel {
	status: EcgDaoEditChannelStatus;
	serialNumber: string;
	request?: {
		ecgRangeEditList: IEcgRangeEdit[];
		ecgAnalyzeRequest: IEcgAnalyzerAnalyzeRequest;
	};
	response?: IEcgEditResponse;
}

/**
 * Strip edit status that can be sent over the DaoEditChannel
 * These status define how the code should handle different edits
 *
 */
export enum EcgDaoEditChannelStatus {

    // Request for Instant or Session Edit
	EDIT_REQUEST,

    // Pending response for edit request
	EDIT_REQUEST_PENDING,

    // Edit request response
	EDIT_RESPONSE,

    // Edit Process Complete
	EDIT_PROCESSING_COMPLETE,
}


export interface IEcgAnalyzeChannel {
	status: EcgAnalyzeChannelStatus;
	serialNumber: string;
	request?: IEcgAnalyzerAnalyzeRequest;
	response?: IEcgAnalyzerAnalyzeResponse;
    additionalStripsResponse?: IAdditionalStripsResponse;
}

export enum EcgAnalyzeChannelStatus {
	ANALYZE_REQUEST,
	ANALYZE_REQUEST_PENDING,
	ANALYZE_RESPONSE,
	ANALYZE_RESPONSE_PROCESSING_COMPLETE
}



/**
 * Describes data in the Window channel.
 * These are notifications that will generally be RENDER commdands
 *
 * actionType: What action needs to be taken on the canvas (add layer, delete layer, etc...) (Is this necessary?)
 * endIndex (Optional)
 */
export interface IEcgLineActionChannel {
    actions: Array<IEcgLineAction>;
}

export interface IEcgLineAction {
    type: EcgLineActionType;
    episodeType?: EcgEpisodeType;
    rhythmType?: RhythmType;
    backgroundColor?: string;
    startIndex?: number;
    endIndex?: number;
	region?: RegionType;
}


/**
 * Beat Action Channel / Data that can be sent over this channel
 */
export interface IEcgBeatActionChannel {
    actions: Array<IEcgBeatAction>;
}

export interface IEcgBeatAction {
    type: EcgBeatActionType;
    rhythmTypeEdit: EcgRhythmTypeEdit;
    //Tuples representing start and end indexes:
    frontIndexes?: [number, number];
    backIndexes?: [number, number];
    newEctopicType?: EctopicType;
	ectopicType?: EctopicType;
	selectedPeaks?: Array<number>;
	beatListIndex?: number;
	numBeatsToMark?: number;
}

/**
 * Paint interval channel / data that can be sent of this channel
 */
export interface IEcgPaintIntervalChannel {
    intervals: Array<IEcgPaintInterval>;
}

export interface IEcgPaintInterval {
    leftDataPoint: number;
    rightDataPoint: number;
}


/**
 * Beat Render Channel / Data that can be sent over this channel
 */
export interface IEcgBeatRenderActionChannel {
    actions: Array<IEcgBeatRenderAction>;
}

export interface IEcgBeatRenderAction {
    type: EcgBeatRenderActionType;
}


/**
 * Gain Change Channel
 */
export interface IEcgGainChangeChannel {
    selectedIndex: number;
    gain: number;
    percent: number;
}

/**
 * Reset View Channel
 */

export interface IEcgResetViewChannel {
    resetViewState: EcgResetViewType;
}

/**
 * Action Menu Channel data
 */
export interface IEcgActionMenuChannel {
    actionMenuType: EcgComponentKey[];
}

/**
 * Toggle Min/Max Channel
 */

export interface IEcgToggleMinMaxChannel {
    minMaxType: EcgMinMaxType;
}

/**
 * Toggle Expand Channel
 */

export interface IEcgToggleExpandChannel {
    expandViewType: EcgExpandViewType;
}


/**
 * Caliper Action Channel
 */
export interface IEcgCaliperActionChannel {
    actions: Array<IEcgCaliperAction>;
}

export interface IEcgCaliperAction {
    type: EcgCaliperActionType,
    paintInterval?: {
        left: number,
        right: number
    },
	regionKey?: string
}

export interface IEcgNonScrollableContentChannel {
	actions: IEcgNonScrollableContentAction[];
}

export interface IEcgNonScrollableContentAction {
	type: EcgNonScrollableContentActionType;
}

export enum EcgNonScrollableContentActionType {
	RENDER_ALL
}

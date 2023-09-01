import { Canvas } from 'fabric/fabric-impl';

import {
    EcgStripType,
    EcgExpandViewType,
    EcgResetViewType,
    EcgMinMaxType,
    EcgSecondsViewType,
    EcgComponentKey,
    EcgViewType
} from '../enums';

import {
	IEcgAnalyzerAnalyzeRequest,
    IEcgGainOption,
    IEpisode,
    IEcgBaseMetaData,
    ISurroundingEpisode,
    RegionType,
    SubRegion,
    IEcgEpisodeInterval
} from './index';
import { RhythmType } from 'app/commons/constants/rhythms.const';
import { RhythmSortType } from 'app/features/record/services/enums/rhythm-sort-type.enum';


/**
 * Properties used to define a new instance of the EcgComponents and all related child components.
 */
export interface IEcgCardConfig {

    list?: IEcgConfgListInput;

    data?: IEcgData;

    config?: IEcgConfigInput;
}


export interface IEcgConfigList extends IEcgConfgListInput {
    episodes?: Array<ISurroundingEpisode>;
}

export interface IEcgConfgListInput extends IEcgAnalyzerAnalyzeRequest {
    episodes?: Array<ISurroundingEpisode>;
}
// export interface IEcgConfgListInput extends IEcgAnalyzerAnalyzeRequest {
//     episodes?: Array<ISurroundingEpisode>;
// }

/**
 * Top level configuration object
 */
export interface IEcgConfigInput {

    viewType?: EcgViewType;

    global?: IEcgConfigGlobalInput;

    gain?: IEcgConfigGainInput;

    actionMenu?: IEcgConfigActionMenuInput;

    toggleMinMax?: IEcgConfigToggleMinMaxInput;

    toggleExpandView?: IEcgConfigToggleExpandViewInput;

    info?: IEcgConfigInfoInput;

    strips?: IEcgConfigStripsInput;

    convertArtifact?: IEcgConfigConvertArtifactInput;

    resetView?: IEcgConfigResetViewInput;

    convertSinus?: IEcgConfigConvertSinusInput;
}


/**
 * Top level configuration object
 */
export interface IEcgConfig {

    viewType?: EcgViewType;

    global?: IEcgConfigGlobal;

    html?: IEcgConfigHtmlElements;

    gain?: IEcgConfigGain;

    actionMenu?: IEcgConfigActionMenu;

    toggleMinMax?: IEcgConfigToggleMinMax;

    toggleExpandView?: IEcgConfigToggleExpandView;

    info?: IEcgConfigInfo;

    strips?: IEcgConfigStrips;

    convertArtifact?: IEcgConfigConvertArtifact;

    convertSinus?: IEcgConfigConvertSinus;

    resetView?: IEcgConfigResetView;
}


export interface IEcgConfigStrips {
    parentStrips: Array<IEcgParentConfigStrip>;
}

export interface IEcgConfigStripsInput {
    parentStrips: Array<IEcgParentConfigStripInput>;
}


/**
 * Describes properties common to both Parent and Child strips
 */
export interface IEcgConfigStrip extends IEcgConfigStripInput {

	width?: number

    parent?: IEcgConfigStrip;

    children?: Array<IEcgConfigStrip>;

    global?: IEcgConfigStripGlobal;

    beats?: IEcgConfigBeats;

    line?: IEcgConfigLine;

    highlighter?: IEcgConfigHighlighter;

    primaryEpisodeIndicator?: IEcgConfigPrimaryEpisodeIndicator;

	focusIndicator?: IEcgConfigFocusIndicator;

    axisGrid?: IEcgConfigAxisGrid;

	episodeDurationText?: IEcgEpisodeDurationText

    html?: IEcgConfigStripHtmlElements;

    caliper?: IEcgConfigCaliper;

    navigationArrow?: IEcgConfigNavigationArrow;
}


/**
 * Window input/config properties.
 */
export interface IEcgConfigStripInput {

    global?: IEcgConfigStripGlobalInput;

    beats?: IEcgConfigBeatsInput;

    line?: IEcgConfigLineInput;

    highlighter?: IEcgConfigHighlighterInput;

    primaryEpisodeIndicator?: IEcgConfigPrimaryEpisodeIndicatorInput;

    axisGrid?: IEcgConfigAxisGridInput;

    caliper?: IEcgConfigCaliperInput;

    navigationArrow?: IEcgConfigNavigationArrowInput;
}


export interface IEcgConfigFocusIndicator {
	show: boolean;
	duration: number;
}

/**
 * Config object that will hold any needed html elements
 * Note: This is for controllers only - no input needed for this one
 */
export interface IEcgConfigStripHtmlElements {
    canvas?: Canvas;
    bgImg?: HTMLImageElement;
    baseHtmlCanvas?: HTMLCanvasElement;
    positioner?: HTMLElement;
    scrollContainer?: HTMLElement;
}


/**
 * Config object that will hold any needed html elements
 * Note: This is for controllers only - no input needed for this one
 */
export interface IEcgConfigHtmlElements {

    // TODO: Is this even being used??
    container?: HTMLElement;
}


/**
 * Describes properties of the Parent Window Config
 */
export interface IEcgParentConfigStrip extends IEcgConfigStrip {

    /**
     * Array of child windows.configs
     */
    children?: Array<IEcgConfigStrip>;
}
export interface IEcgParentConfigStripInput extends IEcgConfigStripInput {
    children?: Array<IEcgConfigStripInput>;
}


/**
 * Config object describing global properties
 */
export interface IEcgConfigGlobal extends IEcgConfigGlobalInput {
    numValidEpisodes?: number;

}
export interface IEcgConfigGlobalInput {
    //width?: number;
    //episodes?: Array<ISurroundingEpisode>;
	episodes?: Map<string, Array<ISurroundingEpisode>>;
}


/**
 * Config object for info
 */
export interface IEcgConfigInfo extends IEcgConfigInfoInput {
}
export interface IEcgConfigInfoInput {
    show: boolean;
}


/**
 * Config object for beats
 */
export interface IEcgConfigBeats extends IEcgConfigBeatsInput {
    show: boolean;
}
export interface IEcgConfigBeatsInput {
    showTicks: boolean;
    showLines: boolean;
    lineHeight?: number;
    lineColor?: string;
    lineBgColor?: string;
    lineTextColor?: string;
    tickColor?: string;
    tickHeight?: number;
    tickTop?: number;
    addLineElement?: HTMLElement;
    addLineElementLeft?: number;
	addLineElementTop?: number;
    ectopicStrokeWidth?: number;
    ectopicTickHeight?: number;
}

/**
 * Config object for beats
 */
export interface IEcgConfigLine extends IEcgConfigLineInput {
	/**
	 * Height of canvas
	 */
	height: number;
}
export interface IEcgConfigLineInput {
}


/**
 * Config object for reset view
 */
export interface IEcgConfigResetView extends IEcgConfigResetViewInput {
    state: EcgResetViewType;
}
export interface IEcgConfigResetViewInput {
    show: boolean;
}

/**
 * Config object for expanded view
 */
export interface IEcgConfigToggleExpandView extends IEcgConfigToggleExpandViewInput {
    view: EcgExpandViewType;
}
export interface IEcgConfigToggleExpandViewInput {
    show: boolean;
}


/**
 * Config object for convert artifact component/action
 */
export interface IEcgConfigConvertArtifact extends IEcgConfigConvertArtifactInput {
}
export interface IEcgConfigConvertArtifactInput {
    show: boolean;
}

/**
 * Config object for split view
 */
export interface IEcgConfigToggleMinMax extends IEcgConfigToggleMinMaxInput {
    view: EcgMinMaxType;
}
export interface IEcgConfigToggleMinMaxInput {
    show: boolean;
}

/**
 * Config object for convert sinus component/action
 */
export interface IEcgConfigConvertSinus extends IEcgConfigConvertSinusInput {
}
export interface IEcgConfigConvertSinusInput {
    show: boolean;
}



/**
 * Config object for action menu
 */
export interface IEcgConfigActionMenu extends IEcgConfigActionMenuInput {
}
export interface IEcgConfigActionMenuInput {
    actionIds?: Array<EcgComponentKey>;
    show: boolean;
}


/**
 * Config object for strip primary episode indicator
 */
export interface IEcgConfigPrimaryEpisodeIndicator extends IEcgConfigPrimaryEpisodeIndicatorInput {
    element?: HTMLElement;
    width?: number;
    leftX?: number;
    styleDisplay?: 'block' | 'none';
}
export interface IEcgConfigPrimaryEpisodeIndicatorInput {
    show: boolean;
}

/**
 * Config object for strip global properties.
 */
export interface IEcgConfigStripGlobal extends IEcgConfigStripGlobalInput {

    /**
     * Indicates strip as parent/primary or child/mini
     * ...call them what you will
     *
     * @type {EcgStripType}
     */
    type: EcgStripType;

    /**
     * What I used to weirdly call 'pointsPerPixel'
     *
     * @type {number}
     */
    resolutionScale: number;

    /**
     * Final height of the canvas object.
     * This is the combined height of beat blocks, line
     * and any thing else that would affect the height of the canvas
     *
     * @type {number}
     */
    height?: number;

    /**
     * Canvas overflow width.
     *
     * @type {number}
     */
    overflowWidth?: number;

    /**
     * Format to display seconds in.
     *
     * @type {EcgSecondsViewType}
     */
    secondsViewType?: EcgSecondsViewType;

    /**
     * Total number of seconds represented by the ecg sample data
     * @type {number}
     */
    numTotalSeconds?: number;

	/**
	 * Number of seconds viewable in the strip
	 */
	numSecondsViewable?: number;

    /**
     * Amount of pixels to assign the top property of the canvas when tile view
     * @type {number}
     */
    tileTop?: number;

}

export interface IEcgConfigStripGlobalInput {

    /**
     * User should be able to set the width of the strip OR
     * leave it blank/null and it should auto calculate the width based
     * on the size of the canvas container.
     *
     * @type {number}
     */
    // width?: number;



	/**
	 * Force a certain number of seconds to show in the windows
	 * Ex. We are forcing a 30 second view in the child/mini windows
	 *
	 * TODO: Is this doing what the preComputedSubRegionList should be doing, or is it seperate?
	 * @type {number}
	 */

	forcedNumSecondsViewable?: number;

    /**
     * [EcgRhythmType description]
     * @type {EcgRhythmType}
     */
    baseRhythmType?: RhythmType;

    /**
     * TODO: Do we need this global bg color?
     * @type {string}
     */
    bgColor?: string;

	region?: string;

	subRegion?: SubRegion;

	sampleCursorResultKey?: string;

	showHrType?: ShowHRType;

	rowIntervals?: IEcgEpisodeInterval[];

	disableEditSessionCommitting?: boolean;
}

export enum ShowHRType {
	MAX="MAX",
	AVERAGE="AVERAGE",
	MIN="MIN"
}


/**
 * Config object for strip axis grid
 */
export interface IEcgConfigAxisGrid extends IEcgConfigAxisGridInput {
}
export interface IEcgConfigAxisGridInput {
    show: boolean;
    xAxisLineFrequency?: number;
    color?: string;
}

export interface IEcgEpisodeDurationText {
	show?: boolean;
}

/**
 * Config object for strip highlighter
 */
export interface IEcgConfigHighlighter extends IEcgConfigHighlighterInput {
    width?: number;
}
export interface IEcgConfigHighlighterInput {
    show: boolean;
    bgColor?: string;
}


/**
 * Config object for strip caliper
 */
export interface IEcgConfigCaliper extends IEcgConfigCaliperInput {
}
export interface IEcgConfigCaliperInput {
    show: boolean;
}


/**
 * Config object for strip navigtion left/right arrows
 */
export interface IEcgConfigNavigationArrow extends IEcgConfigNavigationArrowInput {
    containerTop?: number;
    arrowTop?: number;
    leftArrow?: HTMLElement;
    rightArrow?: HTMLElement;
}
export interface IEcgConfigNavigationArrowInput {
    show: boolean;
    bgColor?: string;
    width?: number;
    hPadding?: number;
    arrowColor?: string;
    arrowSize?: number;
}


/**
 * Config object for GainComponent
 */
export interface IEcgConfigGain extends IEcgConfigGainInput {
    options?: Array<IEcgGainOption>;
    readonly defaultGainIndex?: number;
    selectedGainIndex?: number;
    selectedGainValue?: number;
}
export interface IEcgConfigGainInput {
    baseOptions?: Array<number>;
    show: boolean;
}


/**
 * EcgData for additional properties
 */
export interface IEcgData {
    listIndex?: number;
    episode: IEpisode;
    serialNumber: string;
    metaData: IEcgMetaData;
    sortTypes?: RhythmSortType[];
}


/**
 * EcgMetaData
 * Any additional properties needed on top of the properties returned from the API
 * can be added here.
 */
export interface IEcgMetaData extends IEcgBaseMetaData {
}

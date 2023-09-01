import {
    EcgComponentKey,
    EcgExpandViewType,
    EcgMinMaxType,
    EcgResetViewType,
    EcgSecondsViewType,
    EcgStripType,
    EcgViewType
} from 'app/modules/ecg/enums';
import { RhythmType } from 'app/commons/constants/rhythms.const';
import { IEcgConfig, IEcgConfigStrip } from 'app/modules/ecg/interfaces/ecg-config.interface';


/**
 * Default EcgCard Config.
 *
 * @type {IEcgConfig}
 */
export const EcgDefaultConfig: IEcgConfig = {

	viewType: EcgViewType.DEFAULT,

	global: {
		//width: null
	},

	gain: {
		show: false,
		baseOptions: new Array(.25, .50, .75, 1, 1.25, 1.50, 1.75, 2, 2.5, 3, 3.5, 4),
		defaultGainIndex: 3,
		selectedGainIndex: 3,
		selectedGainValue: 1
	},

	actionMenu: {
		show: false,
        actionIds: [
            EcgComponentKey.GAIN,
            EcgComponentKey.CONVERT_SINUS
        ]
	},

	info: {
		show: false
	},

    toggleMinMax: {
        view: EcgMinMaxType.HEART_RATE,
        show: false
    },

    toggleExpandView: {
        view: EcgExpandViewType.EXPAND,
        show: false
    },

    convertArtifact: {
    	show: false
    },

    convertSinus: {
    	show: false
    },

    resetView: {
        state: EcgResetViewType.INITIAL,
        show: false
    }
};


/**
 * Default Ecg Parent Strip Config
 *
 * @type {IEcgConfigStrip}
 */
export const EcgDefaultParentStripConfig: IEcgConfigStrip = {

	// TODO: Anything all children/renderers need access to should go in global
	global: {
		type: EcgStripType.PARENT,
		bgColor: '#111',
		baseRhythmType: RhythmType.SINUS,
		// width: null,
		height: null,
		resolutionScale: null,
		secondsViewType: EcgSecondsViewType.IN_VIEW
	},

	line: {
		height: 160
	},

	axisGrid: {
		show: false,
        xAxisLineFrequency: 250,
        color: '#787777'
	},

	beats: {
		showLines: false,
		showTicks: false,
		show: false,
		lineHeight: 30,
		lineBgColor: '#111',
		lineColor: '#787777',
		lineTextColor: '#fff',
		tickColor: '#66e1e3',
		tickHeight: 5,
		tickTop: 15,
		ectopicTickHeight: 9,
		ectopicStrokeWidth: 5,
	},

	highlighter: {
		show: true,
		bgColor: 'rgba(173, 240, 249, .25)'
	},

	primaryEpisodeIndicator: {
		show: false
	},

	caliper: {
		show: true
	},

	navigationArrow: {
		show: false
	}
}


/**
 * Default Ecg Child Strip Config
 *
 * @type {IEcgConfigStrip}
 */
export const EcgDefaultChildStripConfig: IEcgConfigStrip = {


	global: {
		type: EcgStripType.CHILD,
		bgColor: '#000', // TODO: NOT HERE (EVERY COMPONENT COULD HAVE A BG COLOR - REALLY NEED A BASE CONFIG INTERFACE..)
		baseRhythmType: RhythmType.SINUS,
		height: null,
		resolutionScale: null,
		forcedNumSecondsViewable: 30,
		secondsViewType: EcgSecondsViewType.IN_VIEW_TOTAL
	},

	line: {
		height: 60
	},

	axisGrid: {
		show: false,
        xAxisLineFrequency: 150
	},

	beats: {
		showLines: false,
		showTicks: true,
		show: true,
		lineHeight: 0,
		tickColor: '#66e1e3',
		tickHeight: 5,
		tickTop: 5,
		ectopicTickHeight: 7,
		ectopicStrokeWidth: 3,
	},

	highlighter: {
		show: true,
		bgColor: 'rgba(173, 240, 249, .25)'
	},

	primaryEpisodeIndicator: {
		show: true,
		styleDisplay: 'none'
	},

	caliper: {
		show: false
	},

	navigationArrow: {
		show: true,
	    bgColor: '#ffffff',
	    width: 20,
	    hPadding: 10,
	    arrowColor: '#383ebd',
	    arrowSize: 16
	}
}

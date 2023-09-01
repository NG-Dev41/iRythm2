import { KeyboardKey } from './keyboard.const';


/**
 * RhythmType Enum
 */
export enum RhythmType {

    /** Keep ordering for paint rhythms */

    SINUS = 'SINUS',
    SVT = 'SVT',
    AFIB = 'IRREGULAR',
    BIGEMINY = 'BIGEMINY',
    TRIGEMINY = 'TRIGEMINY',
    PAUSE = 'PAUSE',
    AVB_TYPE2 = 'SECOND_DEG_BLOCK',
    AVB_TYPE3 = 'THIRD_DEG_BLOCK',
    VT = 'VT',
    VF = 'PVT_TDP_VF',
    EAR = 'EAR',
    JR = 'JR',
    IVR = 'IVR',
    WENCKEBACH = 'WENCKEBACH',
    ARTIFACT = 'ARTIFACT',

    /** End Paint Rhythms */

    AFL = 'AFL',
    JUNCTIONAL = 'JUNCTIONAL',
    NOISE = 'NOISE',
    NSR = 'NSR',
    PACE = 'PACE',
    SUDDEN_BRADY = 'SUDDEN_BRADY',
    UNDEFINED = 'UNDEFINED',
    UNDETERMINED = 'UNDETERMINED',
}


/**
 * HR Bar Action Type
 */
export enum HRBarActionType {
    BLANK_BEATS = 'BLANK_BEATS',
    UNBLANK_BEATS = 'UNBLANK_BEATS',
    CONVERT_TO_NORMAL = 'CONVERT_TO_NORMAL',
    REMOVE_BEATS = 'REMOVE_BEATS',
    ADD_BEATS = 'ADD_BEATS'
}


/**
 * Interface describing RhythmTypeMeta objects
 */
export interface IRhythmTypeMeta {
    name: string;
    paintRhythm?: boolean;
    color?: string;
    abbreviation?: string;
    keyboardShortcut?: string | string[];
}

/**
 * Rhythm Type Meta
 */

export const RhythmTypeMeta: { [key in RhythmType]: IRhythmTypeMeta; } = {
    [RhythmType.PAUSE]: {
        name: 'Pause',
        paintRhythm: true,
        color: '#EC008C',
        keyboardShortcut: [KeyboardKey.CTRL, KeyboardKey.SHIFT, 'P']
    },
    [RhythmType.VT]: {
        name: 'VT',
        paintRhythm: true,
        color: '#ED2938',
        keyboardShortcut: [KeyboardKey.CTRL, KeyboardKey.SHIFT, 'V']
    },
    [RhythmType.AFIB]: {
        name: 'AF',
        paintRhythm: true,
        color: '#49CD0B',
        keyboardShortcut: [KeyboardKey.CTRL, KeyboardKey.SHIFT, 'A']
    },
    [RhythmType.SVT]: {
        name: 'SVT',
        paintRhythm: true,
        color: '#FEFEFD',
        keyboardShortcut: [KeyboardKey.CTRL, KeyboardKey.SHIFT, 'T']
    },
    [RhythmType.IVR]: {
        name: 'IVR',
        paintRhythm: true,
        color: '#DB2D71',
        keyboardShortcut: [KeyboardKey.CTRL, KeyboardKey.SHIFT, 'I']
    },
    [RhythmType.ARTIFACT]: {
        color: '#808285',
        paintRhythm: true,
        name: 'Artifact',
        keyboardShortcut: [KeyboardKey.CTRL, KeyboardKey.SHIFT, 'S']
    },
    [RhythmType.AFL]: {
        color: 'yellowgreen',
        name: 'AFL'
    },
    [RhythmType.AVB_TYPE2]: {
        color: '#C37244',
        paintRhythm: true,
        name: 'AVB 2nd',
        keyboardShortcut: [KeyboardKey.CTRL, KeyboardKey.SHIFT, '2']
    },
    [RhythmType.AVB_TYPE3]: {
        color: '#BE9134',
        paintRhythm: true,
        name: 'AVB 3rd',
        keyboardShortcut: [KeyboardKey.CTRL, KeyboardKey.SHIFT, '3']
    },
    [RhythmType.BIGEMINY]: {
        name: 'Bigeminy', // used in navigation panel
        abbreviation: 'VBG', // used in edit panel
        paintRhythm: true,
        color: '#842990',
        keyboardShortcut: [KeyboardKey.CTRL, KeyboardKey.SHIFT, 'B']
    },
    [RhythmType.EAR]: {
        name: 'EAR',
        paintRhythm: true,
        color: '#7362D0',
        keyboardShortcut: [KeyboardKey.CTRL, KeyboardKey.SHIFT, 'E']
    },
    [RhythmType.JUNCTIONAL]: {
        color: 'teal',
        name: 'Junctional',
    },
    [RhythmType.NOISE]: {
        color: 'black',
        name: 'Noise',
    },
    [RhythmType.NSR]: {
        color: 'blue',
        name: 'NSR',
    },
    [RhythmType.PACE]: {
        color: 'black',
        name: 'Pace',
    },
    [RhythmType.SINUS]: {
        color: '#0088C9',
        paintRhythm: true,
        name: 'Sinus',
        keyboardShortcut: [KeyboardKey.CTRL, KeyboardKey.SHIFT, 'S']
    },
    [RhythmType.SUDDEN_BRADY]: {
        color: 'saddlebrown',
        name: 'Sudden Brady',
    },
    [RhythmType.TRIGEMINY]: {
        name: 'Trigeminy', // used in edit panel
        abbreviation: 'VTG', // used in navigation panel
        paintRhythm: true,
        color: '#EF7EBE',
        keyboardShortcut: [KeyboardKey.CTRL, KeyboardKey.SHIFT, 'T']
    },
    [RhythmType.UNDEFINED]: {
        name: 'Undefined',
        color: 'black'
    },
    [RhythmType.UNDETERMINED]: {
        name: 'Undetermined',
        color: 'black'
    },
    [RhythmType.VF]: {
        name: 'VF',
        paintRhythm: true,
        color: '#FFDE17',
        keyboardShortcut: [KeyboardKey.CTRL, KeyboardKey.SHIFT, 'F'],
    },
    [RhythmType.WENCKEBACH]: {
        name: 'WENCK',
        paintRhythm: true,
        color: '#8BCFF9',
        keyboardShortcut: [KeyboardKey.CTRL, KeyboardKey.SHIFT, 'W']
    },
    [RhythmType.JR]: {
        name: 'JR',
        paintRhythm: true,
        color: '#2D8185',
        keyboardShortcut: [KeyboardKey.CTRL, KeyboardKey.SHIFT, 'J']
    }
};

// todo: move these to another const file?

export const HRBarActionTypeMeta: { [key in HRBarActionType]: IRhythmTypeMeta; } = {
    [HRBarActionType.BLANK_BEATS]: {
        name: 'Blank Beats',
        keyboardShortcut: [KeyboardKey.CTRL, KeyboardKey.SHIFT, '9']
    },
    [HRBarActionType.UNBLANK_BEATS]: {
        name: 'Unblank Beats',
        keyboardShortcut: [KeyboardKey.CTRL, KeyboardKey.SHIFT, '8']
    },
    [HRBarActionType.CONVERT_TO_NORMAL]: {
        name: 'Convert to Norm.',
        keyboardShortcut: [KeyboardKey.CTRL, KeyboardKey.SHIFT, '0']
    },
    [HRBarActionType.REMOVE_BEATS]: {
        name: 'Remove Beats',
        keyboardShortcut: [KeyboardKey.CTRL, KeyboardKey.SHIFT, '-']
    },
    [HRBarActionType.ADD_BEATS]: {
        name: 'Add Beats (Avg)',
        keyboardShortcut: [KeyboardKey.CTRL, KeyboardKey.SHIFT, '=']
    }
};

export const rhythmChildren = [
    { name: RhythmType.PAUSE },
    { name: RhythmType.VT },
    { name: RhythmType.SVT },
    { name: RhythmType.AFIB },
    { name: RhythmType.WENCKEBACH }, //Mobitz 1
    { name: RhythmType.IVR },
    { name: RhythmType.AVB_TYPE2 },
    { name: RhythmType.AVB_TYPE3 }
];

export const ectopicPatternsChildren = [
    { name: RhythmType.BIGEMINY},
    { name: RhythmType.TRIGEMINY}
];


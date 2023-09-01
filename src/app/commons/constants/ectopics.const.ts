import { KeyboardKey } from './keyboard.const';
import {EcgRhythmTypeEdit} from 'app/modules/ecg/enums';

/**
 * Ectopic Types
 */
export enum EctopicType {
    VE3 = 'VE3',
    VE2 = 'VE2',
    VE1 = 'VE1',
    SVE3 = 'SVE3',
    SVE2 = 'SVE2',
    SVE1 = 'SVE1'
}

export enum EctopicCategory {
    VE = 'VE',
    SVE = 'SVE'
}

export enum OptionalBeatAttributes{
    ECTOPIC_OTHER_PEAK_INDEXES = 'ectopicOtherPeakIndexes',
    ECTOPIC_TYPE = 'ectopicType'
}
/**
 * Interface describing EctopicTypeMeta objects
 */
export interface IEctopicTypeMeta {
    name: string;
    color: string;
    numberOfBeats: number;
    abbreviation?: string;
    keyboardShortcut?: string[];
    rhythmTypeEdit?: EcgRhythmTypeEdit;
}


/**
 * RhythmType Meta Data
 */
export const EctopicTypeMeta: { [key in EctopicType]: IEctopicTypeMeta; } = {
    [EctopicType.SVE1]: {
        name: 'SVE Singles',
        abbreviation: 'SVE Sing.',
        color: '#33CC00',
        numberOfBeats: 1,
        keyboardShortcut: [KeyboardKey.ALT, KeyboardKey.SHIFT, '4'],
        rhythmTypeEdit: EcgRhythmTypeEdit.ECTOPIC_SVE_PEAK
    },
    [EctopicType.SVE2]: {
        name: 'SVE Couplets',
        abbreviation: 'SVE Coup.',
        color: '#FDFBDE',
        numberOfBeats: 2,
        keyboardShortcut: [KeyboardKey.ALT, KeyboardKey.SHIFT, '5'],
        rhythmTypeEdit: EcgRhythmTypeEdit.ECTOPIC_SVE_PEAK
    },
    [EctopicType.SVE3]: {
        name: 'SVE Triplets',
        abbreviation: 'SVE Trip.',
        color: '#B41E8E',
        numberOfBeats: 3,
        keyboardShortcut: [KeyboardKey.ALT, KeyboardKey.SHIFT, '6'],
        rhythmTypeEdit: EcgRhythmTypeEdit.ECTOPIC_SVE_PEAK
    },
    [EctopicType.VE1]: {
        name: 'VE Singles',
        abbreviation: 'VE Sing.',
        color: '#E93823',
        numberOfBeats: 1,
        keyboardShortcut: [KeyboardKey.ALT, KeyboardKey.SHIFT, '1'],
        rhythmTypeEdit: EcgRhythmTypeEdit.ECTOPIC_VE_PEAK
    },
    [EctopicType.VE2]: {
        name: 'VE Couplets',
        abbreviation: 'VE Coup.',
        color: '#C77646',
        numberOfBeats: 2,
        keyboardShortcut: [KeyboardKey.ALT, KeyboardKey.SHIFT, '2'],
        rhythmTypeEdit: EcgRhythmTypeEdit.ECTOPIC_VE_PEAK
    },
    [EctopicType.VE3]: {
        name: 'VE Triplets',
        abbreviation: 'VE Trip',
        color: '#FFDE17',
        numberOfBeats: 3,
        keyboardShortcut: [KeyboardKey.ALT, KeyboardKey.SHIFT, '3'],
        rhythmTypeEdit: EcgRhythmTypeEdit.ECTOPIC_VE_PEAK
    },
};

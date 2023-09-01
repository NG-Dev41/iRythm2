import { RhythmType } from 'app/commons/constants/rhythms.const';
import { RhythmSortType } from '../enums/rhythm-sort-type.enum';

export interface IRecordRhythmsInitConfig {
    rhythmType: RhythmType;
    sortType?: RhythmSortType;
}

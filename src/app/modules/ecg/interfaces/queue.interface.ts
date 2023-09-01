// import { GenericHttpResponse } from 'app/commons/constants';

// export interface IQueueResponse extends GenericHttpResponse {
//     queueRecords: {
//         inprogress: IQueueRecord[],
//         onhold: IQueueRecord[]
//     }
// }

// export interface IQueueRecord {
//     ecgSerialNumber: string,
//     startDateTime: Date,
//     priority: `${QueueRecordPriorityEnum}`,
//     mdnTypes: `${QueueRecordMdnTypeEnum}`[],
//     notesCount: number,
//     expedited: boolean,
//     consultation: boolean
// }

// export enum QueueRecordPriorityEnum {
//     REGULAR = "REGULAR",
//     MD_NOTIFY = "MD_NOTIFY",
//     PRIORITY_REQUEST = "PRIORITY_REQUEST",
//     MDN_FOLLOW_UP="MDN_FOLLOW_UP",
//     STANDARD="STANDARD"
// }

// export enum QueueRecordMdnTypeEnum {
//     PAUSE = "Pause",
//     CHB = "CHB, Wide QRS Tachycardia",
//     AF = "AF/Flutter",
//     SYMPTOMATIC = "Symptomatic 2nd degree Heart Block",
//     MOBITZ = "Mobitz II",
//     VF="VF",
//     VT="VT",
//     Pause="Pause",
//     Symp_Brady="SYMP_BRADY",
//     SVT="SVT"
// }



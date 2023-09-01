import { EctopicType } from "app/commons/constants/ectopics.const";
import { GenericHttpResponse } from "app/commons/constants/endpoint-url.const";
import { RhythmType } from "app/commons/constants/rhythms.const";
import { MetricsKey } from '../enums/record-metrics.enum';

/**
 * Record metrics request payload
 */
export interface IRecordMetricsRequest {
    ecgSerialNumber: string;
}


/**
 * Main Record Metrics Interface
 * Contains all properties from the metrics request
 * Any additional metric related properties needed by the front end can be added here
 */
export interface IRecordMetrics extends IRecordMetricsResponse {
}


/**
 * Top level record metrics reponse
 */
export interface IRecordMetricsResponse extends GenericHttpResponse {
	[MetricsKey.VE_CHAPTER_PAGE]: boolean;
	[MetricsKey.SVE_CHAPTER_PAGE]: boolean;
	[MetricsKey.SINUS_PERCENTAGE]: number;
	[MetricsKey.AF_PERCENTAGE]: number;
	[MetricsKey.PATIENT_TRIGGERS]: number;
	[MetricsKey.PATIENT_DIARIES]: number;
	[MetricsKey.EVENT_CHARTS]: number;
	[MetricsKey.ADDITIONAL_STRIPS]: number;
    [MetricsKey.RHYTHM_METRICS]: IRhythmMetrics;
    [MetricsKey.ECTOPIC_METRICS]: IEctopicMetrics;
    [MetricsKey.ECTOPIC_BURDEN_PERCENTAGES]: IEctopicBurdenPercentages;
    [MetricsKey.ACCOUNT_INFO]: IAccountInfo;
    [MetricsKey.PATIENT_INFO]: IPatientInfo;
    [MetricsKey.PATCH_INFO]: IPatchInfo;
    [MetricsKey.MDN_INFO]: IMdnInfo;
	[MetricsKey.DETECTED_RHYTHMS_INFO]: IDetectedRhythmsInfo;
}

export interface IDetectedRhythmsInfo {
	mdnRhythmList: string[];
	symptomaticRhythmList: string[];
}

/**
 * Rhythm Metrics
 */
export interface IRhythmMetrics {
    [RhythmType.AFIB]: number;
    [RhythmType.SVT]: number;
    [RhythmType.VT]: number;
    [RhythmType.SINUS]: number;
    [RhythmType.ARTIFACT]: number;
    [RhythmType.PAUSE]: number;
    [RhythmType.BIGEMINY]: number;
    [RhythmType.TRIGEMINY]: number;
    [RhythmType.IVR]: number;
    [RhythmType.WENCKEBACH]: number;
    [RhythmType.JR]: number;
    [RhythmType.EAR]: number;
    [RhythmType.UNDETERMINED]: number;
}


/**
 * Ectopic Metrics
 */
export interface IEctopicMetrics {
    [EctopicType.SVE1]: number;
    [EctopicType.SVE2]: number;
    [EctopicType.SVE3]: number;
    [EctopicType.VE1]: number;
    [EctopicType.VE2]: number;
    [EctopicType.VE3]: number;
}


/**
 * Ectopic Burden Percentages
 */
export interface IEctopicBurdenPercentages {
    [EctopicType.SVE1]: number;
    [EctopicType.SVE2]: number;
    [EctopicType.SVE3]: number;
    [EctopicType.VE1]: number;
    [EctopicType.VE2]: number;
    [EctopicType.VE3]: number;
}


/**
 * Account Info
 */
export interface IAccountInfo {
    account: string;
    location: string;
    notificationMethod: string;
    prescribingProviderFirstName: string;
    prescribingProviderLastName: string;
    ectopyVeReportingRequired: boolean;
    ectopySveReportingRequired: boolean;
    prescribingProviderNotes: string;
}


/**
 * Patient Info
 */
export interface IPatientInfo {
    age: string;
    primaryIndication: string;
    icdOrPacemaker: boolean;
    mode: string;
    lowerRateLimit: number;
    upperRateLimit: number;
    relevantInfo: string;
}


/**
 * Patch Info
 */
export interface IPatchInfo {
    effectiveDate: Date;
    wideQrsMinHr: number;
    wideQrsMinDuration: number;
    wideQrsNotificationType: string;
    wideQrsDetected: boolean;
    wideQrsDetectedReason: string;
    wideQrsUnique: boolean;
    avb3NotificationType: string;
    avb3Detected: boolean;
    avb3DetectedReason: string;
    avb3Unique: boolean;
    avb2NotificationType: string;
    avb2Detected: boolean;
    avb2DetectedReason: string;
    avb2Unique: boolean;
    pauseMinDuration: number;
    pauseNotificationType: string;
    pauseDetected: boolean;
    pauseDetectedReason: string;
    pauseUnique: boolean;
    bradyMaxHr: number;
    bradyMinDuration: number;
    bradyNotificationType: string;
    bradyDetected: boolean;
    bradyDetectedReason: string;
    bradyUnique: boolean;
    afMinHr: number;
    afMaxHr: number;
    afMinDuration: number;
    afNotificationType: string;
    afDetected: boolean;
    afDetectedReason: string;
    afUnique: boolean;
    svtMinHr: number;
    svtMinDuration: number;
    svtNotificationType: string;
    svtDetected: boolean;
    svtDetectedReason: string;
    svtUnique: boolean;
}

/**
 * MDN Info
 */
export interface IMdnInfo {
    defaultMdnTypesList: Array<string>;
}

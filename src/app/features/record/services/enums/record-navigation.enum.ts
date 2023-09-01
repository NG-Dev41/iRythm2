export enum RecordNavigationKey {
    CASE_OVERVIEW = 'CASE_OVERVIEW',
    RHYTHMS = 'RHYTHMS',
    ECTOPICS = 'ECTOPICS',
    ECTOPIC_PATTERNS = 'ECTOPIC-PATTERNS',
    RATES = 'RATES',
    EVENT_CHART = 'EVENT_CHART',
    TRIGGERS_DIARIES = 'TRIGGERS_DIARIES',
    DIARIES = 'DIARIES',
    REPORT_PREP = 'REPORT_PREP',
    REPORT_PREVIEW = 'REPORT_PREVIEW'
}

export enum RecordNavigationStatus {
    COMPLETE = 'complete',
    PARTIAL_COMPLETE = 'partial-complete',
    INCOMPLETE = 'incomplete'
}


export enum RecordNavigationToggleStatus {
    OPEN  = 'OPEN',
    CLOSED  = 'CLOSED'
}


/**
 * Enum to distinguish other Enum types
 * we use throughout the application.
 * This will hopefully make it a little easier to write
 * more dynamic code.
 */
export enum RecordMetricType {
    RHYTHMS,
    ECTOPICS,
    RECORD_PAGE,
    ECTOPIC_PATTERNS
}

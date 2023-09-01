
/**
 * Channels available with the GlobalNotifier.
 * Also used to map channel data interfaces with each channel.
 */
export enum RecordChannelKey {
	ACTION,
    LAYOUT_TYPE,
    HR_BAR_ACTION,
	HEADER_NOTIFY,
    MARK_ECTOPY,
    PAINT_RHYTHM,
    REPORT_ACTION,
	OPEN_RIGHT_COL_MODAL
}

/**
 * Defines different basic actions that can be send of the global ACTION channel.
 * Define what these are...if there are any at all??
 */
export enum RecordChannelAction {
    CACHE_RECORD,
    EDIT_SESSION_CANCELLED,
    ERROR_ON_EDIT_SESSION_SAVE,
    EDITS_UNDONE,
    ECTOPY_MARKED,
    METRIC_DATA_UPDATED,
	EDIT_SESSION_ENDED,
    REANALYZE_LISTS,
    REPORT_GENERATED
}

export enum RecordReportChannelAction {
    REPORT_GENERATED,
    REPORT_QUALITY_CHECK_FAILURE
}

export enum SidebarChannelKey {
    ACTION
}

export enum SidebarChannelAction {
    SWITCH_TAB
}

export enum SidebarTab {
    NAVIGATION,
    EDIT
}

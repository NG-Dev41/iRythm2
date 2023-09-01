import { EctopicType } from 'app/commons/constants/ectopics.const';
import { RhythmType, HRBarActionType } from 'app/commons/constants/rhythms.const';
import { EcgRhythmTypeEdit } from 'app/modules/ecg/enums';
import { RecordChannelKey, RecordChannelAction, SidebarChannelKey, SidebarChannelAction, SidebarTab, RecordReportChannelAction } from '../enums/channel.enum';
import { EcgLayoutType } from '../enums';
import { RecordNavigationKey } from '../enums/record-navigation.enum';
import { IEcgCardConfig} from '../../../../modules/ecg/interfaces';


/**
 * Channels available with the RecordNotifier
 */
export type RecordChannelData = {
    [RecordChannelKey.ACTION]?: IRecordActionChannel;
    [RecordChannelKey.HR_BAR_ACTION]?: IHRBarActionChannel;
    [RecordChannelKey.PAINT_RHYTHM]?: IRecordPaintChannel;
    [RecordChannelKey.MARK_ECTOPY]?: IRecordMarkEctopyChannel;
    [RecordChannelKey.LAYOUT_TYPE]?: IRecordEcgLayoutTypeChannel;
    [RecordChannelKey.REPORT_ACTION]?: IRecordReportChannel;
	[RecordChannelKey.OPEN_RIGHT_COL_MODAL]?: IRecordRightColModalChannel;
};


/**
 * Data that can be passed over the RecordChannelKey.ACTION channel.
 */
export interface IRecordActionChannel {
	action: RecordChannelAction;
}


/**
 * Data that can send of the channel.
 * This channel is used to pass changes to the Ecg List layout
 */
export interface IRecordEcgLayoutTypeChannel {
    layoutType: EcgLayoutType;
}




/**
 * Data passed over PAINT_RHYTHM channel
 */
export interface IRecordPaintChannel {
    rhythmTypeEdit: EcgRhythmTypeEdit;
    newRhythmType: RhythmType;
    startIndex: number;
    endIndex: number;
    paintModeEdit: boolean; // flag is used on the QATool to denote whether the edit is made from page view tab, always false in TraceQA
}


/**
 * Data that can be passed over the RecordChannelKey.MARK_ECTOPY channel.
 */
export interface IRecordMarkEctopyChannel {
    ectopicType: EctopicType;
}


/**
 * Data used to open a modal in the right column of the record component
 * i.e. Overlays the main content, but allows access to the edit bar
 */
export interface IRecordRightColModalChannel {
	action: RightColModalAction;
	type?: RightColModalType,
	initProperties?: RightColModalInitProprtiersUnion;
}

export type RightColModalInitProprtiersUnion = IMultilineStripModalInitProperties

export enum RightColModalAction {
	OPEN_MODAL,
	CLOSE_MODAL
}

export interface IMultilineStripModalInitProperties {
	ecgCardConfig: IEcgCardConfig
}

/**
 * enum for the different types of modals that can be opened in the right col
 */
export enum RightColModalType {
	MULTILINE_STRIP_MODAL
}

/**
 * Data that can be passed over the RecordChannelKey.RECORD_REPORT channel.
 * Used for things surrounding report generation
 */
export interface IRecordReportChannel {
    action: RecordReportChannelAction;
    //warnings and/or errors should be populated if action is REPORT_QUALITY_CHECK_FAILURE
    qualityCheckWarnings?: (RecordNavigationKey | RhythmType)[];
    qualityCheckErrors?: (RecordNavigationKey | RhythmType)[];
}

/**
 * Channel Name - Each Key of the ChannelData type.
 */
export type RecordChannelName = keyof RecordChannelData;



/**
 * Channels available with the RecordNotifier
 */
export type SidebarChannelData = {
    [SidebarChannelKey.ACTION]?: ISidebarActionChannel;
};


/**
 * Data that can be passed over the RecordChannelKey.ACTION channel.
 */
export interface ISidebarActionChannel {
    action: SidebarChannelAction;
    target: SidebarTab;
}


/**
 * Channel Name - Each Key of the ChannelData type.
 */
export type SidebarChannelName = keyof SidebarChannelData;

/**
 * Data that can be passed over the RecordChannelKey.HR_BAR_ACTION channel.
 */
export interface IHRBarActionChannel {
    selectedAction: HRBarActionType;
}

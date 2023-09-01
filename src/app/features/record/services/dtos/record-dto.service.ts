import { Injectable } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

import { IEcgAnalyzerAnalyzeRequest, IEcgCurrentEditsResponse, IEcgRangeEdit } from 'app/modules/ecg/interfaces';
import { SidebarTab } from 'app/features/record/services/enums/channel.enum';
import { IRecordSideBar } from 'app/features/record/services/interfaces/record-sidebar.interface';
import { IRecordNavigationItem } from 'app/features/record/services/interfaces/record-navigation.interface';
import { IRecordMetrics, IAccountInfo, IMdnInfo, IPatchInfo, IPatientInfo, IDetectedRhythmsInfo } from 'app/features/record/services/interfaces/record-metrics.interface';
import { EcgLayoutType } from '../enums';


@Injectable()
export class RecordDto {

    // Record Serial Number
    public serialNumber: string;

    // Record Metrics
    public metrics: IRecordMetrics;

    // Array of sidebar navigation items
    public navigationItems: Array<IRecordNavigationItem> = new Array<IRecordNavigationItem>();

    // Record Account Information
    public accountInfo: IAccountInfo;

    // Record MDN Information
    public mdnInfo: IMdnInfo;

    // Record Patch Information
    public patchInfo: IPatchInfo;

    // Record Patient Information
    public patientInfo: IPatientInfo;

    // Sidebar information
    public sidebar: IRecordSideBar = {
        activeTab: SidebarTab.NAVIGATION,
        rhythmsDisabled: true,
        ectopicsDisabled: false,
        hrBarDisabled: false
    };

    public sessionEdits: Array<IEcgRangeEdit> = null;

    // Current edit data returned from API
    public currentEdits: IEcgCurrentEditsResponse;

    public detectedRhythmsInfo: IDetectedRhythmsInfo;

    // enables/disables sections on the record page during edit sessions
    public editControls: IEditControls = {
        undoDisabled: false,
        pageGainDisabled: false,
        viewToggleDisabled: false,
        convertToSinusButtonsDisabled: false,
        convertToArtifactButtonsDisabled: false
    };

	public ecgAnalyzerRequest: IEcgAnalyzerAnalyzeRequest;

    // Current layout type of the list of ECG cards (TILE VS LIST/LONG)
    public ecgListLayoutType: EcgLayoutType = EcgLayoutType.LIST;

    public paintIntervalStart: number;

    public paintIntervalEnd: number;

    // URL to the report PDF
    public reportUrl: string;
}

/**
 * Sets disable/enable state for page controls, use with disableOverlay directive
 */
export interface IEditControls {

    undoDisabled: boolean;

    /**
     * Not Developed 2/2023
     */
    pageGainDisabled: boolean;
    viewToggleDisabled: boolean; // strip/tile view toggle
    convertToSinusButtonsDisabled: boolean;
    convertToArtifactButtonsDisabled: boolean;
}

@Injectable()
export class RecordStateDto extends RecordDto {
}

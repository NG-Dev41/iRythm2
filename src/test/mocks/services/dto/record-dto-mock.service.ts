import { IEditControls } from "app/features/record/services/dtos/record-dto.service";
import { IPatientInfo, IRecordMetrics, IAccountInfo } from "app/features/record/services/interfaces/record-metrics.interface";
import { IRecordNavigationItem } from 'app/features/record/services/interfaces/record-navigation.interface';

export class RecordDtoMock {
    public serialNumber: string = 'UNIT_TEST';
    public sidebar = {
        hrBarDisabled: false
    }
    public metrics: IRecordMetrics = {} as IRecordMetrics

    // Array of sidebar navigation items
    public navigationItems: Array<IRecordNavigationItem> = new Array<IRecordNavigationItem>();

    public patientInfo: IPatientInfo = {
        age: '100000',
        primaryIndication: 'indication',
        icdOrPacemaker: true,
        mode: 'mode',
        lowerRateLimit: 1,
        upperRateLimit: 100,
        relevantInfo: 'info'
    }
    public editControls: IEditControls = {
        undoDisabled: false,
        pageGainDisabled: false,
        viewToggleDisabled: false,
        convertToSinusButtonsDisabled: false,
        convertToArtifactButtonsDisabled: false
    };
    public patchInfo = {
        effectiveDate: new Date()
    };
    public reportUrl: any;
    public accountInfo: IAccountInfo = {
        account: "test",
        location: "NJ",
        notificationMethod: "",
        prescribingProviderFirstName: "",
        prescribingProviderLastName: "",
        ectopyVeReportingRequired: true,
        ectopySveReportingRequired: true,
        prescribingProviderNotes: ""
    }
}

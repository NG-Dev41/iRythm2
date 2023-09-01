import { IFinding } from 'app/commons/services/dao/process-data-dao.service';

export interface IAppState {
    recordEntity: IRecordState;
}

export interface IRecordState {
    serialNumber: string;
    reportFindings: IFindingsState;
}

export interface IFindingsState {
    // this is to track the serial number used to retrieve the findings
    serialNumber: string;
    rawServerResponse: string;
    findingsList: Array<IFinding>;
    keyValueMap: { [key: string]: string };
}

export const initialRecordState: IRecordState = {
    serialNumber: null,
    reportFindings: {
        serialNumber: null,
        rawServerResponse: null,
        findingsList: new Array<IFinding>(),
        keyValueMap: {},
    },
};

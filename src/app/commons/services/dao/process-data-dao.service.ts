import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { EndpointUrl, GenericHttpResponse } from 'app/commons/constants/endpoint-url.const';


@Injectable({
    providedIn: 'root'
})
export class ProcessDataDao {

    constructor(
        private httpClient: HttpClient,
        private endpoint: EndpointUrl
    ) {}


    public processDataRequest(payload: IProcessDataRequest): Observable<IProcessDataResponse> {
        return this.httpClient.post<IProcessDataResponse>(this.endpoint.url(this.endpoint.processData), payload);
    }


    /**
     * Formats the dao response into useable data objects.
     * I.e. An epoch timestamp into a Javascript Date Object.
     * @param response
     */
    /*
    public formatDataStructures(response: IProcessDataResponse): IProcessDataResponse {
        response.noteList?.forEach(note => note.createdDate = new Date(note.createdDate));

        response.findingsResponse.newlyGeneratedReportFindings.forEach(finding => finding.keyValueMap = new Map(finding.keyValueMap.entries()));
        response.findingsResponse.savedReportFindings.forEach(finding => finding.keyValueMap = new Map(finding.keyValueMap.entries()));

        return response;
    }
    */
}

export interface IProcessDataRequest {
    ecgSerialNumber: string;
    notesRequest?: INotesRequestParams;
    priorityRequest?: IPriorityRequestParams;
    findingsRequest?: IFindingsRequest;
}

export interface IProcessDataResponse extends GenericHttpResponse {
    noteList?: INote[];
    priorityResponse?: IPriorityParams;
    findingsResponse?: IFindingsResponse;
}

export interface INotesRequestParams {
    requestType: RequestTypeEnum;
    noteList?: INote[];
}

export interface INote {
    content: string;
    user: string;
    createdDate?: Date;
}

export interface IPriorityParams {
    priorityStatus?: PriorityStatusEnum;
    mdnTypes?: string[];
}

export interface IPriorityRequestParams extends IPriorityParams, IRequestType {
}

export enum PriorityStatusEnum {
    MD_NOTIFY = 'MD_NOTIFY',
    PRIORITY_REQUEST = 'PRIORITY_REQUEST',
    REGULAR = 'REGULAR'
}

export interface IFindingsRequest {
    findingRequestItemList?: Array<IFindingRequestItem>;
    legacyMacroForm?: string;
}

export interface IFindingRequestItem {
    findingsActionType: FindingActionsType;
    findingList?: Array<IFinding>;
}

export interface IFindingsResponse {
    reportFindings: IReportFindings;

    // savedReportFindings: IReportFindings[];
    // newlyGeneratedReportFindings: IReportFindings[];
}

export interface IReportFindings {
    findingList: Array<IFinding>;
    keyValueMap: {[key: string]: any};
}

export interface IFinding {
    key: string;
    findingsType: FindingsType;
    sequence?: number;
    content?: string;
}

export enum FindingActionsType {
    OBTAIN_FINDINGS = 'OBTAIN_FINDINGS',
    USER_DEFINED = 'USER_DEFINED',
    TOGGLE = 'TOGGLE',
	CREATE = 'CREATE',
	UPDATE = 'UPDATE',
	DELETE = 'DELETE'
}

export enum FindingsType {
    AUTO_GENERATED = 'AUTO_GENERATED',
    USER_DEFINED = 'USER_DEFINED',
    TOGGLE = 'TOGGLE',
    KEY_VALUE_MAP = 'KEY_VALUE_MAP'
}

export interface IRequestType {
    requestType: RequestTypeEnum;
}

export enum RequestTypeEnum {
    CREATE = 'CREATE',
    READ = 'READ',
    DELETE = 'DELETE',
    UPDATE = 'UPDATE'
}

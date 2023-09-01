import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { EndpointUrl, GenericHttpResponse } from 'app/commons/constants/endpoint-url.const';
import { ErrorCode } from 'app/commons/enums/error-codes.enum';


@Injectable({
    providedIn: 'root'
})
export class ProcessReportDao {


    /**
     * Ctor
     *
     * @param {HttpClient}  private httpClient
     * @param {EndpointUrl} private endpoint
     */
    constructor(
        private httpClient: HttpClient,
        private endpoint: EndpointUrl
    ) {}


    /**
     * Endpoint to make POST request to the report/process endpoint.
     *
     * @param  {IProcessReportRequest}              payload
     * @return {Observable<IProcessReportResponse>}
     */
    public processReportRequest(payload: IProcessReportRequest): Observable<IProcessReportResponse> {
        return this.httpClient.post<IProcessReportResponse>(this.endpoint.url(this.endpoint.readProcessReport), payload);
    }
}



/**
 * Interface describing properties available with a report request
 */
export interface IProcessReportRequest {
    ecgSerialNumber: string;
    reportAction: ReportActionType;
    reportWarningIgnoreList?: string[];
    user: string;
}


/**
 * Interface describing properties available with a report response
 */
export interface IProcessReportResponse extends GenericHttpResponse {
    reportInfo: {
        url: string;
        warningList: Array<IReportError>;
        errorList: Array<IReportError>;
    }
}


/**
 * Interface describing both report errors and report warnings.
 */
export interface IReportError {
    throwableMessage: string;
    errorExceptionName: string;
    errorStackTrace: string;
    errorCode: ErrorCode;
    errorZoneDateTime: string;
    errorCodeDetail: string;
    errorValueMap: {[key: string]: string};
}


/**
 * Report action types available to the process report endpoint
 */
export enum ReportActionType {
    PREVIEW = 'PREVIEW',
    APPROVE = 'APPROVE'
}

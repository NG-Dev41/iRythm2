import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { EndpointUrl, GenericHttpResponse } from 'app/commons/constants/endpoint-url.const';
import { additionalStripDisplayResolutionTypeEnum, IRequestPagination, IAdditionalStripResponse } from 'app/modules/ecg/interfaces';
import { IEcgAnalyzerAnalyzeResponse } from 'app/modules/ecg/interfaces';


@Injectable({
    providedIn: 'root'
})
export class AdditionalStripsDao {

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
     * Makes request to additional strips endpoint and returns the response.
     *
     * @param  {IAdditionalStripsRequest}              payload
     * @return {Observable<IAdditionalStripsResponse>}
     */
    public getAdditionalStrips(payload: IAdditionalStripsRequest): Observable<IAdditionalStripsResponse> {
        return this.httpClient.post<IAdditionalStripsResponse>(this.endpoint.url(this.endpoint.additionalStrips), payload);
    }
}


/**
 * Payload properties used with additional strips request
 */
export interface IAdditionalStripsRequest {
    ecgSerialNumber: string;
    additionalStripReadType: AdditionalStripReadType;
    prePopulatedHeadingTitle?: string;
    subTitle?: string;
    startIndex?: number;
    additionalStripId?: number;
    duration?: number;
    additionalStripDisplayResolutionType?: additionalStripDisplayResolutionTypeEnum;
    sequence?: number;
    additionalStripRequestConfiguration?: IAdditionalStripRequestConfiguration;
}


/**
 * Payload properties for the additionalStripRequestConfiguration property
 */
export interface IAdditionalStripRequestConfiguration {
    requestPagination: IRequestPagination;
}


/**
 * Response properties returned from additional strips request
 */
export interface IAdditionalStripsResponse extends IEcgAnalyzerAnalyzeResponse {
    additionalStripResponse: IAdditionalStripResponse;
}


/**
 * Additional Strip Read Types
 */
export enum AdditionalStripReadType {
    READ_WITH_SAMPLES_USING_CONFIG = 'READ_WITH_SAMPLES_USING_CONFIG',
    READ_METADATA_WITHOUT_CONFIG = 'READ_METADATA_WITHOUT_CONFIG'
}
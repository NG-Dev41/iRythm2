import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { EndpointUrl, GenericHttpResponse } from 'app/commons/constants/endpoint-url.const';


@Injectable()
export class EcgResetDao {

    /**
     * Ctor
     *
     * @param httpClient
     * @param endpoint
     */
    public constructor(
        private httpClient: HttpClient,
        private endpoint: EndpointUrl
    ) {
    }

    /**
     * Post request to the resetEcg endpoint
     * @param params
     */
    public resetEcg(params: IEcgResetRequest): Observable<GenericHttpResponse> {
        return this.httpClient.post<GenericHttpResponse>(this.endpoint.url(this.endpoint.ecgWriteReset), params);
    }
}

/**
 * Interface describing requests for the resetEcg endpoint
 */
export interface IEcgResetRequest {
    ecgSerialNumber: String
}

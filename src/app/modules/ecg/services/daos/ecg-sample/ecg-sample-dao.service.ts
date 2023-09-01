import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IEcgReadSampleRequest, IEcgReadSampleResponse } from '../../../interfaces';
import { EndpointUrl } from '../../../../../commons/constants/endpoint-url.const';


@Injectable({
    providedIn: 'root'
})
export class EcgSampleDao {


    /**
     * Ctor
     *
     * @param {HttpClient}  private httpClient
     * @param {EndpointUrl} private endpoint
     */
    public constructor(
        private httpClient: HttpClient,
        private endpoint: EndpointUrl
    ) {}


    /**
     * Hit /read/sample endpoint.
     *
     * @param  {IEcgReadSampleRequest}              params
     * @return {Observable<IEcgReadSampleResponse>}
     */
    public read(params: IEcgReadSampleRequest): Observable<IEcgReadSampleResponse> {
        return this.httpClient.post<IEcgReadSampleResponse>(this.endpoint.url(this.endpoint.ecgSampleRead), params);
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EndpointUrl } from 'app/commons/constants/endpoint-url.const';
import { IEcgEditRequest, IEcgEditResponse } from '../../../interfaces';

// TODO: I think this should be renamed WriteDao
@Injectable({
    providedIn: 'root'
})
export class EcgEditDao {

    /**
     * Ctor
     *
     * @param {HttpClient}      private httpClient
     * @param {InfoEndpointUrl} private endpoint
     */
    public constructor(
        private httpClient: HttpClient,
        private endpoint: EndpointUrl
    ) {}


    public edit(params: IEcgEditRequest): Observable<IEcgEditResponse> {
        return this.httpClient.post<IEcgEditResponse>(this.endpoint.url(this.endpoint.ecgWriteEdit), params);
    }


    public editBeat(params: IEcgEditRequest): Observable<IEcgEditResponse> {
        return this.httpClient.post<IEcgEditResponse>(this.endpoint.url(this.endpoint.ecgWriteEdit), params);
    }
}

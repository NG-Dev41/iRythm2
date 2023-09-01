import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { IEcgUndoEditRequest } from '../../../interfaces';
import { EndpointUrl, GenericHttpResponse } from 'app/commons/constants/endpoint-url.const';


@Injectable({
    providedIn: 'root'
})
export class EcgUndoEditDao {

    /**
     * Ctor
     *
     * @param {HttpClient}      private httpClient
     * @param {InfoEndpointUrl} private endpoint
     */
    public constructor(
        private httpClient: HttpClient,
        private endpoint: EndpointUrl
    ) {
    }

    /**
     * Make request to edit undo endpoint.
     *
     * @param  {IEcgUndoEditRequest} params
     * @return {Observable<GenericHttpResponse>}
     */
    public undo(params: IEcgUndoEditRequest): Observable<GenericHttpResponse> {
        return this.httpClient.post<GenericHttpResponse>(this.endpoint.url(this.endpoint.ecgWriteUndo), params);
    }
}

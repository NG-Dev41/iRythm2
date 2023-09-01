import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { EndpointUrl } from 'app/commons/constants/endpoint-url.const';
import { InfoSerializer, MInfo, IGetInfoResponse } from 'app/features/info/models/info';


@Injectable()
export class InfoDao {


    /**
     * Ctor
     *
     * @param {HttpClient}      private httpClient
     * @param {InfoEndpointUrl} private endpoint
     * @param {InfoSerializer}  private infoSerializer
     */
    public constructor(
        private httpClient: HttpClient,
        private endpoint: EndpointUrl,
        private infoSerializer: InfoSerializer
    ) {}


    /**
     * Returns MInfo observable object from api /info
     * @return {Observable<MInfo>}
     */
    public getInfo(): Observable<MInfo> {

        return this.httpClient.get(this.endpoint.url(this.endpoint.info)).pipe(
            map((data: IGetInfoResponse) => {
                return this.infoSerializer.deserialize(data);
            })
        );
    }
}


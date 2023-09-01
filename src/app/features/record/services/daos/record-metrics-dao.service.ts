import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { EndpointUrl } from 'app/commons/constants/endpoint-url.const';
import { IRecordMetricsRequest, IRecordMetricsResponse } from 'app/features/record/services/interfaces/record-metrics.interface';


@Injectable()
export class RecordMetricsDao {

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
     * Hit record metrics endpoint.
     *
     * @param  {IRecordMetricsRequest}              payload
     * @return {Observable<IRecordMetricsResponse>}
     */
    public readMetrics(payload: IRecordMetricsRequest): Observable<IRecordMetricsResponse> {
        return this.httpClient.post<IRecordMetricsResponse>(this.endpoint.url(this.endpoint.readRecordMetrics), payload)
            .pipe(map((res) => {

                if(res.patchInfo.effectiveDate) {
                    res.patchInfo.effectiveDate = new Date(res.patchInfo.effectiveDate);
                }

                return res;
            }));
    }
}


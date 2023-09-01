import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { EndpointUrl } from 'app/commons/constants/endpoint-url.const';
import { IEcgAnalyzerAnalyzeRequest, IEcgAnalyzerAnalyzeResponse } from 'app/modules/ecg/interfaces';


@Injectable({
    providedIn: 'root'
})
export class EcgAnalyzerDao {


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


    /** Method that calls the /irhythm/read/analyze endpoint.
     *
     * NOTE: If at any point they change the name of any existing properties we will introduce (HERE)
     * the Serializer layer which will take care of converting the data from the backend into what
     * the front end is expecting.
     *
     * @param  {IEcgAnalyzerAnalyzeRequest}              params
     * @return {Observable<IEcgAnalyzerAnalyzeResponse>}
     */
    public analyze(params: IEcgAnalyzerAnalyzeRequest): Observable<IEcgAnalyzerAnalyzeResponse> {
        return this.httpClient.post<IEcgAnalyzerAnalyzeResponse>(this.endpoint.url(this.endpoint.ecgAnalyzerAnalyze), params);
    }
}

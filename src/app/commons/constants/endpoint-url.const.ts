import { Injectable } from '@angular/core';

import { environment } from 'environments/environment';
import { ErrorCode } from 'app/commons/enums/error-codes.enum';

/**
 * Service providing access to endpoint URL and some helper methods.
 * TODO: Started this as a const but would make more sense to rename file to endpoint-url.service.ts
 * OR - turn endpoint urls into a const and create a EndpointUrlUtils (or something similiar) that has methods
 * that work with new const. Thoughts?
 */
@Injectable({
    providedIn: 'root',
})
export class EndpointUrl {

    public readonly info: string = 'info';

    public readonly ecgAnalyzerAnalyze: string = 'irhythm/read/analyze';

    public readonly ecgWriteEdit: string = 'irhythm/write/edit';

    public readonly ecgWriteUndo: string = 'irhythm/write/undo';

    public readonly ecgWriteReset: string = 'irhythm/write/reset';

    public readonly ecgSampleRead: string = 'irhythm/read/sample';

    public readonly processData: string = 'irhythm/process/data';

    public readonly processQueue: string = 'irhythm/process/queue';

    public readonly readRecordMetrics: string = 'irhythm/read/metrics';

    public readonly readProcessReport: string = 'irhythm/process/report';

    public readonly additionalStrips: string = 'irhythm/read/additionalstrip';


    /**
     * Build api url using environment specific base domain and the supplied path parameter.
     *
     * @param  {string} path Api url path
     * @return {string}      Full api url
     */
    public url(path: string): string {
        return `${environment.api.domain}${path}`;
    }
}


/**
 * Base HTTP response data available to all API responses
 */
export interface GenericHttpResponse {
    serverInfo?: {
        version: string,
        buildNumber: number
    };
    errorInfo?: {
        hasError: boolean;
        errorRecordList?: Array<{
            errorCode: ErrorCode;
            errorZoneDateTime: string;
            errorCodeDetail: string;
            throwableMessage: string;
            errorExceptionName: string;
            errorStackTrace: string;
        }>;
    };
}

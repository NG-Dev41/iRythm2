import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgxIndexedDBService } from 'ngx-indexed-db';

import { UserDto } from 'app/commons/services/dtos/user-dto.service';
import { EndpointUrl, GenericHttpResponse } from 'app/commons/constants/endpoint-url.const';
import { MdnType } from 'app/commons/enums';


@Injectable({
    providedIn: 'root'
})
export class QueueDao {

    /**
     * Ctor
     *
     * @param {HttpClient}  private httpClient
     * @param {EndpointUrl} private endpoint
     * @param {NgxIndexedDBService} private dbService
     */
    public constructor(
        private httpClient: HttpClient,
        private endpoint: EndpointUrl,
        private dbService: NgxIndexedDBService
    ) {
    }


    /**
     * Process queue endpoint.
     *
     * @param  {IProcessQueueRequest} params
     * @return {Observable<IProcessQueueResponse>}
     */
    public processQueue(payload: IQueueRequest): Observable<IQueueResponse> {

        return this.httpClient.post<IQueueResponse>(this.endpoint.url(this.endpoint.processQueue), payload).pipe(map(res => {

            // Mapping unix time stamps to Javascript Date objects
            res.queueRecordList?.onHoldList?.map(this.mapQueueRecordToDate);
            res.queueRecordList?.inProgressList?.map(this.mapQueueRecordToDate);

            return res;
        }));
    }

    /**
     * Maps unix time stamp to Javascript Date object
     * @param queueItem
     * @private
     */
    private mapQueueRecordToDate(queueItem: IQueueRecord) {
        queueItem.lockedDateTime = new Date(queueItem.lockedDateTime)
        return queueItem;
    }

    /**
     * Save Queue on Hold list to cache
     *
     * @param user UserDto
     * @param onHoldRecords IQueueRecord[]
     */
    public saveQueueHoldToCache(user: UserDto, onHoldRecords: IQueueRecord[]): Observable<any>{
        return this.dbService.update('queueHold', {
            user: user.id,
            onHoldRecords: onHoldRecords,
        });
    }

    /**
     * Save Queue on Hold list to cache
     *
     * @param user UserDto
     * @param diffRecords IQueueRecord[]
     */
    public saveQueueDiffToCache(user: UserDto, diffRecords: IQueueRecord[]): Observable<any>{
        return this.dbService.update('queueDiff', {
            user: user.id,
            diffRecords: diffRecords,
        });
    }

    /**
     * Loads queue on hold list from cache
     *
     * @param user UserDto
     */

    public loadQueueHoldFromCache(user: UserDto): Observable<any>{
        return this.dbService.getByKey(
            'queueHold', user.id
        );
    }

    /**
     * Loads queue diff from cache
     *
     * @param user UserDto
     */

    public loadQueueDiffFromCache(user: UserDto): Observable<any>{
        return this.dbService.getByKey(
            'queueDiff', user.id
        );
    }

}



/**
 * Queue Resquest Data
 */
export interface IQueueRequest extends IQueueRequestOptionals {
    user: string;
    queueAction: QueueAction;

};

export interface IQueueRequestOptionals {
    ecgSerialNumber?: string;
    reasonList?: string[];
}

/**
 * Queue Response Data
 */
export interface IQueueResponse extends GenericHttpResponse {
    queueRecordList: {
        inProgressList: Array<IQueueRecord>;
        onHoldList: Array<IQueueRecord>;
    }
};


/**
 * Queue Record Interface
 *
 * ecgSerialNumber: string;
 *
 * lockedDateTime: Date;
 *
 * priority: QueueRecordPriority;
 *
 * mdnTypesList: Array<MdnType>;
 *
 * notesCount: number;
 *
 * expedited: boolean;
 *
 * consultation: boolean;
 *
 */
export interface IQueueRecord {
    ecgSerialNumber: string;
    lockedDateTime: Date;
    priority: QueueRecordPriority;
    mdnTypesList: Array<MdnType>;
    notesCount: number;
    expedited: boolean;
    consultation: boolean;
}


/**
 * Queue Record Priority
 */
export enum QueueRecordPriority {
    REGULAR = 'REGULAR',
    MD_NOTIFY = 'MD_NOTIFY',
    PRIORITY_REQUEST = 'PRIORITY_REQUEST',
    MDN_FOLLOW_UP='MDN_FOLLOW_UP',
    STANDARD='STANDARD'
}


/**
 * Queue Action Types
 */
export enum QueueAction {
    POLL_QUEUE = 'POLL_QUEUE',
    START_NEW_RECORD = 'START_NEW_RECORD',
    ON_HOLD = 'ON_HOLD',
    ON_HOLD_CONSULTATION = 'ON_HOLD_CONSULTATION',
    IN_PROGRESS = 'IN_PROGRESS',
    SEND_BACK_TO_QA_TOOL = 'SEND_BACK_TO_QA_TOOL',
    COPY_REPORT_URL = 'COPY_REPORT_URL',
    ELIGIBLE_FOR_TRACE_QA = 'ELIGIBLE_FOR_TRACE_QA'
}


/**
 * Response Mock Data
 *
 * @type {IProcessQueueResponse}
 */
export const MockProcessQueueResponse: IQueueResponse = {
    queueRecordList: {
        inProgressList: [
            {
                ecgSerialNumber: 'INPROGRESS1',
                lockedDateTime: new Date('2022-07-31T22:30:15.000+00:00'),
                priority: QueueRecordPriority.REGULAR,
                mdnTypesList: [
                    MdnType.PAUSE,
                    MdnType.CHB
                ],
                notesCount: 0,
                expedited: true,
                consultation: true
            },
            {
                ecgSerialNumber: 'NTESTL9308',
                lockedDateTime: new Date('2021-07-31T22:30:15.000+00:00'),
                priority: QueueRecordPriority.MD_NOTIFY,
                mdnTypesList: [
                    MdnType.PAUSE,
                    MdnType.CHB
                ],
                notesCount: 1,
                expedited: true,
                consultation: true
            }
        ],
        onHoldList: [
            {
                ecgSerialNumber: 'ONHOLD1',
                lockedDateTime: new Date('2022-07-31T22:30:15.000+00:00'),
                priority: QueueRecordPriority.PRIORITY_REQUEST,
                mdnTypesList: [
                    MdnType.PAUSE,
                    MdnType.CHB
                ],
                notesCount: 2,
                expedited: true,
                consultation: true
            },
            {
                ecgSerialNumber: 'ONHOLD2',
                lockedDateTime: new Date('2021-07-31T22:30:15.000+00:00'),
                priority: QueueRecordPriority.MD_NOTIFY,
                mdnTypesList: [
                    MdnType.PAUSE,
                    MdnType.CHB
                ],
                notesCount: 3,
                expedited: true,
                consultation: true
            }
        ]
    }
};

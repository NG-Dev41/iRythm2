import { Injectable } from '@angular/core';

import { Observable, Subscription, timer } from 'rxjs';
import { add } from 'date-fns';
import { isAfter } from 'date-fns/fp';
import { map } from 'rxjs/operators';

import { ComponentLoadState } from 'app/commons/enums';
import { SnackbarService } from 'app/modules/snackbar/snackbar.service';
import { QueueUtils } from 'app/modules/queue/services/queue-utils.service';
import { UserDto } from 'app/commons/services/dtos/user-dto.service';
import { newTransferSuccess, newReassignMessage } from 'app/commons/constants/common.const';
import { IQueueResponse, IQueueRecord, QueueDao, IQueueRequest, QueueAction } from 'app/features/queue/daos/queue-dao.service';

// TODO: Why is this a root provider? Can't remember....
@Injectable({
	providedIn: 'root'
})
export class QueueService {

	// State of queue data
	public loadState: ComponentLoadState = ComponentLoadState.LOADING;

	// Queue data returned from API
	public queueData: IQueueResponse;

	// In progress records
	public inProgressRecords: IQueueRecord[];

	// In progress records
	public onHoldRecords: IQueueRecord[];

    // Indicates if there is an on hold record that is 3 days older or longer
	public hasRecordLongerThanThreeDays: boolean = true;

	// Polling interval
	public pollInterval: ReturnType<typeof setInterval>;

	// Number of seconds to poll the queue - set in milliseconds
	public pollMilliseconds: number = 5000;

    // Subscription to the queue interval that updates the queue
    public queuePoll$: Subscription;

    // rxjs timer that fires according to the pollMilliseconds
    private queueInterval$: Observable<number> = timer(0, this.pollMilliseconds);

    // Previous queue response, used to determine where to show snackbar or not, and whether to re-render queue or not
    private prevResponse: IQueueResponse;

    // List of the new transfer records for the user
    public diffRecords: IQueueRecord[] = [];

    // list of ecgSerialNumbers of records placed on hold by the user
    public userOnHoldList: string[] = [];

    // user put record in progress
    public userInProgress: boolean = false;

    /**
     * Ctor
     *
     * @param queueDao
     * @param snackBarService
     * @param queueUtils
     * @param user
     */
	public constructor(
        private queueDao: QueueDao,
        private snackBarService: SnackbarService,
        private queueUtils: QueueUtils,
        public user: UserDto
	) {}


    /**
     * Init queue.
     *
     * @param {IQueueRequest} payload
     */
    public initQueue(payload: IQueueRequest): void {
        this.queuePoll$ = this.queueInterval$.subscribe(() => this.processQueue(payload));
    }


    /**
     * Make a queue request to the queue dao without creating a new polling service
     *
     * @param {IQueueRequest} payload
     */
    public makeQueueRequest(payload: IQueueRequest): void {

        // keep track of what the user placed on hold
        if(payload.queueAction === QueueAction.ON_HOLD || QueueAction.ON_HOLD_CONSULTATION) {
            this.userOnHoldList.push(payload.ecgSerialNumber);
        }

        // determine if user put record in progress, alternative is reassignment
        if(payload.queueAction === QueueAction.IN_PROGRESS) {
            this.userInProgress = true;
        }

        this.processQueue(payload);
    }


    /**
     * Helper function to make a request to the queue dao, and process the response
     * @param payload
     * @private
     */
    private processQueue(payload: IQueueRequest): void {

        this.queueDao.processQueue(payload)
            // Diff between the prev and curr queue response
            // Don't do queue processing/updates if response is the same
            .subscribe((res: IQueueResponse) => {
                // Set information and flags for queue
                if(!this.prevResponse || !this.checkLength(this.prevResponse, res)) {
                    this.queueData = this.processResponse(res);
                }
                this.prevResponse = res;
            });
    }


    /**
     * Process the polling response
     * @param response
     * @private
     */
    private processResponse(response: IQueueResponse): IQueueResponse {

        this.inProgressRecords = response.queueRecordList.inProgressList;
        this.onHoldRecords = response.queueRecordList.onHoldList;

        // save OnHoldRecords to storage for when user leaves computer and returns in order to calculate diff
        this.queueDao.saveQueueHoldToCache(
            this.user,
             this.onHoldRecords
        ).pipe(
            // rxjs take specified value(s) from source observable then unsubscribe
            // take(1)
        ).subscribe();

        if(!this.inProgressRecords) {
            this.inProgressRecords = [];
        }

        if(!this.onHoldRecords) {
            this.onHoldRecords = [];
        }

        this.hasRecordLongerThanThreeDays = false;

        // TODO: Move to method that can take list of records as param and process this and the next loop after
        for ( let [i, record] of this.inProgressRecords.entries() ) {
            if ( ! this.hasRecordLongerThanThreeDays ) {
                this.hasRecordLongerThanThreeDays = this.isRecordOlderThanThreeDays(record);
            }
        }

        for ( let [i, record] of this.onHoldRecords.entries() ) {
            if ( ! this.hasRecordLongerThanThreeDays ) {
                this.hasRecordLongerThanThreeDays = this.isRecordOlderThanThreeDays(record);
            }
        }

        // Update queue status
        this.loadState = ComponentLoadState.LOADED;

        return response;
    }

    /**
     * Check Length
     * Custom Compare method to use with distinctUntilChanged
     * @param prev
     * @param curr
     */

    private checkLength(prev: IQueueResponse, curr: IQueueResponse): boolean {

        // assign responses to new constants
        const onHoldPrev: IQueueResponse = prev;
        const onHoldCurr: IQueueResponse = curr;

        // if list is undefined, set to empty array
        if ( !onHoldPrev.queueRecordList.onHoldList ) {
            onHoldPrev.queueRecordList.onHoldList = [];
        }

        if ( !onHoldCurr.queueRecordList.onHoldList) {
            onHoldCurr.queueRecordList.onHoldList = [];
        }

        // find new record from the diff
        this.getNewRecords(onHoldPrev.queueRecordList.onHoldList, onHoldCurr.queueRecordList.onHoldList);

        // return boolean value
        return (onHoldCurr.queueRecordList.onHoldList.length === onHoldPrev.queueRecordList.onHoldList.length
                    && curr.queueRecordList.inProgressList?.length === prev.queueRecordList.inProgressList?.length);
    }

    /**
     * Show Snackbar Message based on lengths
     * @param prevLength
     * @param currLength
     * @param newSerialNumber
     * @private
     */

    private checkForNewTransferSnackbar(prevLength: number, currLength: number): void {
        // new transfer to user
        if ( prevLength < currLength ) {
            this.snackBarService.openSnackBar(newTransferSuccess, 'x');
        }
    }

    private checkForNewReassignSnackbar(prevLength: number, currLength: number, newSerialNumber: string): void {
        // reassigned away from user
        if ( prevLength > currLength ) {
            this.snackBarService.openSnackBar(newReassignMessage(newSerialNumber), 'x');
        }
    }

	/**
	 * Ends the polling process
	 */
	public stopPolling(): void {
        this.queuePoll$.unsubscribe();
	}


	/**
	 * Determines if the given record is older than three days.
	 *
	 * @param {IQueueRecord} record
	 */
    private isRecordOlderThanThreeDays(record: IQueueRecord) {
        let threeDaysAgoDate = add(new Date(), {days: -3});
        return isAfter(record.lockedDateTime, threeDaysAgoDate);
    }

    public getNewRecords(prev: IQueueRecord[], curr: IQueueRecord[]): IQueueRecord[] {

        // find diff between calls
        // transferred to user
        const transferToUserDiff = this.queueUtils.getDiff(curr, prev);
        // new transfer record
        const newTransferRecord: IQueueRecord = transferToUserDiff[0];

        // reassigned from user
        const reassignedFromUserDiff = this.queueUtils.getDiff(prev, curr);

        // check if user placed record in progress,
        // compare lengths in order to deploy reassignment snackbar
        if (!this.userInProgress) {
            this.checkForNewReassignSnackbar(prev.length, curr.length, reassignedFromUserDiff[0]?.ecgSerialNumber);

            // remove serial number from indexed db diff list if it exists there
            this.removeRecordFromCache(reassignedFromUserDiff[0]?.ecgSerialNumber);
        }

        // check that new item was not placed on hold by user
        if (newTransferRecord && !this.userOnHoldList?.some(ecg => ecg === newTransferRecord.ecgSerialNumber)){

            // compare lengths in order to deploy snackbar
            this.checkForNewTransferSnackbar(prev.length, curr.length);

            // push new transfer to diffRecords list
            if (this.diffRecords) {
                const index = this.diffRecords.findIndex(object => object?.ecgSerialNumber === newTransferRecord.ecgSerialNumber);

                if (index === -1) {
                    this.diffRecords.push(newTransferRecord);
                }
            } else {
                this.diffRecords.push(newTransferRecord);
            }
        }

        return this.diffRecords;
    }

    /**
     * Returns a boolean based on if record is a new transfer. Used with newRecordPipe
     */

    public isNewRecord(record: IQueueRecord): Observable<boolean> {

        return this.queueDao.loadQueueDiffFromCache(this.user)
            .pipe(
                map((res) => {
                    let newRecords: boolean;

                    newRecords = res?.diffRecords?.some(rec => rec.ecgSerialNumber === record.ecgSerialNumber);

                    this.diffRecords = res?.diffRecords;

                    return newRecords;
                }));
    }

    /**
     * Local Storage Handlers
     * @param serialNumber
     */
    public removeRecordFromCache(serialNumber): Subscription {

        // filter out clicked on record from diffRecords list
        this.diffRecords = this.diffRecords?.filter((record) => record.ecgSerialNumber !== serialNumber);

        // save new diffRecords list to storage
        return this.queueDao.saveQueueDiffToCache(
            this.user, this.diffRecords
        ).pipe(
            // rxjs take specified value(s) from source observable then unsubscribe
            // take(1)
        ).subscribe();
    }

    public getCachedValues(user): void {
        this.user = user;

        this.queueDao.loadQueueHoldFromCache(user).pipe(
            // rxjs take specified value(s) from source observable then unsubscribe
            // take(1)
        ).subscribe((res) => {
            if(res?.onHoldRecords){
                this.onHoldRecords = res.onHoldRecords;
            }
        });

        this.queueDao.loadQueueDiffFromCache(user).pipe(
            // rxjs take specified value(s) from source observable then unsubscribe
            // take(1)
        ).subscribe(res => {
            if(res?.diffRecords){
                this.diffRecords = res.diffRecords;
            }
        });
    }
}


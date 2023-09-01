import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { map } from 'rxjs/operators';

import { IQueueResponse, QueueAction, QueueDao } from 'app/features/queue/daos/queue-dao.service';
import { QueueService } from 'app/features/queue/services/queue.service';
import { UserDto } from 'app/commons/services/dtos/user-dto.service';


@Component({
    selector: 'app-on-hold-modal',
    templateUrl: './on-hold-modal.component.html',
    styleUrls: ['./on-hold-modal.component.scss']
})
export class OnHoldModalComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { serialNumber: string, onHoldSerialNumber: string, user: UserDto },
        public queueService: QueueService,
        public queueDao: QueueDao,
    ) { }

    /**
     * Switch on hold record to in progress
     */
    public setRecordInProgress(): void { 
        // prepare in progress payload
        const inProgressPayload = {
            user: this.data.user.id,
            queueAction: QueueAction.IN_PROGRESS,
            ecgSerialNumber: this.data.serialNumber
        };

        this.queueDao.processQueue(inProgressPayload).pipe(
            map((result: IQueueResponse) => {

                // set queue data items in queueService
                this.queueService.onHoldRecords = result.queueRecordList?.onHoldList;
                this.queueService.inProgressRecords = result.queueRecordList?.inProgressList;
                this.queueService.queueData.queueRecordList = result.queueRecordList;
                this.queueService.userOnHoldList.push(this.data.onHoldSerialNumber);

                // save on hold list to cache
                this.queueDao.saveQueueHoldToCache(this.data.user, result.queueRecordList?.onHoldList).pipe(
                    // take(1)
                ).subscribe();

                // remove new in progress record from diff list if it exists
                this.queueService.diffRecords = this.queueService.diffRecords?.filter(
                    record => record.ecgSerialNumber !== this.data.serialNumber);
            })
        ).subscribe();
    }
}

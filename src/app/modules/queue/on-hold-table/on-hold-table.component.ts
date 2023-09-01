import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';

import { UserDto } from 'app/commons/services/dtos/user-dto.service';
import { QueueUtils } from 'app/modules/queue/services/queue-utils.service';
import { OnHoldModalComponent } from 'app/modules/queue/on-hold-modal/on-hold-modal.component';
import { QueueDao, IQueueRecord, QueueAction } from 'app/features/queue/daos/queue-dao.service';
import { QueueService } from 'app/features/queue/services/queue.service';



@Component({
    selector: 'app-on-hold-table',
    templateUrl: './on-hold-table.component.html',
    styleUrls: ['./on-hold-table.component.scss']
})
export class OnHoldTableComponent implements OnInit {

    public columnHeaders = ['Serial Number', 'Time In Queue', 'Priority', 'MDN', ''];

    public newRecords: boolean = false;

    // If any item in the options box is hovered, disable the row hover effect
    public isOptionsHovered: boolean = false;


    @ViewChild('consultationTrigger', {read: MatMenuTrigger}) trigger: MatMenuTrigger;


    public constructor(
        public queueService: QueueService,
        public queueUtils: QueueUtils,

        private dialog: MatDialog,
        private router: Router,
        private user: UserDto,
        private queueDao: QueueDao
    ) { }


    public ngOnInit(): void {

        // load diff from cache, take first emitted value then unsubscribe
        this.queueDao.loadQueueDiffFromCache(this.user)
            .pipe(
                // take(1)
            ).subscribe(result => {
                // if a diff exists, set queueService diff records
                if(result?.diffRecords){
                this.queueService.diffRecords = result.diffRecords;
            }
        });
    }

    /**
     * Opens on onHoldModalComponent
     * @param record
     */
    public openOnHoldModal(record: IQueueRecord): void {
        if(this.isRecordDisabled(record)) return;

        if(this.queueService.inProgressRecords?.length > 0) {

            this.dialog.open(OnHoldModalComponent, {
                panelClass: ['modal-standard', 'modal-content-no-scroll'],
                data: {
                    serialNumber: record.ecgSerialNumber, // future in progress from Queue Service on hold list
                    onHoldSerialNumber: this.queueService.inProgressRecords[0].ecgSerialNumber,
                    user: this.user
                }
            });
        } else {

            this.queueService.makeQueueRequest({
                queueAction: QueueAction.IN_PROGRESS,
                user: this.user.id,
                ecgSerialNumber: record.ecgSerialNumber
            });

            this.router.navigateByUrl(`record/${record.ecgSerialNumber}`);
        }

        this.queueService.removeRecordFromCache(record.ecgSerialNumber);
    }

    /**
     * Returns a boolean indicating whether a record should be disabled or not
     * @param record
     */
    public isRecordDisabled(record: IQueueRecord) {
        if(!this.queueService.hasRecordLongerThanThreeDays || this.queueUtils.calcIsRecordLongerThanThreeDays(record)) return false;
        return true;
    }

    /**
     * Sets the isOptionsHovered flag, so that when the user is hovering over an option located in the right of the MDN column,
     * the row doesn't get set to a hovered state
     * @param isOptionsHovered
     */
    public setOptionsHovered(isOptionsHovered: boolean) {
        this.isOptionsHovered = isOptionsHovered;
    }


    /**
     * Writes the report URL to the clipboard
     */
    public writeUrlToClipboard(e: MouseEvent) {
        this.stopPropagation(e);
        navigator.clipboard.writeText(atob('aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1kUXc0dzlXZ1hjUQ=='));
    }

    /**
     * Stops all event propagation
     * @param e
     *
     * TODO: Maybe move this to a util class somewhere?
     */
    public stopPropagation(e: MouseEvent) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
    }
}

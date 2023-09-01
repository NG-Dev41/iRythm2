import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';

import { UserDto } from 'app/commons/services/dtos/user-dto.service';
import { QueueService } from 'app/features/queue/services/queue.service';
import { QueueUtils } from 'app/modules/queue/services/queue-utils.service';
import { IQueueRecord, QueueAction } from 'app/features/queue/daos/queue-dao.service';
import { AgingRecordsModalComponent } from 'app/modules/queue/aging-records-modal/aging-records-modal.component';


@Component({
    selector: 'app-in-progress-table',
    templateUrl: './in-progress-table.component.html',
    styleUrls: ['./in-progress-table.component.scss']
})
export class InProgressTableComponent implements OnInit {
    isConsultationMenuOpened: boolean;

    // Queue Table Column Headers
    public columnHeaders = ['Serial Number', 'Time In Queue', 'Priority', 'MDN', ''];

    // If any item in the options box is hovered, disable the row hover effect
    public isOptionsHovered: boolean = false;

    // new record text
    public newRecordText: string = 'Start A New Record';

    // TODO: What's this?

    @ViewChild('consultationTrigger', {read: MatMenuTrigger}) trigger: MatMenuTrigger;

    public constructor(
        public queueService: QueueService,
        public queueUtils: QueueUtils,

        public dialog: MatDialog,
        public router: Router,
        private user: UserDto
    ) { }


    public ngOnInit(): void {
    }


    /**
     * Closes the consultation menu
     */
    public closeConsultationMenu(): void {
        this.trigger.closeMenu();
    }


    /**
     * Stubbed method to hook up api to mark a record as Consultation
     * @param record
     */
    public markAsConsultation(record: IQueueRecord) {

        this.queueService.makeQueueRequest({
            queueAction: QueueAction.ON_HOLD_CONSULTATION,
            user: this.user.id,
            ecgSerialNumber: record.ecgSerialNumber
        });
    }

    /**
     * Stubbed record to hook up api to place a record on hold
     * @param record
     */
    public placeOnHold(record: IQueueRecord) {

        this.queueService.makeQueueRequest({
            queueAction: QueueAction.ON_HOLD,
            user: this.user.id,
            ecgSerialNumber: record.ecgSerialNumber
        });
    }

    /**
     * Opens the aging records dialog
     */
    public openAgingRecordsDialog(): void {
        this.dialog.open(AgingRecordsModalComponent, {
            panelClass: 'modal-standard'
        });
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
     * Starts a new in progress record for the user
     */
    public startNewRecord(): void {

        this.queueService.makeQueueRequest({
            queueAction: QueueAction.START_NEW_RECORD,
            user: this.user.id
        });
    }

    /**
     * Returns a boolean indicating whether a record should be disabled or not
     * @param record
     */
    public isRecordDisabled(record: IQueueRecord) {

        if(!this.queueService.hasRecordLongerThanThreeDays || this.queueUtils.calcIsRecordLongerThanThreeDays(record)) {
            return false;
        }

        return true;
    }

    /**
     * Navigates user to the findings page for the given record
     * @param record
     */
    public navigateToRecord(record) {
        this.router.navigateByUrl(`record/${record.ecgSerialNumber}`)
    }

    /**
     * Stops all event propagation
     * TODO: Move this to a core utility class?
     *
     * @param e
     */
    public stopPropagation(e: MouseEvent) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
    }
}

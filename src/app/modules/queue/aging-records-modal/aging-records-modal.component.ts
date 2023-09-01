import { Component } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';

import { QueueAction } from 'app/features/queue/daos/queue-dao.service';
import { QueueService } from 'app/features/queue/services/queue.service';
import { UserDto } from 'app/commons/services/dtos/user-dto.service';

@Component({
    selector: 'app-aging-records-modal',
    templateUrl: './aging-records-modal.component.html',
    styleUrls: ['./aging-records-modal.component.scss']
})
export class AgingRecordsModalComponent {

    constructor(
        private dialogRef: MatDialogRef<AgingRecordsModalComponent>,
        private queueService: QueueService,
        private user: UserDto
    ) {}

    /**
     * Starts a new record and closes the Aging Records Modal
     */
    public startNewRecord(): void {

        this.queueService.makeQueueRequest({
            queueAction: QueueAction.START_NEW_RECORD,
            user: this.user.id
        });
    }
}

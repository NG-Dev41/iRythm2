import { Component, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';

import { ReasonDialogComponent } from './reason-dialog/reason-dialog.component';
import { RecordMdnModalComponent } from 'app/features/record/mdn-modal/record-mdn-modal.component';
import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { UserDto } from 'app/commons/services/dtos/user-dto.service';
import { QueueAction, QueueDao } from 'app/features/queue/daos/queue-dao.service';



@Component({
    selector: 'app-header-options',
    templateUrl: './header-options.component.html',
    styleUrls: ['./header-options.component.scss']
})
export class HeaderOptionsComponent {
    isConsultationMenuOpened: boolean;

    @ViewChild('consultationTrigger', {read: MatMenuTrigger}) trigger: MatMenuTrigger;

    // For use in the template
    public QueueAction = QueueAction;


    constructor(
        private dialog: MatDialog,
        private recordDto: RecordDto,
        private queueDao: QueueDao,
        private userDto: UserDto,
        private router: Router
    ) { }


    /**
     * Change record priority to MDN
     */
    public changePriorityToMdn(): void {

        this.dialog.open(RecordMdnModalComponent, {
            panelClass: ['modal-standard', 'modal-content-no-scroll', 'mdn-modal-width'],
            data: {
                serialNumber: this.recordDto.serialNumber
            }
        });
    }


    /**
     * Closes the consultation menu
     */
    public closeConsultationMenu(): void {
        this.trigger.closeMenu();
    }


    /**
     * Place record on hold.
     *
     * @param {QueueAction} action
     */
    public placeOnHold(action: QueueAction): void {

        this.queueDao
            .processQueue({
                ecgSerialNumber: this.recordDto.serialNumber,
                user: this.userDto.id,
                queueAction: action
            })
            .subscribe(() => {
                this.router.navigate(['/queue']);
            });
    }


    /**
     * Open Send to Full QA Dialog
     */
    public openReasonDialog(): void {
        this.dialog.open(ReasonDialogComponent, {
            panelClass: 'modal-standard',
            data: {
                serialNumber: this.recordDto.serialNumber
            }
        });
    }
}

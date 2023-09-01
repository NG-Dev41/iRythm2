import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
	selector: 'app-approve-report-modal',
	templateUrl: './approve-report-modal.component.html',
	styleUrls: ['./approve-report-modal.component.scss']
})
export class ApproveReportModalComponent {

    constructor(
        private dialogRef: MatDialogRef<ApproveReportModalComponent>
    ) {}

    public approveReport(): void {
        this.dialogRef.close(true);
    }
}

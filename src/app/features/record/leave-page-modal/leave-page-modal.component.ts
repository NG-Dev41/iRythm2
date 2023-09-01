import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-leave-page-modal',
  templateUrl: './leave-page-modal.component.html',
  styleUrls: ['./leave-page-modal.component.scss']
})
export class LeavePageModalComponent {

    public leaveModalText: string = `Changes to this strip have not been saved yet. Leaving the page will discard any unsaved edits. Are you sure you want to leave?`;

    public stayOnPageLinkText: string = `Stay On Page`;

    public leavePageButtonText: string = `Leave Page`;

    public leaveModalTitle: string = `Leave Page?`;

    /**
     * ctor
     *
     */
    constructor(
        public dialogRef: MatDialogRef<LeavePageModalComponent>
    ) {}

    /**
     * Navigate away from page
     */
    public leavePage(): void {
        // dialog result = true for dialog.afterClose
        this.dialogRef.close(true);
    }


    /**
     * Stay on Page
     */
    public stayOnPage(): void {
        // dialog result = false for dialog.afterClose
        this.dialogRef.close(false);
    }
}

import { Component, Input, OnInit } from '@angular/core';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NotesHistoryDialogComponent } from 'app/modules/notes/notes-history/notes-history-dialog.component';
import { INotesConfig } from 'app/modules/notes/service/notes.service';

@Component({
    selector: 'app-notes',
    templateUrl: './notes.component.html',
    styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {

    // MatDialogConfig type includes data property for data being injected into the child component

    public dialogConfig: MatDialogConfig = new MatDialogConfig<INotesConfig>();
    // Incoming initial note count
    @Input() public newNoteNumber: number = 0;
    // Incoming serial number
    @Input() private serialNumber: string;

    /**
     * Ctor
     *
     * @param {MatDialog} public dialog
     */
    public constructor(
        public dialog: MatDialog
    ) {
    }


    public ngOnInit(): void {

        //  set disableClose to true to prevent user from closing modal by clicking outside it
        // TODO: Are these duplicate 'disableClose' properties both needed?
        this.dialogConfig.disableClose = true;

        //  Set config object to pass to child component
        this.dialogConfig.data = {
            serialNumber: this.serialNumber,
            newNoteNumber: this.newNoteNumber,
            disableClose: true
        };

        this.dialogConfig.panelClass = 'modal-standard';
    }


    /**
     * Opens note dialog and watches for dialog to close
     */
    public openDialog(): void {

        // open has second config option
        const dialogRef = this.dialog.open(NotesHistoryDialogComponent, this.dialogConfig);

        // Watching for dialog to close
        // Dialog closing will return whether a new note was succesfully added or not
        // If a new note was added incremement the note count
        dialogRef
            .afterClosed()
            .subscribe((wasSuccessful: boolean) => {
                if (wasSuccessful) {
                    this.newNoteNumber++;
                }
            });
    }
}

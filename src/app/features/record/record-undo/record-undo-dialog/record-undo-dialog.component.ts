import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IEcgCurrentEdit } from 'app/modules/ecg/interfaces';


@Component({
  selector: 'app-undo-confirmation-dialog',
  templateUrl: './record-undo-dialog.component.html',
  styleUrls: ['./record-undo-dialog.component.scss']
})
export class RecordUndoDialogComponent {

    constructor(@Inject(MAT_DIALOG_DATA) public data: {undoList: Array<IEcgCurrentEdit>}) {}

}

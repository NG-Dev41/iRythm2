import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { NotesService, INotesConfig } from 'app/modules/notes/service/notes.service';
import { QA_DATE_FORMAT } from 'app/commons/constants/common.const';
import {
    INote,
    IProcessDataRequest,
    IProcessDataResponse,
    ProcessDataDao,
    RequestTypeEnum
} from 'app/commons/services/dao/process-data-dao.service';

@Component({
    selector: 'app-notes-history',
    templateUrl: 'notes-history-dialog.component.html',
    styleUrls: ['./notes-history-dialog.component.scss'],
    providers: [
        NotesService,
        ProcessDataDao
    ]
})
export class NotesHistoryDialogComponent implements OnInit {
    public formControl = new FormControl('', [
        Validators.pattern('^(?!\\s*$).+'),
        Validators.required,
        Validators.maxLength(1000)
    ]);
    public form: FormGroup;
    public notes$: Observable<INote[]>;
    public newNote: INote;
    public ecgSerialNumber: string;
    public dateFormat: string = QA_DATE_FORMAT;

    public newNotesNumber: number;

    public constructor(
        public dialogRef: MatDialogRef<NotesHistoryDialogComponent>,
        public notesService: NotesService,
        @Inject(MAT_DIALOG_DATA) public dialogConfigData: INotesConfig
    ) { }

    public ngOnInit(): void {
        // Get serial number from dialogConfigData passed from parent component
        this.ecgSerialNumber = this.dialogConfigData.serialNumber;

        // get number of new notes from dialogConfigData passed from parent component
        this.newNotesNumber = this.dialogConfigData.newNoteNumber;

        // Call backend to get notes$ list; unwrap notes$ observable with asyncPipe in the template
        this.notes$ = this.notesService.makeNotesRequest({
            ecgSerialNumber: this.ecgSerialNumber,
            notesRequest: {
                requestType: RequestTypeEnum.READ
            }
        }).pipe(
            map(response => response.noteList),

            // catch any errors sent from the backend
            catchError((error: any) => {
                console.log('Error getting notes: ', error);
                return of([]);
            })
        );

        this.form = new FormGroup({
            note: this.formControl
        });
    }

    /**
     * Add Note to ecg serial number
     */
    public addNote(): any {

        // Get form value for content, hardcoded user, current date in EPOCH time
        this.newNote = {
            // trim submission to remove whitespaces before and after
            content: this.form.get('note')?.value.trim(),
            // hardcode user for now
            user: 'CurrentUser@irhythmtech.com'
        };

        // Prepare parameters for call to service
        const params: IProcessDataRequest = {
            ecgSerialNumber: this.ecgSerialNumber,
            notesRequest: {
                requestType: RequestTypeEnum.CREATE,
                noteList: [
                    this.newNote
                ]
            }
        };

        // Add new note to list
        this.notesService
            .makeNotesRequest(params)
            .subscribe((data: IProcessDataResponse) => {

                // If no errors - close dialog and let calling component know it was successful
                if (!data?.errorInfo?.hasError) {
                    // this.dialogRef.close(true);
                    this.close(true);
                }
            });
    }


    public close(result: boolean): void {
        this.dialogRef.close(result);
    }
}

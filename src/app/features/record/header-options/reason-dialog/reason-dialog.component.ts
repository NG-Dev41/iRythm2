import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UserDto } from 'app/commons/services/dtos/user-dto.service'
import { QueueDao, QueueAction, IQueueResponse } from 'app/features/queue/daos/queue-dao.service';


@Component({
    selector: 'app-reason-component',
    templateUrl: './reason-dialog.component.html',
    styleUrls: ['reason-dialog.component.scss']
})
export class ReasonDialogComponent implements OnInit {

    // Send Back to QA form
    public form: FormGroup;

    // List of reasons for send a record back to QA
    public reasons: string[] = [
        'Paroxysmal AF',
        'AV Block',
        'Too many arrhythmia episodes',
        'Too many misticked beats',
        'Other',
    ];


    public constructor(
        @Inject(MAT_DIALOG_DATA) public data: { serialNumber: string },
        private formBuilder: FormBuilder,
        private queueDao: QueueDao,
        private userDto: UserDto,
        private router: Router
    ) { }


    /**
     * Onit
     * Build out form / form controls
     */
    public ngOnInit(): void {

        // Init the form group
        this.form = this.formBuilder.group({
            reasonList: new FormArray([])
        });

        // Add form control dynamically to each reasonList checkbox
        this.reasons.forEach((reason: string) => {
            this.reasonsFormArray.push(new FormControl(false));
        });
    }


    /**
     * Processes a user submitting the form
     */
    public sendBack(): void {

        // Looping through all checkbox controls aka reasons
        // And adding to array if it's checked
        let checkedReasons: string[] = [];

        this.form.value.reasonList.forEach((isChecked: boolean, i: number) => {

            if(isChecked) {
                checkedReasons.push(this.reasons[i]);
            }
        });


        // Send request to 'Send Back to QA'
        this.queueDao
            .processQueue({
                user: this.userDto.id,
                ecgSerialNumber: this.data.serialNumber,
                queueAction: QueueAction.SEND_BACK_TO_QA_TOOL,
                reasonList: checkedReasons
            })
            .subscribe((response: IQueueResponse) => {

                // Route back to queue page
                this.router.navigate(['/queue']);
            });
    }


    /**
     * Convience method to get the reasonList FormArray control
     */
    public get reasonsFormArray() {
        return this.form.controls.reasonList as FormArray;
    }
}

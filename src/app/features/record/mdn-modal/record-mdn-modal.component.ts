import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { PriorityStatusEnum, RequestTypeEnum } from 'app/commons/services/dao/process-data-dao.service';
import { FormBuilder } from '@angular/forms';
import { IProcessDataResponse, ProcessDataDao } from 'app/commons/services/dao/process-data-dao.service';


@Component({
    selector: 'app-mdn-modal',
    templateUrl: './record-mdn-modal.component.html',
    styleUrls: ['./record-mdn-modal.component.scss']
})
export class RecordMdnModalComponent implements OnInit {

    public mdnReasons: string[] = [];

    // Object whose values are all booleans
    public mdnFormObject = {};

    public mdnCheckboxesObject = this.formBuilder.group({});


    /**
     * Ctor
     *
     * @param {string}    @Inject(MAT_DIALOG_DATA) public        data
     * @param {FormBuilder}                        private formBuilder
     * @param {ProcessDataDao}                     private processDataDao
     * @param {[type]}
     */
    public constructor(
        @Inject(MAT_DIALOG_DATA) public data: { serialNumber: string },
        private formBuilder: FormBuilder,
        private processDataDao: ProcessDataDao,
    ) { }


    /**
     * OnInit
     */
    public ngOnInit(): void {

        // Load the MDN reasons for a given serial number
        this.processDataDao.processDataRequest({
            ecgSerialNumber: this.data.serialNumber,
            priorityRequest: {
                requestType: RequestTypeEnum.READ
            }
        }).subscribe((res: IProcessDataResponse) => {

            // Set the mdn reasons string
            this.mdnReasons = res.priorityResponse?.mdnTypes;

            // Format the MDN reasons for dynamic form
            this.mdnFormObject = {};
            this.mdnReasons?.forEach((reason) => {
                this.mdnFormObject[reason] = false;
            });

            // Build dynamic form from MDN reasons
            this.mdnCheckboxesObject = this.formBuilder.group(this.mdnFormObject);
        });
    }


    /**
     * Sends reasons for marking record as MDN to backend
     */
    public submitMdnReasons(): void {

        // Gather the selected Mdn Reasons
        let mdnTypes = [];
        for(const mdnType in this.mdnCheckboxesObject.value) {
            if(this.mdnCheckboxesObject.value[mdnType]) {
                mdnTypes.push(mdnType);
            }
        }

        // Submit MDN reasons and change to backed
        this.processDataDao.processDataRequest({
            ecgSerialNumber: this.data.serialNumber,
            priorityRequest: {
                requestType: RequestTypeEnum.UPDATE,
                priorityStatus: PriorityStatusEnum.MD_NOTIFY,
                mdnTypes: mdnTypes
            }
        });

    }
}

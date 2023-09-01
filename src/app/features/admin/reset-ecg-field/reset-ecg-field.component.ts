import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { EcgResetDao } from '../services/daos/ecg-reset.dao';
import { GenericHttpResponse } from 'app/commons/constants/endpoint-url.const';
import { IAdminMessageType } from '../admin-form-message/admin-form-message.component';


@Component({
    selector: 'app-reset-ecg-field',
    templateUrl: './reset-ecg-field.component.html',
    styleUrls: ['./reset-ecg-field.component.scss'],
    providers: [EcgResetDao]
})
export class ResetEcgFieldComponent {

    @Input() public serialNumber = '';

    public responseData: GenericHttpResponse;

    public responseMessage = '';

    public responseMessageType: keyof typeof IAdminMessageType;

    private INVALID_DEVICE_STATE = 'SERIAL_NUMBER_INVALID_DEVICE_STATE';

    @ViewChild('f') public f: NgForm;


    /**
     * Ctor
     *
     * @param {EcgResetDao} private ecgResetDao
     */
    public constructor(private ecgResetDao: EcgResetDao) { }


    /**
     * Sends a post request to reset the ECG strip with the given serial number
     * @param ecgSerialNumber
     * @private
     */
    private postEcgReset(ecgSerialNumber: string) {

        this.ecgResetDao
            .resetEcg({ecgSerialNumber: ecgSerialNumber})
            .subscribe((response: GenericHttpResponse) => {

                // Set response data for later use
                this.responseData = response;
                if(response.errorInfo.hasError) {
                   this.responseMessageType = IAdminMessageType.ERROR;
                   this.responseMessage = `Error: ${response.errorInfo.errorRecordList[0].errorCode}`;

                   if(response.errorInfo.errorRecordList[0].errorCode === this.INVALID_DEVICE_STATE) {
                       this.responseMessage = `${this.responseMessage} -> ${response.errorInfo.errorRecordList[0].throwableMessage.split("=")[1]}`;
                    }
                } else {
                    this.responseMessageType = IAdminMessageType.SUCCESS;
                    this.responseMessage = 'ECG Reset request successful';
                }
            },
            (error: HttpErrorResponse) => {
                this.responseMessageType = IAdminMessageType.ERROR;
                this.responseMessage = `Error: ${error.message}`
            });
    }


    /**
     * Sends reset ECG post request to server
     * @param f
     */
    public resetEcg(f: NgForm): void {
        this.postEcgReset(f.value.serialNumber);
    }


    /**
     * Resets the response message and response message type, hiding the admin form message
     */
    public resetMessage() : void {
        this.responseMessage = "";
        this.responseMessageType = null;
    }

}

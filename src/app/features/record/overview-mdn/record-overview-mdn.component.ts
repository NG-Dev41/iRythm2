import { Component, OnInit } from '@angular/core';

import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { IInfoListCardConfig } from 'app/modules/mdn/info-list-card/info-list-card.component';


/**
 * Record Overiew component.
 */
@Component({
    selector: 'app-record-overview-mdn',
    templateUrl: './record-overview-mdn.component.html',
    styleUrls: ['./record-overview-mdn.component.scss']
})
export class RecordOverviewMdnComponent implements OnInit {

    // Config for patient card
    public patientCardConfig: IInfoListCardConfig = {
        title: 'Patient Information',
        iconName: 'icon-mdn-patient-info',
        rowCount: 3,
        data: []
    };

    // Config for account card
    public accountCardConfig: IInfoListCardConfig = {
        title: 'Account & Location Information',
        iconName: 'icon-mdn-account-info',
        rowCount: 4,
        data: []
    };

    /**
     * Ctor
     */
    public constructor(
        public recordDto: RecordDto
    ) {}


    /**
     * OnInit
     */
    public ngOnInit(): void {

        // Grab patient info from the recordDTO and convert to data format for InfoListCardComponent
        let patientInfoDto = this.recordDto.patientInfo;
        this.patientCardConfig.data = [
            {
                key: 'Age',
                val: `${patientInfoDto.age} years`
            },
            {
                key: 'Indication',
                val: patientInfoDto.primaryIndication,
                boldedRow: true
            },
            {
                key: 'Patient Notes',
                val: patientInfoDto.relevantInfo
            }
        ];

        // Grab account info from the recordDTO and convert to data format for InfoListCardComponent
        let accountInfoDto = this.recordDto.accountInfo;
        this.accountCardConfig.data = [
            {
                key: 'Account',
                val: accountInfoDto.account
            },
            {
                key: 'Location',
                val: accountInfoDto.location
            },
            {
                key: 'Notification Method',
                val: accountInfoDto.notificationMethod
            },
            {
                key: 'Ectopy Reporting Req',
                val: accountInfoDto.ectopyVeReportingRequired ? 'Yes' : 'No'
            },
            {
                key: 'Location Notes',
                val: accountInfoDto.location,
                boldedRow: true
            },
            {
                key: 'Prescribing Provider',
                val: `${accountInfoDto.prescribingProviderFirstName} ${accountInfoDto.prescribingProviderLastName}`
            },
            {
                key: 'Prescribing Provider Notes',
                val: accountInfoDto.prescribingProviderNotes
            },
        ];

    }
}

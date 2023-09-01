import { Component, OnInit } from '@angular/core';

import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';

@Component({
    selector: 'app-patch-notification-table',
    templateUrl: './patch-notification-table.component.html',
    styleUrls: ['./patch-notification-table.component.scss']
})
export class PatchNotificationTableComponent implements OnInit {
    public patchNotificationCriteria: IPatchNotificationRow[] = [];
    public displayedColumns = ['arrhythmiaType', 'criteria', 'notification', 'detectedReason'];

    constructor(public recordDto: RecordDto) {
    }

    ngOnInit(): void {
        let criteria: IPatchNotificationRow[] = [];
        let patchInfo = this.recordDto.patchInfo;

        // Convert patchInfo into array of table rows to be iterated over to create the Patch Notification Table
        // TODO: Does this need to reload dynamically ever? If so, needs to be moved to seperate function

        // Wide QRS
        criteria.push(
            this.buildTableRow({
                arrythmiaType: 'Wide QRS Tachycardia',
                criteriaStringInfo: {
                    minHR: patchInfo.wideQrsMinHr,
                    minDuration: patchInfo.wideQrsMinDuration,
                    notifyInfo: 'Notify monomorphic VT, polymorphic VT and VF'
                },
                notificationType: patchInfo.wideQrsNotificationType,
                detected: patchInfo.wideQrsDetected,
                detectedReason: patchInfo.wideQrsDetectedReason,
                bolded: patchInfo.wideQrsUnique
            })
        );

        // Complete Heart Block (AVB3)
        criteria.push(
            this.buildTableRow({
                arrythmiaType: 'Complete Heart Block',
                criteriaStringInfo: {},
                notificationType: patchInfo.avb3NotificationType,
                detected: patchInfo.avb3Detected,
                detectedReason: patchInfo.avb3DetectedReason,
                bolded: patchInfo.avb3Unique
            })
        );

        // AVB2
        criteria.push(
            this.buildTableRow({
                arrythmiaType: 'Symptomatic 2nd degree Heart Block, Mobitz II',
                criteriaStringInfo: {},
                notificationType: patchInfo.avb2NotificationType,
                detected: patchInfo.avb2Detected,
                detectedReason: patchInfo.avb2DetectedReason,
                bolded: patchInfo.avb2Unique
            })
        );

        // Pause
        criteria.push(
            this.buildTableRow({
                arrythmiaType: 'Pause',
                criteriaStringInfo: {
                    minHR: patchInfo.pauseMinDuration
                },
                notificationType: patchInfo.pauseNotificationType,
                detected: patchInfo.pauseDetected,
                detectedReason: patchInfo.pauseDetectedReason,
                bolded: patchInfo.pauseUnique
            })
        );

        // Symptomatic Bradycardia
        criteria.push(
            this.buildTableRow({
                arrythmiaType: 'Symptomatic Bradycardia',
                criteriaStringInfo: {
                    maxHR: patchInfo.bradyMaxHr,
                    minDuration: patchInfo.bradyMinDuration,
                    notifyInfo: 'Notify for Symptomatic AND Asymptomatic Bradycardia'
                },
                notificationType: patchInfo.bradyNotificationType,
                detected: patchInfo.bradyDetected,
                detectedReason: patchInfo.bradyDetectedReason,
                bolded: patchInfo.bradyUnique
            })
        );

        // AF/Flutter
        criteria.push(
            this.buildTableRow({
                arrythmiaType: 'AF/Flutter',
                criteriaStringInfo: {
                    minHR: patchInfo.afMinHr,
                    maxHR: patchInfo.afMaxHr,
                    minDuration: patchInfo.afMinDuration
                },
                notificationType: patchInfo.afNotificationType,
                detected: patchInfo.afDetected,
                detectedReason: patchInfo.afDetectedReason,
                bolded: patchInfo.afUnique
            })
        );

        // Narrow QRS Tachycardia (SVT)
        criteria.push(
            this.buildTableRow({
                arrythmiaType: 'Narrow QRS Tachycardia',
                criteriaStringInfo: {
                    minHR: patchInfo.svtMinHr,
                    minDuration: patchInfo.svtMinDuration
                },
                notificationType: patchInfo.svtNotificationType,
                detected: patchInfo.svtDetected,
                detectedReason: patchInfo.svtDetectedReason,
                bolded: patchInfo.svtUnique
            })
        );

        this.patchNotificationCriteria = criteria;
    }

    /**
     * Converts patch notification criteria into a table row for the Patch Notification Criteria Table
     * @param criteria
     * @private
     */
    private buildTableRow(
        criteria: {
            arrythmiaType: string,
            criteriaStringInfo: ICriteriaString,
            notificationType: string,
            detected: boolean,
            detectedReason?: string,
            bolded: boolean
        }): IPatchNotificationRow {
        let tableRow: IPatchNotificationRow;

        // Wide QRS
        tableRow = {
            arrhythmiaType: criteria.arrythmiaType,
            criteria: this.buildCriteriaString(criteria.criteriaStringInfo),
            notification: criteria.notificationType,
            bolded: criteria.bolded
        };

        if(criteria.detected) {
            tableRow.detectedReason = criteria.detectedReason;
        }

        return tableRow;
    }

    /**
     * Builds the string for the Criteria column of the Patch Notification Criteria Table
     * @param criteriaStringInfo
     * @private
     */
    private buildCriteriaString(criteriaStringInfo: ICriteriaString): string {
        let criteriaString: string = ``;

        if(criteriaStringInfo.maxHR && criteriaStringInfo.minHR) {
            criteriaString = criteriaString + `Avg HR <${criteriaStringInfo.maxHR} bpm or >${criteriaStringInfo.minHR} bpm`;
        } else if(criteriaStringInfo.minHR) {
            criteriaString = criteriaString + `>${criteriaStringInfo.minHR} bpm`;
        } else if(criteriaStringInfo.maxHR) {
            criteriaString = criteriaString + `<${criteriaStringInfo.maxHR} bpm`;
        }

        if(criteriaStringInfo.minDuration) {
            criteriaString = criteriaString + `, sustained for > ${criteriaStringInfo.minDuration} sec`;
        }

        if(criteriaStringInfo.notifyInfo) {
            criteriaString = criteriaString + `. ${criteriaStringInfo.notifyInfo}`;
        }

        return criteriaString;
    }

}

export interface ICriteriaString {
    minHR?: number,
    maxHR?: number,
    minDuration?: number,
    notifyInfo?: string
}

export interface IPatchNotificationRow {
    arrhythmiaType: string,
    criteria: string,
    notification: string,
    detectedReason?: string
    bolded?: boolean
}

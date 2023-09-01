import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { ApproveReportModalComponent } from './approve-report-modal/approve-report-modal/approve-report-modal.component';
import { RecordDto } from '../services/dtos/record-dto.service';
import { UserDto } from 'app/commons/services/dtos/user-dto.service';
import { ProcessReportDao, IProcessReportRequest, ReportActionType, IProcessReportResponse } from 'app/commons/services/dao/process-report-dao.service';
import { filter, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-record-approve-report',
    templateUrl: './approve-report.component.html',
    styleUrls: [ './approve-report.component.scss' ]
})
export class ApproveReportComponent {

	public constructor(
        private recordDto: RecordDto,
        private dialog: MatDialog,
        private user: UserDto,
        private reportDao: ProcessReportDao,
        private router: Router
    ) { }

    openRecordApproveModal(): void {
        const dialogRef = this.dialog.open(ApproveReportModalComponent, {
            panelClass: ['modal-standard', 'modal-content-no-scroll']
        });
        dialogRef
            .afterClosed()
            .pipe(
                // approveRequested means they confirmed the approval within the dialog
                filter((approveRequested: boolean) => approveRequested),
                switchMap(() => {
                    const approveReportRequestPayload: IProcessReportRequest = {
                        ecgSerialNumber: this.recordDto.serialNumber,
                        reportAction: ReportActionType.APPROVE,
                        user: this.user.id
                    };
                    return this.reportDao.processReportRequest(approveReportRequestPayload);
                })
            )
            .subscribe((result: IProcessReportResponse) => {
                if (!result.reportInfo.errorList?.length) {
                    // fromSerial param gets checked for in the queue component to show a snackbar confirming the approval
                    this.router.navigate(['/queue'], { queryParams: { fromSerial: this.recordDto.serialNumber } });
                } else {
                    // Error handling needed
                }
            });
    }

    openPdfNewTab(): void {
        const pdfEncodedUrl = encodeURI(this.recordDto.reportUrl);
        const url = this.router.serializeUrl(this.router.createUrlTree(['pdf-view', this.recordDto.serialNumber], { queryParams: { reportUrl: pdfEncodedUrl }}));
        window.open(url, '_blank');
    }
}

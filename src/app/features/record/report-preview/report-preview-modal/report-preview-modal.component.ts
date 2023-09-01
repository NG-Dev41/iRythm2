import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NavigationStart, Router } from '@angular/router';
import { ErrorCode } from 'app/commons/enums/error-codes.enum';

import { IReportError } from 'app/commons/services/dao/process-report-dao.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';


@Component({
	selector: 'app-report-preview-modal',
	templateUrl: './report-preview-modal.component.html',
	styleUrls: ['./report-preview-modal.component.scss']
})
export class ReportPreviewModalComponent implements OnInit, OnDestroy {

    private routerSubscription: Subscription;

    //Used to map errorValueMap errorCode values to display values w/ getDisplayData
    errorCodeToDisplayKeyMap = {
        "FINDINGS_EXCESS_CHAR_ERROR": "FINDING_EXTRA_CHARACTERS_COUNT",
        "EVENT_CHART_ERROR": "TRIGGERS_AND_DIARIES_CURRENT_COUNT",
        "FINDINGS_INVALID_DATA_ERROR": "INVALID_STRINGS_IN_FINDINGS"
    }
    
    constructor(
        private dialogRef: MatDialogRef<ReportPreviewModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { errorList?: Array<IReportError>, warningList?: Array<IReportError> },
        private router: Router
    ) {}

    public ngOnInit(): void {
        this.routerSubscription = this.router.events
            .pipe(
                filter((event) => event instanceof NavigationStart)
            )
            .subscribe(() => {
                this.dialogRef.close();
            });


    }

    public ngOnDestroy(): void {
        this.routerSubscription?.unsubscribe();
    }

    // Clicking 'Proceed as is' button will proceed with overrides of warnings
    public proceedWithReportGeneration(): void {
        this.dialogRef.close(true);
    }

    //Extra display values that get shimmed into translation strings if the string requires data
    public getDisplayData(error: IReportError): string {
        //Extract the key from error.errorCode that corresponds to the errorValueMap key using our mapper object
        // Note not all errorValueMap values are represented in the mapper, this is just for the single value ones we insert into the display string

        const mappedErrorCodeKey = this.errorCodeToDisplayKeyMap[error.errorCode];
        
        if (mappedErrorCodeKey) {
            //Use the key from the mapping to find the value in errorValueMap
            return error.errorValueMap[mappedErrorCodeKey];
        }
    }

    public getInvalidFindingsList(error: IReportError): string[] {
        if (error.errorCode === ErrorCode.FINDINGS_INVALID_DATA_ERROR) {
            return error.errorValueMap["INVALID_STRINGS_IN_FINDINGS"].split(',');
        }
    }
}

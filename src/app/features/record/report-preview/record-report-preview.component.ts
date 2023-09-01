import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { filter, switchMap } from 'rxjs/operators';

import { ProcessDataDao, IProcessDataResponse, FindingActionsType, IFinding } from 'app/commons/services/dao/process-data-dao.service';
import { EcgEditDao } from 'app/modules/ecg/services/daos/ecg-edit/ecg-edit-dao.service';
import { IEcgEditResponse } from 'app/modules/ecg/interfaces/ecg-dao.interface';
import { EcgRhythmTypeEdit } from 'app/modules/ecg/enums';
import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { UserDto } from 'app/commons/services/dtos/user-dto.service';
import { ProcessReportDao, ReportActionType, IProcessReportResponse, IProcessReportRequest, IReportError } from 'app/commons/services/dao/process-report-dao.service';
import { ReportPreviewModalComponent } from './report-preview-modal/report-preview-modal.component';
import { of, throwError } from 'rxjs';
import { RecordChannelKey, RecordReportChannelAction } from '../services/enums';
import { RecordNotifier } from '../services/notifiers/record-notifier.service';
import { RhythmType } from 'app/commons/constants/rhythms.const';
import { ErrorCode } from 'app/commons/enums/error-codes.enum';
import { RecordNavigationKey } from '../services/enums/record-navigation.enum';
import { LoadingSpinnerService } from 'app/commons/services/loading-spinner/loading-spinner.service';


/**
 * Record Overiew component.
 */
@Component({
	selector: 'app-record-report-preview',
	templateUrl: './record-report-preview.component.html',
	styleUrls: ['./record-report-preview.component.scss']
})
export class RecordReportPreviewComponent implements OnInit {

	private readonly AUTO_FINDINGS_TRANSLATE_PREFIX: string = 'report.findings.auto.';
	public sanitizedUrl: SafeResourceUrl;
	
	/**
	 * Ctor
	 */
	public constructor(
		public recordDto: RecordDto,
		private processDataDao: ProcessDataDao,
		private editDao: EcgEditDao,
		private reportDao: ProcessReportDao,
		private userDto: UserDto,
		private domSanitizer: DomSanitizer,
		private translateService: TranslateService,
		private dialog: MatDialog,
		private recordNotifier: RecordNotifier,
		private loadingSpinnerService: LoadingSpinnerService
	) {}


	/**
	 * OnInit
	 */
	public ngOnInit(): void {
		this.recordDto.reportUrl = null;

		this.processDataDao.processDataRequest({
				ecgSerialNumber: this.recordDto.serialNumber,
				findingsRequest: {
					findingRequestItemList: [{
						findingsActionType: FindingActionsType.OBTAIN_FINDINGS
					}]
				}
			})
			.pipe(
				switchMap((obtainFindingsData: IProcessDataResponse) => {
					// Process response data from obtain findings request

					// Loop over the findingList property and extract all findings strings
					// that match the key property provided in the findingList
					if (obtainFindingsData.findingsResponse?.reportFindings?.findingList) {
						// Findings string that all findings will be concatenated to
						// This is ultimately used to populate the endpoint legacyMacroForm prop and sent to the backend
						let finalFindings: string = '';
						let findingKeyArray: string[] = obtainFindingsData.findingsResponse.reportFindings.findingList.map((finding: IFinding) => { 
							return this.AUTO_FINDINGS_TRANSLATE_PREFIX + finding.key
						});

						return this.translateService.get(findingKeyArray).pipe(
							switchMap((result) => {
								let results: string[] = Object.values<string>(result);
								finalFindings = results.join(' ');

								return this.processDataDao.processDataRequest({
									ecgSerialNumber: this.recordDto.serialNumber,
									findingsRequest: {
										legacyMacroForm: finalFindings
									}
								});
							})
						);
					} else {
						return throwError('Finding list not available');
					}
				}),
				switchMap((macroFormData: IProcessDataResponse) => {
					// Method of loadingSpinnerService to display the loading spinner with custom message.
					this.loadingSpinnerService.show('Edits are being saved...');
					// Read strips with ADDITIONAL_STRIP_AUTO_CREATE via write/edit
					return this.editDao.edit({
						ecgSerialNumber: this.recordDto.serialNumber,
						ecgRangeEditList: [{
							rhythmTypeEdit: EcgRhythmTypeEdit.ADDITIONAL_STRIP_AUTO_CREATE,
							paintModeEdit: false
						}]
					});
				}),
				switchMap((editData: IEcgEditResponse) => {
					// Method of loadingSpinnerService to hide the loading spinner.
					this.loadingSpinnerService.hide();
					// If response containing savedAdditionalStrips and newlyGeneratedAdditionalStrips differ, make a call to write
					// newlyGeneratedAdditionalStrips using ADDITIONAL_STRIP_UPDATE (should only happen if you change something)

					// Finally call preview report with all override flags set to true
					return this.reportDao.processReportRequest({
						ecgSerialNumber: this.recordDto.serialNumber,
						reportAction: ReportActionType.PREVIEW,
						user: this.userDto.id
					});
				}),
				switchMap((reportData: IProcessReportResponse) => {
					// if warnings or errors (warningList, errorList), pop modal before proceeding
					// pass in errorList and warningList

					if (reportData.reportInfo.errorList || reportData.reportInfo.warningList) {

						this.populateNavQualityChecks(reportData.reportInfo.errorList, reportData.reportInfo.warningList)

						return this.dialog.open(ReportPreviewModalComponent, {
							panelClass: ['modal-standard', 'modal-content-no-scroll'],
							// backdrop-allow-nav class shifts the backdrop so that it doesn't cover the left sidebar
							backdropClass: ['backdrop-allow-nav', 'cdk-overlay-dark-backdrop'],
							// disableClose stops all inputs from closing
							// we override this just for the nav links in the modal component
							disableClose: true,
							data: {
								errorList: reportData.reportInfo.errorList,
								warningList: reportData.reportInfo.warningList
							}
						}).afterClosed().pipe(
							// proceedWithReportGeneration means they hit 'Proceed as is' within the dialog
							// so we make the preview request again w/ override flags
							filter((proceedWithReportGeneration: boolean) => proceedWithReportGeneration),
							switchMap(() => {
								const previewRequestPayload: IProcessReportRequest = {
									ecgSerialNumber: this.recordDto.serialNumber,
									reportAction: ReportActionType.PREVIEW,
									user: this.userDto.id,
									reportWarningIgnoreList: ["ALL"]
								};
								return this.reportDao.processReportRequest(previewRequestPayload);
							})
						);
					} else {
						return of(reportData);
					}
				})
			)
			.subscribe((reportData: IProcessReportResponse) => {
				// Finally have the report url - sanitize and set for template
				if (reportData.reportInfo.url) {
					//Save off the URL to recordDto as a string
					this.recordDto.reportUrl = reportData.reportInfo.url;
					//Sanitize the url
					this.sanitizedUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(reportData.reportInfo.url);
					this.recordNotifier.send(RecordChannelKey.REPORT_ACTION, { action: RecordReportChannelAction.REPORT_GENERATED });
				}
			});
	}

	// Maps quality check errors to nav locations and sends a notifier that's received in RecordNavigationComponent to display error icons
	private populateNavQualityChecks(errorList?: IReportError[], warningList?: IReportError[]): void {
        //error and warning locations are kept separate as they have different visual indicators on the navbar (error = red, warning = yellow)
        let errorNavLocations = [];
        let warningNavLocations = [];
		errorNavLocations = errorList ? this.getNavLocations(errorList) : null;
		warningNavLocations = warningList ? this.getNavLocations(warningList) : null;

        this.recordNotifier.send(
            RecordChannelKey.REPORT_ACTION, {
            action: RecordReportChannelAction.REPORT_QUALITY_CHECK_FAILURE,
            qualityCheckWarnings: warningNavLocations,
            qualityCheckErrors: errorNavLocations
        });
	}

	// Returns all locations quality checks have failed (could be one of two types depending if it's a rhythm subnav item or a top level nav item)
	private getNavLocations(list: Array<IReportError>): (RecordNavigationKey | RhythmType)[] {
		// Location that each error/warning should highlight in the sidebar
		let navLocations: any[] = [];
		list.forEach((error: IReportError) => {
			switch (error.errorCode) {
				//These 2 locations are dynamic based on the rhythm type that the error is present in, could be multiple
				case ErrorCode.NON_PAUSE_LOW_HR_ERROR:
				case ErrorCode.MAX_HR_EXCEEDED:
					//The dynamic rhythm values come from BE as comma delimited lists so we convert to array
					for (const key in error.errorValueMap) {
						const splitList = error.errorValueMap[key].split(',');
						splitList.forEach((location: RhythmType) => {
							navLocations.push(location);
						});
					}
					break;
				case ErrorCode.VT_AVG_HR_LOW_ERROR:
					navLocations.push(RhythmType.VT);
					break;
				case ErrorCode.FINDINGS_EXCESS_CHAR_ERROR:
				case ErrorCode.FINDINGS_INVALID_DATA_ERROR:
				case ErrorCode.FINDINGS_VALIDATION_ERROR:
				case ErrorCode.MDN_STATEMENT_ERROR:
				case ErrorCode.ADDITIONAL_STRIPS_NOT_FOUND:
				case ErrorCode.FINDINGS_NOT_FOUND:
				case ErrorCode.INCOMPLETE_MDN_STATEMENT:
				case ErrorCode.UNSAVED_PRELIMINARY_FINDINGS:
				case ErrorCode.UNSAVED_ADDITIONAL_STRIPS:
				case ErrorCode.MDN_PRIORITY_ERROR:
					navLocations.push(RecordNavigationKey.REPORT_PREP);
					break;
				case ErrorCode.EVENT_CHART_ERROR:
					navLocations.push(RecordNavigationKey.EVENT_CHART);
					break;
				case ErrorCode.AF_EPISODE_DURATION_ERROR:
					navLocations.push(RhythmType.AFIB);
					break;
				case ErrorCode.SVT_AVG_HR_LOW_ERROR:
					navLocations.push(RhythmType.SVT);
					break;
				case ErrorCode.AF_BURDEN_ERROR:
					navLocations.push(RhythmType.BIGEMINY);
					navLocations.push(RhythmType.TRIGEMINY);
					navLocations.push(RecordNavigationKey.RATES);
					break;
				default:
					break;
			}
		});
		//Set used to de-dupe the array values
		return [...new Set(navLocations)];
	}
}

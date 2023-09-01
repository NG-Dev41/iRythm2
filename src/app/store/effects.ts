import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState, IFindingsState } from './state';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import {
    addFindingAction,
    deleteFindingAction,
    retrieveFindingsAction,
    setFindingsAction,
    updateFindingAction,
} from './actions';
import { selectPreviousFindings } from './selectors';
import {
    FindingActionsType,
    FindingsType,
    IFinding,
    IProcessDataResponse,
    ProcessDataDao,
} from 'app/commons/services/dao/process-data-dao.service';
import { TranslateService } from '@ngx-translate/core';
import { IRHYTHM_COLORS } from 'app/commons/enums/common.enum';
import { PageChannelKey, PageNotifier } from 'app/commons/services/notifiers/page-notifier.service';
import { IHeaderNotifyAction } from 'app/commons/interfaces/channel.interface';


@Injectable()
export class FindingsEffects {
    constructor(
        private actions$: Actions,
        private processDataDao: ProcessDataDao,
        private store: Store<IAppState>,
        private translateService: TranslateService,
        private pageNotifier: PageNotifier
    ) {}

    private readonly AUTO_FINDINGS_TRANSLATE_PREFIX: string = 'report.findings.auto';


    public deleteFinding$  = createEffect(() =>
        this.actions$.pipe(
            ofType(deleteFindingAction),
            switchMap(action => this.processDataDao.processDataRequest({
                ecgSerialNumber: action.serialNumber,
                findingsRequest: {
                    findingRequestItemList: [
                        {
                            findingsActionType: FindingActionsType.DELETE,
                            findingList: [{
                                key: action.key,
                                findingsType: FindingsType.USER_DEFINED
                            }]
                        },
                    ],
                },
            }).pipe(
                map(retrievedFindings => {

                    const findingsList: Array<IFinding> = new Array<IFinding>();
                    let rawServerResponse = '';
                    let listHasUserDefinedFindings = false;

                    const newFindingsState: IFindingsState = {
                        serialNumber: null,
                        rawServerResponse: null,
                        findingsList: null,
                        keyValueMap: null
                    };

                    // Making sure we have some findings data before continuing
                    if (retrievedFindings.findingsResponse?.reportFindings?.findingList) {

                        // set the raw response here before any manipulation
                        rawServerResponse = JSON.stringify(retrievedFindings.findingsResponse.reportFindings);

                        // Get all report.findings translations
                        this.translateService.get(this.AUTO_FINDINGS_TRANSLATE_PREFIX).subscribe((translations) => {
                            // Loop over findings returned from the API
                            retrievedFindings.findingsResponse.reportFindings.findingList.forEach(
                                (finding: IFinding) => {
                                    if (finding.findingsType === FindingsType.USER_DEFINED) {
                                        listHasUserDefinedFindings = true;
                                    }
                                    // Set the raw description still containing the replacement keys
                                    if (finding.findingsType === FindingsType.AUTO_GENERATED) {
                                        finding.content = translations[finding.key];
                                    }

                                    // Add updated finding to our array, and they're ready for the template
                                    findingsList.push(finding);
                                }
                            );

                            // set all the prepared data into the list to be used by the component
                            newFindingsState.findingsList = findingsList;
                            newFindingsState.keyValueMap = retrievedFindings.findingsResponse.reportFindings.keyValueMap;
                            newFindingsState.rawServerResponse = rawServerResponse;
                            newFindingsState.serialNumber = action.serialNumber;
                        });
                    }
                    return setFindingsAction({ findings: newFindingsState });
                }),
                catchError(() => EMPTY)

            )
            )));

    public addFinding$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addFindingAction),
	        withLatestFrom(this.store.select(selectPreviousFindings)),
            switchMap(([action, previousFindings]) => this.processDataDao.processDataRequest({
                ecgSerialNumber: action.serialNumber,
                findingsRequest: {
                    findingRequestItemList: [
                        {
                            findingsActionType: FindingActionsType.CREATE,
                            findingList: [{
                                key: action.key,
                                content: action.content,
                                findingsType: FindingsType.USER_DEFINED,
	                            sequence: previousFindings.findingsList[previousFindings.findingsList.length - 1].sequence
                            }]
                        },
                    ],
                },
            }).pipe(
                map(retrievedFindings => {

                    const findingsList: Array<IFinding> = new Array<IFinding>();
                    let rawServerResponse = '';
                    let listHasUserDefinedFindings = false;

                    const newFindingsState: IFindingsState = {
                        serialNumber: null,
                        rawServerResponse: null,
                        findingsList: null,
                        keyValueMap: null
                    };

                    // Making sure we have some findings data before continuing
                    if (retrievedFindings.findingsResponse?.reportFindings?.findingList) {

                        // set the raw response here before any manipulation
                        rawServerResponse = JSON.stringify(retrievedFindings.findingsResponse.reportFindings);

                        // Get all report.findings translations
                        this.translateService.get(this.AUTO_FINDINGS_TRANSLATE_PREFIX).subscribe((translations) => {
                            // Loop over findings returned from the API
                            retrievedFindings.findingsResponse.reportFindings.findingList.forEach(
                                (finding: IFinding) => {
                                    if (finding.findingsType === FindingsType.USER_DEFINED) {
                                        listHasUserDefinedFindings = true;
                                    }
                                    // Set the raw description still containing the replacement keys
                                    if (finding.findingsType === FindingsType.AUTO_GENERATED) {
                                        finding.content = translations[finding.key];
                                    }

                                    // Add updated finding to our array, and they're ready for the template
                                    findingsList.push(finding);
                                }
                            );

                            // set all the prepared data into the list to be used by the component
                            newFindingsState.findingsList = findingsList;
                            newFindingsState.keyValueMap = retrievedFindings.findingsResponse.reportFindings.keyValueMap;
                            newFindingsState.rawServerResponse = rawServerResponse;
                            newFindingsState.serialNumber = action.serialNumber;
                        });
                    }
                    return setFindingsAction({ findings: newFindingsState });
                }),
                catchError(() => EMPTY)

            )
            )));

    public updateFindingBackend$ = createEffect(() =>
        this.actions$.pipe(
            ofType(updateFindingAction),
            switchMap(action => this.processDataDao.processDataRequest({
                ecgSerialNumber: action.serialNumber,
                findingsRequest: {
                    findingRequestItemList: [
                        {
                            findingsActionType: FindingActionsType.UPDATE,
                            findingList: [{
                                key: action.key,
                                content: action.content,
                                findingsType: FindingsType.USER_DEFINED
                            }]
                        },
                    ],
                },
            }).pipe(
                map(retrievedFindings => {

                    const findingsList: Array<IFinding> = new Array<IFinding>();
                    let rawServerResponse = '';
                    let listHasUserDefinedFindings = false;

                    const newFindingsState: IFindingsState = {
                        serialNumber: null,
                        rawServerResponse: null,
                        findingsList: null,
                        keyValueMap: null
                    };

                    // Making sure we have some findings data before continuing
                    if (retrievedFindings.findingsResponse?.reportFindings?.findingList) {

                        // set the raw response here before any manipulation
                        rawServerResponse = JSON.stringify(retrievedFindings.findingsResponse.reportFindings);

                        // Get all report.findings translations
                        this.translateService.get(this.AUTO_FINDINGS_TRANSLATE_PREFIX).subscribe((translations) => {
                            // Loop over findings returned from the API
                            retrievedFindings.findingsResponse.reportFindings.findingList.forEach(
                                (finding: IFinding) => {
                                    if (finding.findingsType === FindingsType.USER_DEFINED) {
                                        listHasUserDefinedFindings = true;
                                    }
                                    // Set the raw description still containing the replacement keys
                                    if (finding.findingsType === FindingsType.AUTO_GENERATED) {
                                        finding.content = translations[finding.key];
                                    }

                                    // Add updated finding to our array, and they're ready for the template
                                    findingsList.push(finding);
                                }
                            );

                            // set all the prepared data into the list to be used by the component
                            newFindingsState.findingsList = findingsList;
                            newFindingsState.keyValueMap = retrievedFindings.findingsResponse.reportFindings.keyValueMap;
                            newFindingsState.rawServerResponse = rawServerResponse;
                            newFindingsState.serialNumber = action.serialNumber;
                        });
                    }
                    return setFindingsAction({ findings: newFindingsState });
                }),
                catchError(() => EMPTY)

            )
            )));


    public retrieveFindings$ = createEffect(() =>
        this.actions$.pipe(
            ofType(retrieveFindingsAction),
            withLatestFrom(this.store.select(selectPreviousFindings)),
            switchMap(([action, previousFindings]) =>
                // Make request to obtain Findings
                this.processDataDao
                    .processDataRequest({
                        ecgSerialNumber: action.serialNumber,
                        findingsRequest: {
                            findingRequestItemList: [
                                {
                                    findingsActionType: FindingActionsType.OBTAIN_FINDINGS,
                                },
                            ],
                        },
                    })
                    .pipe(
                        map((retrievedFindings: IProcessDataResponse) => {

                            const findingsList: Array<IFinding> = new Array<IFinding>();
                            let rawServerResponse = '';
                            let listHasUserDefinedFindings = false;

                            const newFindingsState: IFindingsState = {
                                serialNumber: null,
                                rawServerResponse: null,
                                findingsList: null,
	                            keyValueMap: null
                            };

                            // Making sure we have some findings data before continuing
                            if (retrievedFindings.findingsResponse?.reportFindings?.findingList) {

                                // set the raw response here before any manipulation
                                rawServerResponse = JSON.stringify(retrievedFindings.findingsResponse.reportFindings);

                                // Get all report.findings translations
                                this.translateService.get(this.AUTO_FINDINGS_TRANSLATE_PREFIX).subscribe((translations) => {
                                    // Loop over findings returned from the API
                                    retrievedFindings.findingsResponse.reportFindings.findingList.forEach(
                                        (finding: IFinding) => {
                                            if (finding.findingsType === FindingsType.USER_DEFINED) {
                                                listHasUserDefinedFindings = true;
                                            }
                                            // Set the raw description still containing the replacement keys
	                                        if (finding.findingsType === FindingsType.AUTO_GENERATED) {
                                                finding.content = translations[finding.key];
	                                        }

                                            // Add updated finding to our array, and they're ready for the template
                                            findingsList.push(finding);
                                        }
                                    );

                                    // if we have previously retrieved findings for this serialNumber, and they have changed
                                    // since the last retrieval we will show a warning
                                    if (
                                        previousFindings.serialNumber === action.serialNumber &&
                                        previousFindings.rawServerResponse !== rawServerResponse
                                    ) {
                                        let notificationText = 'report.notifications.findings-updated';

                                        if (listHasUserDefinedFindings) {
                                            notificationText = 'report.notifications.findings-updated-manual-warning ';
                                        }

                                        this.pageNotifier.send(PageChannelKey.HEADER_NOTIFY, {
                                            action: IHeaderNotifyAction.ADD,
                                            snackbars: [
                                                {
                                                    text: notificationText,
                                                    textColor: IRHYTHM_COLORS.GREY,
                                                    backgroundColor: IRHYTHM_COLORS.WARNING_YELLOW_BG,
                                                    shouldHaveCloseButton: true,
                                                },
                                            ],
                                        });
                                    }

                                    // set all the prepared data into the list to be used by the component
                                    newFindingsState.findingsList = findingsList;
                                    newFindingsState.keyValueMap = retrievedFindings.findingsResponse.reportFindings.keyValueMap;
                                    newFindingsState.rawServerResponse = rawServerResponse;
                                    newFindingsState.serialNumber = action.serialNumber;
                                });
                            }
                            return setFindingsAction({ findings: newFindingsState });
                        }),
                        catchError(() => of({ type: 'Findings Retrieval Error' }))
                    )
            )
        )
    );
}

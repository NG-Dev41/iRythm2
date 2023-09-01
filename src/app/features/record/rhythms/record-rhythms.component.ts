import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, combineLatest, of } from 'rxjs';

import { RhythmType } from 'app/commons/constants/rhythms.const';
import { ComponentLoadState } from 'app/commons/enums';
import { ICanComponentDeactivate } from 'app/commons/interfaces/can-component-deactivate.interface';
import { LoadingSpinnerService } from 'app/commons/services/loading-spinner/loading-spinner.service';
import { LeavePageModalComponent } from 'app/features/record/leave-page-modal/leave-page-modal.component';
import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { RecordChannelAction, RecordChannelKey } from 'app/features/record/services/enums/channel.enum';
import { IRecordActionChannel } from 'app/features/record/services/interfaces/channel.interface';
import { RecordNotifier } from 'app/features/record/services/notifiers/record-notifier.service';
import { RecordSessionEditService } from 'app/features/record/services/record-service.service';
import { EcgComponentKey, EcgDaoChannelKey } from 'app/modules/ecg/enums';
import {
    EcgAnalyzeChannelStatus,
    EcgDaoEditChannelStatus,
    IEcgAnalyzerAnalyzeResponse,
    IEcgCardConfig,
    IEcgDaoEditChannel,
    IMdnRequest,
    IRhythmRequest,
    ISymptomaticRequest
} from 'app/modules/ecg/interfaces';
import { EcgDaoController } from 'app/modules/ecg/services/controller/dao/ecg-dao-controller.service';
import { EcgAnalyzerDao } from 'app/modules/ecg/services/daos/ecg-analyzer/ecg-analyzer-dao.service';
import { RhythmSortType } from '../services/enums/rhythm-sort-type.enum';
import { RecordRhythmsDto, RecordRhythmsService } from './record-rhythms.service';


/**
 * Record Overiew component.
 */
@Component({
    selector: 'app-record-rhythms',
    templateUrl: './record-rhythms.component.html',
    styleUrls: ['./record-rhythms.component.scss'],
    providers: [
        RecordRhythmsService
    ]
})
export class RecordRhythmsComponent implements OnInit, OnDestroy, ICanComponentDeactivate {

    // ECG Config Object
    public ecgConfig: IEcgCardConfig;

    // For use in template
    public ComponentLoadState = ComponentLoadState;

    // Current load state of processing/analyze request
    public responseLoadState: ComponentLoadState = ComponentLoadState.LOADING;

    // Current load state of component (One time thing)
    public componentLoadState: ComponentLoadState = ComponentLoadState.LOADING;

    private allSubscriptions: Subscription = new Subscription();

    //we will keep track of the current params and queryParams in the current ActivatedRoute
    private routeParams: { [key: string]: any; };
    private routeQueryParams: { [key: string]: any; };

    /**
     * Ctor
     */
    public constructor(
        public recordDto: RecordDto,
        private activatedRoute: ActivatedRoute,
        private rhythmService: RecordRhythmsService,
        public rhythmsDto: RecordRhythmsDto,
        private ecgAnalyzerDao: EcgAnalyzerDao,
        private ecgDaoController: EcgDaoController,
        private router: Router,
        private dialog: MatDialog,
        public sessionEditService: RecordSessionEditService,
        public recordNotifier: RecordNotifier,
		private loadingSpinnerService: LoadingSpinnerService
    ) {}

    /**
     * OnInit
     */
    public ngOnInit(): void {

        // Getting both params and queryParams in one fell swoop
        // We will persist these params because we need to refresh the view from a session cancel
        // and they are necessary to do so
       this.allSubscriptions.add(combineLatest([this.activatedRoute.params, this.activatedRoute.queryParams])
            .subscribe(([params, queryParams]) => {
                this.routeParams = params;
                this.routeQueryParams = queryParams;
                this.init();
            }));

        // if a user cancels a session edit or there is an error saving the edit session, we need to refresh the view from the backend to the last saved state
        this.allSubscriptions.add(this.recordNotifier.listen(RecordChannelKey.ACTION).subscribe((data: IRecordActionChannel) => {
            if(data.action === RecordChannelAction.EDIT_SESSION_CANCELLED ||
                data.action === RecordChannelAction.ERROR_ON_EDIT_SESSION_SAVE ||
                data.action === RecordChannelAction.EDITS_UNDONE ||
                data.action === RecordChannelAction.REANALYZE_LISTS){
                this.init();
            }
        }));

        this.allSubscriptions.add(this.ecgDaoController.daoNotifier
            .listen(EcgDaoChannelKey.DAO_EDIT)
            .subscribe((channelData:IEcgDaoEditChannel) => {

                if(channelData.status === EcgDaoEditChannelStatus.EDIT_RESPONSE) {

                    let detectedRhythmsInfo = channelData.response.navigationMetricsResponse.detectedRhythmsInfo;

                    let numMdnEpisodesPresent = detectedRhythmsInfo?.mdnRhythmList?.length;
                    let numSymptomaticEpisodesPresent = detectedRhythmsInfo?.symptomaticRhythmList?.length;

                    this.navigateIfNoEpisodesArePresent(numMdnEpisodesPresent, numSymptomaticEpisodesPresent, this.routeQueryParams.sortType);

                    if(channelData?.request?.ecgRangeEditList[0]?.blankBeatsRequest) {
                        this.init();
                    }
                }

            }));

    }

    /**
     * the view may change, not only on a Route Change, but we also need to
     * re-initialize the view from backend on RecordChannelAction.EDIT_SESSION_CANCELLED
     */
    private init(): void{

        // Set loading state for components that need to be destroyed and completely rebuilt (ex. EcgListComponent)
        this.responseLoadState = ComponentLoadState.LOADING;

        // Init top level rhythms section functionality/props
        // NOTE: This is building out our intial RecordRhythmsDto object
        this.rhythmService.init({
            rhythmType: this.routeParams.rhythmType,
            sortType: this.routeQueryParams.sortType
        });

        // Set up the 'rhythmRequest' portion of our request data that will ultimately get passed into the EcgAnalyzerDao
        let rhythmRequest = {

            ecgSerialNumber: this.recordDto.serialNumber,

            includeNavigationMetricsResponse: true,

            // Headmap Config
            heatMapRequest: {
                rhythmType: this.rhythmsDto.rhythmType,
                heatMapConfiguration: {
                    requestSort: {
                        sortType: this.rhythmsDto.sortType
                    },
                    requestPagination: {
                        limit: 5,
                        offset: 0
                    }
                }
            }
        };

        // Rhythm request can only have one request config. Currently those are rhythmRequest/mdnRequest/symptomaticRequest.
        // The logic below is to calculate what kind


        let rhythmRequestConfig = this.createRhythmRequestConfig(this.routeQueryParams.sortType);

        // Merge the RhythmRequest with the correct Rhythm Request Configuration
        rhythmRequest = {...rhythmRequest, ...rhythmRequestConfig};

        this.ecgDaoController.daoNotifier.send(EcgDaoChannelKey.ANALYZE, {
            status: EcgAnalyzeChannelStatus.ANALYZE_REQUEST,
            serialNumber: this.recordDto.serialNumber,
            request: rhythmRequest
        });

        // Heatmap request must be re-sent with every edit, so save the ecgAnalyzerRequest in recordDto
        this.recordDto.ecgAnalyzerRequest = rhythmRequest;

        // Method of loadingSpinnerService to display the loading spinner.
		this.loadingSpinnerService.show();

        // Make request for rhythms data
        this.ecgAnalyzerDao
            .analyze(rhythmRequest)
            .subscribe((response: IEcgAnalyzerAnalyzeResponse) => {
                // Method of loadingSpinnerService to hide the loading spinner.
                this.loadingSpinnerService.hide();

                // Set up the configurationg object that defines how our ECG strips will look/operate
                this.ecgConfig = {
                    config: {

                        // viewType: EcgViewType.ADDITIONAL_STRIP,

                        global: {
                        },

                        gain: {
                            show: true
                        },

                        info: {
                            show: true
                        },

                        actionMenu: {
                            show: false,
                            actionIds: [
                                EcgComponentKey.CONVERT_SINUS,
                                EcgComponentKey.GAIN
                            ]
                        },

                        toggleMinMax: {
                            show: false
                        },

                        convertArtifact: {
                            show: true
                        },

                        toggleExpandView: {
                            show: true
                        },

                        convertSinus: {
                            show: true
                        },

                        resetView: {
                            show: true
                        },

                        strips: {
                            parentStrips: [
                                {
                                    global: {
                                        bgColor: '#000',
                                        baseRhythmType: RhythmType.SINUS,
                                    },

                                    line: {
                                        height: 160
                                    },

                                    beats: {
                                        showLines: true,
                                        showTicks: true,
                                        lineHeight: 30
                                    },

                                    highlighter: {
                                        show: false
                                    },

                                    axisGrid: {
                                        show: true
                                    },

                                    caliper: {
                                        show: true
                                    },

                                    children: [
                                        {
                                            global: {
                                                bgColor: '#000',
                                                baseRhythmType: RhythmType.SINUS,
                                            },

                                            line: {
                                                height: 60
                                            },

                                            beats: {
                                                showTicks: true,
                                                showLines: false
                                            },

                                            highlighter: {
                                                show: true,
                                                bgColor: 'rgba(173, 240, 249, .25)'
                                            },

                                            axisGrid: {
                                                show: false
                                            },

                                            primaryEpisodeIndicator: {
                                                show: true
                                            },

                                            navigationArrow: {
                                                show: true
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                };

                let numMdnEpisodesPresent = response.mdnResponse?.rhythmRequestConfigurationResult.episodeTotalCount;
                let numSymptomaticEpisodesPresent = response.symptomaticResponse?.rhythmRequestConfigurationResult.episodeTotalCount;

                this.navigateIfNoEpisodesArePresent(numMdnEpisodesPresent, numSymptomaticEpisodesPresent, this.routeQueryParams.sortType);

                // Update RhythmsDto with response data
                // TODO: Need an HttpInterceptor in place to catch general errors
                // TODO: Need to handle this error here as well....or do we?
                this.ecgDaoController.daoNotifier.send(EcgDaoChannelKey.ANALYZE, {
                    status: EcgAnalyzeChannelStatus.ANALYZE_RESPONSE,
                    serialNumber: this.recordDto.serialNumber,
                    response: response
                })

                // Update load states
                this.componentLoadState = ComponentLoadState.LOADED;
                this.responseLoadState = ComponentLoadState.LOADED;
            });


    }


    /**
     * Used with PreventNavigationGuard to prevent user from navigating away
     * prevents clicking back button, navigating within application during edit session
     */
    public canDeactivate(): Observable<boolean> {

        // prevent committing active session edit when user clicks on browser controls
        this.sessionEditService.doNotCommit = true;

        // check if active edit session
        if(this.recordDto.sessionEdits?.length) {
            const dialogRef = this.dialog.open(LeavePageModalComponent);

            // subscribe to user selecting to leave or stay on page
            const afterCloseSubs = dialogRef.afterClosed().subscribe((leavePage: boolean) => {

                // if user chooses to leave the page, end the edit session
                if(leavePage){
                    this.sessionEditService.endEditSession();
                }
            });

            this.allSubscriptions.add(afterCloseSubs);

            return dialogRef.afterClosed();
        } else {
            // return true will disable the route guard
            return of(true);
        }

    }

    /**
     * Listens in on window:beforeunload event to display native browser pop up
     */

    @HostListener('window:beforeunload', ['$event'])
    public onBeforeUnload(): boolean {

        // prevent committing active session edit when user clicks on browser controls
        this.sessionEditService.doNotCommit = true;

        // display pop up if active session edit
        if(this.recordDto.sessionEdits?.length) {
            return false;
        }
        else {
            return true;
        }
    }

    /**
     * Creates a Request Configuration for the RhythmRequest
     * @param sortType
     * @private
     */
    private createRhythmRequestConfig(sortType: RhythmSortType): { rhythmRequest: IRhythmRequest }
                                                                    | { mdnRequest: IMdnRequest }
                                                                    | { symptomaticRequest: ISymptomaticRequest} {

        /**
         * The RhythmRequest can only have one configuration on it at a time.
         * Currently, the available configurations are RhythmRequest, MdnRequest, and SymptomaticRequest
         * This method calcs which of the configurations should be added to the request based on sortType,
         * and then generates and returns the respective Request Configuration
         */


        let rhythmRequestConfig: { rhythmRequest: IRhythmRequest}
            | { mdnRequest: IMdnRequest }
            | { symptomaticRequest: ISymptomaticRequest};

        // TODO: How many different Request Configurations are we going to have? Will using SortType work on all of them?
        if(sortType === RhythmSortType.FASTEST_MDN) {
            rhythmRequestConfig = {
                mdnRequest: {
                    rhythmType: this.rhythmsDto.rhythmType
                }
            };
        } else if(sortType === RhythmSortType.LONGEST_SYMPTOMATIC) {
            rhythmRequestConfig = {
                symptomaticRequest: {
                    rhythmType: this.rhythmsDto.rhythmType,
                    symptomaticRequestConfiguration: {

                    }
                }
            };
        } else {
            rhythmRequestConfig = {
                rhythmRequest: {
                    rhythmType: this.rhythmsDto.rhythmType,
                    rhythmRequestConfiguration: {
                        requestSort: {
                            sortType: this.rhythmsDto.sortType
                        }
                    }
                }
            };
        }

        return rhythmRequestConfig;
    }

    /**
     * Navigates the user to the longest tab if they attempt to access an empty Symptomatic or MDN page
     * @param numMdnEpisodes
     * @param numSymptomaticEpisodes
     * @param sortType
     * @private
     */
    private navigateIfNoEpisodesArePresent(numMdnEpisodes: number, numSymptomaticEpisodes: number, sortType: RhythmSortType): void {
        let areMdnEpisodesPresent = numMdnEpisodes > 0;
        let areSymptomaticEpisodesPresent = numSymptomaticEpisodes > 0;

        if(sortType === RhythmSortType.FASTEST_MDN && !areMdnEpisodesPresent
            || sortType === RhythmSortType.LONGEST_SYMPTOMATIC && !areSymptomaticEpisodesPresent) {

            this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: {
                    sortType: RhythmSortType.LONGEST
                },
            });
        }
    }

    public ngOnDestroy(): void {
        this.allSubscriptions.unsubscribe();
    }
}

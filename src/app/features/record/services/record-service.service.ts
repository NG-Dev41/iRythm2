import { Injectable, OnDestroy } from '@angular/core';

import { fromEvent, Observable, Subscription } from 'rxjs';
import { concatMap, filter, map } from 'rxjs/operators';

import { PageDto } from 'app/commons/services/dtos/page-dto.service';
import { IRecordActionChannel } from 'app/features/record/services/interfaces/record-sidebar.interface';
import { RecordDto, RecordStateDto } from './dtos/record-dto.service';
import { EctopicTypeMeta } from 'app/commons/constants/ectopics.const';
import { PageKey } from 'app/commons/constants/page-meta.const';
import { RhythmTypeMeta } from 'app/commons/constants/rhythms.const';
import {
    IProcessDataRequest,
    IProcessDataResponse,
    ProcessDataDao,
} from 'app/commons/services/dao/process-data-dao.service';
import {
    IRouteChangeChannel,
    PageChannelKey,
    PageNotifier,
} from 'app/commons/services/notifiers/page-notifier.service';
import { HttpUtils } from 'app/commons/utils/http/http.utils';
import { EcgDaoChannelKey } from 'app/modules/ecg/enums';
import { EcgDaoEditChannelStatus, IEcgDaoEditChannel } from 'app/modules/ecg/interfaces/ecg-channel.interface';
import { IEcgRangeEdit } from 'app/modules/ecg/interfaces/ecg-dao.interface';
import { EcgDaoNotifier } from 'app/modules/ecg/services/notifier/dao/ecg-dao-notifier.service';
import { RecordDao } from './daos/record-dao.service';
import { RecordMetricsDao } from './daos/record-metrics-dao.service';
import { RecordChannelAction, RecordChannelKey } from './enums/channel.enum';
import { RecordNotifier } from './notifiers/record-notifier.service';
import { IRecordMetricsResponse } from './interfaces/record-metrics.interface';
import { EcgLayoutType } from './enums';


@Injectable()
export class RecordService implements OnDestroy  {


    // holds references to all subscriptions so they can be unsubscribed in one line
    private allSubscriptions: Subscription = new Subscription();


    /**
     * Ctor
     *
     * @param recordDto
     * @param recordStateDto
     * @param processDataDao
     * @param metricsDao
     * @param recordDao
     * @param pageDto
     * @param pageNotifier
     * @param editNotifier
     */
    public constructor(
        private recordDto: RecordDto,
        private recordStateDto: RecordStateDto,
        private processDataDao: ProcessDataDao,
        private metricsDao: RecordMetricsDao,
        private recordDao: RecordDao,
        private pageDto: PageDto,
        private pageNotifier: PageNotifier,
	    private editNotifier: EcgDaoNotifier,
        private recordNotifier: RecordNotifier
    ) {

        //by initializing the Observable subscriptions here, this ensures
        // that they will need to be initialized only once, and similarly we can unsubscribe only once
        // in ngOnDestroy because the init() method is invoked multiple times by the component on Route change
        this.initListeners();
    }


    /**
     * Loads intial top level data for a record based on the serial number.
     * Any top level processing that needs to be done can be handled in this method as well.
     * Or this method can delegate processing to other services/methods
     *
     * @param  {string}              serialNumber
     * @return {Observable<boolean>}
     */
    public init(serialNumber: string): Observable<boolean> {


        // Start with request to indexed db for a cached version of this record
        return this.recordDao
            .loadRecord(serialNumber)
            .pipe(
                concatMap((cache) => {

                    // Do we have a cached version?
                    Object.assign(this.recordStateDto, cache?.recordDto);

                    // Get api record data
                    return this.metricsDao
                        .readMetrics({
                            ecgSerialNumber: serialNumber
                        })
                        .pipe(
                            map((metricData: IRecordMetricsResponse) => {

                                // Before we do any processing on the metric data let's first check
                                // if the backend is sending us an error
                                // If an error is present stop everything and return false
                                // TODO: Should we handle a server error here or just rely on the HttpInterceptor?
                                if(HttpUtils.hasError(metricData)) {
                                    return false;
                                }
                                else {

                                    // We have a legit serial number/record

                                    // Any processing that needs to be done on the metrics data should happen here

                                    // Populate the top level RecordDto object
                                    this.recordDto.serialNumber = serialNumber;
                                    Object.assign(this.recordDto, metricData);

									this.populateRecordDto(serialNumber, metricData);

                                    // Set initial page title
                                    this.setPageTitle();

                                    return true;
                                }
                            })
                        );
                })
            );
    }

	/**
	 * Populates the RecordDTO data
	 * @param serialNumber
	 * @param metricData
	 * @private
	 */
	private populateRecordDto(serialNumber: string, metricData: IRecordMetricsResponse) {
		this.recordDto.serialNumber = serialNumber;
		Object.assign(this.recordDto, metricData);

		if(!metricData.detectedRhythmsInfo) {
			this.recordDto.detectedRhythmsInfo = null;
		}

		// we need to inform the left hand nav mark-ectopy component that the ectopic metrics data has been updated
        this.recordNotifier.send(RecordChannelKey.ACTION, {action: RecordChannelAction.METRIC_DATA_UPDATED});
	}


    /**
     * Initiliazes RouteChangeListener
     *
     * Listens for route changes and calls any methods that need to react.
     */
    private initListeners(): void {

        this.allSubscriptions.add(this.editNotifier.listen(EcgDaoChannelKey.DAO_EDIT).subscribe((res: IEcgDaoEditChannel) => {
            if(res.status === EcgDaoEditChannelStatus.EDIT_RESPONSE && res?.response?.navigationMetricsResponse) {
                this.populateRecordDto(res.serialNumber, res.response.navigationMetricsResponse);
            }
        }));

        // Watch for changes to the route
        this.allSubscriptions.add(this.pageNotifier
            .listen(PageChannelKey.ROUTE_CHANGE)
            .subscribe((routeData: IRouteChangeChannel) => {
                this.setPageTitle();
            }));

    }


    /**
     * Sets the page title. For the most part this is pretty straightfoward.
     * Rhythm and Ectopic types need a little extra processing.
     */
    private setPageTitle(): void {

        // Check if we're dealing with rhythm or ectopic type pages
        if(this.pageDto.key == PageKey.RHYTHMS || this.pageDto.key == PageKey.ECTOPICS || this.pageDto.key === PageKey.ECTOPIC_PATTERNS) {

            // Get type - either rhythm type or ectopic type
            const type = this.pageDto.urlPathSegments[(this.pageDto.urlPathSegments.length - 1)].toUpperCase();

            if(this.pageDto.key == PageKey.RHYTHMS || this.pageDto.key === PageKey.ECTOPIC_PATTERNS) {
                this.pageDto.meta.title = RhythmTypeMeta[type].name;
            }
            else {
                const burdenPercentage = (Math.round(this.recordDto.metrics.ectopicBurdenPercentages[type] * 100) / 100).toFixed(2);
                this.pageDto.meta.title = `${EctopicTypeMeta[type].name} <span>(${burdenPercentage}%)</span>`;
            }
        }
    }


    /**
     * Saves a record to cache.
     * This will need to be built out more.
     */
    public cacheRecord(): void {

        this.recordDao
            .saveRecord(this.recordDto)
            .subscribe((response: any) => {

                // Saving RecordDto to cache. What now?
            });
    }


    /**
    * Makes a request to the processDataDao
    * TODO: REMOVE ME
    *
    * @param payload
    */
    public processDataRequest(payload: IProcessDataRequest): Observable<IProcessDataResponse> {
        return this.processDataDao.processDataRequest(payload);
    }


    /**
     * Method sends out notification that list of ECGs needs to change the layout.
     *
     * @param {EcgLayoutType} layoutTypeInput
     */
    public toggleEcgLayout(layoutTypeInput: EcgLayoutType): void {

        // Set new layout type onto our recordDto
        this.recordDto.ecgListLayoutType = layoutTypeInput;

        // Send notification that ECG layout is being changed
        this.recordNotifier.send(RecordChannelKey.LAYOUT_TYPE, {
            layoutType: layoutTypeInput
        });
    }

    public ngOnDestroy(){
        this.allSubscriptions.unsubscribe();
    }
}



/**
 * Record Session Edit Service
 * TODO: We should move this to its own file
 */
@Injectable()
export class RecordSessionEditService implements OnDestroy{
    // flag for onBeforeUnload
    public doNotCommit: boolean = false;

    // escape key subscription, destroyed in endEditSession() here
    public escapeSubs: Subscription;

    private allSubscriptions: Subscription = new Subscription();


    /**
     * Ctor
     * @param recordDto
     * @param daoNotifier
     * @param recordNotifier
     */
    constructor(
        public recordDto: RecordDto,
        public daoNotifier: EcgDaoNotifier,
        private recordNotifier: RecordNotifier
    ) {
        this.initListeners();
    }


    /**
     * Initialize Listeners
     */
    public initListeners(): void {

        // start listening for DAO_EDIT
        this.allSubscriptions.add(this.daoNotifier
            .listen(EcgDaoChannelKey.DAO_EDIT)
            .subscribe((data: IEcgDaoEditChannel) => {

                // once status is EDIT_RESPONSE, end the editing session
                if(data.status === EcgDaoEditChannelStatus.EDIT_RESPONSE) {
                    this.endEditSession();
                }
            }));

        // if there is an error saving the session we need to clear out the existing session edits
        // and start from scratch
        this.allSubscriptions.add(this.recordNotifier.listen(RecordChannelKey.ACTION).subscribe((data: IRecordActionChannel) => {
            if(data.action === RecordChannelAction.ERROR_ON_EDIT_SESSION_SAVE){
                this.endEditSession();
            }
        }));

    }

    /**
     * Start A Single Edit Session
     */
    public startEditSession(): void {

        // Instantiate our array of session edits
        this.recordDto.sessionEdits = new Array<IEcgRangeEdit>();

        // Disable controls
        this.toggleEditControls(true);

        // listen to keydown event with rxjs fromEvent
        const keyboardEvent$ = fromEvent(document, 'keydown');

        // filter out escape key event to listen to
        const escapeEvent$ = keyboardEvent$.pipe(
            filter((event: KeyboardEvent) => event.key === 'Escape'));

        // if escape key pressed, end the edit session without committing
        this.escapeSubs = escapeEvent$.subscribe(() => {
            this.endEditSession();
            this.recordNotifier.send(RecordChannelKey.ACTION, {action: RecordChannelAction.EDIT_SESSION_CANCELLED});
        });
    }


    /**
     * Toggle page controls
     * @param disabled
     */
    public toggleEditControls(disabled: boolean): void {
        this.recordDto.editControls.undoDisabled = disabled;
        this.recordDto.editControls.pageGainDisabled = disabled;
        this.recordDto.editControls.viewToggleDisabled = disabled;
        this.recordDto.editControls.convertToSinusButtonsDisabled = disabled;
        this.recordDto.editControls.convertToArtifactButtonsDisabled = disabled;
    }


    /**
     * Returns true if there's an active edit session going on and
     * false otherwise.
     *
     * @return {boolean}
     */
    public hasActiveSession(): boolean {
        return (!this.recordDto.sessionEdits) ? false : true;
    }


    /**
     * Adds a session edit onto the array of session edits stored in the RecordDto.
     * If an edit session is not active one will be started.
     *
     * @param {IEcgRangeEdit} edit
     */
    public addSessionEdit(edit: IEcgRangeEdit): void {

        if(!this.hasActiveSession()) {
            this.startEditSession();
        }

        // prevent adding duplicate session edits to the queue
        if(!this.recordDto.sessionEdits.find((rangeEdit: IEcgRangeEdit) => JSON.stringify(rangeEdit) ===  JSON.stringify(edit))) {

            this.recordDto.sessionEdits.push(edit);
        }
    }


    /**
     * Takes an array of edits and pushes each edit individually onto the
     * array of session edits.
     *
     * @param {IEcgRangeEdit[]} edits
     */
    public addSessionEdits(edits: IEcgRangeEdit[]): void {
        edits.forEach((edit: IEcgRangeEdit) => {
            this.addSessionEdit(edit);
        });
    }


    /**
     * Saves the edits from a single edit session
     */
    public commitEditSession(): void {
		if(this.recordDto.sessionEdits) {
			this.daoNotifier.send(EcgDaoChannelKey.DAO_EDIT, {
				serialNumber: this.recordDto.serialNumber,
				status: EcgDaoEditChannelStatus.EDIT_REQUEST,
				request: {
					ecgRangeEditList: this.recordDto.sessionEdits,
					ecgAnalyzeRequest: this.recordDto.ecgAnalyzerRequest
				}
			});
		}
    }


    /**
     * Ends an edit session
     */
    public endEditSession(): void {
        // reset session edits
        this.recordDto.sessionEdits = null;

        // toggle edit controls
        this.toggleEditControls(false);

        // check if escape subscription is active, unsubscribe if so
        this.escapeSubs?.unsubscribe();

		this.recordNotifier.send(RecordChannelKey.ACTION, {action: RecordChannelAction.EDIT_SESSION_ENDED});
    }

    ngOnDestroy(){
        this.allSubscriptions.unsubscribe();
        this.escapeSubs?.unsubscribe();
    }

}

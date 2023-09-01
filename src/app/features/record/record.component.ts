import { Component, ElementRef, OnDestroy, OnInit, ViewChild, Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { ComponentLoadState } from 'app/commons/enums';
import { EcgDaoController } from 'app/modules/ecg/services/controller/dao/ecg-dao-controller.service';
import { RecordNotifier } from 'app/features/record/services/notifiers/record-notifier.service';
import { EcgDaoNotifier } from 'app/modules/ecg/services/notifier/dao/ecg-dao-notifier.service';
import { EcgListNotifier } from 'app/modules/ecg/components/list/services/notifier/ecg-list-notifier.service';
import { RecordMetricsDao } from './services/daos/record-metrics-dao.service';
import { RecordDto, RecordStateDto } from './services/dtos/record-dto.service';
import { RecordSidebarNotifier } from './services/notifiers/record-edit-bar-notifier.service';
import { RecordNavigationService } from './services/record-navigation.service';
import { RecordService, RecordSessionEditService } from './services/record-service.service';
import { RecordSidebarService } from './services/record-sidebar.service';
import { RecordNavigationUtils } from './services/utils/record-navigation-utils';
import {
	IMultilineStripModalInitProperties, IRecordRightColModalChannel, RightColModalAction, RightColModalInitProprtiersUnion,
	RightColModalType
} from './services/interfaces/channel.interface';
import { RecordChannelKey } from './services/enums';
import { RecordRhythmsDto } from './rhythms/record-rhythms.service';
import { Observable, Subscription } from 'rxjs';
import { RightColMultiLineModalComponent } from './right-col-multi-line-modal/right-col-multi-line-modal.component';
import { LoadingSpinnerService } from 'app/commons/services/loading-spinner/loading-spinner.service';


/**
 * Top level/parent record component.
 */
@Component({
	selector: 'app-record',
	templateUrl: './record.component.html',
	styleUrls: ['./record.component.scss'],
	providers: [
		RecordService,
		RecordNotifier,
		RecordDto,
		RecordMetricsDao,
		RecordNavigationUtils,
		RecordStateDto,
		RecordNavigationService,
		RecordSidebarNotifier,
		RecordSidebarService,
		EcgDaoController,
		EcgDaoNotifier,
		EcgListNotifier,
		RecordSessionEditService,
		RecordRhythmsDto,
		LoadingSpinnerService
	]
})
export class RecordComponent implements OnInit, OnDestroy {

	readonly RightColModalType = RightColModalType;

	// Load state of the component
	public loadState: ComponentLoadState = ComponentLoadState.LOADING;

	// For use in template comparisons
	public ComponentLoadState = ComponentLoadState;

	public shouldShowModal: boolean = false;

	public activeModalType: RightColModalType;

	@ViewChild('rightColumnOverlay') rightColumnOverlay: ElementRef<HTMLDivElement>;

	@ViewChild('rightColMultilineModal') rightColMultilineModal: RightColMultiLineModalComponent;

	public modalInitProperties: RightColModalInitProprtiersUnion;

	private allSubscriptions: Subscription = new Subscription();

	public openRightColumnSubscription: Subscription;

	public isLoading: Observable<boolean>;
	public loadingMessage: Observable<string>;

	private routeSubscription = new Subscription();


	/**
	 * Ctor
	 *
	 * @param {ActivatedRoute}   private activatedRoute
	 * @param {Router}           private router
	 * @param {RecordService}    public  recordService
	 * @param {EcgDaoController} private ecgDaoController
	 */
	public constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		public recordService: RecordService,
		private ecgDaoController: EcgDaoController,
		private recordNotifier: RecordNotifier,
		private loadingSpinnerService: LoadingSpinnerService
	) { }


	/**
	 * OnInit
	 */
	public ngOnInit(): void {

        // TODO: Update this using concatMap...I think
        // Attempt to grab the record serial number from the URL
        this.routeSubscription = this.activatedRoute.params.subscribe((params: Params) => {

        	// Make sure we actually have a serial number
            if(params.serialNumber) {

            	// We have a valid serial number
            	// Load the record
            	this.recordService
            		.init(params.serialNumber)
            		.subscribe((loadingSuccesful: boolean) => {

            			// Check load status of the record metrics data
            			if(loadingSuccesful) {

            				// Any top level record processing that needs to happen outside of services can be done here

					        // Initialize Dao Controller
					        // TODO: This shold probably renamed to something like 'EcgEditController'
					        this.ecgDaoController.init();


	            			// Html is ready to be rendered
	            			// Update load state
	            			this.loadState = ComponentLoadState.LOADED;
            			}
            			else {

            				// For some reason the record service returned false for loading a record
            				// Maybe instead of returning a boolean from the loadRecord method we should
            				// return some sort object with details...error handling will also be done
            				// through HttpInterceptors and guards

            				// Update load state
            				this.loadState = ComponentLoadState.ERROR;
            			}
            		});
            }
            else {

            	// Serial number did not exist in URL
            	// Handle that
            	this.processInvalidSerialNumber();
            }
        });

		this.openRightColumnSubscription = this.recordNotifier.listen(RecordChannelKey.OPEN_RIGHT_COL_MODAL).subscribe((data: IRecordRightColModalChannel) => this.processOpenRightColumnData(data));

		this.allSubscriptions.add(this.openRightColumnSubscription);

		// Subscribe to the isLoading BehaviourSubject to receive loading status changes.
		this.isLoading = this.loadingSpinnerService.isLoading.asObservable();
		// Subscribe to the loadingMessage BehaviourSubject to receive loadingMessage changes.
		this.loadingMessage = this.loadingSpinnerService.message.asObservable();
	}

	public processOpenRightColumnData(data: IRecordRightColModalChannel): void {
			switch(data.action) {
				case RightColModalAction.OPEN_MODAL:
					this.shouldShowModal = true;
					this.activeModalType = data.type;
					this.modalInitProperties = data.initProperties;
					break;

				case RightColModalAction.CLOSE_MODAL:
					this.shouldShowModal = false;
					this.activeModalType = null;
					this.modalInitProperties = null;
					break;
			}
	}


	public processInvalidSerialNumber(): void {
		this.router.navigate(['/queue']);
	}

    public ngOnDestroy(){
        this.allSubscriptions.unsubscribe();
		this.routeSubscription.unsubscribe();
    }
}

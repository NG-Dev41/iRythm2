import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { EcgStripGroupController } from 'app/modules/ecg/components/children/strip/children/strip-group/services/controller/ecg-strip-group-controller.service';
import { EcgListNotifier } from 'app/modules/ecg/components/list/services/notifier/ecg-list-notifier.service';
import {
	EcgDaoEditChannelStatus, IEcgCardConfig, IEcgConfig, IEcgConfigStrip, IEcgControllerInit, IEcgDaoEditChannel, IEcgListContextMenuAction,
	IEcgListContextMenuChannel
} from '../../interfaces';
import { EcgComponentState, EcgDaoChannelKey, EcgListChannelKey } from '../../enums';
import { EcgController } from 'app/modules/ecg/services/controller/ecg/ecg-controller.service';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';
import { EcgDto } from 'app/modules/ecg/services/dto/ecg/ecg-dto.service';
import { EcgNotifier } from 'app/modules/ecg/services/notifier/ecg/ecg-notifier.service';
import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';
import { Subscription } from 'rxjs';
import { EcgDaoNotifier } from '../../services/notifier/dao/ecg-dao-notifier.service';


/**
 * EcgComponent
 *
 * Top level ecg component.
 * Parent to all children components.
 *
 */

@Component( {
	selector: 'app-ecg-split-duo',
	templateUrl: './ecg-split-duo.component.html',
	styleUrls: [ './ecg-split-duo.component.scss' ],
	providers: [
		EcgController, EcgUtils, EcgDto, EcgConfigDto, EcgNotifier, EcgStripGroupController
	]
} )
export class EcgSplitDuoComponent implements OnInit, OnDestroy {

	// Incoming init properties used to intialize the Ecg and all related components
	@Input() public initProperties: IEcgCardConfig;

	@ViewChild( 'ecgCardContainer' ) public cardContainer: ElementRef<HTMLElement>;

	@ViewChild( 'ecgWidth' ) public cardWidth: ElementRef<HTMLElement>;

	// For use in the template
	public EcgComponentState = EcgComponentState;

	public originalStripConfig: IEcgConfigStrip;

	private daoNotifierSubs: Subscription;

    private initTimeout: ReturnType<typeof setTimeout>;

	/**
	 * Ctor
	 *
	 * @param controller
	 * @param ecgUtils
	 * @param notifier
	 * @param listNotifier
	 * @param config
	 * @param dto
	 * @param stripGroupController
	 */
	public constructor( public controller: EcgController,
		private ecgUtils: EcgUtils,
		public notifier: EcgNotifier,
		public listNotifier: EcgListNotifier,
		public config: EcgConfigDto,
		public dto: EcgDto,
		private daoNotifier: EcgDaoNotifier,
		public stripGroupController: EcgStripGroupController)
	{}

	public ngOnInit(): void {
		// Update the episode data on edit, which will update the ecg-card-info
		this.daoNotifierSubs = this.daoNotifier.listen(EcgDaoChannelKey.DAO_EDIT).subscribe((data: IEcgDaoEditChannel) => {
			if(data.status === EcgDaoEditChannelStatus.EDIT_PROCESSING_COMPLETE) {

				for(let episode of data.response.potentialImpactedEpisodeList) {
					let curEpisodeInterval = this.dto.data.episode.interval;
					if(episode.interval.startIndex === curEpisodeInterval.startIndex
						&& episode.interval.endIndex === curEpisodeInterval.endIndex) {
						Object.assign(this.dto.data.episode, structuredClone(episode));
					}
				}

			}
		} );

		this.initTimeout = setTimeout( () => {
			let initProperies = this.initProperties;
			// Set default according to CLIN-500 rules
			this.controller.processConfig( initProperies.config as IEcgConfig);

			// Set up DTO (Data Transfer Object)
			this.dto.setData( initProperies.data );

			// Use the input init properties to initialize our ecg data
			// This will be building out top level ecg functionality needed by child component to do their jobs
			this.controller
				.init()
				.subscribe( ( response: IEcgControllerInit ) => {
					this.ecgUtils.ready( this.controller );
				} );

			this.originalStripConfig = this.stripGroupController.processConfig( this.config.ct.strips.parentStrips[0] );
		}, 1 );
	}

	/**
	 * OnDestroy
	 */
	public ngOnDestroy(): void {
		this.notifier?.stopListening();
		this.daoNotifierSubs.unsubscribe();
        clearTimeout(this.initTimeout);
	}

}

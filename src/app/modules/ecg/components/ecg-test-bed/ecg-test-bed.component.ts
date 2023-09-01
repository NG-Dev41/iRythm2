import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

import { EcgStripGroupController } from 'app/modules/ecg/components/children/strip/children/strip-group/services/controller/ecg-strip-group-controller.service';
import { EcgListNotifier } from 'app/modules/ecg/components/list/services/notifier/ecg-list-notifier.service';
import {
	IEcgCardConfig, IEcgConfig, IEcgConfigStrip, IEcgControllerInit, IEcgEpisodeInterval, IEcgListContextMenuAction
} from '../../interfaces';
import { EcgComponentState, EcgCursorType, EcgListChannelKey } from '../../enums';
import { EcgController } from 'app/modules/ecg/services/controller/ecg/ecg-controller.service';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';
import { EcgDto } from 'app/modules/ecg/services/dto/ecg/ecg-dto.service';
import { EcgNotifier } from 'app/modules/ecg/services/notifier/ecg/ecg-notifier.service';
import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';
import { EcgSampleDao } from '../../services/daos/ecg-sample/ecg-sample-dao.service';

@Component({
  selector: 'app-ecg-test-bed',
  templateUrl: './ecg-test-bed.component.html',
  styleUrls: ['./ecg-test-bed.component.scss'],
	providers: [
		EcgController, EcgUtils, EcgDto, EcgConfigDto, EcgNotifier, EcgStripGroupController
	]
})
export class EcgTestBedComponent {
	
	// Incoming init properties used to intialize the Ecg and all related components
	@Input() public initProperties: IEcgCardConfig;
	
	@ViewChild( 'ecgCardContainer' ) public cardContainer: ElementRef<HTMLElement>;
	
	@ViewChild( 'ecgWidth' ) public cardWidth: ElementRef<HTMLElement>;
	
	// For use in the template
	public EcgComponentState = EcgComponentState;
	
	public originalStripConfig: IEcgConfigStrip;
	
	public originalStripConfigWithSampleData: IEcgConfigStrip;
	
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
	public constructor(
		public controller: EcgController,
		private ecgUtils: EcgUtils,
		public notifier: EcgNotifier,
		public listNotifier: EcgListNotifier,
		public config: EcgConfigDto,
		public dto: EcgDto,
		public stripGroupController: EcgStripGroupController,
		public sampleDao: EcgSampleDao ) {}
	
	
	/**
	 * OnDestroy
	 */
	public ngOnDestroy(): void {
		this.notifier.stopListening();
	}
	
	public ngOnInit(): void {
		setTimeout( () => {
			
			// Set default according to CLIN-500 rules
			this.controller.processConfig( this.initProperties.config as IEcgConfig);
			
			// Set up DTO (Data Transfer Object)
			this.dto.setData( this.initProperties.data );
			
			// Use the input init properties to initialize our ecg data
			// This will be building out top level ecg functionality needed by child component to do their jobs
			this.controller
				.init()
				.subscribe( ( response: IEcgControllerInit ) => {
					this.ecgUtils.ready( this.controller );
				} );
			
			let curInterval = this.dto.data.episode.interval;
			let durationInSeconds = 150;
			
			this.sampleDao.read({
				ecgSerialNumber: this.dto.data.serialNumber,
				sampleReadCursorTaskList: [
					{
						cursorType: EcgCursorType.CENTER,
						cursorIndex: curInterval.startIndex + ((curInterval.endIndex - curInterval.startIndex) / 2),
						durationInSeconds: durationInSeconds
					}
				]
			}).subscribe((res) => {
				let sampleAccessString = `${durationInSeconds}_SECONDS_SAMPLE`;
				let originalStripConfigClone: IEcgConfigStrip = structuredClone(this.originalStripConfig);
				originalStripConfigClone.global.sampleCursorResultKey = sampleAccessString;
				
				this.dto.regions[sampleAccessString] = res.sampleCursorResultList[0];
				
				let rowIntervals: IEcgEpisodeInterval[] = [];
				let intervalRange = this.dto.regions[sampleAccessString].interval.endIndex - this.dto.regions[sampleAccessString].interval.startIndex;
				const NUM_ROWS = 5;
				for(let i = 0; i < NUM_ROWS; i++) {
					rowIntervals.push({
						startIndex: Math.floor(i * (intervalRange / NUM_ROWS ) + this.dto.regions[sampleAccessString].interval.startIndex),
						endIndex: Math.floor((i + 1) * (intervalRange / NUM_ROWS) + this.dto.regions[sampleAccessString].interval.startIndex) - 1
					})
				}
				
				originalStripConfigClone.global.rowIntervals = rowIntervals;
				this.originalStripConfigWithSampleData = originalStripConfigClone;
			});
			
			this.originalStripConfig = this.stripGroupController.processConfig( this.config.ct.strips.parentStrips[0] );
		}, 1 );
	}
	
	public setAsContextMenuInterval(): void {
		this.listNotifier.send(EcgListChannelKey.CONTEXT_MENU, {
            action: IEcgListContextMenuAction.CLEAR,
        });

        this.listNotifier.send(EcgListChannelKey.CONTEXT_MENU, {
            action: IEcgListContextMenuAction.ADD,
            intervalToUpdate: this.dto.data.episode.interval,
        });
	}
}

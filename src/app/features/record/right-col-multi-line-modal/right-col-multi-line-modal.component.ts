import { Component, Input, OnInit } from '@angular/core';
import { IMultilineStripModalInitProperties, RightColModalAction } from '../services/interfaces/channel.interface';
import { EcgController } from '../../../modules/ecg/services/controller/ecg/ecg-controller.service';
import { EcgUtils } from '../../../modules/ecg/services/utils/ecg-utils.service';
import { EcgDto } from '../../../modules/ecg/services/dto/ecg/ecg-dto.service';
import { EcgConfigDto } from '../../../modules/ecg/services/dto/ecg/ecg-config-dto.service';
import { EcgNotifier } from '../../../modules/ecg/services/notifier/ecg/ecg-notifier.service';
import { EcgStripGroupController } from '../../../modules/ecg/components/children/strip/children/strip-group/services/controller/ecg-strip-group-controller.service';
import { EcgListController } from '../../../modules/ecg/components/list/services/controller/ecg-list-controller.service';
import { EcgListConfigDto } from '../../../modules/ecg/services/dto/ecg/ecg-list-config-dto.service';
import { RecordRhythmsDto } from '../rhythms/record-rhythms.service';
import {
	IEcgCardConfig, IEcgConfig, IEcgConfigStrip, IEcgControllerInit, IEcgEpisodeInterval, IEcgReadSampleResponse
} from '../../../modules/ecg/interfaces';
import { EcgCursorType } from '../../../modules/ecg/enums';
import { EcgSampleDao } from '../../../modules/ecg/services/daos/ecg-sample/ecg-sample-dao.service';
import { RecordNotifier } from '../services/notifiers/record-notifier.service';
import { RecordChannelAction, RecordChannelKey } from '../services/enums';
import { RecordSessionEditService } from '../services/record-service.service';

@Component({
    selector: 'app-right-col-multi-line-modal',
    templateUrl: './right-col-multi-line-modal.component.html',
    styleUrls: ['./right-col-multi-line-modal.component.scss'],
    providers: [
        EcgListController,
        EcgListConfigDto,
        EcgController,
        EcgUtils,
        EcgDto,
        EcgConfigDto,
        EcgNotifier,
        EcgStripGroupController,
    ],
})
export class RightColMultiLineModalComponent implements OnInit {
    @Input() public initProperties: IMultilineStripModalInitProperties;

    public originalStripConfig: IEcgConfigStrip;

    public originalStripConfigWithSampleData: IEcgConfigStrip;
	
	public readonly STRIP_DURATION = 150;

    constructor(
        private listController: EcgListController,
        private ecgUtils: EcgUtils,
        public controller: EcgController,
        public dto: EcgDto,
        public sampleDao: EcgSampleDao,
        public stripGroupController: EcgStripGroupController,
        public config: EcgConfigDto,
        public recordRhythmsDto: RecordRhythmsDto,
        private recordNotifier: RecordNotifier,
        private recordSessionService: RecordSessionEditService
    ) {}

    public ngOnInit(): void {
        this.recordSessionService.doNotCommit = true;
        // Set default according to CLIN-500 rules
        this.controller.processConfig(this.initProperties.ecgCardConfig.config as IEcgConfig);

        setTimeout(() => {
            this.listController.init(this.initProperties.ecgCardConfig);

            // Process ECG Data
            this.listController.processEcgData();

            // Set up DTO (Data Transfer Object)
            this.dto.setData(this.initProperties.ecgCardConfig.data);

            // Use the input init properties to initialize our ecg data
            // This will be building out top level ecg functionality needed by child component to do their jobs
            this.controller.init().subscribe((response: IEcgControllerInit) => {
                this.ecgUtils.ready(this.controller);
            });

            let curInterval = this.dto.data.episode.interval;

            this.listController.registerController(this.controller);
            this.listController.contextMenuIntervals.clear();
            this.listController.contextMenuIntervals.add(curInterval);

            this.sampleDao
                .read({
                    ecgSerialNumber: this.dto.data.serialNumber,
                    sampleReadCursorTaskList: [
                        {
                            cursorType: EcgCursorType.CENTER,
                            cursorIndex: curInterval.startIndex + (curInterval.endIndex - curInterval.startIndex) / 2,
                            durationInSeconds: this.STRIP_DURATION,
                        },
                    ],
                })
                .subscribe((res) => this.processSampleDaoResponse(res));

            this.originalStripConfig = this.stripGroupController.processConfig(this.config.ct.strips.parentStrips[0]);
        }, 1);
    }
	
	public processSampleDaoResponse(sampleDaoResponse: IEcgReadSampleResponse): void {
		let sampleAccessString = `${this.STRIP_DURATION}_SECONDS_SAMPLE`;
		let originalStripConfigClone: IEcgConfigStrip = structuredClone(this.originalStripConfig);
		originalStripConfigClone.global.sampleCursorResultKey = sampleAccessString;
		
		this.dto.regions[sampleAccessString] = sampleDaoResponse.sampleCursorResultList[0];
		
		let rowIntervals: IEcgEpisodeInterval[] = [];
		let intervalRange =
			this.dto.regions[sampleAccessString].interval.endIndex -
			this.dto.regions[sampleAccessString].interval.startIndex;
		const NUM_ROWS = 5;
		for (let i = 0; i < NUM_ROWS; i++) {
			rowIntervals.push({
				startIndex: Math.floor(
					i * (intervalRange / NUM_ROWS) +
					this.dto.regions[sampleAccessString].interval.startIndex
				),
				endIndex:
					Math.floor(
						(i + 1) * (intervalRange / NUM_ROWS) +
						this.dto.regions[sampleAccessString].interval.startIndex
					) - 1,
			});
		}
		
		originalStripConfigClone.global.rowIntervals = rowIntervals;
		originalStripConfigClone.global.disableEditSessionCommitting = true;
		originalStripConfigClone.focusIndicator = {
			show: true,
			duration: 150
		}
		this.originalStripConfigWithSampleData = originalStripConfigClone;
	}

    public closeModal(): void {
        this.recordNotifier.send(RecordChannelKey.OPEN_RIGHT_COL_MODAL, {
            action: RightColModalAction.CLOSE_MODAL,
        });
    }

    public cancelEdits() {
        // Commit edit session
        // CLOSE MODAL AFTER EDIT SESSION COMMIT
        // RELOAD ECG LIST AFTER EDIT SESSION COMMIT
        this.recordSessionService.endEditSession();
        this.recordSessionService.doNotCommit = false;
        this.closeModal();
    }

    public saveEdits() {
        // Cancel edit session
        this.recordSessionService.commitEditSession();
        this.recordSessionService.endEditSession();
        this.recordSessionService.doNotCommit = false;
        this.recordNotifier.send(RecordChannelKey.ACTION, {
            action: RecordChannelAction.REANALYZE_LISTS,
        });
        this.closeModal();
    }
}

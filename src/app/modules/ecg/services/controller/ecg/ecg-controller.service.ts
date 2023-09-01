import { Injectable, OnDestroy } from '@angular/core';

import { Observable, of, Subscription } from 'rxjs';

import {
	EcgDaoEditChannelStatus, IEcgConfig, IEcgControllerInit, IEcgConvertArtifactChannel, IEcgConvertSinusChannel,
	IEpisodeDataRegion, RegionType
} from 'app/modules/ecg/interfaces';
import {
	EcgChannelKey, EcgComponentKey, EcgDaoChannelKey, EcgLineActionType, EcgListActionType, EcgListChannelKey, EcgRhythmTypeEdit
} from 'app/modules/ecg/enums';
import { EcgDaoNotifier } from 'app/modules/ecg/services/notifier/dao/ecg-dao-notifier.service';
import { RhythmType } from 'app/commons/constants/rhythms.const';
import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { EcgListController } from 'app/modules/ecg/components/list/services/controller/ecg-list-controller.service';
import { EcgListNotifier } from 'app/modules/ecg/components/list/services/notifier/ecg-list-notifier.service';
import { EcgEditDao } from 'app/modules/ecg/services/daos/ecg-edit/ecg-edit-dao.service';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';
import { EcgDto } from 'app/modules/ecg/services/dto/ecg/ecg-dto.service';
import { EcgListConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-list-config-dto.service';
import { EcgNotifier } from 'app/modules/ecg/services/notifier/ecg/ecg-notifier.service';
import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';
import { EcgBaseController } from 'app/modules/ecg/services/controller/base/ecg-base-controller.service';


/**
 * EcgController
 *
 * Commander/Delegator/Master
 * Top level ecg logic controller.
 * Responsible for global intialization
 */
@Injectable()
export class EcgController extends EcgBaseController implements OnDestroy {

    private componentDoesExist: boolean = true;

    private timeoutIds: number[] = [];

    private convertToSinusSubs: Subscription;

    private convertToArtifactSubs: Subscription;


    /**
     * Ctor
     */
    public constructor(
        public listNotifier: EcgListNotifier,
        public listController: EcgListController,
	    public notifier: EcgNotifier,
	    public dto: EcgDto,
	    public listConfig: EcgListConfigDto,
        private editDao: EcgEditDao,
        private utils: EcgUtils,
        private config: EcgConfigDto,
        private daoNotifier: EcgDaoNotifier,
	    private recordDto: RecordDto
    ) {
        super();
        this.setComponentKey();
    }


    /**
     * Set component key
     * TODO: I don't like this...
     */
    protected setComponentKey(): void {
        this.componentKey = EcgComponentKey.ECG;
    }


    /**
     * Process global config properties.
     *
     * @param {IEcgConfig} config
     */
    public processConfig(config: IEcgConfig): void {

        // TODO: I'm seeing config being merged all over the place...what seems to be the same config oject
        // We really should figure this out. Do we even need a default config object?? If not we can get rid of all this merging
        // Merging ecg default config with input config to create the final config object
        this.config.ct = config;
        this.config.ct.global = {};
        this.config.ct.gain = EcgConfigDto.mergeConfig('gain', config);
        this.config.ct.actionMenu = EcgConfigDto.mergeConfig('actionMenu', config);
        this.config.ct.toggleMinMax = EcgConfigDto.mergeConfig('toggleMinMax', config);
        this.config.ct.toggleExpandView = EcgConfigDto.mergeConfig('toggleExpandView', config);
        this.config.ct.info = EcgConfigDto.mergeConfig('info', config);
        this.config.ct.strips = config.strips;
        this.config.ct.convertArtifact = EcgConfigDto.mergeConfig('convertArtifact', config);
        this.config.ct.convertSinus = EcgConfigDto.mergeConfig('convertSinus', config);
        this.config.ct.resetView = EcgConfigDto.mergeConfig('resetView', config);
        this.config.ct.html = {};
    }


    /**
     * Global EcgDto initialization method.
     *
     * @param  {IEcgCardConfig} initProps
     * @return {EcgDto}
     */
    public init(): Observable<IEcgControllerInit> {

        // Init episode regions
        this.initEpisodeRegions();

        // Register controller onto list controller
        this.listController.registerController(this);

        // Init list list listeners
        this.initListeners();

    	return of({
    		success: true
    	});
    }


    /**
     * Loops through the regions list and creatig a map of the regions so we don't have to constantly do this everytime
     * we need access to a specific region
     *  (due to refactoring of the endpoint)
     */
    public initEpisodeRegions(): void {

        // Init regions object
        this.dto.regions = {};

        this.dto.data.episode.dataRegionList
            .forEach((region: IEpisodeDataRegion) => {
                this.dto.regions[region.regionType] = region;
            });
    }



    /**
     * This method may not belong here but for now it stays.
     * This method is a bridge each individual ecg card to the EcgListComponent
     * Listens to different channels from child components and relays
     * them to the ListComponent.
     * TODO: Probably a much more dynamic way of doing this
     */
    public initListeners(): void {

        this.convertArtifactListener();
        this.convertToSinusListener();

        // this.toggleExpandViewListener();
        // this.toggleMinMaxListener();
    }

    /**
     * Convert to artifact listener
     */
    private convertArtifactListener(): void {

        // Use the listNotifer, emit message that convert to artifact has changed
        this.convertToArtifactSubs = this.notifier
            .listen(EcgChannelKey.CONVERT_ARTIFACT)
            .subscribe((data: IEcgConvertArtifactChannel) => {

                // Send notification to ListController to remove this card from the list
                this.listNotifier.send(EcgListChannelKey.ACTION, {
                    actionType: EcgListActionType.REMOVE_CARD,
                    primaryEpisodeInterval: this.dto.data.episode.interval,
                });

                // Send notification to DaoController to save the edit
                this.daoNotifier.send(EcgDaoChannelKey.DAO_EDIT, {
					status: EcgDaoEditChannelStatus.EDIT_REQUEST,
	                serialNumber: this.recordDto.serialNumber,
	                request: {
		                ecgAnalyzeRequest: this.recordDto.ecgAnalyzerRequest,
		                ecgRangeEditList: [{
			                rhythmTypeEdit: EcgRhythmTypeEdit.CHANGE_RHYTHM,
			                newRhythmType: RhythmType.ARTIFACT,
			                startIndex: this.dto.data.episode.interval.startIndex,
			                endIndex: this.dto.data.episode.interval.endIndex,
			                paintModeEdit: false
		                }]
	                }
                });
            });
    }

    /**
     * Listens for the convert to sinus action.

     */
    private convertToSinusListener(): void {

        // List for messages over the GAIN_CHANGE channel
       this.convertToSinusSubs = this.notifier
            .listen(EcgChannelKey.CONVERT_SINUS)
            .subscribe((data: IEcgConvertSinusChannel) => {
                // Convert the primary episode rhythm type to sinus
                this.dto.data.episode.rhythmType = RhythmType.SINUS;

                for (let episode of this.dto.regions[RegionType.DEFAULT_SAMPLES].surroundingEpisodeList) {
                    if (episode.interval.startIndex === this.dto.data.episode.interval.startIndex) {
                        episode.rhythmType = RhythmType.SINUS;
                        break;
                    }
                }

                // Reset global list episode array
                this.listConfig.resetEpisodes();

                // Clear out surrounding
                this.sendLineProcessAction();

                // Send a message over the EcgNotifier LINE_ACTION channel to the LineController
                this.sendLineRenderAction();

                // Send message over the ListNotifier for all the other EcgCards (minus this one) to reload the lines
                this.listNotifier.send(EcgListChannelKey.LINE_ACTION, {
                    actions: [
                        {
                            type: EcgLineActionType.LOAD_EPISODES,
                        },
                    ],
                });

                // Clearing out the episodeList which is what the LineController uses to build out the episode lines
                this.daoNotifier.send(EcgDaoChannelKey.DAO_EDIT, {
                    status: EcgDaoEditChannelStatus.EDIT_REQUEST,
                    serialNumber: this.recordDto.serialNumber,
                    request: {
                        ecgAnalyzeRequest: this.recordDto.ecgAnalyzerRequest,
                        ecgRangeEditList: [
                            {
                                rhythmTypeEdit: EcgRhythmTypeEdit.CHANGE_RHYTHM,
                                newRhythmType: RhythmType.SINUS,
                                startIndex: this.dto.data.episode.interval.startIndex,
                                endIndex: this.dto.data.episode.interval.endIndex,
                                paintModeEdit: false,
                            },
                        ],
                    },
                });
            });
    }

    /**
     * Send a message over the EcgNotifier LINE_ACTION channel to the LineController
     *
     * @param {EcgLineActionType = EcgLineActionType.LOAD_EPISODES} actionType
     */
    private sendLineRenderAction(actionType: EcgLineActionType = EcgLineActionType.LOAD_EPISODES) {
        this.notifier.send(EcgChannelKey.LINE_RENDER_ACTION, {
            actions: [
                {
                    type: actionType
                }
            ]
        });
    }

    /**
     * Tells the line controller to process lines for this ecg card
     */
    private sendLineProcessAction(actionType: EcgLineActionType = EcgLineActionType.PROCESS_EPISODE_LINES) {
        this.notifier.send(EcgChannelKey.LINE_RENDER_ACTION, {
            actions: [
                {
                    type: actionType
                }
            ]
        });
    }


    public ngOnDestroy(): void {
        this.destroy();
    }

    public destroy(): void {
        this.timeoutIds.forEach(timeoutID => clearTimeout(timeoutID))
        this.convertToSinusSubs?.unsubscribe();
        this.convertToArtifactSubs?.unsubscribe();
        this.componentDoesExist = false;
    }
}

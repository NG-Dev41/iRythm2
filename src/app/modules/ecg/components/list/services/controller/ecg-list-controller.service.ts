import { Injectable, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { RhythmType } from 'app/commons/constants/rhythms.const';
import {
	RecordRhythmsDto,
} from 'app/features/record/rhythms/record-rhythms.service';
import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { RhythmSortType } from 'app/features/record/services/enums/rhythm-sort-type.enum';
import { RecordDataMapper } from 'app/features/record/services/record-data-map';
import { RecordSessionEditService } from 'app/features/record/services/record-service.service';
import { EcgController } from 'app/modules/ecg/services/controller/ecg/ecg-controller.service';
import { EcgListConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-list-config-dto.service';
import { EcgDaoNotifier } from 'app/modules/ecg/services/notifier/dao/ecg-dao-notifier.service';
import { RecordChannelAction, RecordChannelKey } from '../../../../../../features/record/services/enums';
import { IRecordActionChannel } from '../../../../../../features/record/services/interfaces/channel.interface';
import { RecordNotifier } from '../../../../../../features/record/services/notifiers/record-notifier.service';
import {
	EcgChannelKey,
	EcgComponentKey,
	EcgComponentState,
	EcgDaoChannelKey,
	EcgListActionType,
	EcgListChannelKey,
	EcgRhythmTypeEdit,
	EcgViewType,
} from '../../../../enums';
import {
	BlankBeatsRequestType,
	EcgDaoEditChannelStatus,
	IEcgAnalyzerAnalyzeResponse,
	IEcgBaseMetaData,
	IEcgCardConfig,
	IEcgCurrentEditsResponse,
	IEcgDaoEditChannel,
	IEcgEpisodeInterval,
	IEcgListActionData,
	IEcgListContextMenuAction,
	IEcgListContextMenuChannel,
	IEcgSampleCursorResult,
	IEpisode,
	IEpisodeDataRegion,
	IRhythmResponse,
	ISurroundingEpisode,
} from '../../../../interfaces';
import { EcgListNotifier } from '../notifier/ecg-list-notifier.service';


/**
 * EcgListController
 *
 * Handles list of Ecgs
 */
@Injectable()
export class EcgListController implements OnDestroy{

	// List of child EcgControllers
	// TODO: Do we need this?
	public ecgControllers: Array<EcgController>;

	// Configuration object supplied by calling code
	public config: IEcgCardConfig;

	// Component key
	public componentKey: EcgComponentKey = EcgComponentKey.LIST;

	// Component load state
	public componentLoadState: EcgComponentState = EcgComponentState.LOADING;

	// List of ecg cards
	public ecgCards: Array<IEcgCardConfig>;

	// Original reponse retrieved from the backend
	public response: IEcgAnalyzerAnalyzeResponse;

	public contextMenuIntervals: Set<IEcgEpisodeInterval> = new Set();

   private allSubscriptions: Subscription = new Subscription();
	/**
	 * Ctor
	 */
	public constructor(
        private listNotifier: EcgListNotifier,
        private listConfig: EcgListConfigDto,
        private recordDto: RecordDto,
        private rhythmsDto: RecordRhythmsDto,
        private daoEditNotifier: EcgDaoNotifier,
        private recordSessionEditService: RecordSessionEditService,
		private recordNotifier: RecordNotifier
	) {}


	/**
	 * Global EcgDto initialization method.
	 *
	 * @param  {IEcgCardConfig} SinitProps
	 */
	public init( config: IEcgCardConfig ): void {

		// Init listeners
		this.initListeners();

		// Instantiate list of ecg objects
		this.reset();

		// Assign data and config properties onto controller
		// For now just take the user input config until I can figure this out
		// TODO: Move to DTO?
		this.config = config;

		// Update list config
		// CLIN-656: Episodes aren't used with Additional Strips
		this.listConfig.ct.episodes = new Array<ISurroundingEpisode>();
	}


	/**
	 * Registers an EcgController onto the ecgControllers array.
	 *
	 * @param  {EcgController}        controller
	 * @return {Array<EcgController>}
	 */
	public registerController( controller: EcgController ): Array<EcgController> {
		this.ecgControllers.push( controller );
		return this.ecgControllers;
	}


	/**
	 * Sets current edits response data onto the RecordDto object.
	 *
	 * @param {IEcgCurrentEditsResponse} data
	 */
	public setCurrentEditsResponse( data: IEcgCurrentEditsResponse ): void {
		this.recordDto.currentEdits = data;
	}


	/**
	 * This method may not belong here but for now it stays.
	 * This method is a bridge each individual ecg card to the EcgListComponent
	 * Listens to different channels from child components and relays
	 * them to the ListComponent.
	 */
	public initListeners(): void {

		this.allSubscriptions.add(this.daoEditNotifier
			.listen( EcgDaoChannelKey.DAO_EDIT )
			.subscribe( ( data: IEcgDaoEditChannel ) => {

                if ( data.status === EcgDaoEditChannelStatus.EDIT_RESPONSE ) {
                    // clear contextMenu intervals which are edit session intervals
                    this.contextMenuIntervals.clear();

                    // send notification of update highlight to remove edit session visuals on ecg.component
                    this.listNotifier.send(EcgListChannelKey.CONTEXT_MENU, {
                        action: IEcgListContextMenuAction.UPDATE_HIGHLIGHTING,
                        highlightedIntervals: this.contextMenuIntervals,
                    });
                }
			}));

		// Listening for a convert to artifact action and sending up to the EcgListComponent/Controller
		this.allSubscriptions.add(this.listNotifier
			.listen( EcgListChannelKey.ACTION )
			.subscribe( ( data: IEcgListActionData ) => {

				switch ( data.actionType ) {

					case EcgListActionType.REMOVE_CARD:

						// Implement functionality/logic to remove card at supplied index
						this.removeCard( data.primaryEpisodeInterval );
						break;

					case EcgListActionType.ADD_CARD:
						this.addCard( data.episodeToCopyDataFrom, data.newEpisodeInterval, data.newEpisodeRhythmType, data.metaData, data.region );
						break;

					case EcgListActionType.MODIFY_CARD_PRIMARY_EPISODE:
						this.modifyCardPrimaryEpisode( data.primaryEpisodeInterval, data.newEpisodeInterval );
						break;
				}

			} ));



		this.allSubscriptions.add(this.listNotifier
			.listen( EcgListChannelKey.CONTEXT_MENU )
			.subscribe( ( data: IEcgListContextMenuChannel ) => {

				if ( !this.contextMenuIntervals ) {
					this.contextMenuIntervals = new Set();
				}

				const intervals = this.contextMenuIntervals;

				switch ( data.action ) {
					case IEcgListContextMenuAction.TOGGLE:
						intervals.has( data.intervalToUpdate ) ? intervals.delete( data.intervalToUpdate ) : intervals.add(
							data.intervalToUpdate );
						break;

					case IEcgListContextMenuAction.ADD:
						intervals.add( data.intervalToUpdate );
						break;

					case IEcgListContextMenuAction.REMOVE:
						intervals.delete( data.intervalToUpdate );
						break;

					case IEcgListContextMenuAction.CLEAR:
						intervals.clear();
						break;

					default:
						return;

				}

				this.listNotifier.send(EcgListChannelKey.CONTEXT_MENU, {
                    action: IEcgListContextMenuAction.UPDATE_HIGHLIGHTING,
                    highlightedIntervals: this.contextMenuIntervals,
                });

			} ));

		this.allSubscriptions.add(this.recordNotifier.listen(RecordChannelKey.ACTION).subscribe((data: IRecordActionChannel) => {
			if(data.action === RecordChannelAction.EDIT_SESSION_ENDED) {
				this.ecgCards
					.map(card => card.data.episode.interval)
					.filter(interval => interval.startIndex < 0)
					.forEach(interval => this.removeCard(interval));
			}
		}));

	}

	/**
	 * Returns the index of the card in the ecgCards array for a given interval!!!
	 * TODO: Better description
	 * @param primaryEpisodeInterval
	 * @private
	 */
	private findCardIndex( primaryEpisodeInterval: IEcgEpisodeInterval ): number {
		return this.ecgCards.findIndex( ( card: IEcgCardConfig ) => {
			if ( card.data.episode.interval.startIndex === primaryEpisodeInterval.startIndex && card.data.episode.interval.endIndex ===
				primaryEpisodeInterval.endIndex )
			{
				return true;
			}
			return false;
		} );
	}


	public reset(): void {
		this.ecgControllers = new Array<EcgController>();
		this.ecgCards = new Array<IEcgCardConfig>();
	}


	/**
	 * Removes an ecgCard from the array at the specified index.
	 * NOTE: The index will still exist but will be undefined
	 *
	 * @param {number} index index to remove
	 */
	private removeCard( primaryEpisodeInterval: IEcgEpisodeInterval ): void {
		// Find the index of the card to remove
		const cardIndex = this.findCardIndex( primaryEpisodeInterval );

		// If index is found, remove card
		if ( cardIndex !== -1 ) {
			this.ecgCards.splice( cardIndex, 1 );
		}

		this.contextMenuIntervals.delete(primaryEpisodeInterval);
	}

	/**
	 * Adds a new card to the ecg list containing a given episode interval
	 * Copies a lot of the data from an existing episode
	 * @param episodeToCopyDataFrom
	 * @param newEpisodeInterval
	 * @param newEpisodeType
	 * @param metadata
	 * @private
	 */
	private addCard( episodeToCopyDataFrom: IEpisode,
		                newEpisodeInterval: IEcgEpisodeInterval,
		                newEpisodeType: RhythmType,
		                metadata: IEcgBaseMetaData,
						regionType: string): void {

		// Sinus and Artifact episodes do not get a card
		if ( newEpisodeType === RhythmType.ARTIFACT || newEpisodeType === RhythmType.SINUS ) {
			return;
		}

		// Get default region
		const region = this.findDataRegion( episodeToCopyDataFrom, regionType );

		// let epList = episodeToCopyDataFrom.surroundingEpisodeList;
		const epList = region.surroundingEpisodeList;

		// Check if primary episode is in surrounding episode list
		let alreadyHasPrimEpisode = false;
		for ( const episode of epList ) {
			if ( episode.interval.startIndex === episodeToCopyDataFrom.interval.startIndex && episode.interval.endIndex ===
				episodeToCopyDataFrom.interval.endIndex ) {
				alreadyHasPrimEpisode = true;
				break;
			}
		}

		// If not already in there, then add it
		if ( !alreadyHasPrimEpisode ) {
			for ( let i = 0; i < epList.length; i++ ) {
				const currentEpisode = epList[i];

				if ( currentEpisode.interval.endIndex === episodeToCopyDataFrom.interval.startIndex ) {

					epList.splice( i + 1, 0, {
						rhythmType: episodeToCopyDataFrom.rhythmType,
						interval: episodeToCopyDataFrom.interval
					} );

					i++;
				}
			}
		}
		// Only add card if card does not already exist
		if(this.findCardIndex(newEpisodeInterval) === -1) {
			let newEpisode: IEpisode = structuredClone(episodeToCopyDataFrom);
			newEpisode.rhythmType = newEpisodeType
			newEpisode.confidence = 1;
			newEpisode.interval = newEpisodeInterval;
			newEpisode.dataRegionList = episodeToCopyDataFrom.dataRegionList

			// Add card beneath of card being edited
			this.ecgCards.splice(this.findCardIndex(episodeToCopyDataFrom.interval)+1, 0, {
				list: Object.assign({}, this.config.list),
				config: Object.assign({}, this.config.config),
				data: {
					listIndex: this.ecgCards.length+1,
					serialNumber: this.recordDto.serialNumber,
					metaData: metadata,
					episode: newEpisode,
					sortTypes: this.getRhythmSortTypes(newEpisode)
				}
			});
		}
	}

	/**
	 * If a cards primary episode is modified by another cards paint edit, then edit that cards primary episode to reflect the paint edit
	 * @param primaryEpisodeInterval
	 * @param newEpisodeInterval
	 * @private
	 */
	private modifyCardPrimaryEpisode( primaryEpisodeInterval: IEcgEpisodeInterval, newEpisodeInterval: IEcgEpisodeInterval ): void {

		if(this.contextMenuIntervals.has(primaryEpisodeInterval)) {
			this.contextMenuIntervals.delete(primaryEpisodeInterval);
			this.contextMenuIntervals.add(newEpisodeInterval);
		}

		let cardIndex = this.findCardIndex( primaryEpisodeInterval );

		// Find the episode in the ecgCardsArray
		const currentEpisode = this.ecgCards[cardIndex];

		// If the episode is found, then modify the episode interval to be the newEpisodeInterval
		if ( currentEpisode ) {
			currentEpisode.data.episode.interval = newEpisodeInterval;
				let dtos = this.ecgControllers.filter(controller => {
				return controller.dto.data.episode.interval.startIndex === primaryEpisodeInterval.startIndex
					&& controller.dto.data.episode.interval.endIndex === primaryEpisodeInterval.endIndex
			});

			dtos.forEach(dto => dto.dto.data.episode.interval = newEpisodeInterval);

			let contextMenuInterval = Array.from(this.contextMenuIntervals).find(interval => {
				return interval.startIndex === primaryEpisodeInterval.startIndex
				&& interval.endIndex === primaryEpisodeInterval.endIndex
			})
			if(this.contextMenuIntervals.has(contextMenuInterval)) {
				this.contextMenuIntervals.delete(primaryEpisodeInterval);
				this.contextMenuIntervals.add(newEpisodeInterval);
			}
		}
	}


	/**
	 * Static method to find a given region in the given episode.
	 *
	 * @param  {IEpisode}           episode
	 * @param  {RegionType}         regionType
	 * @return {IEpisodeDataRegion}
	 */
	public findDataRegion( episode: IEpisode, regionType: string ): IEpisodeDataRegion | IEcgSampleCursorResult {

		return this.ecgControllers.find(controller => controller.dto.data.episode.interval.startIndex === episode.interval.startIndex).dto.regions[regionType];
	}

	/**
	 * Process ECG Data
	 */
	public processEcgData(): void {

		// Current edits response
		this.setCurrentEditsResponse( this.rhythmsDto.response.currentEditsResponse );

		const res: IRhythmResponse = this.getCurrentResponse();

		// Loop over episode list
		res.episodeList?.forEach( ( episode: IEpisode, i: number ) => {

			this.ecgCards.push({
				list: Object.assign( {}, this.config.list ),
				config: Object.assign( {}, this.config.config ),
				data: {
					listIndex: i,
					serialNumber: this.recordDto.serialNumber,
					metaData: this.rhythmsDto.response.ecgMetaData,
					episode,
                    sortTypes: this.getRhythmSortTypes(episode)
				}
			});

			// Update component state after loading one episode
			this.componentLoadState = EcgComponentState.READY;
		});
	}

    /**
     * Return sortType to display in episode tags
     * @param episode
     * @private
     */
    private getRhythmSortTypes(episode: IEpisode): RhythmSortType[] {
        const rhythmSortTypes: RhythmSortType[] = [];

        this.rhythmsDto.response.heatMapResponse?.heatMapMetadata?.topSortSummaryList.forEach((summary) => {

            // if episode appears first in the topSortSummaryList, add tag
            if(episode.interval.startIndex === summary.intervalList[0].startIndex){

                rhythmSortTypes.push(summary.sortType);
            }

            // if episode appears 2nd fastest, longest or fastest avg in the topSortSummaryList, add tag
            if(episode.interval.startIndex === summary.intervalList[1]?.startIndex){

                let type;

                switch(summary.sortType) {
                    case RhythmSortType.FASTEST:
                        type = RhythmSortType.SECOND_FASTEST;

                        break;

                    case RhythmSortType.LONGEST:
                        type = RhythmSortType.SECOND_LONGEST;

                        break;

                    case RhythmSortType.FASTEST_AVERAGE:
                        type = RhythmSortType.SECOND_FASTEST_AVERAGE;
                }

                // filter out empty tags
                if(type){
                    rhythmSortTypes.push(type);
                }
            }
        });

        // if episode response is symptomatic, add symptomatic tag
        if(episode.symptomatic){
            rhythmSortTypes.push(RhythmSortType.SYMPTOMATIC);
        }

        // if episode response has mdNotification, add mdn tag
        if(episode.mdNotification){
            rhythmSortTypes.push(RhythmSortType.MDN);
        }

        return rhythmSortTypes;
    }


	private getCurrentResponse(): IRhythmResponse {

		let res: IRhythmResponse;

		// Determine where we need to pull the response data from that will be used to generate the ECG data

		// First check to see if the config is for the Additional Strip view
		// If it is - current solution is to map the additional strip response data to mimic
		// our regular analyze response data.
		if(this.config.config.viewType === EcgViewType.ADDITIONAL_STRIP) {

			res = RecordDataMapper.mapAdditionalStripResponse(this.rhythmsDto.additionalStripResponse);
		}
		else {

			// This is NOT the additional strip view -
			if(this.rhythmsDto.sortType === RhythmSortType.FASTEST_MDN) {
				res = this.rhythmsDto.response.mdnResponse;
			}
			else
			if(this.rhythmsDto.sortType === RhythmSortType.LONGEST_SYMPTOMATIC) {
				res = this.rhythmsDto.response.symptomaticResponse;
			}
			else {
				res = this.rhythmsDto.response.rhythmResponse;
			}
	    }

		return res;
	}

	/**
	 * Blank all beats that are faster than the fastest beat in the selected episode
	 * TODO: This method and "makemakeEpisodeTheSlowest" could be combined into a single method
	 */
	public makeEpisodeTheFastest(): void {
		this.daoEditNotifier.send(EcgDaoChannelKey.DAO_EDIT, {
			request: {
				ecgAnalyzeRequest: this.recordDto.ecgAnalyzerRequest,
				ecgRangeEditList: [{
					rhythmTypeEdit: EcgRhythmTypeEdit.BLANK_HR_REGION_CREATE,
					blankBeatsRequest: {
						rhythmType: this.getCurrentResponse().rhythmType,
						blankBeatsRequestType: BlankBeatsRequestType.FASTEST,
						interval: this.contextMenuIntervals.values().next().value
					}
				}]
			},
			serialNumber: this.rhythmsDto.response.ecgMetaData.serialNumber,
			status: EcgDaoEditChannelStatus.EDIT_REQUEST
		});
	}

	/**
	 * Blank all beats that are slower than the slowest beat in the selected episode
	 */
	public makeEpisodeTheSlowest(): void {
		this.daoEditNotifier.send(EcgDaoChannelKey.DAO_EDIT, {
			request: {
				ecgAnalyzeRequest: this.recordDto.ecgAnalyzerRequest,
				ecgRangeEditList: [{
					rhythmTypeEdit: EcgRhythmTypeEdit.BLANK_HR_REGION_CREATE,
					blankBeatsRequest: {
						rhythmType: this.getCurrentResponse().rhythmType,
						blankBeatsRequestType: BlankBeatsRequestType.SLOWEST,
						interval: this.contextMenuIntervals.values().next().value
					}
				}]
			},
			serialNumber: this.rhythmsDto.response.ecgMetaData.serialNumber,
			status: EcgDaoEditChannelStatus.EDIT_REQUEST
		});
	}

	/**
	 * Helper method to find the bpm for two given beat indexes (Indexes have intervalStartIndex removed from them)
	 * TODO: Move to utility
	 * @param peak1 First beat.index - episode.interval.startIndex
	 * @param peak2 Second beat.index - episode.interval.startIndex
	 * @private
	 */
	private getBPM( peak1: number, peak2: number ): number {
		return Math.round( 60 * this.rhythmsDto.response.ecgMetaData.ecgSampleRate / ( peak2 - peak1 ) );
	}

	/**
	 * Marks all selected intervals as Sinus Episodes
	 */
	public markEpisodesAsSinus(): void {
		for ( const interval of this.contextMenuIntervals ) {
			const episodeController = this.ecgControllers.find( controller => controller.dto.data.episode.interval === interval );

			episodeController.notifier.send( EcgChannelKey.CONVERT_SINUS, {} );
		}
	}

	/**
	 * Marks all selected intervals as Artifact episodes
	 */
	public markEpisodesAsArtifact(): void {
		for ( const interval of this.contextMenuIntervals ) {
			const episodeController = this.ecgControllers.find( controller => controller.dto.data.episode.interval === interval );
			episodeController.notifier.send( EcgChannelKey.CONVERT_ARTIFACT, {} );
		}
	}

    public ngOnDestroy(){
        this.allSubscriptions.unsubscribe();

        // ecgControllers here are not 'provided' by the framework so ngOnDestroy() will not work in these cases
        // we have to manually clean up their resources.
        this.ecgControllers?.forEach((controller) => {
            controller.destroy();
        });

    }
}

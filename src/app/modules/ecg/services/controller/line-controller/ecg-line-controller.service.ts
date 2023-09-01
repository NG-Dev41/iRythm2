import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import {
	IEcgConfig, IEcgControllerInit, IEcgEpisodeInterval, IEcgLineActionChannel, IEcgSampleCursorResult, IEpisodeDataRegion,
	ISurroundingEpisode, RegionType,
} from 'app/modules/ecg/interfaces';
import {
    EcgChannelKey,
    EcgComponentKey,
    EcgLineActionType,
    EcgListActionType,
    EcgListChannelKey,
} from 'app/modules/ecg/enums';
import { EcgNotifier } from 'app/modules/ecg/services/notifier/ecg/ecg-notifier.service';
import { RhythmType, RhythmTypeMeta } from 'app/commons/constants/rhythms.const';
import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { RecordChannelKey } from 'app/features/record/services/enums/channel.enum';
import { IRecordPaintChannel } from 'app/features/record/services/interfaces/channel.interface';
import { RecordNotifier } from 'app/features/record/services/notifiers/record-notifier.service';
import { RecordSessionEditService } from 'app/features/record/services/record-service.service';
import { EcgLineRenderer } from 'app/modules/ecg/components/children/strip/children/strip/services/controller/line/ecg-line-renderer.service';
import { EcgListController } from 'app/modules/ecg/components/list/services/controller/ecg-list-controller.service';
import { EcgListNotifier } from 'app/modules/ecg/components/list/services/notifier/ecg-list-notifier.service';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';
import { EcgDto } from 'app/modules/ecg/services/dto/ecg/ecg-dto.service';
import { EcgListConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-list-config-dto.service';
import { EcgStripConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-strip-config-dto.service';
import { EcgStripUtils } from 'app/modules/ecg/services/utils/ecg-strip-utils.service';
import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';
import { EcgBaseController } from 'app/modules/ecg/services/controller/base/ecg-base-controller.service';
import { EcgLayoutType } from '../../../../../features/record/services/enums';

@Injectable()
export class EcgLineController extends EcgBaseController implements OnDestroy {

    // Flag that will prevent the line from being modified via the ListNotifier
    private processLines: boolean = true;

    private timeoutIds: number[] = [];

    // we can hold references to all subscriptions needed in one Parent subscription to easily manage them
    private allSubscriptions: Subscription = new Subscription();

    private ecgLineRenderer: EcgLineRenderer;

    private region: IEpisodeDataRegion | IEcgSampleCursorResult;

	private selectedCardInterval: IEcgEpisodeInterval;

    /**
     * Ctor
     */
    public constructor(
        private ecgNotifier: EcgNotifier,
        private recordSessionEditService: RecordSessionEditService,
        private ecgUtils: EcgUtils,
        private stripUtils: EcgStripUtils,
        private config: EcgConfigDto,
        private stripConfig: EcgStripConfigDto,
        private recordDto: RecordDto,
        private recordNotifier: RecordNotifier,
        public ecgListController: EcgListController,
        public ecgListNotifier: EcgListNotifier,
        public dto: EcgDto,
        public listConfig: EcgListConfigDto
    ) {
        super();
        this.setComponentKey();
    }

    public init(): Observable<IEcgControllerInit> {

        this.region = this.dto.regions[this.stripUtils.getRegionKey()];

        this.ecgLineRenderer = new EcgLineRenderer(
            this.config,
            this.stripConfig,
            this.dto,
            this.ecgNotifier,
            this.stripUtils
        );

        // Load/Parse the episode lines
        this.processEpisodeLines();

        // Init list list listeners
        this.initListeners();

        this.ecgLineRenderer.init();

        return of({
            success: true,
        });
    }

    private initListeners(): void {
        this.lineListener();
        this.recordNotifierListener();
    }

    /**
     * Set component key
     * TODO: I don't like this...
     */
    protected setComponentKey(): void {
        this.componentKey = EcgComponentKey.LINE;
    }

    /**
     * Process global config properties.
     *
     * TODO: Why is the line controller re-processing the config?
     * @param {HTMLElement} container
     */
    public processConfig(container: HTMLElement, config: IEcgConfig): void {

        // TODO: At some point we may  this config out of this controller
        this.config.ct = {
            global: {},

            gain: EcgConfigDto.mergeConfig('gain', config),

            actionMenu: EcgConfigDto.mergeConfig('actionMenu', config),

            toggleMinMax: EcgConfigDto.mergeConfig('toggleMinMax', config),

            toggleExpandView: EcgConfigDto.mergeConfig('toggleExpandView', config),

            info: EcgConfigDto.mergeConfig('info', config),

            strips: config.strips,

            convertArtifact: EcgConfigDto.mergeConfig('convertArtifact', config),

            convertSinus: EcgConfigDto.mergeConfig('convertSinus', config),

            resetView: EcgConfigDto.mergeConfig('resetView', config),

            html: {
                container: container,
            },
        };
    }

    /**
     * Line Listener
     */
    public lineListener(): void {

        this.allSubscriptions.add(this.ecgListNotifier
            .listen(EcgListChannelKey.LINE_ACTION)
            .subscribe((data: IEcgLineActionChannel) => {
                // Processing all EcgCard episode lines except the one the action was originally done on...
                // b/c it's already been processed
                if (this.processLines === true) {
                    // TODO: Would be nice to know if the lines actually need to rerendered..and not rerender if there's no need
                    this.processEpisodeLines();
                    this.sendLineRenderAction();
                } else {
                    this.processLines = true;
                }
            }));

        this.allSubscriptions.add(this.ecgNotifier
            .listen(EcgChannelKey.LINE_RENDER_ACTION)
            .subscribe((data: IEcgLineActionChannel) => {
                for (const action of data.actions) {
                    switch (action.type) {
                        case EcgLineActionType.PROCESS_EPISODE_LINES:
                            this.processEpisodeLines();
                            // Update to flag to NOT process episode lines for this EcgCard
                            // when the notification is sent out via the ListNotifier
                            this.processLines = false;
                            break;
                    }
                }
            }));

    }

    /**
     * Listen for Record Notifier Paint Rhythm
     */
    recordNotifierListener(): void {

	    this.allSubscriptions.add(this.recordNotifier.listen(RecordChannelKey.PAINT_RHYTHM).subscribe((data: IRecordPaintChannel) => {

            // wait for newRhythmType to be selected, and check that episode interval is in ecgListController
            if(data?.newRhythmType && this.ecgListController.contextMenuIntervals.has(this.dto.data.episode.interval)){
				let startIndex = this.dto.data.episode.interval.startIndex;
				if(startIndex < 1) {
					startIndex = this.dto.data.episode.interval.endIndex * -1;
				}

                // adjust strip indices to episode indices before adding edit to the session edits
                const sessionEdit: IRecordPaintChannel =  {
                    ...data,
                    startIndex: data.startIndex,
                    endIndex: data.endIndex
                };

	            this.selectedCardInterval = Array.from(this.ecgListController.contextMenuIntervals)[0];

	            if(this.stripConfig.ct.children?.length) {
		            this.paintIntervals(data?.newRhythmType, this.stripUtils.getRegionKey());
                }

                this.recordSessionEditService.addSessionEdit(sessionEdit);
            }
        }));

    }

    /**
     * Makes Visual Paint Edit
     * @param newRhythmType
     */
    public paintIntervals(newRhythmType: RhythmType, regionKey: string): void {

		let episodeListRegion = this.dto.regions[regionKey];
		this.selectedCardInterval = Array.from(this.ecgListController.contextMenuIntervals)[0];

        // Since the editBar can contain undefined values, we need to cast as EcgRhythmType to make Typescript happy
        const rhythmTypeNotNull: RhythmType = newRhythmType as RhythmType;

		const [paintStart, paintEnd] = [
			Math.min(this.recordDto.paintIntervalStart, this.recordDto.paintIntervalEnd),
			Math.max(this.recordDto.paintIntervalStart, this.recordDto.paintIntervalEnd)
		];

        // Save caliper indexes as absolute datapoint values
        const newStartIndex = paintStart;
        const newEndIndex = paintEnd;

        // The caliper should insert a new episode, except in a few circumstances, so it defaults to true
        let shouldAddNewEpisode = true;

        // Used for when a paint edit is used to join two episodes, like this:
        // -----xxxx-----xxxx-----
        // -------xxxxxxxxx-------
        // becomes one episode
        // -----xxxxxxxxxxxxx-----
        let shouldJoinEpisode: boolean = false;
        let startingEpisodeIfJoinEpisode: ISurroundingEpisode;

        // Check if primary episode is in surroundingEpisodeList
        let alreadyHasPrimEpisode: boolean = false;
        for (const episode of episodeListRegion.surroundingEpisodeList) {
            if (
                episode.interval.startIndex === this.dto.data.episode.interval.startIndex &&
                episode.interval.endIndex === this.dto.data.episode.interval.endIndex
            ) {
                alreadyHasPrimEpisode = true;
                break;
            }
        }

        // Add primary episode to surroundingEpisodeList if not already in there
        if (!alreadyHasPrimEpisode) {
	        episodeListRegion.surroundingEpisodeList.push({
                rhythmType: this.dto.data.episode.rhythmType,
                interval: this.dto.data.episode.interval,
            });
        }

        // Since the surroundingEpisodeList doesn't include the primary episode, create a new list that does
        // NOTE: The primary IEpisode gets cast down to an ISurroundingEpisode
        // WARNING: MEDIOCRE VISUALISATIONS BELOW
        episodeListRegion.surroundingEpisodeList.sort(
            (a: ISurroundingEpisode, b: ISurroundingEpisode) => a.interval.startIndex - b.interval.startIndex
        );

        for (let i = 0; i < episodeListRegion.surroundingEpisodeList.length; i++) {
            const currentEpisode = episodeListRegion.surroundingEpisodeList[i];

            // The indexes of the existing episode
            const oldStartIndex = currentEpisode.interval.startIndex;
            const oldEndIndex = currentEpisode.interval.endIndex;

			// The new episode completely encompasses the existing episode,
            // so remove the existing episode since it will be painted over
            // --------xxxxxxxx----------
            // ----xxxxxxxxxxxxxxxx------
            if(newStartIndex < oldStartIndex &&  newEndIndex > oldEndIndex) {
				if(currentEpisode.interval.startIndex === this.dto.data.episode.interval.startIndex && rhythmTypeNotNull === this.dto.data.episode.rhythmType) {
					this.paintEditModifyEpisode(currentEpisode, {
						startIndex: newStartIndex,
						endIndex: newEndIndex
					})
					shouldAddNewEpisode = false;
				} else {
					let removeCard = rhythmTypeNotNull === this.dto.data.episode.rhythmType;

					// Delete episode
					this.paintEditRemoveEpisode(
						episodeListRegion.surroundingEpisodeList[i].interval,
						removeCard,
						regionKey
					);

					// Move pointer back one so we don't skip an episode
					i--;
				}


                // New episode overlaps with the beginning of the existing episode
                // -----------xxxxxxxxxx---------
                // ------xxxxxxxxxx--------------
                // If they are the same episode type, they become one episode
                // ------xxxxxxxxxxxxxxx---------
                // If they aren't, the existing episode end become the new episode beginning
                // ------OOOOOOOOOOxxxxx---------
            } else if (newStartIndex < oldStartIndex && newEndIndex < oldEndIndex && newEndIndex > oldStartIndex) {
                // New episode is same type as existing episode, so only modify existing episode
                if (currentEpisode.rhythmType === rhythmTypeNotNull) {
                    // Special case: If we are joining two episodes, then we delete this episode and expand the starting episode
                    // ----xxxx----xxxx----
                    // ------xxxxxxxx------
                    // becomes
                    // ----xxxxxxxxxxxx----
                    // To do this, we expand the first episode to the end of the last episode, and delete the last episode
                    if (shouldJoinEpisode && startingEpisodeIfJoinEpisode) {

						// Make sure to not remove the episode that is the primary episode of the card we are editing,
						if(this.selectedCardInterval.startIndex === currentEpisode.interval.startIndex &&
						this.selectedCardInterval.endIndex === currentEpisode.interval.endIndex) {
							// Expand first episode
							this.paintEditModifyEpisode(currentEpisode, {
								startIndex: startingEpisodeIfJoinEpisode.interval.startIndex,
								endIndex: null,
							});

							// Delete episode
							this.paintEditRemoveEpisode(startingEpisodeIfJoinEpisode.interval, true, regionKey);
						} else {
							// Expand first episode
							this.paintEditModifyEpisode(startingEpisodeIfJoinEpisode, {
								startIndex: null,
								endIndex: currentEpisode.interval.endIndex,
							});

							// Delete episode
							this.paintEditRemoveEpisode(currentEpisode.interval, true, regionKey);
						}

                        // Move pointer back one so we don't skip an episode
                        i--;

                        shouldAddNewEpisode = false;
                    } else {
                        // Episode gets expanded, so existing start index becomes the new start index
                        this.paintEditModifyEpisode(currentEpisode, { startIndex: newStartIndex, endIndex: null });

                        shouldAddNewEpisode = false;
                    }
                } else {
                    // New episode is different type, set existing episode beginning to new episode end;
                    this.paintEditModifyEpisode(currentEpisode, {startIndex: newEndIndex, endIndex: null});
                }

                // new episode is pasted within an existing episode
                // ----------xxxxxxxxxxx---------
                // -------------xxxxx------------
                // If they are the same type nothing happens, but if they aren't,
                // Modify an the exising episode to end at the new episode beginning
                // and add an additional episode from the new episode ending to the
                // existing episode beginning
                // ----------xxxOOOOOxxx---------
            } else if (newStartIndex >= oldStartIndex && newEndIndex <= oldEndIndex) {
                if (currentEpisode.rhythmType !== rhythmTypeNotNull) {
                    // Set the existing episodes end to the new episodes start
                    this.paintEditModifyEpisode(currentEpisode, { startIndex: null, endIndex: newStartIndex });

                    // Create interval where the start is the new episodes end index,
                    // and the end is the existing episodes end index,
                    // Add new episode containing the interval,
                    // and using the existing episodes type
                    this.paintEditAddEpisode(
                        currentEpisode,
                        { startIndex: newEndIndex, endIndex: oldEndIndex },
                        currentEpisode.rhythmType,
	                    regionKey
                    );
                    i++;
                } else {
                    shouldAddNewEpisode = false;
                }

                // New episode overlaps the right edge of the episode
                // -----------xxxxxxxxxxx-------------------
                // -----------------xxxxxxxxxxx-------------
                // If the new and old episode types are the same, they become one episode
                // -----------xxxxxxxxxxxxxxxxx-------------
                // If they aren't, then set the existing episode end to the new episode begin,
                // and add new episode (Note: this is done at the end of the function)
                // -----------xxxxxxOOOOOOOOOOO-------------
            } else if (newStartIndex > oldStartIndex && newStartIndex < oldEndIndex && newEndIndex > oldEndIndex) {
                // New episode type is the same, so we only modify existing episode
                if (currentEpisode.rhythmType === rhythmTypeNotNull) {
                    // Existing episode right edge is expanded to be the new episode right edge
                    this.paintEditModifyEpisode(currentEpisode, { startIndex: null, endIndex: newEndIndex });


                    // If we end up joining an episode later, like this
                    // ----xxxx----xxxx----
                    // ------xxxxxxxx------
                    // =>
                    // ----xxxxxxxxxxxx----
                    // Then we need to save this episode and indicate that we should join an episode if encountering overlap
                    // with an episode on the right
                    shouldAddNewEpisode = false;
                    shouldJoinEpisode = true;
                    startingEpisodeIfJoinEpisode = currentEpisode;
                } else {
                    // New episode type is different, so we shorten the existing episode right edge to the new episode left edge
                    this.paintEditModifyEpisode(currentEpisode, { startIndex: null, endIndex: newStartIndex });
                }
            }
        }

        // Add a new episode at the caliper edges if required
        if (shouldAddNewEpisode) {
            // Create a new interval containing the caliper edges
            const newEpisodeInterval = {
                startIndex: paintStart,
                endIndex: paintEnd,
            };

            // Create surrounding episode
            const surroundEpisode: ISurroundingEpisode = {
                rhythmType: this.dto.data.episode.rhythmType,
                interval: {
                    startIndex: this.dto.data.episode.interval.startIndex,
                    endIndex: this.dto.data.episode.interval.endIndex,
                },
            };

            // Add the episode to the surrounding episode list, where the interval type is the interval type in the edit bar
            this.paintEditAddEpisode(surroundEpisode, newEpisodeInterval, rhythmTypeNotNull, regionKey);
        }

	    // Reset global list episode array
	    this.listConfig.resetEpisodes();

	    // Clear out surrounding
	    this.processEpisodeLines();

	    // Update to flag to NOT process episode lines for this EcgCard when the notification is sent out via the ListNotifier
	    this.processLines = false;

	    // Send a message over the EcgNotifier LINE_ACTION channel to the LineController
	    this.sendLineRenderAction();

	    // Send message over the ListNotifier for all the other EcgCards (minus this one) to reload the lines
	    this.ecgListNotifier.send(EcgListChannelKey.LINE_ACTION, {
            actions: [
                {
                    type: EcgLineActionType.LOAD_EPISODES,
                },
            ],
        });
    }

    /**
     * Adds a new episode to the surroundingEpisodeList, and if neccesary, adds a new card for that episode
     * @param currentEpisode
     * @param newInterval
     * @param newRhythmType
     * @private
     */
    private paintEditAddEpisode(
        currentEpisode: ISurroundingEpisode,
        newInterval: IEcgEpisodeInterval,
        newRhythmType: RhythmType,
	    regionKey: string
    ): void {

        // Autofill missing values from the newInterval
        if (newInterval.startIndex === null) newInterval.startIndex = currentEpisode.interval.startIndex;
        if (newInterval.endIndex === null) newInterval.endIndex = currentEpisode.interval.endIndex;

        // Figure out where to add new interval so surroundingEpisodeList is ordered
        let newEpisodeIndex = 0;
        while (
            this.dto.regions[regionKey].surroundingEpisodeList[newEpisodeIndex]?.interval
                .startIndex <= newInterval.startIndex
        ) {
            newEpisodeIndex++;
        }

	    for(let key of Object.keys(this.dto.regions)) {
			let index = this.dto.regions[key].surroundingEpisodeList.findIndex(episode => {
				return episode.interval.startIndex > newInterval.startIndex
			});

			if(index >= 0) {
				this.dto.regions[key].surroundingEpisodeList.splice(index, 0, {
					rhythmType: newRhythmType,
					interval: newInterval
				});
			} else {
				this.dto.regions[key].surroundingEpisodeList.splice(this.dto.regions[key].surroundingEpisodeList.length, 0, {
					rhythmType: newRhythmType,
					interval: newInterval
				});
			}
	    }

		if(newRhythmType === this.dto.data.episode.rhythmType) {
			if(this.selectedCardInterval.startIndex >= 0 && this.selectedCardInterval.endIndex >= 0) {
				// Create a new card containing the episode we just created
				this.ecgListNotifier.send(EcgListChannelKey.ACTION, {
					actionType: EcgListActionType.ADD_CARD,
					episodeToCopyDataFrom: this.dto.data.episode,
					newEpisodeInterval: Object.assign({}, newInterval),
					newEpisodeRhythmType: newRhythmType,
					metaData: this.dto.data.metaData,
					region: regionKey
				});
			} else {
				// Modify primary episode if it exists on a card
				this.ecgListNotifier.send(EcgListChannelKey.ACTION, {
                    actionType: EcgListActionType.MODIFY_CARD_PRIMARY_EPISODE,
                    primaryEpisodeInterval: Object.assign({}, this.selectedCardInterval),
                    newEpisodeInterval: Object.assign({}, newInterval),
                    region: regionKey,
                });
			}

		}
    }

    /**
     * Modifies an episodes bounds in the surroundingEpisodeList, and modifies the card whose primary episode is the same as the
     * given episode interval
     * @param currentEpisode
     * @param newInterval
     * @private
     */
    private paintEditModifyEpisode(currentEpisode: ISurroundingEpisode, newInterval: IEcgEpisodeInterval): void {
		currentEpisode = structuredClone(currentEpisode);

        // Autofill missing values from the newInterval
        if (newInterval.startIndex == null) newInterval.startIndex = currentEpisode.interval.startIndex;
        if (newInterval.endIndex == null) newInterval.endIndex = currentEpisode.interval.endIndex;

        // Modify primary episode if it exists on a card
        this.ecgListNotifier.send(EcgListChannelKey.ACTION, {
            actionType: EcgListActionType.MODIFY_CARD_PRIMARY_EPISODE,
            primaryEpisodeInterval: Object.assign({}, currentEpisode.interval),
            newEpisodeInterval: Object.assign({}, newInterval),
        });

	    for(let key of Object.keys(this.dto.regions)) {
		    let index = this.dto.regions[key].surroundingEpisodeList.findIndex(episode => {
			    return episode.interval.startIndex === currentEpisode.interval.startIndex
			    && episode.interval.endIndex === currentEpisode.interval.endIndex
		    });

		    if(index >= 0) {
			    this.dto.regions[key].surroundingEpisodeList[index].interval.startIndex = newInterval.startIndex;
			    this.dto.regions[key].surroundingEpisodeList[index].interval.endIndex = newInterval.endIndex;
		    }
	    }
    }

    /**
     * Removes an episode from the surrounding episode list and from the list of cards, if it exists as the primary episode for that card
     * @param intervalToRemove
     * @private
     */
    private paintEditRemoveEpisode(intervalToRemove: IEcgEpisodeInterval, shouldRemoveCard: boolean = true, regionKey: string): void {
        // Find episodes index to remove it
        let indexToRemove = -1;
        for (let i = 0; i < this.dto.regions[regionKey].surroundingEpisodeList.length; i++) {
            let currentEpisodeInterval = this.dto.regions[regionKey].surroundingEpisodeList[i].interval;

            if (
                currentEpisodeInterval.startIndex === intervalToRemove.startIndex &&
                currentEpisodeInterval.endIndex === intervalToRemove.endIndex
            ) {
                indexToRemove = i;
                break;
            }
        }

		if(shouldRemoveCard) {
			// Remove card if episode interval is the card's primary episode
			this.ecgListNotifier.send( EcgListChannelKey.ACTION, {
				actionType: EcgListActionType.REMOVE_CARD,
				primaryEpisodeInterval: Object.assign( {}, intervalToRemove ),
				region: regionKey as RegionType
			} );
		} else {
			if(intervalToRemove.startIndex === this.selectedCardInterval.startIndex && intervalToRemove.endIndex === this.selectedCardInterval.endIndex) {
					this.selectedCardInterval = {
						startIndex: -1 * intervalToRemove.endIndex,
						endIndex: -1 * intervalToRemove.startIndex
					};
			}

			this.ecgListNotifier.send(EcgListChannelKey.ACTION, {
                actionType: EcgListActionType.MODIFY_CARD_PRIMARY_EPISODE,
                primaryEpisodeInterval: Object.assign({}, intervalToRemove),
                newEpisodeInterval: Object.assign(
                    {},
                    {
                        startIndex: -1 * intervalToRemove.endIndex,
                        endIndex: -1 * intervalToRemove.startIndex,
                    }
                ),
                region: regionKey as RegionType,
            });
		}

	    for(let key of Object.keys(this.dto.regions)) {
		    let index = this.dto.regions[key].surroundingEpisodeList.findIndex(episode => {
			    return episode.interval.startIndex === intervalToRemove.startIndex
				    && episode.interval.endIndex === intervalToRemove.endIndex
		    });

		    if(index >= 0) {
			    this.dto.regions[key].surroundingEpisodeList.splice(index, 1);
		    }
	    }
    }

    /**
     * Create array of episodes
     */
    public processEpisodeLines(): void {

        if (!this.config.ct.global.episodes) {
            this.config.ct.global.episodes = new Map<RegionType, Array<ISurroundingEpisode>>();
        }

        let region = this.dto.regions[this.stripConfig.ct.global.region];

        this.listConfig.ct.episodes = [];

        // Step 1: Push all of this EcgCard's episodes onto the global master list config's episodes

        // Push primary episode...if primary episode startIndex is present
        if(this.dto.data.episode.interval?.startIndex !== null && this.dto.data.episode.interval.startIndex >= 0) {
            let episode: ISurroundingEpisode = {
                rhythmType: this.dto.data.episode.rhythmType,
                interval: this.dto.data.episode.interval,
            };
            this.listConfig.ct.episodes.push(episode);
        }

        // Push each surrounding episode
        region.surroundingEpisodeList?.forEach((episode: ISurroundingEpisode) => {
            this.listConfig.ct.episodes.push(episode);
        });

        // Step 2: Loop over all of the global master list config's episodes
        // and process the ones that affect this specific EcgCard
        // Get the current ecg line and primary start/end index for easy access
        const startIndex = region.interval.startIndex;
        const endIndex = region.interval.endIndex;

        // Array of episode types that we don't want to display
        // TODO: This may need to be a configurable property at some point and moved up higher in the food chain
        const excludePaintRhythmTypes: Array<RhythmType> = [];

        const excludeValidRhythmTypes: Array<RhythmType> = [RhythmType.ARTIFACT, RhythmType.SINUS];

        let listStrings = new Map<string, boolean>();

        // Remove all duplicate episodes
        for (let i = 0; i < this.listConfig.ct.episodes.length; i++) {
            let episode = this.listConfig.ct.episodes[i];

            if (listStrings.get(this.ecgUtils.episodeStringKeyCreator(episode))) {
                this.listConfig.ct.episodes.splice(i, 1);
                i--;
            } else {
                listStrings.set(this.ecgUtils.episodeStringKeyCreator(episode), true);
            }
        }

        // Clear episodes before building out the list
        this.config.ct.global.episodes.set(this.stripConfig.ct.global.region, []);
        this.config.ct.global.numValidEpisodes = 0;

        this.listConfig.ct.episodes.forEach((episode: ISurroundingEpisode) => {

            // If this episode is one of our excluded rhythm types - we convert to sinus
            if (!RhythmTypeMeta[episode.rhythmType] || excludePaintRhythmTypes.includes(episode.rhythmType)) {
                episode.rhythmType = RhythmType.SINUS;
            }

            // First make sure we want to include this rhythm type
            if (RhythmTypeMeta[episode.rhythmType] && !excludePaintRhythmTypes.includes(episode.rhythmType)) {
                // Does the loop episode start or end index fall withing the start/end index of the current strip line
                // If so - this episode needs to be added to our local EcgCard episodes
                if (
                    (episode.interval.startIndex >= startIndex && episode.interval.startIndex <= endIndex) ||
                    (episode.interval.endIndex >= startIndex && episode.interval.endIndex <= endIndex) ||
                    (episode.interval.startIndex <= startIndex && episode.interval.endIndex >= endIndex)
                ) {
                    // Set episode default values - start/end index can potential be overridden below
                    let localEpisode: ISurroundingEpisode = {
                        rhythmType: episode.rhythmType,
                        interval: {
                            startIndex: episode.interval.startIndex,
                            endIndex: episode.interval.endIndex,
                        },
                    };

                    // Account for any episode that may have started before the start of our ECG data but overlaps into it
                    if (episode.interval.startIndex < startIndex) {
                        localEpisode.interval.startIndex = region.interval.startIndex;
                    }

                    // Account for any episode that ends after the end of our ECG data but overlaps into it
                    if (episode.interval.endIndex > endIndex) {
                        localEpisode.interval.endIndex = region.interval.endIndex;
                    }

                    // Is this considered a valid episode (used to show primary episode indicator)
                    if (!excludeValidRhythmTypes.includes(episode.rhythmType)) {
                        this.config.ct.global.numValidEpisodes++;
                    }

                    // Add the episode/line to our list current EcgCardList
                    this.config.ct.global.episodes.get(this.stripUtils.getRegionKey()).push(localEpisode);
                }
            }
        });
    }

    /**
     * Send a message over the EcgNotifier LINE_ACTION channel to the LineController
     *
     * @param {EcgLineActionType = EcgLineActionType.LOAD_EPISODES} actionType
     */
    private sendLineRenderAction(actionType: EcgLineActionType = EcgLineActionType.LOAD_EPISODES) {
        this.ecgNotifier.send(EcgChannelKey.LINE_RENDER_ACTION, {
            actions: [
                {
                    type: actionType,
                },
            ],
        });
    }

    public ngOnDestroy(): void {
        this.destroy();
    }

    public destroy(): void {
        this.timeoutIds.forEach((timeoutID) => clearTimeout(timeoutID));
        this.allSubscriptions.unsubscribe();
    }
}

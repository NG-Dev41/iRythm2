import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { RhythmType } from 'app/commons/constants/rhythms.const';
import {
	IEcgAnalyzerLoaderConfig,
	IEcgAnalyzerAnalyzeResponse,
	IEpisode,
	IEcgAnalyzerLoaderResponse
} from '../../../interfaces';
import { EcgAnalyzerDao } from './ecg-analyzer-dao.service';
import { EcgAnalyzerLoaderState } from '../../../enums';
import { RhythmSortType } from 'app/features/record/services/enums/rhythm-sort-type.enum';
import { LoadingSpinnerService } from 'app/commons/services/loading-spinner/loading-spinner.service';


/**
 * [Injectable description]
 */
@Injectable()
export class EcgAnalyzerLoader {

	// Serial number
	public serialNumber: string;

	// Analyze endpoint limit
	public limit: number = 0;

	// Analyze endpoint offset
	private offset: number = 0;

	// Total number of items matching request
	private totalMatchingItems: number = 0;

	// Number of analyze items loaded (fully loaded)
	private itemsLoaded: number = 0;

	// Flag to indicate whether data is actively being loaded or not
	public dataLoading: boolean = false;

	// Original config - never modified - used for resetting Loader back to its original state
	private config: IEcgAnalyzerLoaderConfig = null;

	// Rhythm types
	public rhythmTypes: Array<RhythmType>;

	// Response data returned from /analyze endpoint
	public analyzeEcgResponse: IEcgAnalyzerAnalyzeResponse;

	public newResponseNotifier$: Subject<IEcgAnalyzerAnalyzeResponse>;

	// New episode notifier
	public newEcgNotifier$: Subject<IEcgAnalyzerLoaderResponse>;

	// Loading State
	public loadState: EcgAnalyzerLoaderState = EcgAnalyzerLoaderState.IDLE;


	/**
	 * Ctor
	 *
	 * @param {EcgDao} public ecgAnalyzeDao
	 */
	public constructor(
		public ecgAnalyzerDao: EcgAnalyzerDao,
		private loadingSpinnerService: LoadingSpinnerService
	) { }


	/**
	 * Loads EcgData
	 */
	public loadData(): void {

		// Update load state
		this.loadState = EcgAnalyzerLoaderState.LOADING;

		if (this.totalMatchingItems === 0 || this.totalMatchingItems > this.itemsLoaded) {

			// Toggle loading flag
			this.dataLoading = true;

			// Method of loadingSpinnerService to display the loading spinner.
			this.loadingSpinnerService.show();

			// Make request for ecg data
			this.ecgAnalyzerDao
				.analyze({
					ecgSerialNumber: this.serialNumber,

				    rhythmRequest: {
				        rhythmType: this.rhythmTypes[0],
		                rhythmRequestConfiguration: {
		                	requestPagination: {
		                		limit: this.limit,
		                		offset: this.offset
		                	}
		                }
				    },

                    heatMapRequest: {
                        rhythmType: this.rhythmTypes[0],
                        heatMapConfiguration: {
                            requestSort: { sortType: RhythmSortType.LONGEST },
                            requestPagination: {
                                limit: this.limit,
                                offset: this.offset
                            }
                        }
                    }
	            })
	            .subscribe((response: IEcgAnalyzerAnalyzeResponse) => {

					// Set response data for later use
					this.analyzeEcgResponse = response;

					this.newResponseNotifier$.next(response);

	            	// Update offset
	            	this.offset += this.limit;

	            	// response.rhythmResponse
	            	// Update total ecg strips available
	            	this.totalMatchingItems = response.rhythmResponse.rhythmRequestConfigurationResult.episodeMatchingCount;

			    	// Loop over each episode
			    	response.rhythmResponse?.episodeList?.forEach((episode: IEpisode, i: number) => {

			    		// Push episode for calling code to react to
			    		this.pushEpisode(episode);

			    		// Update num items loaded
			    		this.itemsLoaded++;
			    	});

					// Toggle loading flag
					this.dataLoading = false;

					// Method of loadingSpinnerService to hide the loading spinner.
					this.loadingSpinnerService.hide();
				});
		}
		else {
			this.loadState = EcgAnalyzerLoaderState.LOADED;
		}
	}


	/**
	 * Pushes new episode for calling code to react to.
	 *
	 * @param {IEpisodeResponse} episode
	 */
	private pushEpisode(episode: IEpisode): void {

		// Update load state
		this.loadState = EcgAnalyzerLoaderState.LOADED;

		this.newEcgNotifier$.next({
			episode: episode,
			currentEditsResponse: this.analyzeEcgResponse.currentEditsResponse,
			metaData: this.analyzeEcgResponse.ecgMetaData
		});
	}


	/**
	 * Sets config props.
	 *
	 * @param {IEcgOnDemandLoaderProperties} properties
	 */
	public configure(config: IEcgAnalyzerLoaderConfig): void {
		this.reset();
		this.config = config;
		Object.assign(this, config);
	}


	/**
	 * Resets Loader back to it's original state
	 */
	public reset(): void {
		this.newEcgNotifier$ = new Subject<IEcgAnalyzerLoaderResponse>();
        this.newResponseNotifier$ = new Subject<IEcgAnalyzerAnalyzeResponse>();
		this.analyzeEcgResponse = null;
		this.offset = 0;
		this.totalMatchingItems = 0;
		this.itemsLoaded = 0;
		this.loadState = EcgAnalyzerLoaderState.IDLE;
	}
}

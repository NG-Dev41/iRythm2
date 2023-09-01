import { Injectable, OnDestroy } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { INavigationItem } from 'app/commons/constants/page-meta.const';
import { RhythmType } from 'app/commons/constants/rhythms.const';
import { IRHYTHM_COLORS } from 'app/commons/enums/common.enum';
import { IHeaderNotifyAction } from 'app/commons/interfaces/channel.interface';
import { PageChannelKey, PageNotifier } from 'app/commons/services/notifiers/page-notifier.service';
import { EcgDaoChannelKey } from 'app/modules/ecg/enums';
import {
    EcgAnalyzeChannelStatus, EcgDaoEditChannelStatus, IEcgAnalyzeChannel, IEcgAnalyzerAnalyzeResponse, IEcgDaoEditChannel
} from 'app/modules/ecg/interfaces';
import { EcgDaoController } from 'app/modules/ecg/services/controller/dao/ecg-dao-controller.service';
import { Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { RecordDto } from '../services/dtos/record-dto.service';
import { RhythmSortType } from '../services/enums/rhythm-sort-type.enum';
import { IRecordRhythmsInitConfig } from '../services/interfaces/record-rhythms-init-config.interface';
import { TranslateService } from '@ngx-translate/core';
import { IAdditionalStripsResponse } from 'app/commons/services/dao/additional-strips-dao.service';


@Injectable()
export class RecordRhythmsDto {

    // Rhythm type
    public rhythmType: RhythmType;

    // Sort Type
    public sortType?: RhythmSortType;

	// Current /analyze response data
	public response?: IEcgAnalyzerAnalyzeResponse;

	// Previous /analyze response data
	public previousResponse?: IEcgAnalyzerAnalyzeResponse;

    // Additional strip response data
    public additionalStripResponse?: IAdditionalStripsResponse;
}


@Injectable()
export class RecordRhythmsService implements OnDestroy {

    // Rhythms config properties
    // This could be used to set some default properties that could be overriden by the init config param
    private config: IRecordRhythmsInitConfig;

	readonly rhythmsDtoResponseChange$: Subject<boolean> = new Subject<boolean>();

    private allSubscriptions: Subscription = new Subscription();

    // Maps RhythmType to the sorttypes, used to build subtabs
    private readonly rhythmSubTabs = {
        [RhythmType.SVT]: [RhythmSortType.LONGEST, RhythmSortType.FASTEST, RhythmSortType.FASTEST_AVERAGE, RhythmSortType.SLOWEST],
        [RhythmType.PAUSE]: [RhythmSortType.LONGEST, RhythmSortType.SLOWEST],
        [RhythmType.VT]: [RhythmSortType.LONGEST, RhythmSortType.FASTEST, RhythmSortType.FASTEST_AVERAGE, RhythmSortType.SLOWEST],
        [RhythmType.AFIB]: [RhythmSortType.LONGEST, RhythmSortType.FASTEST, RhythmSortType.SLOWEST],
        [RhythmType.WENCKEBACH]: [RhythmSortType.FASTEST, RhythmSortType.SLOWEST],
        [RhythmType.IVR]: [RhythmSortType.SLOWEST, RhythmSortType.FASTEST, RhythmSortType.FASTEST_AVERAGE]
    }

    private readonly RHYTHM_SORT_TRANSLATE_KEY: string = 'record.rhythm.sort';
    /**
     * 
     * @param pageNotifier 
     * @param ecgDaoController 
     * @param rhythmsDto 
     * @param recordDto 
     * @param router 
     * @param route 
     */
    public constructor(
        private pageNotifier: PageNotifier,
		private ecgDaoController: EcgDaoController,
        private rhythmsDto: RecordRhythmsDto,
	    private recordDto: RecordDto,
	    private router: Router,
	    private route: ActivatedRoute,
        private translateService: TranslateService
    ) {
        // this is ok to create the listeners only once here
        this.allSubscriptions.add(this.ecgDaoController.daoNotifier
            .listen(EcgDaoChannelKey.DAO_EDIT)
            .pipe(filter(channelData => channelData.status === EcgDaoEditChannelStatus.EDIT_RESPONSE))
            .subscribe((channelData: IEcgDaoEditChannel) => {
                this.processEditResponse(channelData);
            }));


        this.allSubscriptions.add(this.ecgDaoController.daoNotifier
            .listen(EcgDaoChannelKey.ANALYZE)
            .pipe(filter(channelData => channelData.status === EcgAnalyzeChannelStatus.ANALYZE_RESPONSE))
            .subscribe((channelData: IEcgAnalyzeChannel) => {
                this.processAnalyzeResponse(channelData);
            }));

    }


    /**
     * Init top level rhythms functionality/data
     *
     * @param {IRecordRhythmsInitConfig} config
     */
    public init(config: IRecordRhythmsInitConfig): void {

        // Set config
        this.config = config;

        // Build rhythms page top level dto
        this.initRhythmsDto();

	    this.buildNavigationSubTabs();
    }


    /**
     * Initializes our RhythmsDto object
     */
    private initRhythmsDto(): void {

        // Ensure that rhythm type is uppercase
        this.rhythmsDto.rhythmType = <RhythmType>this.config.rhythmType.toUpperCase();

        // If we have a sort type convert to uppercase otherwise get the default sort
        if(this.config.sortType && this.rhythmSubTabs[this.rhythmsDto.rhythmType].includes(this.config.sortType)) {

            // Ensure all caps
            this.rhythmsDto.sortType = <RhythmSortType>this.config.sortType.toUpperCase();
        }
        else {
            // Default sort
            this.rhythmsDto.sortType = this.rhythmSubTabs[this.rhythmsDto.rhythmType][0];
        }
    }

	/**
	 * Process the /edit channel data.
	 * @param editChannelData
	 */
	public processEditResponse(editChannelData: IEcgDaoEditChannel): void {

		this.buildNavigationSubTabs();

		this.rhythmsDto.previousResponse = this.rhythmsDto.response;

		// 'Episode Sort Type has changed' snackbars
		if(this.rhythmsDto.previousResponse.heatMapResponse) {
			let sortTypesThatHaveChanges: RhythmSortType[] = [];
			let cur = editChannelData.response.heatMapResponse.heatMapMetadata.topSortSummaryList.filter(res => res.sortType !== this.rhythmsDto.sortType);
			let prev = this.rhythmsDto.previousResponse.heatMapResponse.heatMapMetadata.topSortSummaryList.filter(res => res.sortType !== this.rhythmsDto.sortType);

			for(const sortType in RhythmSortType) {
				let curTopSortInterval = cur.find(topSortSummary => topSortSummary.sortType === sortType);
				let prevTopSortInterval = prev.find(topSortSummary => topSortSummary.sortType === sortType);

				if(curTopSortInterval?.intervalList[0].startIndex !== prevTopSortInterval?.intervalList[0].startIndex
					|| curTopSortInterval?.intervalList[0].endIndex !== prevTopSortInterval?.intervalList[0].endIndex) {

					sortTypesThatHaveChanges.push(sortType as RhythmSortType);
				}
			}

            // if/elseif block is to display a snackbar when a sortType has been changed
            // language changes between singlar/plural
			if(sortTypesThatHaveChanges.length == 1) {
                // Retrive translations before sending to snackbar since 
                this.translateService.get([
                        `${this.RHYTHM_SORT_TRANSLATE_KEY}.${sortTypesThatHaveChanges[0]}`, 
                        `${this.RHYTHM_SORT_TRANSLATE_KEY}.changes.singularChanged`
                ])
                .subscribe((notifyText: any) => {
                    let combinedNotifyText: string = Object.values(notifyText).join(' ')
                    this.pageNotifier.send(PageChannelKey.HEADER_NOTIFY, {
                        action: IHeaderNotifyAction.ADD,
                        snackbars: [{
                            text: combinedNotifyText,
                            backgroundColor: IRHYTHM_COLORS.LIGHT_GREY,
                            shouldHaveCloseButton: true,
                            clickFunction: () => this.router.navigate([], {
                                relativeTo: this.route,
                                queryParams: {
                                    sortType: sortTypesThatHaveChanges[0]
                                }
                            })
                        }]
                    });
                });

			} else if(sortTypesThatHaveChanges.length > 1) {
				let displaySortTypesThatHaveChanges: string[] = sortTypesThatHaveChanges.map(sortType => `${this.RHYTHM_SORT_TRANSLATE_KEY}.${sortType}`);
                displaySortTypesThatHaveChanges.push(`${this.RHYTHM_SORT_TRANSLATE_KEY}.changes.joiner`); 
                displaySortTypesThatHaveChanges.push(`${this.RHYTHM_SORT_TRANSLATE_KEY}.changes.multipleChanged`);
                // [0...n-2] = sort types
                // [n - 1] = joiner word (e.g. and)
                // [n] = multiple changed language (e.g. episodes have changed)
                this.translateService.get(displaySortTypesThatHaveChanges).subscribe((notifyText: any) => {
                    let translatedStrings = Object.values<string>(notifyText);
                    const episodeText = `${translatedStrings.slice(0, -3).join(', ')} ${translatedStrings.slice(-2,-1)} ${translatedStrings.slice(-3, -2)} ${translatedStrings.slice(-1)}`;

                    this.pageNotifier.send(PageChannelKey.HEADER_NOTIFY, {
                        action: IHeaderNotifyAction.ADD,
                        snackbars: [
                            {
                                text: episodeText,
                                backgroundColor: IRHYTHM_COLORS.LIGHT_GREY,
                                shouldHaveCloseButton: true
                            }
                        ]
                    });
                });
			}
		}

		this.rhythmsDto.response.heatMapResponse = editChannelData.response.heatMapResponse;
		this.ecgDaoController.daoNotifier.send(EcgDaoChannelKey.DAO_EDIT, {
			status: EcgDaoEditChannelStatus.EDIT_PROCESSING_COMPLETE,
			serialNumber: editChannelData.serialNumber,
			response: editChannelData.response
		});


	}

    /**
     * Process the /analyze response data.
     *
     * @param {IEcgAnalyzerAnalyzeResponse} analyzeChannelData
     */
    public processAnalyzeResponse(analyzeChannelData: IEcgAnalyzeChannel): void {

		this.buildNavigationSubTabs();

		// Setting our previous and current response properties
		// Note: previousResponse will be initally null
		this.rhythmsDto.previousResponse = null;
		this.rhythmsDto.response = analyzeChannelData.response;
        this.rhythmsDto.additionalStripResponse = analyzeChannelData.additionalStripsResponse

		this.ecgDaoController.daoNotifier.send(EcgDaoChannelKey.ANALYZE, {
			status: EcgAnalyzeChannelStatus.ANALYZE_RESPONSE_PROCESSING_COMPLETE,
			serialNumber: analyzeChannelData.serialNumber,
			response: analyzeChannelData.response,
            additionalStripsResponse: analyzeChannelData.additionalStripsResponse
		});

    }


    /**
     * Builds Rhythms Sub Tab Navigation
     *
     * For a selected RhythmType, this function will build out subtabs based on the
     * class-level variable mapping the RhythmType to the list of RhythmSortTypes that 
     * a user will be able to sort the rhythms by. 
     */
    private buildNavigationSubTabs(): void {

        // Array of rhythm sub tab nav items that will ultimately get sent to the header
        let subTabs: Array<INavigationItem> = new Array<INavigationItem>();

		let curRhythmType = this.rhythmsDto.rhythmType;

        let subTabList = this.rhythmSubTabs[curRhythmType];
        if(subTabList) {
            subTabList.forEach((sortType: RhythmSortType, index: number) => {
                subTabs.push({
                    name: `${this.RHYTHM_SORT_TRANSLATE_KEY}.${sortType}`,
                    isDefault: index === 0,
                    params: {
                        sortType: sortType
                    }
                })
            });
        }

	    if(this.recordDto.detectedRhythmsInfo?.mdnRhythmList?.includes(curRhythmType)) {
			subTabs.push({
				name: `${this.RHYTHM_SORT_TRANSLATE_KEY}.${RhythmSortType.FASTEST_MDN}`,
				params: {
					['sortType']: RhythmSortType.FASTEST_MDN
				}
			});
	    }

	    if(this.recordDto.detectedRhythmsInfo?.symptomaticRhythmList?.includes(curRhythmType)) {
		    subTabs.push({
			    name: `${this.RHYTHM_SORT_TRANSLATE_KEY}.${RhythmSortType.LONGEST_SYMPTOMATIC}`,
			    params: {
					['sortType']: RhythmSortType.LONGEST_SYMPTOMATIC
			    }
		    });
	    }

        // Send sub tabs to header - could be an empty array
        this.pageNotifier.send(PageChannelKey.NAVIGATION_SUB_TABS, {
            subTabs: subTabs
        });
    }


    public ngOnDestroy(): void {
        this.allSubscriptions.unsubscribe();
    }
}
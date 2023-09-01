import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EcgListChannelKey, EcgMinMaxType } from 'app/modules/ecg/enums';
import { EcgListNotifier } from 'app/modules/ecg/components/list/services/notifier/ecg-list-notifier.service';
import { EcgDto } from 'app/modules/ecg/services/dto/ecg/ecg-dto.service';
import { IEcgCardConfig, IEcgConfigStrip, IEcgListContextMenuChannel, IEcgListContextMenuAction, RegionType, SubRegion, ShowHRType } from 'app/modules/ecg/interfaces';
import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { EcgLayoutType } from 'app/features/record/services/enums';
import { RhythmSortType } from 'app/features/record/services/enums/rhythm-sort-type.enum';

@Component({
  selector: 'app-split-strip',
  templateUrl: './split-strip.component.html',
  styleUrls: ['./split-strip.component.scss']
})
export class SplitStripComponent implements OnInit{
    // for showing sortType bubbles
    @Input() public ecgCardConfig: IEcgCardConfig;

	private _ecgMinMaxType: EcgMinMaxType;

	public get ecgMinMaxType(): EcgMinMaxType {
		return this._ecgMinMaxType
	}

	@Input() public set ecgMinMaxType(minMaxType: EcgMinMaxType) {
		if(!minMaxType) return;
		this._ecgMinMaxType = minMaxType;
		this.setStripConfigs();
	};

	private _stripConfig: IEcgConfigStrip;

	@Input() public set stripConfig(stripConfig: IEcgConfigStrip){
		if(!stripConfig) return;
		this.processInputStripConfig(stripConfig);
		this.setStripConfigs();
	}

	public get stripConfig(): IEcgConfigStrip {
		return this._stripConfig;
	}

	public stripConfigTop: IEcgConfigStrip;

	public stripConfigBottom: IEcgConfigStrip;

	public processedStripConfig: IEcgConfigStrip;

	public isEpisodeHighlighted: boolean = false;


	/**
	 * Ctor
	 *
	 * @param listNotifier
	 * @param dto
	 * @param activatedRoute
	 * @param recordDto
	 */
	public constructor(
		public listNotifier: EcgListNotifier,
		public dto: EcgDto,
		private activatedRoute: ActivatedRoute,
		private recordDto: RecordDto)
	{}

	public ngOnInit(): void {
		this.listNotifier.listen( EcgListChannelKey.CONTEXT_MENU ).subscribe( ( data: IEcgListContextMenuChannel ) => {
			if( data.action === IEcgListContextMenuAction.UPDATE_HIGHLIGHTING && data.highlightedIntervals ) {
				this.isEpisodeHighlighted = data.highlightedIntervals.has( this.dto.data?.episode.interval );
			}
		});

		// Set initial EcgMinMaxType
		if(!this.ecgMinMaxType) {
			let sortType;

			this.activatedRoute.queryParams.subscribe(queryParams => {
				sortType = (queryParams['sortType']) ? queryParams['sortType'] : RhythmSortType.LONGEST;
			});

			if([RhythmSortType.LONGEST, RhythmSortType.FASTEST_MDN, RhythmSortType.LONGEST_SYMPTOMATIC].includes(sortType)) {
				this._ecgMinMaxType = EcgMinMaxType.DURATION;
			}  else if([RhythmSortType.FASTEST, RhythmSortType.FASTEST_AVERAGE, RhythmSortType.SLOWEST].includes(sortType)) {
				this._ecgMinMaxType = EcgMinMaxType.HEART_RATE;
			}
		}
	}

	private processInputStripConfig( stripConfig: IEcgConfigStrip ): void {
		this._stripConfig = stripConfig;

		// Default values we want for all strip configs
		let processedStripConfig = structuredClone(this.stripConfig);
		processedStripConfig.beats.showLines = false;
		processedStripConfig.global.secondsViewType = null;
		processedStripConfig.caliper.show = false;
		processedStripConfig.episodeDurationText = {
			show: false
		};

		// If layout is Tile, add tileTop value otherwise leave as undefined
		if (this.recordDto.ecgListLayoutType === EcgLayoutType.TILE) {
			processedStripConfig.global.tileTop = 20;
		}

		this.processedStripConfig = processedStripConfig
	}

	/**
	 * Load strip configs based on the queryParams['sortType'];
	 * @private
	 */
	private setStripConfigs(): void {
		if(!this.processedStripConfig || !this.ecgMinMaxType) return;

		let sortType: RhythmSortType;

		this.activatedRoute.queryParams.subscribe(queryParams => {
			sortType=queryParams['sortType'];
			if(!sortType) sortType = RhythmSortType.LONGEST
		});

		// Episodes less than 12 seconds long get a static view of the entire episode
		if(this.dto.data.episode.episodeDuration < 12) {
			let stripConfigTop = this.createStripConfig(RegionType.DEFAULT_SAMPLES, null, SubRegion.PREVIOUS_8_SECONDS_FROM_CENTER);
			stripConfigTop.episodeDurationText.show = true;
			this.stripConfigTop = stripConfigTop
			this.stripConfigBottom = this.createStripConfig(RegionType.DEFAULT_SAMPLES, null, SubRegion.NEXT_8_SECONDS_FROM_CENTER);
			return;
		}

		switch(sortType) {
			case RhythmSortType.LONGEST:
			case RhythmSortType.FASTEST_MDN:
			case RhythmSortType.LONGEST_SYMPTOMATIC:
				this.createStripConfigs(ShowHRType.AVERAGE);
				break;

			case RhythmSortType.FASTEST:
			case RhythmSortType.FASTEST_AVERAGE:
				this.createStripConfigs(ShowHRType.MAX);
				break;

			case RhythmSortType.SLOWEST:
				this.createStripConfigs(ShowHRType.MIN);
				break;
		}
	}

	/**
	 * Generate the MIN/MAX or ONSET/OFFSET strip configs
	 * @param showHrType
	 * @private
	 */
	private createStripConfigs(showHrType?: ShowHRType): void {
		if(this.ecgMinMaxType === EcgMinMaxType.DURATION) {
			let stripConfigTop = this.createStripConfig(RegionType.ONSET);
			stripConfigTop.episodeDurationText.show = true;
			this.stripConfigTop = stripConfigTop
			this.stripConfigBottom = this.createStripConfig(RegionType.OFFSET);
		} else {
			this.stripConfigTop = this.createStripConfig(RegionType.MIN, showHrType);
			this.stripConfigBottom = this.createStripConfig(RegionType.MAX);
		}
	}

	/**
	 * Generate an individual split-strip config
	 * @param region
	 * @param showHRType
	 * @param subRegion
	 * @private
	 */
	private createStripConfig(region: RegionType, showHRType?: ShowHRType, subRegion: SubRegion = SubRegion.CENTERED_ON_8_SECONDS ): IEcgConfigStrip {
		let stripConfig: IEcgConfigStrip = structuredClone(this.processedStripConfig);
		stripConfig.global.region = region;
		stripConfig.global.subRegion = subRegion;
		if(showHRType) stripConfig.global.showHrType = showHRType;

		return stripConfig;

	}

	/**
	 * Select or multi-select ecg-card
	 * @param $event
	 */
	public selectEcgCard($event: MouseEvent ) {
		if( $event.button === 0 && $event.ctrlKey ) {
			this.listNotifier.send(EcgListChannelKey.CONTEXT_MENU, {
                action: IEcgListContextMenuAction.TOGGLE,
                intervalToUpdate: this.dto.data.episode.interval,
            });
		} else if($event.button === 0) {
			let isEpisodeHighlighted = this.isEpisodeHighlighted;
            this.listNotifier.send(EcgListChannelKey.CONTEXT_MENU, {
                action: IEcgListContextMenuAction.CLEAR,
            });
            if (!isEpisodeHighlighted) {
                this.listNotifier.send(EcgListChannelKey.CONTEXT_MENU, {
                    action: IEcgListContextMenuAction.ADD,
                    intervalToUpdate: this.dto.data.episode.interval,
                });
            }
		} else if( $event.button === 2 && this.isEpisodeHighlighted ) {
			$event.preventDefault();
			$event.stopPropagation();
			$event.stopImmediatePropagation();
			this.listNotifier.send(EcgListChannelKey.CONTEXT_MENU, {
                action: IEcgListContextMenuAction.OPEN_CONTEXT_MENU,
                contextMenuClickEvent: $event,
            });
		}
	}
}

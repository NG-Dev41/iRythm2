import { Component, Input, OnDestroy, OnInit, ViewEncapsulation , ViewChild, ElementRef } from '@angular/core';

import { EcgController } from 'app/modules/ecg/services/controller/ecg/ecg-controller.service';

import {
	EcgDaoEditChannelStatus, IEcgCardConfig, IEcgConfig, IEcgControllerInit, IEcgDaoEditChannel, IEcgEpisodeInterval,
	IEcgListContextMenuAction, IEcgListContextMenuChannel
} from 'app/modules/ecg/interfaces';
import { EcgDaoChannelKey, EcgListChannelKey, EcgViewType } from '../enums';
import { EcgNotifier } from 'app/modules/ecg/services/notifier/ecg/ecg-notifier.service';
import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';
import { EcgDaoNotifier } from 'app/modules/ecg/services/notifier/dao/ecg-dao-notifier.service';
import { EcgListNotifier } from 'app/modules/ecg/components/list/services/notifier/ecg-list-notifier.service';
import { RecordSessionEditService } from 'app/features/record/services/record-service.service';
import { RecordSidebarService } from 'app/features/record/services/record-sidebar.service';
import { EcgConfigDto } from '../services/dto/ecg/ecg-config-dto.service';
import { EcgDto } from '../services/dto/ecg/ecg-dto.service';
import { Subscription } from 'rxjs';
import { RecordChannelKey } from '../../../features/record/services/enums';
import { RightColModalAction, RightColModalType } from '../../../features/record/services/interfaces/channel.interface';
import { RecordNotifier } from '../../../features/record/services/notifiers/record-notifier.service';
import { QA_DATE_FORMAT } from 'app/commons/constants/common.const';

/**
 * EcgComponent
 *
 * Top level ecg component.
 * Parent to all children components.
 *
 */
@Component({
    selector: 'app-ecg2',
    templateUrl: './ecg.component.html',
    styleUrls: ['./ecg.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        EcgController,
        EcgUtils,
        EcgDto,
        EcgConfigDto,
        EcgNotifier
    ]
})
export class EcgComponent implements OnInit, OnDestroy {


    // Incoming init properties used to initialize the Ecg and all related components
    @Input()
    public initProperties: IEcgCardConfig;

    // TODO: This maybe needs a more accurate name (isActiveStrip || isActiveEcg) and should exist on a DTO
	public isEpisodeHighlighted: boolean = false;

    private allSubscriptions:Subscription = new Subscription();

    private initTimeout: ReturnType<typeof setTimeout>;

    // For use in template
    public EcgViewType = EcgViewType;

    // For use in template
    public QA_DATE_FORMAT = QA_DATE_FORMAT;


	/**
	 * Ctor
	 *
	 * @param controller
	 * @param notifier
	 * @param config
	 * @param dto
	 * @param ecgUtils
	 * @param daoNotifier
	 * @param listNotifier
	 */
	public constructor(
        public controller: EcgController,
	    public notifier: EcgNotifier,
	    public config: EcgConfigDto,
	    public dto: EcgDto,
        private ecgUtils: EcgUtils,
        private daoNotifier: EcgDaoNotifier,
	    private listNotifier: EcgListNotifier,
        private sidebarService: RecordSidebarService,
        private sessionEditService: RecordSessionEditService,
		private recordNotifier: RecordNotifier
    ) {}

    /**
     * OnInit
     */
    public ngOnInit(): void {

		// Update the episode data on edit, which will update the ecg-card-info
		this.allSubscriptions.add(this.daoNotifier.listen(EcgDaoChannelKey.DAO_EDIT).subscribe((data: IEcgDaoEditChannel) => {
			if(data.status === EcgDaoEditChannelStatus.EDIT_PROCESSING_COMPLETE) {

				for(let episode of data.response.potentialImpactedEpisodeList) {
					let curEpisodeInterval = this.dto.data.episode.interval;
					if(episode.interval.startIndex === curEpisodeInterval.startIndex
						&& episode.interval.endIndex === curEpisodeInterval.endIndex) {
						Object.assign(this.dto.data.episode, episode);
					}
				}

			}
		} ));

		// this notification is sent by the EcgListController service
		this.allSubscriptions.add(this.listNotifier.listen( EcgListChannelKey.CONTEXT_MENU ).subscribe( ( data: IEcgListContextMenuChannel ) => {
			if( data.action === IEcgListContextMenuAction.UPDATE_HIGHLIGHTING && data.highlightedIntervals ) {
				this.isEpisodeHighlighted = data.highlightedIntervals.has( this.dto.data.episode.interval );
			}
		}));


        this.initTimeout = setTimeout(() => {

            // 1255px
            // TODO: RM - this.cardWidth.nativeElement.offsetWidth is maybe 10px greater than it needs to be. why?
            this.controller.processConfig(
                this.initProperties.config as IEcgConfig
            );

            // Set up DTO (Data Transfer Object)
            this.dto.setData(this.initProperties.data);

            // Use the input init properties to initialize our ecg data
            // This will be building out top level ecg functionality needed by child component to do their jobs
            this.controller
                .init()
                .subscribe((response: IEcgControllerInit) => {
                    this.ecgUtils.ready(this.controller);
                });

        }, 1);
    }

    /**
     * OnDestroy
     */
    public ngOnDestroy(): void {
        this.notifier.stopListening();
        this.allSubscriptions.unsubscribe();
        clearTimeout(this.initTimeout);
    }


    /**
     * Multi Select Cards
     * @param $event
     */
	public multiSelectEcgCards($event: MouseEvent ) {

		if($event.button === 0 && $event.shiftKey ) {
			this.recordNotifier.send(RecordChannelKey.OPEN_RIGHT_COL_MODAL, {
				action: RightColModalAction.OPEN_MODAL,
				type: RightColModalType.MULTILINE_STRIP_MODAL,
				initProperties: {
					ecgCardConfig: this.initProperties
				}
			})
		}

	    // $event.button 0 is left mouse button
        // represents left mouse click with ctrlKey down
		if( $event.button === 0 && $event.ctrlKey ) {

            // EcgListController ecg-list-controller.service.ts is listening for this
            // and adds or deletes the interval from it's contextMenuIntervals .
            // it then re-emits the contextMenuIntervals on the same channel but with
            // action: IEcgListContextMenuAction.UPDATE_HIGHLIGHTING action. See above ngOnInit() method
            // where there is a listener set for this action
            this.listNotifier.send(EcgListChannelKey.CONTEXT_MENU, {
                action: IEcgListContextMenuAction.TOGGLE,
                intervalToUpdate: this.controller.dto.data.episode.interval,
            });

            // $event.button 2 is a right mouse button
            // if we are highlighted and get a right click we will open the context menu
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

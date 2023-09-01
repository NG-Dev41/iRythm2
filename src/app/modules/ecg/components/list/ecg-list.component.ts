import { Component, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

import {
    IEcgCardConfig,
    IEcgListActionData,
    IEcgListContextMenuAction,
    IEcgListContextMenuChannel,
} from '../../interfaces';
import { EcgComponentState, EcgListActionType, EcgListChannelKey } from '../../enums';
import { EcgListConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-list-config-dto.service';
import { RecordRhythmsDto } from 'app/features/record/rhythms/record-rhythms.service';
import { EcgListController } from './services/controller/ecg-list-controller.service';
import { EcgListNotifier } from './services/notifier/ecg-list-notifier.service';
import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { EcgLayoutType } from 'app/features/record/services/enums';
import { Subscription } from 'rxjs';
import { RhythmSortType } from 'app/features/record/services/enums/rhythm-sort-type.enum';

/**
 * EcgList
 *
 * Parent component to a list of components.
 */
@Component({
    selector: 'app-ecg-list',
    templateUrl: './ecg-list.component.html',
    styleUrls: ['./ecg-list.component.scss'],
    providers: [
        EcgListNotifier,
        EcgListController,
        EcgListConfigDto
    ]
})
export class EcgListComponent implements OnInit, OnDestroy {

    // Incoming init properties used to intialize the Ecg and all related components
    @Input() public config: IEcgCardConfig = {}; // this is from record-rhythms.component

    // For use in the template
    public EcgComponentState = EcgComponentState;

    // For use in template
    public EcgLayoutType = EcgLayoutType;

	public menuTopLeftPosition =  {x: '0', y: '0'}

	@ViewChild('contextMenuTrigger') matMenuTrigger: MatMenuTrigger;

	public shouldShowFastestSlowestButton = false;

	private isContextMenuOpen = false;

	// For use in the template
	public RhythmSortType = RhythmSortType;

    // ID of tile episode that has been clicked to show long view
    // Using the interval.startIndex as our ID
    public activeEpisodeId: number = null;

    private allSubscriptions: Subscription = new Subscription();


	@HostListener('document:contextmenu', ['$event'])
	onRightClick($event) {
		if(this.isContextMenuOpen) $event.preventDefault();
		return !this.isContextMenuOpen;
	}


	public constructor(
        public ecgListController: EcgListController,
		public rhythmsDto: RecordRhythmsDto,
		private notifier: EcgListNotifier,
		public recordDto: RecordDto
    ) {}


    /**
     * OnInit
     */
    public ngOnInit(): void {

        // Init Listeners
        this.initListeners();

        // Init list controller
        this.ecgListController.init(this.config);

        // Process ECG Data
		this.ecgListController.processEcgData();
    }


    /**
     * Inits listeners
     * Listener that listens for actions that need to be taken on the list of episodes
     */
    private initListeners(): void {

        // Listen for the command to reload the list
        this.allSubscriptions.add(this.notifier
            .listen(EcgListChannelKey.ACTION)
            .subscribe((data: IEcgListActionData) => {

                switch(data.actionType) {

                    case EcgListActionType.RELOAD_CARDS:

                        this.ecgListController.componentLoadState = EcgComponentState.LOADING;

	                    this.ecgListController.processEcgData();
                        break;
                }
            }));


		this.allSubscriptions.add(this.notifier
			.listen(EcgListChannelKey.CONTEXT_MENU)
			.subscribe((data: IEcgListContextMenuChannel) => {
				switch (data.action) {
					case IEcgListContextMenuAction.OPEN_CONTEXT_MENU:
						this.isContextMenuOpen = true;
						data.contextMenuClickEvent.preventDefault();
						data.contextMenuClickEvent.stopPropagation();
						data.contextMenuClickEvent.stopImmediatePropagation();
						this.menuTopLeftPosition.x = `${data.contextMenuClickEvent.x}px`;
						this.menuTopLeftPosition.y = `${data.contextMenuClickEvent.y}px`;
						this.matMenuTrigger.openMenu();
						break;

					case IEcgListContextMenuAction.UPDATE_HIGHLIGHTING:
						this.shouldShowFastestSlowestButton = data.highlightedIntervals.size === 1;
						break;
				}
			}));
    }


    /**
     * OnDestroy
     */
    public ngOnDestroy(): void {
		this.notifier.stopListening();
        this.allSubscriptions.unsubscribe();
    }

	public disableContextMenu( $event: MouseEvent ) {
		$event.stopImmediatePropagation();
		$event.stopPropagation();
		$event.preventDefault();
		return false;
	}
}

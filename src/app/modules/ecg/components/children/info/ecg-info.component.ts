import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';

import {
    EcgDaoEditChannelStatus, IEcgCardConfig, IEcgControllerInit, IEcgDaoEditChannel, IEcgListContextMenuAction, IEcgListContextMenuChannel
} from 'app/modules/ecg/interfaces';
import { EcgComponentState, EcgDaoChannelKey, EcgListChannelKey } from 'app/modules/ecg/enums';
import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';
import { EcgDaoNotifier } from 'app/modules/ecg/services/notifier/dao/ecg-dao-notifier.service';
import { EcgDto } from 'app/modules/ecg/services/dto/ecg/ecg-dto.service';
import { EcgListNotifier } from 'app/modules/ecg/components/list/services/notifier/ecg-list-notifier.service';
import { EcgInfoController } from './services/controller/ecg-info-controller.service';
import { Subscription } from 'rxjs';
import { RhythmSortType } from 'app/features/record/services/enums/rhythm-sort-type.enum';


/**
 * EcgInfo
 *
 * Ecg info data. Child of EcgComponent
 */
@Component({
    selector: 'app-ecg-info',
    templateUrl: './ecg-info.component.html',
    styleUrls: ['./ecg-info.component.scss'],
   providers: [
        EcgInfoController
    ]
})
export class EcgInfoComponent implements OnInit, OnDestroy {

    // for showing sortType bubbles
    @Input() public ecgCardConfig: IEcgCardConfig;

    // For use in the template
    public EcgComponentState = EcgComponentState;

	public isSelected: boolean = false;

    public RhythmSortType = RhythmSortType;

    private allSubscriptions = new Subscription();

	/**
	 * Ctor
	 *
	 * @param controller
	 * @param ecgDto
	 * @param daoNotifier
	 * @param ecgListNotifier
	 * @param ecgUtils
	 */
	public constructor(
	    public controller: EcgInfoController,
	    public ecgDto: EcgDto,
	    public daoNotifier: EcgDaoNotifier,
	    public ecgListNotifier: EcgListNotifier,
        private ecgUtils: EcgUtils
    ) {}

    /**
     * On Init
     */
    public ngOnInit(): void {

        // Run init method
        this.controller
            .init()
            .subscribe((response: IEcgControllerInit) => {

                // Controller is initalized
                this.ecgUtils.ready(this.controller);
            });

		this.allSubscriptions.add(this.daoNotifier.listen(EcgDaoChannelKey.DAO_EDIT).subscribe((data: IEcgDaoEditChannel) => {
			if(data.status === EcgDaoEditChannelStatus.EDIT_PROCESSING_COMPLETE) {
				this.controller.init();
			}
		}));

		this.allSubscriptions.add(this.ecgListNotifier
			.listen(EcgListChannelKey.CONTEXT_MENU)
			.pipe(filter(data => data.action === IEcgListContextMenuAction.UPDATE_HIGHLIGHTING))
			.subscribe((data: IEcgListContextMenuChannel) => {
				this.isSelected = data.highlightedIntervals.has( this.ecgDto.data.episode.interval );
			}));

    }

    ngOnDestroy(){
        this.allSubscriptions.unsubscribe();
    }
}

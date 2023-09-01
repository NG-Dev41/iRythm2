import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { EcgLayoutType } from 'app/features/record/services/enums';
import { IEcgCardConfig, IEcgListActionData, IEcgParentConfigStripInput } from 'app/modules/ecg/interfaces';
import { EcgListController } from '../../list/services/controller/ecg-list-controller.service';
import { EcgListNotifier } from '../../list/services/notifier/ecg-list-notifier.service';
import { Subscription } from 'rxjs';
import { EcgListActionType, EcgListChannelKey } from '../../../enums';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-ecg-list-row',
    templateUrl: './ecg-list-row.component.html',
    styleUrls: ['./ecg-list-row.component.scss'],
})
export class EcgListRowComponent implements OnInit, OnDestroy {
    // Incoming init properties used to intialize the Ecg and all related components
    @Input()
    public initProperties: IEcgCardConfig;

    // ???
    @Input()
    public startingIndex: number = 0;

    // Subset of EcgCards that will be displayed per row
    public ecgCardsSubset: Array<IEcgCardConfig>;

    // For use in template
    public EcgLayoutType = EcgLayoutType;

    // ID of tile episode that has been clicked to show long view
    // Using the interval.startIndex as our ID
    public activeEpisodeId: number = null;

    private intervalChangedSubs: Subscription;

    public constructor(
        private ecgListController: EcgListController,
        private listNotifier: EcgListNotifier,
        public recordDto: RecordDto
    ) {}

    /**
     * On Init
     */
    public ngOnInit(): void {
        if (this.startingIndex !== 0) {
            this.startingIndex += 1;
        }

        // Get subset of EcgCards that need to be displayed on this row
        this.ecgCardsSubset = this.ecgListController.ecgCards.slice(this.startingIndex, 3 + this.startingIndex);

        // when painting rhythms on this strip there is high chance that the startIndex of the interval of this strip can change
        //  If this occurs we need to ensure that the expanded strip remains visible
        this.intervalChangedSubs = this.listNotifier
            .listen(EcgListChannelKey.ACTION)
            .pipe(
                filter(
                    (data: IEcgListActionData) =>
                        data.actionType === EcgListActionType.MODIFY_CARD_PRIMARY_EPISODE &&
                        data.primaryEpisodeInterval.startIndex === this.activeEpisodeId
                )
            )
            .subscribe((data: IEcgListActionData) => {
                this.activeEpisodeId = data.newEpisodeInterval.startIndex;
            });
    }

    public openLongEpisodeView(episodeId: number): void {
        this.activeEpisodeId = this.activeEpisodeId === episodeId ? null : episodeId;
    }

    ngOnDestroy(): void {
        this.intervalChangedSubs.unsubscribe();
    }
}

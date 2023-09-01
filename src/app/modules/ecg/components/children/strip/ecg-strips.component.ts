import { Component } from '@angular/core';


import { EcgListChannelKey, EcgViewType } from 'app/modules/ecg/enums';
import { IEcgListContextMenuAction } from 'app/modules/ecg/interfaces';
import { EcgController } from 'app/modules/ecg/services/controller/ecg/ecg-controller.service';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';
import { EcgListController } from 'app/modules/ecg/components/list/services/controller/ecg-list-controller.service';
import { EcgListNotifier } from 'app/modules/ecg/components/list/services/notifier/ecg-list-notifier.service';


@Component({
    selector: 'app-ecg-strips',
    templateUrl: './ecg-strips.component.html',
    styleUrls: ['./ecg-strips.component.scss']
})
export class EcgStripsComponent {

    // For use in template
    public EcgViewType = EcgViewType;


    /**
     * Ctor
     *
     * @param {EcgController}     public ec
     * @param {EcgConfigDto}      public config
     * @param {EcgController}     public controller
     * @param {EcgListNotifier}   public listNotifier
     * @param {EcgListController} public ecgListController
     */
    public constructor(
        public ec: EcgController,
        public config: EcgConfigDto,
        public controller: EcgController,
        public listNotifier: EcgListNotifier,
        public ecgListController: EcgListController
    ) { }


    /**
     * Select Card for single edit session
     *
     * @param {MouseEvent} $event
     */
    public selectEcgCard($event: MouseEvent): void {

        // make sure ctrl isn't pressed for multi-select
        if(!$event.ctrlKey) {

            // toggle episode selection
            if(this.controller.dto.data.episode.interval){
                this.ecgListController.contextMenuIntervals.clear();
            }

            this.listNotifier.send(EcgListChannelKey.CONTEXT_MENU, {
                action: IEcgListContextMenuAction.ADD,
                intervalToUpdate: this.controller.dto.data.episode.interval,
            });
        }
    }
}

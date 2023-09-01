import { Component, OnInit } from '@angular/core';

import { IEcgControllerInit } from 'app/modules/ecg/interfaces';
import { EcgComponentState } from 'app/modules/ecg/enums';
import { EcgPrimaryEpisodeIndicatorController } from './ecg-primary-episode-indicator-controller.service'
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';
import { EcgStripConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-strip-config-dto.service';
import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';


@Component({
    selector: 'app-ecg-primary-episode-indicator',
    templateUrl: './ecg-primary-episode-indicator.component.html',
    styleUrls: ['./ecg-primary-episode-indicator.component.scss'],
    providers: [
        EcgPrimaryEpisodeIndicatorController
    ]
})
export class EcgPrimaryEpisodeIndicatorComponent implements OnInit {

    // For use in the template
    public EcgComponentState = EcgComponentState;


    /**
     * Ctor
     *
     * @param {EcgUtils}                             private ecgUtils
     * @param {EcgPrimaryEpisodeIndicatorController} public  controller
     * @param {EcgConfigDto}                         public  config
     * @param {EcgStripConfigDto}                    public  stripConfig
     */
    public constructor(
        private ecgUtils: EcgUtils,
        public controller: EcgPrimaryEpisodeIndicatorController,
        public config: EcgConfigDto,
        public stripConfig: EcgStripConfigDto
    ) {}


    /**
     * On Init
     */
    public ngOnInit(): void {

        // Run init method
        this.controller
            .init()
            .subscribe((response: IEcgControllerInit) => {
                this.ecgUtils.ready(this.controller);
            });
    }
}

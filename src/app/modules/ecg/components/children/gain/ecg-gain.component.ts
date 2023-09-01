import { Component, OnInit } from '@angular/core';

import { EcgGainController } from './services/controller/ecg-gain-controller.service';
import { IEcgControllerInit } from 'app/modules/ecg/interfaces';
import { EcgComponentState } from 'app/modules/ecg/enums';
import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';


/**
 * EcgGainComponent
 *
 * Gain controls
 */
@Component({
    selector: 'app-ecg-gain',
    templateUrl: './ecg-gain.component.html',
    styleUrls: ['./ecg-gain.component.scss'],
    providers: [
        EcgGainController
    ]
})
export class EcgGainComponent implements OnInit {

    // For use in the template
    public EcgComponentState = EcgComponentState;


    /**
     * Ctor
     *
     * @param ecgUtils
     * @param controller
     * @param config
     */
    public constructor(
        private ecgUtils: EcgUtils,
        public controller: EcgGainController,
        public config: EcgConfigDto
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
    }
}

import { Component, OnInit } from '@angular/core';

import { EcgToggleMinMaxController } from 'app/modules/ecg/components/children/toggle-min-max/services/controller/ecg-toggle-min-max-controller.service';
import { IEcgControllerInit } from 'app/modules/ecg/interfaces';
import { EcgComponentState } from 'app/modules/ecg/enums';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';
import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';


@Component({
    selector: 'app-ecg-toggle-min-max',
    templateUrl: './ecg-toggle-min-max.component.html',
    styleUrls: ['./ecg-toggle-min-max.component.scss'],
    providers: [EcgToggleMinMaxController]
})
export class EcgToggleMinMaxComponent implements OnInit {

    public EcgComponentState = EcgComponentState;


    /**
     * Ctor
     *
     * @param {EcgUtils}                  private ecgUtils
     * @param {EcgToggleMinMaxController} public  ecgToggleMinMaxController
     */
    public constructor(
        private ecgUtils: EcgUtils,
        public controller: EcgToggleMinMaxController,
        public config: EcgConfigDto
    ) {}


    /**
     * OnInit
     */
    public ngOnInit(): void {
        // Run init method
        this.controller
            .init()
            .subscribe((response: IEcgControllerInit) => {

                // Controller is initialized
                this.ecgUtils.ready(this.controller);
            });

    }
}

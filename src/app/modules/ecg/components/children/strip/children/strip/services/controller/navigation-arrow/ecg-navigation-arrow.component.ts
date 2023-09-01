import { Component, OnInit } from '@angular/core';

import { EcgNavigationArrowController } from './ecg-navigation-arrow-controller.service';
import { EcgComponentState } from 'app/modules/ecg/enums';
import { IEcgControllerInit } from 'app/modules/ecg/interfaces';
import { EcgStripConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-strip-config-dto.service';
import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';


@Component({
    selector: 'app-ecg-navigation-arrow',
    templateUrl: './ecg-navigation-arrow.component.html',
    styleUrls: ['./ecg-navigation-arrow.component.scss'],
    providers: [
        EcgNavigationArrowController
    ]
})
export class EcgNavigationArrowComponent implements OnInit {

    // For use in the template
    public EcgComponentState = EcgComponentState;


    public constructor(
        public controller: EcgNavigationArrowController,
        private ecgUtils: EcgUtils,
        public config: EcgStripConfigDto
    ) { }


    /**
     * OnInit
     */
    public ngOnInit(): void {

        // All config and html elements are loaded - render the strip
        this.controller
            .init()
            .subscribe((response: IEcgControllerInit) => {
                this.ecgUtils.ready(this.controller);
            });
    }
}

import { Component, OnInit } from '@angular/core';

import { EcgComponentState } from 'app/modules/ecg/enums';
import { IEcgControllerInit } from 'app/modules/ecg/interfaces';
import { EcgToggleExpandViewController } from 'app/modules/ecg/components/children/toggle-expand-view/services/controller/ecg-toggle-expand-view-controller.service';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';
import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';


@Component({
    selector: 'app-ecg-toggle-expand-view',
    templateUrl: './ecg-toggle-expand-view.component.html',
    styleUrls: ['./ecg-toggle-expand-view.component.scss'],
    providers: [EcgToggleExpandViewController]
})
export class EcgToggleExpandViewComponent implements OnInit {
    public EcgComponentState = EcgComponentState;

    constructor(
        private ecgUtils: EcgUtils,
        public controller: EcgToggleExpandViewController,
        public config: EcgConfigDto
    ) {}

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

import { Component, OnInit } from '@angular/core';

import { EcgResetViewController } from 'app/modules/ecg/components/children/reset-view/services/controller/ecg-reset-view-controller.service';
import { EcgComponentState } from 'app/modules/ecg/enums';
import { IEcgControllerInit } from 'app/modules/ecg/interfaces';
import { EcgResetViewType } from 'app/modules/ecg/enums';
import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';

/**
 * EcgResetViewComponent
 *
 * Description
 */
@Component({
    selector: 'app-ecg-reset-view',
    templateUrl: './ecg-reset-view.component.html',
    styleUrls: ['./ecg-reset-view.component.scss'],
    providers: [EcgResetViewController]
})
export class EcgResetViewComponent implements OnInit {

    public EcgComponentState = EcgComponentState;

    public EcgResetViewType = EcgResetViewType;


    /**
     * Ctor
     *
     * @param {EcgUtils}               private ecgUtils
     * @param {EcgResetViewController} public  controller
     */
    constructor(
        private ecgUtils: EcgUtils,
        public controller: EcgResetViewController
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

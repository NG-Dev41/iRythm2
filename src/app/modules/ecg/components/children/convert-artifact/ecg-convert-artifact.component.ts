import { Component, OnInit, Input } from '@angular/core';

import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';
import { IEcgControllerInit } from '../../../interfaces';
import { EcgComponentState } from '../../../enums';
import { EcgConvertArtifactController } from './services/controller/ecg-convert-artifact-controller.service';


@Component({
    selector: 'app-ecg-convert-artifact',
    templateUrl: './ecg-convert-artifact.component.html',
    styleUrls: ['./ecg-convert-artifact.component.scss'],
    providers: [
        EcgConvertArtifactController
    ]
})
export class EcgConvertArtifactComponent implements OnInit {

    // For use in the template
    public EcgComponentState = EcgComponentState;


    /**
     * Ctor
     *
     * @param {EcgController}     private ecgController
     * @param {EcgGainController} public  ecgGainController
     */
    public constructor(
        private ecgUtils: EcgUtils,
        public controller: EcgConvertArtifactController
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

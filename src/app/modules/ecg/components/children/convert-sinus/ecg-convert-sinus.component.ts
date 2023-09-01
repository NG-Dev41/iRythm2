import { Component, OnInit, Input } from '@angular/core';

import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';
import { EcgConvertSinusController } from './services/controller/ecg-convert-sinus-controller.service';
import { IEcgControllerInit } from '../../../interfaces';
import { EcgComponentState } from '../../../enums';


/**
 * EcgConvertSinus
 */
@Component({
    selector: 'app-ecg-convert-sinus',
    templateUrl: './ecg-convert-sinus.component.html',
    styleUrls: ['./ecg-convert-sinus.component.scss'],
    providers: [
        EcgConvertSinusController
    ]
})
export class EcgConvertSinusComponent implements OnInit {

    // For use in the template
    public EcgComponentState = EcgComponentState;

    // Flag to keep track if the sinus button has been clicked
    public buttonClicked: boolean = false;


    /**
     * Ctor
     *
     * @param {EcgController}             private ecgController
     * @param {EcgConvertSinusController} public  componentController
     */
    public constructor(
        private ecgUtils: EcgUtils,
        public controller: EcgConvertSinusController
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


    /**
     * Process sinus button click.
     * Disables the button.
     * Passes the command onto the controller
     */
    public convertToSinus(): void {

        // If button hasn't been clicked carry out the action
        if(!this.buttonClicked) {
            this.controller.convertToSinus();
            this.buttonClicked = true;
        }
    }
}

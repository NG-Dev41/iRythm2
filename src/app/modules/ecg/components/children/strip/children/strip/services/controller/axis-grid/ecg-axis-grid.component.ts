import { Component, OnInit } from '@angular/core';

import { EcgNotifier } from 'app/modules/ecg/services/notifier/ecg/ecg-notifier.service';
import { EcgComponentState, EcgChannelKey } from 'app/modules/ecg/enums';
import { IEcgControllerInit, EcgNonScrollableContentActionType } from 'app/modules/ecg/interfaces';
import { EcgStripConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-strip-config-dto.service';
import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';
import { EcgAxisGridController } from './ecg-axis-grid-controller.service';

@Component({
    selector: 'app-ecg-axis-grid',
    templateUrl: './ecg-axis-grid.component.html',
    styleUrls: ['./ecg-axis-grid.component.scss'],
    providers: [
        EcgAxisGridController
    ]
})
export class EcgAxisGridComponent implements OnInit {

    // For use in the template
    public EcgComponentState = EcgComponentState;


    /**
     * Ctor
     *
     * @param {EcgAxisGridController} public  controller
     * @param {EcgUtils}              private ecgUtils
     * @param {EcgStripConfigDto}     public  config
     * @param {EcgNotifier}           private ecgNotifier
     */
    public constructor(
        public controller: EcgAxisGridController,
        private ecgUtils: EcgUtils,
        public config: EcgStripConfigDto,
	    private ecgNotifier: EcgNotifier
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

		this.ecgNotifier.listen(EcgChannelKey.NON_SCROLLABLE_CONTENT).subscribe((data) => {
			for(let action of data.actions) {
				switch(action.type) {
					case EcgNonScrollableContentActionType.RENDER_ALL:
						this.controller.generateVerticalGridLines();
						break;

				}
			}
		});
    }
}

import { ChangeDetectorRef, Component, Input, OnInit, OnDestroy } from '@angular/core';

import { IEcgParentConfigStrip, IEcgControllerInit } from 'app/modules/ecg/interfaces';
import { EcgComponentState, EcgViewType } from 'app/modules/ecg/enums';
import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';
import { EcgStripGroupController } from './services/controller/ecg-strip-group-controller.service';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';


@Component({
    selector: 'app-ecg-strip-group',
    templateUrl: './ecg-strip-group.component.html',
    styleUrls: ['./ecg-strip-group.component.scss'],
    providers: [
        EcgStripGroupController
    ]
})
export class EcgStripGroupComponent implements OnInit, OnDestroy{

    // Config input
    @Input() public config: IEcgParentConfigStrip;

    // Config output
    public stripConfig: IEcgParentConfigStrip;

    // For use in the template
    public EcgComponentState = EcgComponentState;

    // For use in the template
    public EcgViewType = EcgViewType;

    private initTimeout: ReturnType<typeof setTimeout>;


    public constructor(
        public ecgConfig: EcgConfigDto,
        public controller: EcgStripGroupController,
        private ecgUtils: EcgUtils,
	    private cdRef: ChangeDetectorRef
    ) { }


    /**
     * OnInit
     */
    public ngOnInit(): void {

	    this.initTimeout = setTimeout( () => {

        // Process parent/child strip config
        this.stripConfig = this.controller.processConfig(this.config);

        // Run init method
        this.controller
            .init()
            .subscribe((response: IEcgControllerInit) => {

                // Controller is initalized
                this.ecgUtils.ready(this.controller);
            });
		    this.cdRef.detectChanges();
	    }, 1 );
    }

    public ngOnDestroy(): void {
        clearTimeout(this.initTimeout);
    }
}

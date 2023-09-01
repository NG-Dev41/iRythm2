import { Injectable, OnDestroy } from '@angular/core';

import { Observable, of } from 'rxjs';

import { EcgBaseController } from 'app/modules/ecg/services/controller/base/ecg-base-controller.service';
import { EcgNotifier } from 'app/modules/ecg/services/notifier/ecg/ecg-notifier.service';
import { IEcgControllerInit, IEcgToggleMinMaxChannel } from 'app/modules/ecg/interfaces';
import { EcgChannelKey, EcgComponentKey, EcgMinMaxType } from 'app/modules/ecg/enums';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';


/**
 * EcgToggleMinMaxController
 *
 * Class to handle toggling min/max related logic.
 */
@Injectable()
export class EcgToggleMinMaxController extends EcgBaseController implements OnDestroy {

    // toggle state for below method
    public toggled: boolean = false;

    /**
     * Ctor
     */
    public constructor(
        private notifier: EcgNotifier,
        public config: EcgConfigDto
    ) {
        super();
        this.setComponentKey();
    }

    /**
     * Set component key
     */
    protected setComponentKey(): void {
        this.componentKey = EcgComponentKey.MIN_MAX_TOGGLE;
    }


    /**
     * Init toggle functionality.
     *
     * @return {Observable<IEcgControllerInit>}
     */
    public init(): Observable<IEcgControllerInit> {

        return of({
            success: true
        });
    }

    // Simple toggle button
    public toggleSplitView(): void {
        this.toggled = !this.toggled;

        if (this.toggled){
            this.config.ct.toggleMinMax.view = EcgMinMaxType.HEART_RATE;
        } else {
            this.config.ct.toggleMinMax.view = EcgMinMaxType.DURATION;
        }

        this.notifier.send(EcgChannelKey.MIN_MAX, { minMaxType: this.config.ct.toggleMinMax.view });

        this.notifyView();
    }

    // Watch channel for current view
    private notifyView(): void {
        this.notifier.listen(EcgChannelKey.MIN_MAX).subscribe(
            (data: IEcgToggleMinMaxChannel) => console.log('View: ', data.minMaxType)
        );
    }

    public ngOnDestroy(): void {
        this.destroy();
    }

    public destroy(): void {}

  }

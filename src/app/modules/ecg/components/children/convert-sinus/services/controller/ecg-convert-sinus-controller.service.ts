import { Injectable, OnDestroy } from '@angular/core';

import { Observable, of } from 'rxjs';

import { IEcgControllerInit } from 'app/modules/ecg/interfaces';
import { EcgBaseController } from 'app/modules/ecg/services/controller/base/ecg-base-controller.service';
import { EcgNotifier } from 'app/modules/ecg/services/notifier/ecg/ecg-notifier.service';
import { EcgChannelKey, EcgComponentKey } from 'app/modules/ecg/enums';


/**
 * EcgConvertSinusController
 *
 * Convert to sinus action.
 */
@Injectable()
export class EcgConvertSinusController extends EcgBaseController implements OnDestroy{

    /**
     * Ctor
     */
    public constructor(
        private notifier: EcgNotifier
    ) {
        super();
        this.setComponentKey();
    }


    /**
     * Set component key
     */
    protected setComponentKey(): void {
        this.componentKey = EcgComponentKey.CONVERT_SINUS;
    }


    /**
     * Empty init
     * @return {Observable<IEcgControllerInit>}
     */
    public init(): Observable<IEcgControllerInit> {
        return of({
            success: true
        });
    }


    /**
     * Method sends out the notification for converting to sinus.
     */
    public convertToSinus(): void {
        this.notifier.send(EcgChannelKey.CONVERT_SINUS, {});
    }

    public ngOnDestroy(): void {
        this.destroy();
    }

    public destroy(): void{}
}

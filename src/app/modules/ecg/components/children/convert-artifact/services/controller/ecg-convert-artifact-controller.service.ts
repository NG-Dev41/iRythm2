import { Injectable, OnDestroy } from '@angular/core';

import { Observable, of } from 'rxjs';

import { IEcgControllerInit } from 'app/modules/ecg/interfaces';
import { EcgChannelKey, EcgComponentKey } from 'app/modules/ecg/enums';
import { EcgBaseController } from 'app/modules/ecg/services/controller/base/ecg-base-controller.service';
import { EcgNotifier } from 'app/modules/ecg/services/notifier/ecg/ecg-notifier.service';


/**
 * EcgConvertArtifactController
 *
 * Convert artifact action.
 */
@Injectable()
export class EcgConvertArtifactController extends EcgBaseController implements OnDestroy {


    /**
     * Ctor
     */
    public constructor(
        private notifier: EcgNotifier,
    ) {
        super();
        this.setComponentKey();
    }


    /**
     * Set component key
     */
    protected setComponentKey(): void {
        this.componentKey = EcgComponentKey.CONVERT_ARTIFACT;
    }


    public init(): Observable<IEcgControllerInit> {

        return of({
            success: true
        });
    }


    /**
     * Method sends out the notification for converting to artifact.
     */
    public convertToArtifact(): void {

        // Notify Ecg Channel that convert artifact was pressed
        this.notifier.send(EcgChannelKey.CONVERT_ARTIFACT, { });
    }

    public ngOnDestroy(): void {
        this.destroy();
    }

    public destroy(): void{}
}

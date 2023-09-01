import { Injectable, OnDestroy } from '@angular/core';

import { Observable, of } from 'rxjs';

import { EcgBaseController } from 'app/modules/ecg/services/controller/base/ecg-base-controller.service';
import { IEcgControllerInit } from 'app/modules/ecg/interfaces';
import { EcgComponentKey } from 'app/modules/ecg/enums';
import { EcgDto } from 'app/modules/ecg/services/dto/ecg/ecg-dto.service';


/**
 * EcgInfoController
 *
 * Info section
 */
@Injectable()
export class EcgInfoController extends EcgBaseController implements OnDestroy {


    /**
     * Ctor
     */
    public constructor(
        public dto: EcgDto
    ) {
        super();
        this.setComponentKey();
    }


    /**
     * Inits info functionality which as of now is just cleaning up a few properties.
     *
     * @return {Observable<IEcgControllerInit>}
     */
    public init(): Observable<IEcgControllerInit> {

        // Clean up some of the info data
        this.dto.data.episode.maxHR = Math.round(this.dto.data.episode.maxHR);
        this.dto.data.episode.minHR = Math.round(this.dto.data.episode.minHR);
        this.dto.data.episode.averageHR = Math.round(this.dto.data.episode.averageHR);

        return of({
            success: true
        });
    }


    /**
     * Set component key
     */
    protected setComponentKey(): void {
        this.componentKey = EcgComponentKey.INFO;
    }

    public ngOnDestroy() {
        this.destroy();
    }

    public destroy(): void{}
}

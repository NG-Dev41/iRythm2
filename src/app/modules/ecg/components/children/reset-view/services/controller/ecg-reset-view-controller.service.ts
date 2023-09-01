import {Injectable, OnDestroy } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';

import { EcgBaseController } from 'app/modules/ecg/services/controller/base/ecg-base-controller.service';
import { EcgNotifier } from 'app/modules/ecg/services/notifier/ecg/ecg-notifier.service';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';
import { EcgChannelKey, EcgComponentKey, EcgResetViewType } from 'app/modules/ecg/enums';
import { IEcgControllerInit, IEcgResetViewChannel } from 'app/modules/ecg/interfaces';


@Injectable()
export class EcgResetViewController extends EcgBaseController implements OnDestroy {

    private resetViewSubs: Subscription;

    /**
     * Ctor
     */
    constructor(
        public notifier: EcgNotifier,
        public config: EcgConfigDto
    ) {
        super();
        this.setComponentKey();
    }

    /**
     * Set component key
     */
    protected setComponentKey(): void {
        this.componentKey = EcgComponentKey.RESET_VIEW;
    }


    /**
     * Init reset functionality.
     *
     * @return {Observable<IEcgControllerInit>}
     */
    public init(): Observable<IEcgControllerInit> {

        // Set initial reset view state
        this.config.ct.resetView.state = EcgResetViewType.INITIAL;

        this.initListeners();

        return of({
            success: true
        });
    }


    private initListeners(): void {

        this.resetViewSubs = this.notifier
            .listen(EcgChannelKey.RESET_VIEW)
            .subscribe((data: IEcgResetViewChannel) => {

                // Switch on the incoming reset state value
                switch(data.resetViewState) {

                    case EcgResetViewType.CHANGED:
                        this.config.ct.resetView.state = EcgResetViewType.CHANGED;
                }

            });
    }


    /**
     * Handle click event on reset link
     */
    public resetView(): void {

        this.notifier.send(EcgChannelKey.RESET_VIEW, {
            resetViewState: EcgResetViewType.RESET
        });

        this.config.ct.resetView.state = EcgResetViewType.INITIAL;
    }

    ngOnDestroy(){
        this.destroy();
    }
    destroy(): void{
        this.resetViewSubs?.unsubscribe();
    }
}

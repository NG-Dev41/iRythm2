import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of } from 'rxjs';

import { EcgBaseController } from 'app/modules/ecg/services/controller/base/ecg-base-controller.service';
import { EcgNotifier } from 'app/modules/ecg/services/notifier/ecg/ecg-notifier.service';
import { EcgChannelKey, EcgComponentKey, EcgExpandViewType } from 'app/modules/ecg/enums';
import { IEcgControllerInit, IEcgToggleExpandChannel } from 'app/modules/ecg/interfaces';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';


@Injectable()
export class EcgToggleExpandViewController extends EcgBaseController implements OnDestroy {

    // toggle state for below method
    public toggled: boolean = false;

    /**
     * Ctor
     */

    public constructor(
        private notifier: EcgNotifier,
        private config: EcgConfigDto
    ) {
        super();
        this.setComponentKey();
    }

    /**
     * Set component key
     */
    protected setComponentKey(): void {
        this.componentKey = EcgComponentKey.EXPAND_VIEW_TOGGLE;
    }

    /**
     * Init gain functionality.
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
            this.config.ct.toggleExpandView.view = EcgExpandViewType.EXPAND;
        } else {
            this.config.ct.toggleExpandView.view = EcgExpandViewType.SPLIT;
        }

        this.notifier.send(EcgChannelKey.EXPAND_VIEW, { expandViewType: this.config.ct.toggleExpandView.view });

        this.notifyView();
    }

    // Watch channel for current view
    private notifyView(): void {
        this.notifier.listen(EcgChannelKey.EXPAND_VIEW).subscribe(
            (data: IEcgToggleExpandChannel) => console.log('Expand View: ', data.expandViewType)
        );
    }

    public ngOnDestroy():void {
        this.destroy();
    }

    public destroy():void {}

}

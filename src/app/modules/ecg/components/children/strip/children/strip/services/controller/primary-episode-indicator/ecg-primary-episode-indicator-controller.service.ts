import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';

import { EcgComponentKey, EcgChannelKey, EcgLineActionType } from 'app/modules/ecg/enums';
import { IEcgControllerInit, IEcgLineActionChannel, IEcgLineAction } from 'app/modules/ecg/interfaces';
import { EcgBaseController } from 'app/modules/ecg/services/controller/base/ecg-base-controller.service';
import { EcgDto } from 'app/modules/ecg/services/dto/ecg/ecg-dto.service';
import { EcgStripConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-strip-config-dto.service';
import { EcgNotifier } from 'app/modules/ecg/services/notifier/ecg/ecg-notifier.service';
import { EcgStripUtils } from 'app/modules/ecg/services/utils/ecg-strip-utils.service';

import { EcgStripNotifier } from 'app/modules/ecg/components/children/strip/services/notifier/ecg-strip-notifier.service';



@Injectable()
export class EcgPrimaryEpisodeIndicatorController extends EcgBaseController implements OnDestroy {

    private lineRenderSubs: Subscription;
    /**
     * Ctor
     */
    public constructor(
        public config: EcgStripConfigDto,
        private dto: EcgDto,
        private notifer: EcgStripNotifier,
        public ecgNotifier: EcgNotifier,
        private utils: EcgStripUtils
    ) {
        super();
        this.setComponentKey();
    }

    /**
     * Set component key
     */
    protected setComponentKey(): void {
        this.componentKey = EcgComponentKey.STRIP_BEATS;
    }


    public init(): Observable<IEcgControllerInit> {

        // Init Logic
        this.loadPsiInidicator();
        this.initListeners();

    	return of({
    		success: true
    	});
    }

    private loadPsiInidicator(): void {

        // Calc width of indicator
        this.config.ct.primaryEpisodeIndicator.width = this.utils.calPrimaryIndicatorWidth();

        // Calc left x position of indicator
        this.config.ct.primaryEpisodeIndicator.leftX = this.utils.calcPrimaryIndicatorLeftX();

    }

    public initListeners(): void {

        // When episodes change, re-load the PSI indicator in case the primary episode has changed
        this.lineRenderSubs = this.ecgNotifier
            .listen(EcgChannelKey.LINE_RENDER_ACTION)
            .subscribe((data: IEcgLineActionChannel) => {

                // Loop over the array of actions received and process each
                // The order actions are sent is important...i think
                data.actions.forEach((action: IEcgLineAction) => {

                    switch(action.type) {

                        // Load ecg episodes
                        case EcgLineActionType.LOAD_EPISODES:
                            this.loadPsiInidicator();
                            break;
                    }
                });
            });
    }

    public ngOnDestroy(){}

    public destroy(): void{
        this.lineRenderSubs.unsubscribe();
    }
}

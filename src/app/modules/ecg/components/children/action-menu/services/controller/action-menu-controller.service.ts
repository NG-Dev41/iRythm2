import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of } from 'rxjs';

import { EcgBaseController } from 'app/modules/ecg/services/controller/base/ecg-base-controller.service';
import { EcgNotifier } from 'app/modules/ecg/services/notifier/ecg/ecg-notifier.service';
import { EcgChannelKey, EcgComponentKey } from 'app/modules/ecg/enums';
import { IEcgControllerInit } from 'app/modules/ecg/interfaces';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';


/**
 * EcgActionMenuController
 *
 * Controller for Action Menu Items
 */
@Injectable()
export class EcgActionMenuController extends EcgBaseController implements OnDestroy {

    /**
     * Ctor
     */
  constructor(
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
        this.componentKey = EcgComponentKey.ACTION_MENU;
    }

    public init(): Observable<IEcgControllerInit> {
        return of({
            success: true
        });
    }

    /**
     * Sends out notification
     */
    public showMenu(): void {
        this.notifier.send(EcgChannelKey.ACTION_MENU, { actionMenuType: this.config.ct.actionMenu.actionIds });
    }

    public ngOnDestroy(): void {
        this.destroy();
    }
    public destroy(): void{}
}

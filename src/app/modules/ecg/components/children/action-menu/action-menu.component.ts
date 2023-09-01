import { Component, OnInit } from '@angular/core';

import { EcgActionMenuController } from 'app/modules/ecg/components/children/action-menu/services/controller/action-menu-controller.service';
import { EcgComponentKey, EcgComponentState } from 'app/modules/ecg/enums';
import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';
import { IEcgControllerInit } from 'app/modules/ecg/interfaces';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';

@Component({
  selector: 'app-action-menu',
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.scss'],
  providers: [EcgActionMenuController]
})
export class ActionMenuComponent implements OnInit {
  public EcgComponentState = EcgComponentState;
  public ecgComponentKey = EcgComponentKey;

  constructor(
      private ecgUtils: EcgUtils,
      public controller: EcgActionMenuController,
      public config: EcgConfigDto
  ) { }

    public ngOnInit(): void {

        // Run init method
        this.controller
            .init()
            .subscribe((response: IEcgControllerInit) => {

                // Controller is initialized
                this.ecgUtils.ready(this.controller);
            });
    }

}

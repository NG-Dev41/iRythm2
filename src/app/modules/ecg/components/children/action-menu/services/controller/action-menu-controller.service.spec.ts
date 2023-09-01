import { TestBed } from '@angular/core/testing';

import { EcgActionMenuController } from './action-menu-controller.service';
import { EcgComponentKey } from 'app/modules/ecg/enums';
import { EcgNotifierMock } from 'test/mocks/services/notifier/ecg-notifier-mock.service';
import { EcgConfigDtoMock } from 'test/mocks/services/dto/ecg-config-dto-mock.service';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';
import { EcgNotifier } from 'app/modules/ecg/services/notifier/ecg/ecg-notifier.service';

describe('ActionMenuControllerService', () => {
    let actionMenuController: EcgActionMenuController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                EcgActionMenuController,
                { provide: EcgNotifier, useClass: EcgNotifierMock },
                { provide: EcgConfigDto, useClass: EcgConfigDtoMock }
            ]
        });
        actionMenuController = TestBed.inject(EcgActionMenuController);
    });

    it('should be created', () => {
        expect(actionMenuController).toBeTruthy();
    });

    it('should set componentKey in the constructor', () => {
        actionMenuController.componentKey = 17;

        // test private setComponentKey method
        expect(actionMenuController.componentKey).toBe(EcgComponentKey.ACTION_MENU);
    });
});

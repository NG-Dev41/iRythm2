import { TestBed } from '@angular/core/testing';

import { EcgComponentKey } from 'app/modules/ecg/enums';
import { EcgNotifier } from 'app/modules/ecg/services/notifier/ecg/ecg-notifier.service';
import { EcgNotifierMock } from 'test/mocks/services/notifier/ecg-notifier-mock.service';
import { EcgConvertSinusController } from './ecg-convert-sinus-controller.service';

describe('EcgConvertSinusController', () => {
    let convertSinusController: EcgConvertSinusController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                EcgConvertSinusController,
                { provide: EcgNotifier, useClass: EcgNotifierMock },
            ]
        });
        convertSinusController = TestBed.inject(EcgConvertSinusController);
    });

    it('should be created', () => {
        expect(convertSinusController).toBeTruthy();
    });

    it('should set componentKey in the constructor', () => {
        convertSinusController.componentKey = 12;

        // test private setComponentKey method
        expect(convertSinusController.componentKey).toBe(EcgComponentKey.CONVERT_SINUS);
    });
});

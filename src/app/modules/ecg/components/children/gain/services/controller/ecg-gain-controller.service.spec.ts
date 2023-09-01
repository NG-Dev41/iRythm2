import { TestBed } from '@angular/core/testing';

import { EcgComponentKey } from 'app/modules/ecg/enums';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';
import { EcgNotifier } from 'app/modules/ecg/services/notifier/ecg/ecg-notifier.service';
import { EcgConfigDtoMock } from 'test/mocks/services/dto/ecg-config-dto-mock.service';
import { EcgNotifierMock } from 'test/mocks/services/notifier/ecg-notifier-mock.service';
import { EcgGainController } from './ecg-gain-controller.service';


describe('EcgGainController', () => {
    let gainController: EcgGainController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                EcgGainController,
                { provide: EcgNotifier, useClass: EcgNotifierMock },
                { provide: EcgConfigDto, useClass: EcgConfigDtoMock }
            ]
        });

        gainController = TestBed.inject(EcgGainController);
    });

    it('should be created', () => {
        expect(gainController).toBeTruthy();
    });

    it('should set componentKey in the constructor', () => {
        gainController.componentKey = 1;

        // test private setComponentKey method
        expect(gainController.componentKey).toBe(EcgComponentKey.GAIN);
    });

    describe('emitGainChange', () => {
        it('should send out the notification', () => {
            gainController.config = {
                ct: {
                    gain: {
                        selectedGainValue: null,
                        selectedGainIndex: 0,
                        baseOptions: [123],
                        show: true
                    }
                }
            } as EcgConfigDto;

            gainController.emitGainChange();

            expect(gainController.config.ct.gain.selectedGainValue).toBe(123);
        });
    });
});

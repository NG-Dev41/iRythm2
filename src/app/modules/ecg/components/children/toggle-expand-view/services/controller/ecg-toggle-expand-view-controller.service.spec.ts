import { TestBed } from '@angular/core/testing';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';
import { EcgNotifier } from 'app/modules/ecg/services/notifier/ecg/ecg-notifier.service';
import { EcgConfigDtoMock } from 'test/mocks/services/dto/ecg-config-dto-mock.service';
import { EcgNotifierMock } from 'test/mocks/services/notifier/ecg-notifier-mock.service';
import { EcgToggleExpandViewController } from './ecg-toggle-expand-view-controller.service';


describe('EcgToggleExpandViewController', () => {
    let ecgToggleExpandViewController: EcgToggleExpandViewController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                EcgToggleExpandViewController,
                { provide: EcgNotifier, useClass: EcgNotifierMock },
                { provide: EcgConfigDto, useValue: EcgConfigDtoMock }
            ]
        });
        ecgToggleExpandViewController = TestBed.inject(EcgToggleExpandViewController);
    });

    it('should be created', () => {
        expect(ecgToggleExpandViewController).toBeTruthy();
    });
});

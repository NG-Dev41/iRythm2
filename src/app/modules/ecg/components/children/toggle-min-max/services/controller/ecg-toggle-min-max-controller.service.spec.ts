import { TestBed } from '@angular/core/testing';

import { EcgToggleMinMaxController } from './ecg-toggle-min-max-controller.service';
import { EcgConfigDtoMock } from 'test/mocks/services/dto/ecg-config-dto-mock.service';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';
import { EcgNotifier } from 'app/modules/ecg/services/notifier/ecg/ecg-notifier.service';
import { EcgNotifierMock } from 'test/mocks/services/notifier/ecg-notifier-mock.service';

describe('EcgToggleMinMaxController', () => {
    let service: EcgToggleMinMaxController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                EcgToggleMinMaxController,
                { provide: EcgNotifier, useClass: EcgNotifierMock },
                { provide: EcgConfigDto, useClass: EcgConfigDtoMock }
            ]
    
        });
        service = TestBed.inject(EcgToggleMinMaxController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

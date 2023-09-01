import { TestBed } from '@angular/core/testing';

import { EcgResetViewController } from './ecg-reset-view-controller.service';
import { EcgNotifierMock } from 'test/mocks/services/notifier/ecg-notifier-mock.service';
import { EcgConfigDtoMock } from 'test/mocks/services/dto/ecg-config-dto-mock.service';
import { EcgNotifier } from 'app/modules/ecg/services/notifier/ecg/ecg-notifier.service';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';

describe('ResetViewControllerService', () => {
    let resetViewController: EcgResetViewController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                EcgResetViewController,
                { provide: EcgNotifier, useClass: EcgNotifierMock },
                { provide: EcgConfigDto, useClass: EcgConfigDtoMock },
            ]
        });
        resetViewController = TestBed.inject(EcgResetViewController);
    });

    it('should be created', () => {
        expect(resetViewController).toBeTruthy();
    });
});

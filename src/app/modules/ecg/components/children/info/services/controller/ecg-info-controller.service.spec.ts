import { TestBed } from '@angular/core/testing';

import { EcgComponentKey } from 'app/modules/ecg/enums';
import { EcgDto } from 'app/modules/ecg/services/dto/ecg/ecg-dto.service';
import { EcgDtoMock } from 'test/mocks/services/dto/ecg-dto-mock.service';
import { EcgInfoController } from './ecg-info-controller.service';


describe('EcgInfoController', () => {
    let infoController: EcgInfoController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                EcgInfoController,
                { provide: EcgDto, useClass: EcgDtoMock }
            ]
        });
        infoController = TestBed.inject(EcgInfoController);
    });

    it('should be created', () => {
        expect(infoController).toBeTruthy();
    });

    it('should set componentKey in the constructor', () => {
        infoController.componentKey = 16;

        // test private setComponentKey method
        expect(infoController.componentKey).toBe(EcgComponentKey.INFO);
    });
});

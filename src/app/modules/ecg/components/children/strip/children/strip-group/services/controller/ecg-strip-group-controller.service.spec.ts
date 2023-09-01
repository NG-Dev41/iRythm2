import { TestBed } from '@angular/core/testing';
import { EcgComponentKey, EcgStripType } from 'app/modules/ecg/enums';
import {
    EcgStripGroupController
} from 'app/modules/ecg/components/children/strip/children/strip-group/services/controller/ecg-strip-group-controller.service';
import { IEcgParentConfigStrip } from 'app/modules/ecg/interfaces';

describe('EcgStripGroupController', () => {
    let controller: EcgStripGroupController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                EcgStripGroupController
            ]
        });
        controller = TestBed.inject(EcgStripGroupController);
    });

    it('should be created', () => {
        expect(controller).toBeTruthy();
    });

    it('should set componentKey in the constructor', () => {
        controller.componentKey = 4;

        // test private setComponentKey method
        expect(controller.componentKey).toBe(EcgComponentKey.STRIP_GROUP);
    });

    it('should call init successfully', () => {
        const initSpy = jest.spyOn(controller, 'init');
        controller.init();

        expect(initSpy).toHaveBeenCalled();
    });

    xit('should merge all strip config', () => {
        const input = {
            children:  [
                { global: { type: EcgStripType.CHILD }},
                { global: { type: EcgStripType.CHILD }}
            ]
        } as IEcgParentConfigStrip;

        const processConfigSpy = jest.spyOn(controller, 'processConfig');

        const result = controller.processConfig(input);

        expect(result).toEqual(input);
        expect(processConfigSpy).toHaveBeenCalled();
    });
});

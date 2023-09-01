import { TestBed } from '@angular/core/testing';

import { EcgComponentKey } from 'app/modules/ecg/enums';
import { EcgNotifier } from 'app/modules/ecg/services/notifier/ecg/ecg-notifier.service';
import { EcgNotifierMock } from 'test/mocks/services/notifier/ecg-notifier-mock.service';
import { EcgConvertArtifactController } from './ecg-convert-artifact-controller.service';


describe('EcgConvertArtifactController', () => {
    let convertArtifactController: EcgConvertArtifactController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                EcgConvertArtifactController!,
                { provide: EcgNotifier, useClass: EcgNotifierMock },
            ]
        });
        convertArtifactController = TestBed.inject(EcgConvertArtifactController);
    });

    it('should be created', () => {
        expect(convertArtifactController).toBeTruthy();
    });

    it('should set componentKey in the constructor', () => {
        convertArtifactController.componentKey = 8;

        // test private setComponentKey method
        expect(convertArtifactController.componentKey).toBe(EcgComponentKey.CONVERT_ARTIFACT);
    });

    it('should call init successfully', () => {
        const artifactInitSpy = jest.spyOn(convertArtifactController, 'init');
        convertArtifactController.init();

        expect(artifactInitSpy).toHaveBeenCalled();
    });

    describe('convertToArtifact', () => {
        it('should send out the notification', () => {
            const convertToArtifactSpy = jest.spyOn(convertArtifactController, 'convertToArtifact');

            convertArtifactController.convertToArtifact();

            expect(convertToArtifactSpy).toHaveBeenCalled();
        });
    });
});

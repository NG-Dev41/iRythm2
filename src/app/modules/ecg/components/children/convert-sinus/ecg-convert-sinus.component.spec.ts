import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';
import { EcgUtilsMock } from 'test/mocks/services/ecg-utils-mock.service';
import { EcgConvertSinusComponent } from './ecg-convert-sinus.component';
import { EcgConvertSinusController } from './services/controller/ecg-convert-sinus-controller.service';
import { EcgConvertSinusControllerMock } from 'test/mocks/services/ecg-convert-sinus-controller-mock.service';


describe('EcgConvertSinusComponent', () => {
    let component: EcgConvertSinusComponent;
    let fixture: ComponentFixture<EcgConvertSinusComponent>;

    beforeEach(async () => {
        TestBed.overrideComponent(
            EcgConvertSinusComponent,
        {
            set: {
                providers: [
                    { provide: EcgConvertSinusController, useClass: EcgConvertSinusControllerMock }
                ]
            }
        });
        await TestBed.configureTestingModule({
            declarations: [ EcgConvertSinusComponent ],
            providers: [
                { provide: EcgUtils, useClass: EcgUtilsMock },
                { provide: EcgConvertSinusController, useClass: EcgConvertSinusControllerMock }
            ]
        })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EcgConvertSinusComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should initialize the convert sinus controller', () => {
            const controllerInitSpy = jest.spyOn(component.controller, 'init');
            const ecgUtilsreadySpy = jest.spyOn(component['ecgUtils'], 'ready');

            component.ngOnInit();

            fixture.detectChanges();

            component.controller.init();

            expect(controllerInitSpy).toHaveBeenCalled();
            expect(ecgUtilsreadySpy).toHaveBeenCalled();
        });
    });

    describe('convertToSinus', () => {
        it('should handle button not being clicked', () => {
            component.buttonClicked = false;

            component.convertToSinus();

            expect(component.buttonClicked).toBe(true);
        });

        it('should handle button being clicked', () => {
            const convertToSinusSpy = jest.spyOn(component.controller, 'convertToSinus');

            component.buttonClicked = true;

            component.convertToSinus();

            expect(convertToSinusSpy).not.toHaveBeenCalled();
            expect(component.buttonClicked).toBe(true);
        });
    });
});

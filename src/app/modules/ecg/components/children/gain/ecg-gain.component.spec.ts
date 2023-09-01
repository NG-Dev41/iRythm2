import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';
import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';
import { EcgConfigDtoMock } from 'test/mocks/services/dto/ecg-config-dto-mock.service';
import { EcgUtilsMock } from 'test/mocks/services/ecg-utils-mock.service';
import { EcgGainControllerMock } from 'test/mocks/services/ecg-gain-controller-mock.service';
import { EcgGainComponent } from './ecg-gain.component';
import { EcgGainController } from './services/controller/ecg-gain-controller.service';



describe('EcgGainComponent', () => {
    let component: EcgGainComponent;
    let fixture: ComponentFixture<EcgGainComponent>;

    beforeEach(async () => {
        TestBed.overrideComponent(
            EcgGainComponent,
        {
            set: {
                providers: [
                    { provide: EcgGainController, useClass: EcgGainControllerMock }
                ]
            }
        });
        await TestBed.configureTestingModule({
            declarations: [EcgGainComponent],
            providers: [
                { provide: EcgUtils, useClass: EcgUtilsMock },
                { provide: EcgConfigDto, useClass: EcgConfigDtoMock },
                { provide: EcgGainController, useClass: EcgGainControllerMock }
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EcgGainComponent);
        component = fixture.componentInstance;

        component.controller.config = {
            ct: {
                gain: {
                    baseOptions: [1, 2, 3],
                    show: true
                }
            }
        } as EcgConfigDto;

        fixture.detectChanges();

    });

    it('should create ecg gain component', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should initialize the gain controller', () => {
            const controllerInitSpy = jest.spyOn(component.controller, 'init');
            const ecgUtilsreadySpy = jest.spyOn(component['ecgUtils'], 'ready');

            component.ngOnInit();

            fixture.detectChanges();
            component.controller.init();

            expect(controllerInitSpy).toHaveBeenCalled();
            expect(ecgUtilsreadySpy).toHaveBeenCalled();
        });
    });
});

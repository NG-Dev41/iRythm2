import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';
import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';
import { EcgToggleMinMaxComponent } from './ecg-toggle-min-max.component';
import { EcgToggleMinMaxController } from './services/controller/ecg-toggle-min-max-controller.service';
import { EcgConfigDtoMock } from 'test/mocks/services/dto/ecg-config-dto-mock.service';
import { EcgUtilsMock } from 'test/mocks/services/ecg-utils-mock.service';
import { EcgToggleMinMaxControllerMock } from 'test/mocks/services/ecg-toggle-min-max-controller-mock.service';


describe('EcgToggleMinMaxComponent', () => {
    let component: EcgToggleMinMaxComponent;
    let fixture: ComponentFixture<EcgToggleMinMaxComponent>;

    beforeEach(async () => {
        TestBed.overrideComponent(
            EcgToggleMinMaxComponent,
            {
                set: {
                    providers: [
                        { provide: EcgToggleMinMaxController, useClass: EcgToggleMinMaxControllerMock }
                    ]
                }
            }
        );
        await TestBed.configureTestingModule({
            declarations: [ EcgToggleMinMaxComponent ],
            providers: [
                { provide: EcgUtils, useClass: EcgUtilsMock },
                { provide: EcgConfigDto, useClass: EcgConfigDtoMock }
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EcgToggleMinMaxComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should initialize the ecg toggle min max controller', () => {
            const controllerInitSpy = jest.spyOn(component.controller, 'init');
            const ecgUtilsReadySpy = jest.spyOn(component['ecgUtils'], 'ready');

            component.ngOnInit();

            fixture.detectChanges();
            component.controller.init();

            expect(controllerInitSpy).toHaveBeenCalled();
            expect(ecgUtilsReadySpy).toHaveBeenCalled();
        });
    });
});

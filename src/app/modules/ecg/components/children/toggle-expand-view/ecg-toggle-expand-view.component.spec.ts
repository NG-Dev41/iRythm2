import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EcgToggleExpandViewComponent } from 'app/modules/ecg/components/children/toggle-expand-view/ecg-toggle-expand-view.component';
import { EcgUtilsMock } from 'test/mocks/services/ecg-utils-mock.service';
import { EcgConfigDtoMock } from 'test/mocks/services/dto/ecg-config-dto-mock.service';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';
import { EcgToggleExpandViewControllerMock } from 'test/mocks/services/ecg-toggle-expand-view-controller-mock.service';
import { EcgToggleExpandViewController } from './services/controller/ecg-toggle-expand-view-controller.service';
import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';

describe('EcgToggleExpandViewComponent', () => {
    let component: EcgToggleExpandViewComponent;
    let fixture: ComponentFixture<EcgToggleExpandViewComponent>;

    beforeEach(async () => {
        TestBed.overrideComponent(
            EcgToggleExpandViewComponent,
            {
                set: {
                    providers: [
                        { provide: EcgToggleExpandViewController, useClass: EcgToggleExpandViewControllerMock }
                    ]
                }
            }
        );
        await TestBed.configureTestingModule({
            declarations: [ EcgToggleExpandViewComponent ],
            providers: [
                { provide: EcgUtils, useClass: EcgUtilsMock },
                { provide: EcgConfigDto, useValue: EcgConfigDtoMock },
            ]
        })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EcgToggleExpandViewComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should initialize the ecg toggle expand view controller', () => {
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

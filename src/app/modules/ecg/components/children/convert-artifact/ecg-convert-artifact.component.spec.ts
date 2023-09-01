import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { EcgConvertArtifactComponent } from './ecg-convert-artifact.component';
import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';
import { EcgUtilsMock } from 'test/mocks/services/ecg-utils-mock.service';
import { EcgConvertArtifactControllerMock } from 'test/mocks/services/ecg-convert-artifact-controller-mock.service';
import { EcgConvertArtifactController } from './services/controller/ecg-convert-artifact-controller.service';
import { EcgActionMenuControllerMock } from 'test/mocks/services/ecg-action-menu-controller-mock.service';
import { EcgActionMenuController } from '../action-menu/services/controller/action-menu-controller.service';


describe('EcgConvertArtifactComponent', () => {
    let component: EcgConvertArtifactComponent;
    let fixture: ComponentFixture<EcgConvertArtifactComponent>;

    beforeEach(async () => {
        TestBed.overrideComponent(
            EcgConvertArtifactComponent,
        {
            set: {
                providers: [
                    { provide: EcgConvertArtifactController, useClass: EcgConvertArtifactControllerMock }
                ]
            }
        });
        await TestBed.configureTestingModule({
            declarations: [ EcgConvertArtifactComponent ],
            providers: [
                { provide: EcgUtils, useClass: EcgUtilsMock },
                { provide: EcgConvertArtifactController, useClass: EcgConvertArtifactControllerMock }
            ]
        })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EcgConvertArtifactComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should initialize the convert artifact controller', () => {
            const controllerInitSpy = jest.spyOn(component.controller, 'init');
            const ecgUtilsreadySpy = jest.spyOn(component['ecgUtils'], 'ready');

            component.ngOnInit();

            fixture.detectChanges();

            component.controller.init().subscribe( () => {
                expect(ecgUtilsreadySpy).toHaveBeenCalled();
            });

            expect(controllerInitSpy).toHaveBeenCalled();
        });
    });
});

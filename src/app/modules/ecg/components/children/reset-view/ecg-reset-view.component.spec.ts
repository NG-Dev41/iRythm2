import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { EcgResetViewComponent } from './ecg-reset-view.component';
import { EcgResetViewType } from 'app/modules/ecg/enums';
import { EcgResetViewController } from './services/controller/ecg-reset-view-controller.service';
import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';
import { EcgUtilsMock } from 'test/mocks/services/ecg-utils-mock.service';


describe('EcgResetViewComponent', () => {
    let component: EcgResetViewComponent;
    let fixture: ComponentFixture<EcgResetViewComponent>;

    beforeEach(async () => {
        TestBed.overrideComponent(
            EcgResetViewComponent,
        {
            set: {
                providers: [
                    { provide: EcgResetViewController, useValue: { init: () => of({ success: true }) } }
                ]
            }
        });
        await TestBed.configureTestingModule({
            declarations: [ EcgResetViewComponent ],
            providers: [
                { provide: EcgUtils, useClass: EcgUtilsMock }
            ]
        })
    .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EcgResetViewComponent);
        component = fixture.componentInstance;

        component.controller.config = {
            ct: {
                resetView: {
                    state: EcgResetViewType.CHANGED,
                    show: true
                }
            }
        } as any;
        fixture.detectChanges();

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
      it('should init', () => {
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

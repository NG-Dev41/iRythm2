import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';
import { EcgUtilsMock } from 'test/mocks/services/ecg-utils-mock.service';
import { EcgStripGroupComponent } from './ecg-strip-group.component';
import { EcgStripGroupController } from './services/controller/ecg-strip-group-controller.service';
import { EcgStripGroupControllerMock } from 'test/mocks/services/ecg-strip-group-controller-mock.service';
import { EcgStripComponentMock } from 'test/mocks/components/ecg-strip-mock.component';


describe('EcgStripGroupComponent', () => {
    let component: EcgStripGroupComponent;
    let fixture: ComponentFixture<EcgStripGroupComponent>;

    beforeEach(async () => {
        TestBed.overrideComponent(
            EcgStripGroupComponent,
            {
                set: {
                    providers: [
                        { provide: EcgStripGroupController, useClass: EcgStripGroupControllerMock }
                    ]
                }
            }
        );
        await TestBed.configureTestingModule({
            declarations: [ 
                EcgStripGroupComponent,
                EcgStripComponentMock
            ],
            providers: [
                ChangeDetectorRef,
                { provide: EcgUtils, useClass: EcgUtilsMock }
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EcgStripGroupComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();

    });

    it('should initialize the strip group controller', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should init', () => {
            const controllerInitSpy = jest.spyOn(component.controller, 'init');

            component.ngOnInit();

            fixture.detectChanges();

            component.controller.init();

            fixture.detectChanges();


            expect(controllerInitSpy).toHaveBeenCalled();
        });
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { fabric } from 'fabric';

import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';
import { EcgStripConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-strip-config-dto.service';
import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';
import { EcgConfigDtoMock } from 'test/mocks/services/dto/ecg-config-dto-mock.service';
import { EcgStripConfigDtoMock } from 'test/mocks/services/dto/ecg-strip-config-dto-mock.service';
import { EcgUtilsMock } from 'test/mocks/services/ecg-utils-mock.service';
import { EcgPrimaryEpisodeIndicatorControllerMock } from 'test/mocks/services/ecg-primary-episode-indicator-controller-mock.service';
import { EcgPrimaryEpisodeIndicatorController } from './ecg-primary-episode-indicator-controller.service';
import { EcgPrimaryEpisodeIndicatorComponent } from './ecg-primary-episode-indicator.component';


describe('EcgPrimaryEpisodeIndicatorComponent', () => {
    let component: EcgPrimaryEpisodeIndicatorComponent;
    let fixture: ComponentFixture<EcgPrimaryEpisodeIndicatorComponent>;

    beforeEach(async () => {
        TestBed.overrideComponent(
            EcgPrimaryEpisodeIndicatorComponent,
            {
                set: {
                    providers: [
                        { provide: EcgPrimaryEpisodeIndicatorController, useClass: EcgPrimaryEpisodeIndicatorControllerMock }
                    ]
                }
            }
        );
        await TestBed.configureTestingModule({
            declarations: [ EcgPrimaryEpisodeIndicatorComponent ],
            providers: [
                { provide: EcgUtils, useClass: EcgUtilsMock },
                { provide: EcgPrimaryEpisodeIndicatorController, useClass: EcgPrimaryEpisodeIndicatorControllerMock },
                { provide: EcgConfigDto, useClass: EcgConfigDtoMock },
                { provide: EcgStripConfigDto, useClass: EcgStripConfigDtoMock }        
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EcgPrimaryEpisodeIndicatorComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();

    });

    it('should create the primary episode indicator controller', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should init', () => {
            const controllerInitSpy = jest.spyOn(component.controller, 'init');
            const ecgUtilsReadySpy = jest.spyOn(component['ecgUtils'], 'ready');

            component.ngOnInit();

            fixture.detectChanges();

            expect(ecgUtilsReadySpy).toHaveBeenCalled();
            expect(controllerInitSpy).toHaveBeenCalled();
        });
    });
});


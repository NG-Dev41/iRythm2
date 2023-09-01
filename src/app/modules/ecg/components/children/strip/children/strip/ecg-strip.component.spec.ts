import { EcgStripComponent } from 'app/modules/ecg/components/children/strip/children/strip/ecg-strip.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordSidebarService } from 'app/features/record/services/record-sidebar.service';
import { RecordSidebarServiceMock } from 'test/mocks/services/record-sidebar-service-mock.service';
import { EcgDtoMock } from 'test/mocks/services/dto/ecg-dto-mock.service';
import { EcgNotifierMock } from 'test/mocks/services/notifier/ecg-notifier-mock.service';
import { EcgConfigDtoMock } from 'test/mocks/services/dto/ecg-config-dto-mock.service';
import { EcgListNotifierMock } from 'test/mocks/services/notifier/ecg-list-notifier-mock.service';
import { EcgUtilsMock } from 'test/mocks/services/ecg-utils-mock.service';
import { ChangeDetectorRef } from '@angular/core';
import { RecordSessionEditService } from 'app/features/record/services/record-service.service';
import { EcgListNotifier } from 'app/modules/ecg/components/list/services/notifier/ecg-list-notifier.service';
import { IEcgConfigStrip } from 'app/modules/ecg/interfaces';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';
import { EcgDto } from 'app/modules/ecg/services/dto/ecg/ecg-dto.service';
import { EcgStripConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-strip-config-dto.service';
import { EcgNotifier } from 'app/modules/ecg/services/notifier/ecg/ecg-notifier.service';
import { EcgStripUtils } from 'app/modules/ecg/services/utils/ecg-strip-utils.service';
import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';
import { EcgStripControllerMock } from 'test/mocks/services/ecg-strip-controller-mock.service';
import { EcgStripUtilsMock } from 'test/mocks/services/ecg-strip-utils-mock.service';
import { RecordSessionEditServiceMock } from 'test/mocks/services/record-session-edit-service-mock.service';
import { EcgStripController } from './services/controller/ecg-strip-controller.service';
import { EcgStripConfigDtoMock } from 'test/mocks/services/dto/ecg-strip-config-dto-mock.service';
import { EcgStripNotifierMock } from 'test/mocks/services/notifier/ecg-strip-notifier-mock.service';
import { EcgStripNotifier } from '../../services/notifier/ecg-strip-notifier.service';
import { EcgStripControllerFactory } from './services/controller/ecg-strip-controller-factory.service';
import { EcgStripControllerFactoryMock } from 'test/mocks/services//ecg-strip-controller-factory-mock.service';
import { EcgAxisGridComponentMock } from 'test/mocks/components/ecg-axis-grid-mock.component';
import { EcgBeatsAddLineComponentMock } from 'test/mocks/components/ecg-beats-add-line-mock.component';
import { EpisodeDurationTextComponentMock } from 'test/mocks/components/episode-duration-text-mock.component';
import { EpisodeHrTextComponentMock } from 'test/mocks/components/episode-hr-text-mock.component';
import { EcgSecondsTextComponentMock } from 'test/mocks/components/ecg-seconds-text-mock.component';

class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

window.ResizeObserver = ResizeObserver;

describe('EcgStripComponent', () => {
    let component: EcgStripComponent;
    let fixture: ComponentFixture<EcgStripComponent>;

    beforeEach( async () => {
        TestBed.overrideComponent(
            EcgStripComponent,
            {
                set: {
                    providers: [
                        { provide: EcgStripController, useClass: EcgStripControllerMock },
                        { provide: EcgStripControllerFactory, useClass: EcgStripControllerFactoryMock },
                        { provide: EcgStripNotifier, useClass: EcgStripNotifierMock },
                        { provide: EcgStripConfigDto, useClass: EcgStripConfigDtoMock },
                        { provide: EcgStripUtils, useClass: EcgStripUtilsMock },
                    ]
                }
            }
        );
        await TestBed.configureTestingModule({
            declarations: [ 
                EcgStripComponent,
                EcgAxisGridComponentMock,
                EcgBeatsAddLineComponentMock,
                EcgSecondsTextComponentMock,
                EpisodeDurationTextComponentMock,
                EpisodeHrTextComponentMock
            ],
            providers: [
                { provide: EcgDto, useClass: EcgDtoMock },
                { provide: EcgNotifier, useClass: EcgNotifierMock },
                { provide: EcgConfigDto, useClass: EcgConfigDtoMock },
                { provide: EcgListNotifier, useClass: EcgListNotifierMock },
                { provide: EcgUtils, useClass: EcgUtilsMock },
                { provide: EcgStripController, useClass: EcgStripControllerMock },
                { provide: EcgStripUtils, useClass: EcgStripUtilsMock },
                { provide: EcgStripConfigDto, useClass: EcgStripConfigDtoMock },
                { provide: RecordSidebarService, useClass: RecordSidebarServiceMock },
                { provide: RecordSessionEditService, useClass: RecordSessionEditServiceMock },
                { provide: ChangeDetectorRef, useClass: ChangeDetectorRef }
            ]
        }).compileComponents();
    });


    beforeEach(() => {
        fixture = TestBed.createComponent(EcgStripComponent);
        component = fixture.componentInstance;

        component.controller.stripConfig = {
            ct: {
                html: {

                }
            } as IEcgConfigStrip
        } as EcgStripConfigDto;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

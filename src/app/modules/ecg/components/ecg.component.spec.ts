import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';
import { EcgNotifier } from 'app/modules/ecg/services/notifier/ecg/ecg-notifier.service';
import { EcgComponent } from 'app/modules/ecg/components/ecg.component';
import { EcgController } from 'app/modules/ecg/services/controller/ecg/ecg-controller.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EcgDaoNotifier } from 'app/modules/ecg/services/notifier/dao/ecg-dao-notifier.service';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';
import { EcgDto } from 'app/modules/ecg/services/dto/ecg/ecg-dto.service';
import { EcgListConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-list-config-dto.service';
import { EcgListNotifier } from 'app/modules/ecg/components/list/services/notifier/ecg-list-notifier.service';
import { EcgDtoMock } from 'test/mocks/services/dto/ecg-dto-mock.service';
import { EcgConfigDtoMock } from 'test/mocks/services/dto/ecg-config-dto-mock.service';
import { EcgControllerMock } from 'test/mocks/services/ecg-controller-mock.service';
import { EcgUtilsMock } from 'test/mocks/services/ecg-utils-mock.service';
import { EcgNotifierMock } from 'test/mocks/services/notifier/ecg-notifier-mock.service';
import { RecordSessionEditService } from 'app/features/record/services/record-service.service';
import { RecordSidebarService } from 'app/features/record/services/record-sidebar.service';
import { EcgDaoNotifierMock } from 'test/mocks/services/notifier/ecg-dao-notifier-mock.service';
import { EcgListNotifierMock } from 'test/mocks/services/notifier/ecg-list-notifier-mock.service';
import { RecordSessionEditServiceMock } from 'test/mocks/services/record-session-edit-service-mock.service';
import { RecordSidebarServiceMock } from 'test/mocks/services/record-sidebar-service-mock.service';
import { EcgListConfigDtoMock } from 'test/mocks/services/dto/ecg-list-config-dto-mock.service';
import { EcgGainComponentMock } from 'test/mocks/components/ecg-gain-mock.component';
import { EcgConvertSinusComponentMock } from 'test/mocks/components/ecg-convert-sinus-mock.component';
import { EcgConvertArtifactComponentMock } from 'test/mocks/components/ecg-convert-artifact-mock.component';
import { EcgResetViewComponentMock } from 'test/mocks/components/ecg-reset-view-mock.component';
import { EcgStripsComponentMock } from 'test/mocks/components/ecg-strips-mock-component';
import { EcgToggleExpandViewComponentMock } from 'test/mocks/components/ecg-toggle-expand-view-mock.component';
import { EcgToggleMinMaxComponentMock } from 'test/mocks/components/ecg-toggle-min-max-mock.component';
import { ActionMenuComponentMock } from 'test/mocks/components/action-menu-mock.component';
import { EcgInfoComponentMock } from 'test/mocks/components/ecg-info-mock.component';
import { RecordNotifier } from '../../../features/record/services/notifiers/record-notifier.service';
import { RecordNotifierMock } from '../../../../test/mocks/services/notifier/record-notifier-mock.service';

describe('EcgComponent', () => {
    let component: EcgComponent;
    let fixture: ComponentFixture<EcgComponent>;    
    
    beforeEach(async () => {
        TestBed.overrideComponent(
            EcgComponent,
            {
                set: {
                    providers: [
                        { provide: EcgController, useClass: EcgControllerMock },
                        { provide: EcgUtils, useClass: EcgUtilsMock },
                        { provide: EcgNotifier, useClass: EcgNotifierMock },
                        { provide: EcgConfigDto, useClass: EcgConfigDtoMock },
                        { provide: EcgDto, useClass: EcgDtoMock },
	                    { provide: RecordNotifier, useClass: RecordNotifierMock }
                    ]
                }
            }
        );
        await TestBed.configureTestingModule({
            declarations: [
                EcgComponent,
                EcgInfoComponentMock,
                EcgGainComponentMock,
                EcgToggleMinMaxComponentMock,
                EcgConvertArtifactComponentMock,
                EcgToggleExpandViewComponentMock,
                EcgConvertSinusComponentMock,
                EcgResetViewComponentMock,
                ActionMenuComponentMock,
                EcgStripsComponentMock,
            ],
            imports: [HttpClientTestingModule],
            providers: [
                { provide: EcgNotifier, useClass: EcgNotifierMock },
                { provide: EcgListConfigDto, useClass: EcgListConfigDtoMock },
                { provide: EcgDaoNotifier, useClass: EcgDaoNotifierMock },
                { provide: EcgListNotifier, useClass: EcgListNotifierMock },
                { provide: RecordSidebarService, useClass: RecordSidebarServiceMock },
                { provide: RecordSessionEditService, useClass: RecordSessionEditServiceMock }
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EcgComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should initialize the ecg component', () => {
            const controllerInitSpy = jest.spyOn(component.controller, 'init');

            component.ngOnInit();

            fixture.detectChanges();
            component.controller.init();

            expect(controllerInitSpy).toHaveBeenCalled();
        });
    });

    it('should call ondestroy', () => {
        const stopListeningSpy = jest.spyOn(component.notifier, 'stopListening');
        component.ngOnDestroy();

        expect(stopListeningSpy).toHaveBeenCalled();
    });
});


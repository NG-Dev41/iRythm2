import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { RecordComponent } from './record.component';
import { EcgDaoController } from 'app/modules/ecg/services/controller/dao/ecg-dao-controller.service';
import { EcgDaoControllerMock } from 'test/mocks/services/dao/ecg-dao-controller-mock.service';
import { RecordService, RecordSessionEditService } from './services/record-service.service';
import { RecordServiceMock } from 'test/mocks/services/record-service-mock.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RecordNotifier } from './services/notifiers/record-notifier.service';
import { RecordNotifierMock } from 'test/mocks/services/notifier/record-notifier-mock.service';
import { RecordMetricsDao } from './services/daos/record-metrics-dao.service';
import { RecordDtoMock } from 'test/mocks/services/dto/record-dto-mock.service';
import { RecordDto, RecordStateDto } from './services/dtos/record-dto.service';
import { RecordNavigationUtils } from './services/utils/record-navigation-utils';
import { RecordSidebarNotifier } from './services/notifiers/record-edit-bar-notifier.service';
import { RecordSidebarService } from './services/record-sidebar.service';
import { RecordSidebarServiceMock } from 'test/mocks/services/record-sidebar-service-mock.service';
import { EcgDaoNotifier } from 'app/modules/ecg/services/notifier/dao/ecg-dao-notifier.service';
import { EcgDaoNotifierMock } from 'test/mocks/services/notifier/ecg-dao-notifier-mock.service';
import { EcgListNotifier } from 'app/modules/ecg/components/list/services/notifier/ecg-list-notifier.service';
import { EcgListNotifierMock } from 'test/mocks/services/notifier/ecg-list-notifier-mock.service';
import { RecordSessionEditServiceMock } from 'test/mocks/services/record-session-edit-service-mock.service';
import { of } from 'rxjs';
import { RecordNavigationService } from './services/record-navigation.service';
import { RecordNavigationServiceMock } from 'test/mocks/services/record-navigation-mock.service';
import { RecordDao } from './services/daos/record-dao.service';
import { RecordHeaderComponentMock } from 'test/mocks/components/record-header-mock.component';
import { RecordSidebarComponentMock } from 'test/mocks/components/record-sidebar-mock.component';
import { RightColModalAction, RightColModalType } from './services/interfaces/channel.interface';
import { RightColMultiLineModalComponent } from './right-col-multi-line-modal/right-col-multi-line-modal.component';
import { RecordRhythmsDto } from './rhythms/record-rhythms.service';
import { RecordRhythmsDtoMock } from '../../../test/mocks/services/dto/record-rhythms-dto-mock.service';
import { EcgStripComponent } from '../../modules/ecg/components/children/strip/children/strip/ecg-strip.component';
import { PageNotifier } from '../../commons/services/notifiers/page-notifier.service';
import { PageNotifierMock } from '../../../test/mocks/services/notifier/page-notifier-mock.service';
import { EcgGainComponent } from '../../modules/ecg/components/children/gain/ecg-gain.component';

describe('RecordComponent', () => {
    let component: RecordComponent;
    let fixture: ComponentFixture<RecordComponent>;

    beforeEach(async () => {
        TestBed.overrideComponent(
            RecordComponent,
            {
                set: {
                    providers: [
                        { provide: RecordDao, useValue: {} },
                        { provide: RecordNotifier, useClass: RecordNotifierMock },
                        { provide: RecordDto, useClass: RecordDtoMock },
                        { provide: RecordMetricsDao, useValue: {} },
                        { provide: RecordStateDto, useValue: {} },
                        { provide: RecordNavigationUtils, useValue: {} },
                        { provide: RecordNavigationService, useClass: RecordNavigationServiceMock },
                        { provide: RecordSidebarNotifier, useValue: {} },
                        { provide: RecordSidebarService, useClass: RecordSidebarServiceMock },
                        { provide: EcgDaoNotifier, useClass: EcgDaoNotifierMock },
                        { provide: EcgListNotifier, useClass: EcgListNotifierMock },
                        { provide: RecordSessionEditService, useClass: RecordSessionEditServiceMock },
	                    { provide: RecordRhythmsDto, useClass: RecordRhythmsDtoMock},
	                    { provide: PageNotifier, useClass: PageNotifierMock },
                    ]
                }
            }
        );
        await TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            declarations: [
                RecordComponent,
                RecordSidebarComponentMock,
                RecordHeaderComponentMock,
	            RightColMultiLineModalComponent,
	            EcgStripComponent,
	            EcgGainComponent
             ],
            providers: [
                { provide: RecordService, useClass: RecordServiceMock },
                { provide: ActivatedRoute, useValue: { params: of([{}])} },
                { provide: Router, useValue: {} as Router },
                { provide: EcgDaoController, useClass: EcgDaoControllerMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(RecordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
	
	it('should initalize right columb subscription', () => {
		component.ngOnInit();
		expect(component.openRightColumnSubscription).toBeTruthy();
	})
	
	it('should close right column modal', () => {
		component.processOpenRightColumnData({
			action: RightColModalAction.CLOSE_MODAL
		});
		
		fixture.detectChanges();
		
		expect(component.rightColumnOverlay).toBeFalsy()
	});
	
	it('should open right column multiline modal', () => {
		component.processOpenRightColumnData({
			action: RightColModalAction.OPEN_MODAL,
			type: RightColModalType.MULTILINE_STRIP_MODAL,
			initProperties: {
				ecgCardConfig: {
					config: {}
				}
			}
		});
		
		fixture.detectChanges();
		
		expect(component.rightColumnOverlay).toBeTruthy();
		expect(component.modalInitProperties).toBeTruthy();
		expect(component.rightColMultilineModal).toBeTruthy();
	})
});

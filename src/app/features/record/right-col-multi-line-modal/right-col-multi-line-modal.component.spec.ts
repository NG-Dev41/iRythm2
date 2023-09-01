import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightColMultiLineModalComponent } from './right-col-multi-line-modal.component';
import { EcgListControllerMock } from '../../../../test/mocks/services/ecg-list-controller-mock.service';
import { EcgListController } from '../../../modules/ecg/components/list/services/controller/ecg-list-controller.service';
import { EcgListConfigDto } from '../../../modules/ecg/services/dto/ecg/ecg-list-config-dto.service';
import { EcgController } from '../../../modules/ecg/services/controller/ecg/ecg-controller.service';
import { EcgControllerMock } from '../../../../test/mocks/services/ecg-controller-mock.service';
import { EcgUtils } from '../../../modules/ecg/services/utils/ecg-utils.service';
import { EcgUtilsMock } from '../../../../test/mocks/services/ecg-utils-mock.service';
import { EcgStripGroupController } from '../../../modules/ecg/components/children/strip/children/strip-group/services/controller/ecg-strip-group-controller.service';
import { EcgStripGroupControllerMock } from '../../../../test/mocks/services/ecg-strip-group-controller-mock.service';
import { EcgNotifier } from '../../../modules/ecg/services/notifier/ecg/ecg-notifier.service';
import { EcgNotifierMock } from '../../../../test/mocks/services/notifier/ecg-notifier-mock.service';
import { EcgDtoMock } from '../../../../test/mocks/services/dto/ecg-dto-mock.service';
import { EcgDto } from '../../../modules/ecg/services/dto/ecg/ecg-dto.service';
import { EcgConfigDto } from '../../../modules/ecg/services/dto/ecg/ecg-config-dto.service';
import { EcgConfigDtoMock } from '../../../../test/mocks/services/dto/ecg-config-dto-mock.service';
import { EcgListConfigDtoMock } from '../../../../test/mocks/services/dto/ecg-list-config-dto-mock.service';
import { RecordNotifierMock } from '../../../../test/mocks/services/notifier/record-notifier-mock.service';
import { RecordNotifier } from '../services/notifiers/record-notifier.service';
import { EcgListNotifier } from '../../../modules/ecg/components/list/services/notifier/ecg-list-notifier.service';
import { EcgListNotifierMock } from '../../../../test/mocks/services/notifier/ecg-list-notifier-mock.service';
import { RecordDto } from '../services/dtos/record-dto.service';
import { RecordDtoMock } from '../../../../test/mocks/services/dto/record-dto-mock.service';
import { RecordRhythmsDtoMock } from '../../../../test/mocks/services/dto/record-rhythms-dto-mock.service';
import { RecordRhythmsDto } from '../rhythms/record-rhythms.service';
import { EcgDaoNotifier } from '../../../modules/ecg/services/notifier/dao/ecg-dao-notifier.service';
import { EcgDaoNotifierMock } from '../../../../test/mocks/services/notifier/ecg-dao-notifier-mock.service';
import { RecordSessionEditServiceMock } from '../../../../test/mocks/services/record-session-edit-service-mock.service';
import { RecordSessionEditService } from '../services/record-service.service';
import { HttpClientModule } from '@angular/common/http';
import { EcgDefaultParentStripConfig } from '../../../modules/ecg/constants/ecg-default.config';
import { EcgStripComponent } from '../../../modules/ecg/components/children/strip/children/strip/ecg-strip.component';
import { EcgGainComponent } from '../../../modules/ecg/components/children/gain/ecg-gain.component';
import { PageNotifier } from '../../../commons/services/notifiers/page-notifier.service';
import { PageNotifierMock } from '../../../../test/mocks/services/notifier/page-notifier-mock.service';
import { RecordSidebarServiceMock } from '../../../../test/mocks/services/record-sidebar-service-mock.service';
import { RecordSidebarService } from '../services/record-sidebar.service';

describe('RightColMultiLineModalComponent', () => {
    let component: RightColMultiLineModalComponent;
    let fixture: ComponentFixture<RightColMultiLineModalComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            declarations: [EcgStripComponent, EcgGainComponent],
            providers: [
				{ provide: EcgListController, useClass: EcgListControllerMock },
                { provide: EcgListConfigDto, useClass: EcgListConfigDtoMock },
                { provide: EcgController, useClass: EcgControllerMock },
                { provide: EcgUtils, useClass: EcgUtilsMock },
                { provide: EcgDto, useClass: EcgDtoMock },
                { provide: EcgConfigDto, useClass: EcgConfigDtoMock },
                { provide: EcgNotifier, useClass: EcgNotifierMock },
                { provide: EcgStripGroupController, useClass: EcgStripGroupControllerMock },
                { provide: EcgListNotifier, useClass: EcgListNotifierMock },
                { provide: RecordNotifier, useClass: RecordNotifierMock },
                { provide: RecordDto, useClass: RecordDtoMock },
                { provide: EcgDaoNotifier, useClass: EcgDaoNotifierMock },
                { provide: RecordSessionEditService, useClass: RecordSessionEditServiceMock },
                { provide: PageNotifier, useClass: PageNotifierMock },
                { provide: RecordSidebarService, useClass: RecordSidebarServiceMock },
                { provide: RecordRhythmsDto, useClass: RecordRhythmsDtoMock },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [RightColMultiLineModalComponent],
        });
        fixture = TestBed.createComponent(RightColMultiLineModalComponent);
        component = fixture.componentInstance;
        component.initProperties = {
            ecgCardConfig: {
                config: {},
            },
        };
        component.dto.regions = {};
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Should properly process sampleDaoResponse', () => {
        component.originalStripConfig = structuredClone(EcgDefaultParentStripConfig);
        component.processSampleDaoResponse({
            ecgSerialNumber: '',
            sampleCursorResultList: [
                {
                    beatList: [],
                    cursorIndex: 0,
                    cursorType: undefined,
                    ecgSampleList: undefined,
                    interval: {
                        startIndex: 1000,
                        endIndex: 11000,
                    },
                    surroundingAdditionalStripList: [],
                    surroundingEpisodeList: [],
                },
            ],
            sampleRangeResultList: [],
        });

        expect(component.originalStripConfigWithSampleData.global.disableEditSessionCommitting).toBeTruthy();
        let rowIntervals = component.originalStripConfigWithSampleData.global.rowIntervals;
        expect(rowIntervals[0].startIndex).toBe(1000);
        expect(rowIntervals[0].endIndex).toBe(2999);

        expect(rowIntervals[1].startIndex).toBe(3000);
        expect(rowIntervals[1].endIndex).toBe(4999);

        expect(rowIntervals[2].startIndex).toBe(5000);
        expect(rowIntervals[2].endIndex).toBe(6999);

        expect(rowIntervals[3].startIndex).toBe(7000);
        expect(rowIntervals[3].endIndex).toBe(8999);

        expect(rowIntervals[4].startIndex).toBe(9000);
        expect(rowIntervals[4].endIndex).toBe(10999);
    });
});

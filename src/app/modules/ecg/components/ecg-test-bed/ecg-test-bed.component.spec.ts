import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcgStripComponentMock } from 'test/mocks/components/ecg-strip-mock.component';
import { EcgSampleDaoMock } from 'test/mocks/services/dao/ecg-sample-dao-mock.service';
import { EcgConfigDtoMock } from 'test/mocks/services/dto/ecg-config-dto-mock.service';
import { EcgDtoMock } from 'test/mocks/services/dto/ecg-dto-mock.service';
import { EcgControllerMock } from 'test/mocks/services/ecg-controller-mock.service';
import { EcgStripGroupControllerMock } from 'test/mocks/services/ecg-strip-group-controller-mock.service';
import { EcgUtilsMock } from 'test/mocks/services/ecg-utils-mock.service';
import { EcgListNotifierMock } from 'test/mocks/services/notifier/ecg-list-notifier-mock.service';
import { EcgNotifierMock } from 'test/mocks/services/notifier/ecg-notifier-mock.service';
import { EcgController } from '../../services/controller/ecg/ecg-controller.service';
import { EcgSampleDao } from '../../services/daos/ecg-sample/ecg-sample-dao.service';
import { EcgConfigDto } from '../../services/dto/ecg/ecg-config-dto.service';
import { EcgDto } from '../../services/dto/ecg/ecg-dto.service';
import { EcgNotifier } from '../../services/notifier/ecg/ecg-notifier.service';
import { EcgUtils } from '../../services/utils/ecg-utils.service';
import { EcgStripGroupController } from '../children/strip/children/strip-group/services/controller/ecg-strip-group-controller.service';
import { EcgListNotifier } from '../list/services/notifier/ecg-list-notifier.service';
import { EcgTestBedComponent } from './ecg-test-bed.component';

describe('EcgTestBedComponent', () => {
    let component: EcgTestBedComponent;
    let fixture: ComponentFixture<EcgTestBedComponent>;

    beforeEach(async () => {
        TestBed.overrideComponent(EcgTestBedComponent, {
            set: {
                providers: [
                    { provide: EcgController, useClass: EcgControllerMock },
                    { provide: EcgUtils, useClass: EcgUtilsMock },
                    { provide: EcgNotifier, useClass: EcgNotifierMock },
                    { provide: EcgListNotifier, useClass: EcgListNotifierMock },
                    { provide: EcgConfigDto, useClass: EcgConfigDtoMock },
                    { provide: EcgDto, useClass: EcgDtoMock },
                    { provide: EcgStripGroupController, useClass: EcgStripGroupControllerMock },
                ],
            },
        });

        await TestBed.configureTestingModule({
            declarations: [EcgTestBedComponent, EcgStripComponentMock],
            providers: [{ provide: EcgSampleDao, useClass: EcgSampleDaoMock }],
        });
        fixture = TestBed.createComponent(EcgTestBedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

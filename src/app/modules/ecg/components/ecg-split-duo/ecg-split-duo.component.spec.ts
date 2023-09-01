import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcgSplitDuoComponent } from './ecg-split-duo.component';
import { SplitStripComponentMock } from 'test/mocks/components/split-strip-mock.component';
import { EcgConfigDtoMock } from 'test/mocks/services/dto/ecg-config-dto-mock.service';
import { EcgDtoMock } from 'test/mocks/services/dto/ecg-dto-mock.service';
import { EcgControllerMock } from 'test/mocks/services/ecg-controller-mock.service';
import { EcgStripGroupControllerMock } from 'test/mocks/services/ecg-strip-group-controller-mock.service';
import { EcgUtilsMock } from 'test/mocks/services/ecg-utils-mock.service';
import { EcgListNotifierMock } from 'test/mocks/services/notifier/ecg-list-notifier-mock.service';
import { EcgNotifierMock } from 'test/mocks/services/notifier/ecg-notifier-mock.service';
import { EcgController } from '../../services/controller/ecg/ecg-controller.service';
import { EcgConfigDto } from '../../services/dto/ecg/ecg-config-dto.service';
import { EcgDto } from '../../services/dto/ecg/ecg-dto.service';
import { EcgNotifier } from '../../services/notifier/ecg/ecg-notifier.service';
import { EcgUtils } from '../../services/utils/ecg-utils.service';
import { EcgStripGroupController } from '../children/strip/children/strip-group/services/controller/ecg-strip-group-controller.service';
import { EcgListNotifier } from '../list/services/notifier/ecg-list-notifier.service';
import { EcgDaoNotifier } from '../../services/notifier/dao/ecg-dao-notifier.service';
import { EcgDaoNotifierMock } from 'test/mocks/services/notifier/ecg-dao-notifier-mock.service';


describe('EcgSplitDuoComponent', () => {
    let component: EcgSplitDuoComponent;
    let fixture: ComponentFixture<EcgSplitDuoComponent>;

    beforeEach(async () => {
        TestBed.overrideComponent(
            EcgSplitDuoComponent,
            {
                set: {
                    providers: [
                        { provide: EcgController, useClass: EcgControllerMock },
                        { provide: EcgUtils, useClass: EcgUtilsMock },
                        { provide: EcgNotifier, useClass: EcgNotifierMock },
                        { provide: EcgConfigDto, useClass: EcgConfigDtoMock },
                        { provide: EcgDto, useClass: EcgDtoMock },
                        { provide: EcgDaoNotifier, useClass: EcgDaoNotifierMock },
                        { provide: EcgStripGroupController, useClass: EcgStripGroupControllerMock }
                    ]
                }
            }
        );
        await TestBed.configureTestingModule({
            declarations: [
                EcgSplitDuoComponent,
                SplitStripComponentMock
            ],
            providers: [
                { provide: EcgListNotifier, useClass: EcgListNotifierMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(EcgSplitDuoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

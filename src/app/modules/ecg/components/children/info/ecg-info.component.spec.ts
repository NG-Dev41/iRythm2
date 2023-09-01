import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcgInfoComponent } from 'app/modules/ecg/components/children/info/ecg-info.component';

import { IEcgData, IEcgMetaData, IEpisode } from 'app/modules/ecg/interfaces';
import { EcgInfoControllerMock } from 'test/mocks/services/ecg-info-controller-mock.service';
import { EcgUtilsMock } from 'test/mocks/services/ecg-utils-mock.service';
import { EcgListNotifierMock } from 'test/mocks/services/notifier/ecg-list-notifier-mock.service';
import { EcgDaoNotifierMock } from 'test/mocks/services/notifier/ecg-dao-notifier-mock.service';
import { RhythmType } from 'app/commons/constants/rhythms.const';
import { EcgDto } from 'app/modules/ecg/services/dto/ecg/ecg-dto.service';
import { EcgDaoNotifier } from 'app/modules/ecg/services/notifier/dao/ecg-dao-notifier.service';
import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';
import { EcgDtoMock } from 'test/mocks/services/dto/ecg-dto-mock.service';
import { EcgListNotifier } from '../../list/services/notifier/ecg-list-notifier.service';
import { EcgInfoController } from './services/controller/ecg-info-controller.service';


describe('EcgInfoComponent', () => {
    let component: EcgInfoComponent;
    let fixture: ComponentFixture<EcgInfoComponent>;
    let controller: EcgInfoController;
    let ecgUtils: EcgUtils;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EcgInfoComponent],
            providers: [
                { provide: EcgUtils, useClass: EcgUtilsMock },
                { provide: EcgDto, useClass: EcgDtoMock },
                { provide: EcgDaoNotifier, useClass: EcgDaoNotifierMock },
                { provide: EcgInfoController, useClass: EcgInfoControllerMock },
                { provide: EcgListNotifier, useClass: EcgListNotifierMock }
            ]
        })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EcgInfoComponent);
        component = fixture.componentInstance;
        controller = TestBed.inject(EcgInfoController);
        ecgUtils = TestBed.inject(EcgUtils);

        component.controller.dto.data = {
            episode: {
                rhythmType: RhythmType.SVT,
                averageHR: 2,
                beats: 3,
                confidence: 4,
                episodeDuration: 5,
                minHR: 3,
                maxHR: 2,
            } as IEpisode,
            serialNumber: 'asdfjk',
            metaData: {} as IEcgMetaData
        } as IEcgData;
        component.ecgCardConfig = {
            data: {
                sortTypes: []
            } as any as IEcgData
        }

        fixture.detectChanges();

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should initialize the info controller', () => {
            const ecgUtilsReadySpy = jest.spyOn(ecgUtils, 'ready');
            const controllerInitSpy = jest.spyOn(controller, 'init');
            component.ngOnInit();

            fixture.detectChanges();
            controller.init();

            expect(ecgUtilsReadySpy).toHaveBeenCalled();
            expect(controllerInitSpy).toHaveBeenCalled();
        });
    });
});

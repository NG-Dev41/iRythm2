import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RhythmType } from 'app/commons/constants/rhythms.const';
import { PageChannelKey, PageNotifier } from 'app/commons/services/notifiers/page-notifier.service';
import { EcgDaoController } from 'app/modules/ecg/services/controller/dao/ecg-dao-controller.service';
import { ActivatedRouteMock } from 'test/mocks/services/activated-route-mock.service';
import { EcgDaoControllerMock } from 'test/mocks/services/dao/ecg-dao-controller-mock.service';
import { RecordDtoMock } from 'test/mocks/services/dto/record-dto-mock.service';
import { RecordRhythmsDtoMock } from 'test/mocks/services/dto/record-rhythms-dto-mock.service';
import { PageNotifierMock } from 'test/mocks/services/notifier/page-notifier-mock.service';
import { RouterMock } from 'test/mocks/services/router-mock.service';
import { TranslateServiceMock } from 'test/mocks/services/translation/translate-mock.service';
import { RecordDto } from '../services/dtos/record-dto.service';
import { RhythmSortType } from '../services/enums/rhythm-sort-type.enum';
import { IDetectedRhythmsInfo } from '../services/interfaces/record-metrics.interface';
import { RecordRhythmsDto, RecordRhythmsService } from './record-rhythms.service';

describe('RecordRhythmsService', () => {
    let service: RecordRhythmsService;
    let pageNotifier: PageNotifier;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                RecordRhythmsService,
                { provide: PageNotifier, useClass: PageNotifierMock },
                { provide: EcgDaoController, useClass: EcgDaoControllerMock },
                { provide: RecordRhythmsDto, useClass: RecordRhythmsDtoMock },
                { provide: RecordDto, useClass: RecordDtoMock },
                { provide: Router, useValue: RouterMock },
                { provide: ActivatedRoute, useValue: ActivatedRouteMock },
                { provide: TranslateService, useClass: TranslateServiceMock },
            ],
        });
        service = TestBed.inject(RecordRhythmsService);
        pageNotifier = TestBed.inject(PageNotifier);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('buildNavigationSubTabs', () => {
        let pageNotifierSpy;
        beforeEach(() => {
            service['rhythmsDto'] = { rhythmType: RhythmType.PAUSE } as RecordRhythmsDto;
            pageNotifierSpy = jest.spyOn(pageNotifier, 'send');
        });

        it('builds a list of sub tabs based on the current rhythm type selected', () => {
            service['buildNavigationSubTabs']();
            expect(pageNotifierSpy).toBeCalledWith(PageChannelKey.NAVIGATION_SUB_TABS, {
                subTabs: [
                    {
                        isDefault: true,
                        name: `${service['RHYTHM_SORT_TRANSLATE_KEY']}.${RhythmSortType.LONGEST}`,
                        params: {
                            sortType: RhythmSortType.LONGEST,
                        },
                    },
                    {
                        isDefault: false,
                        name: `${service['RHYTHM_SORT_TRANSLATE_KEY']}.${RhythmSortType.SLOWEST}`,
                        params: {
                            sortType: RhythmSortType.SLOWEST,
                        },
                    },
                ],
            });
        });

        it('adds MDN tab if there are mdn rhythms detected', () => {
            service['recordDto'].detectedRhythmsInfo = { mdnRhythmList: [RhythmType.PAUSE] } as any as IDetectedRhythmsInfo;
            service['buildNavigationSubTabs']();
            expect(pageNotifierSpy).toBeCalledWith(PageChannelKey.NAVIGATION_SUB_TABS, {
                subTabs: [
                    {
                        isDefault: true,
                        name: `${service['RHYTHM_SORT_TRANSLATE_KEY']}.${RhythmSortType.LONGEST}`,
                        params: {
                            sortType: RhythmSortType.LONGEST,
                        },
                    },
                    {
                        isDefault: false,
                        name: `${service['RHYTHM_SORT_TRANSLATE_KEY']}.${RhythmSortType.SLOWEST}`,
                        params: {
                            sortType: RhythmSortType.SLOWEST,
                        },
                    },
                    {
                        name: `${service['RHYTHM_SORT_TRANSLATE_KEY']}.${RhythmSortType.FASTEST_MDN}`,
                        params: {
                            sortType: RhythmSortType.FASTEST_MDN,
                        },
                    },
                ],
            });
        });

        it('adds Symptomatic tab if there are symptomatic rhythms detected', () => {
            service['recordDto'].detectedRhythmsInfo = { symptomaticRhythmList: [RhythmType.PAUSE] } as any as IDetectedRhythmsInfo;
            service['buildNavigationSubTabs']();
            expect(pageNotifierSpy).toBeCalledWith(PageChannelKey.NAVIGATION_SUB_TABS, {
                subTabs: [
                    {
                        isDefault: true,
                        name: `${service['RHYTHM_SORT_TRANSLATE_KEY']}.${RhythmSortType.LONGEST}`,
                        params: {
                            sortType: RhythmSortType.LONGEST,
                        },
                    },
                    {
                        isDefault: false,
                        name: `${service['RHYTHM_SORT_TRANSLATE_KEY']}.${RhythmSortType.SLOWEST}`,
                        params: {
                            sortType: RhythmSortType.SLOWEST,
                        },
                    },
                    {
                        name: `${service['RHYTHM_SORT_TRANSLATE_KEY']}.${RhythmSortType.LONGEST_SYMPTOMATIC}`,
                        params: {
                            sortType: RhythmSortType.LONGEST_SYMPTOMATIC,
                        },
                    },
                ],
            });
        });
    });
});

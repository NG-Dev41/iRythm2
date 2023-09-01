import { TestBed } from '@angular/core/testing';
import { RecordNavigationService } from './record-navigation.service';
import { RecordDto } from './dtos/record-dto.service';
import { RecordDtoMock } from 'test/mocks/services/dto/record-dto-mock.service';
import { RecordStateDto } from './dtos/record-dto.service';
import { RecordStateDtoMock } from 'test/mocks/services/dto/record-state-dto-mock.service';
import { PageNotifier } from 'app/commons/services/notifiers/page-notifier.service';
import { PageNotifierMock } from 'test/mocks/services/notifier/page-notifier-mock.service';
import { PageDto } from 'app/commons/services/dtos/page-dto.service';
import { PageDtoMock } from 'test/mocks/services/dto/page-dto-mock.service';
import { RecordService } from './record-service.service';
import { RecordServiceMock } from 'test/mocks/services/record-service-mock.service';
import { RecordNavigationKey, RecordMetricType, RecordNavigationStatus } from './enums/record-navigation.enum';

describe('RecordNavigationService', () => {
    let service: RecordNavigationService;
    let recordDto: RecordDtoMock;
    let recordStateDto: RecordStateDtoMock;
    let pageNotifier: PageNotifierMock;
    let pageDto: PageDtoMock;
    let recordService: RecordServiceMock;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                RecordNavigationService,
                { provide: RecordDto, useClass: RecordDtoMock },
                { provide: RecordStateDto, useClass: RecordStateDtoMock },
                { provide: PageNotifier, useClass: PageNotifierMock },
                { provide: PageDto, useClass: PageDtoMock },
                { provide: RecordService, useClass: RecordServiceMock },
            ],
        });
        service = TestBed.inject(RecordNavigationService);
        recordDto = TestBed.inject(RecordDto) as RecordDtoMock;
        recordStateDto = TestBed.inject(RecordStateDto) as RecordStateDtoMock;
        pageNotifier = TestBed.inject(PageNotifier) as PageNotifierMock;
        pageDto = TestBed.inject(PageDto) as PageDtoMock;
        recordService = TestBed.inject(RecordService) as RecordServiceMock;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('loadNavigationItems', () => {

        beforeEach(() => {
            const mockMetricsResponse = {
                serverInfo: {
                    version: '0.0.1-SNAPSHOT',
                    buildNumber: '1579',
                },
                errorInfo: {
                    hasError: false,
                },
                metrics: {
                    veChapterPage: true,
                    sveChapterPage: true,
                    sinusPercentage: 100,
                    afPercentage: 0,
                    rhythmMetrics: {
                        SVT: 85,
                        VT: 0,
                        SINUS: 456,
                        ARTIFACT: 207,
                        THIRD_DEG_BLOCK: 0,
                        SECOND_DEG_BLOCK: 0,
                        PAUSE: 0,
                        IRREGULAR: 0,
                        BIGEMINY: 130,
                        TRIGEMINY: 15,
                        PVT_TDP_VF: 0,
                        IVR: 0,
                        WENCKEBACH: 0,
                        JR: 1,
                        EAR: 21,
                        UNDETERMINED: 0,
                    },
                    ectopicMetrics: {
                        SVE1: 51176,
                        SVE2: 789,
                        SVE3: 1240,
                        VE1: 11472,
                        VE2: 76,
                        VE3: 0,
                    },
                    ectopicBurdenPercentages: {
                        SVE1: 6.428782292458341,
                        SVE2: 0.19822999956032636,
                        SVE3: 0.46731026512320284,
                        VE1: 1.4411245595412319,
                        VE2: 0.019094397929765278,
                        VE3: 0,
                    },
                    patientTriggers: 6,
                    patientDiaries: 3,
                    eventCharts: 0,
                    additionalStrips: 0,
                },
                accountInfo: {
                    account: 'IrinaSQA',
                    location: 'Client-Medicare Billing',
                    notificationMethod: 'Notify then post report',
                    prescribingProviderFirstName: 'Irina',
                    prescribingProviderLastName: 'Velichko',
                    prescribingProviderNotes:
                        ' Integer scelerisque nibh at feugiat interdum. Cras condimentum magna nulla, MOST congue magna hendrerit ac. Proin euismod feugiat pulvinar. Mauris interdum elit id suscipit varius. Quisque vitae quam ACTUAL nisi gravida posuere quis non risus. Integer gravida urna eu nulla porta, ac consequat sapien laoreet. Nam nisi erat, consectetur ac tincidunt in, dignissim vitae nulla. Mauris tellus sapien, aliquet quis purus at, bibendum luctus elit. Curabitur in dignissim justo. Etiam volutpat et lorem id bibendum. Nulla maximus a arcu quis bibendum. Maecenas quam ex, sodales sit amet vehicula in, vestibulum et dui. Quisque eu suscipit magna. Donec vitae ornare quam, eu tincidunt sem. Donec imperdiet arcu eget consectetur dictum accumsan in euu MAX.',
                    ectopyVeReportingRequired: false,
                    ectopySveReportingRequired: true,
                },
                patientInfo: {
                    age: '55',
                    primaryIndication: 'Sinoatrial ( Sinus) node dysfunction (Brady tachy syndrome)',
                    icdOrPacemaker: false,
                },
                patchInfo: {
                    wideQrsMinHr: 120,
                    wideQrsMinDuration: 30,
                    wideQrsNotificationType: 'IMMEDIATE',
                    wideQrsDetected: false,
                    wideQrsUnique: false,
                    avb3NotificationType: 'IMMEDIATE',
                    avb3Detected: false,
                    avb3Unique: false,
                    avb2NotificationType: 'IMMEDIATE',
                    avb2Detected: false,
                    avb2Unique: false,
                    pauseMinDuration: 6,
                    pauseNotificationType: 'IMMEDIATE',
                    pauseDetected: false,
                    pauseUnique: false,
                    bradyMaxHr: 40,
                    bradyMinDuration: 30,
                    bradyNotificationType: 'IMMEDIATE',
                    bradyDetected: false,
                    bradyUnique: false,
                    afMinHr: 180,
                    afMaxHr: 40,
                    afMinDuration: 60,
                    afNotificationType: 'IMMEDIATE',
                    afDetected: false,
                    afUnique: false,
                    svtMinHr: 180,
                    svtMinDuration: 60,
                    svtNotificationType: 'IMMEDIATE',
                    svtDetected: false,
                    svtUnique: false,
                },
                mdnInfo: {
                    defaultMdnTypesList: [
                        'CHB',
                        'First AF',
                        'Symp Mobitz II',
                        'VF',
                        'Symp Brady',
                        'SVT',
                        'AF/AFL',
                        'HGAVB',
                        'VT',
                        'Pause',
                    ],
                },
            };

            Object.assign(recordDto, mockMetricsResponse);
        });

        it('should add navigation items to recordDto', () => {
            service.init();

            expect(recordDto.navigationItems).toContainEqual({
                pageKey: RecordNavigationKey.CASE_OVERVIEW,
                name: 'Case Overview',
                metricType: RecordMetricType.RECORD_PAGE,
                url: 'overview',
            });
        });

        it('should order ectopic beat child entries in the following order: SVE3, SVE2, SVE1, VE3, VE2, VE1', () => {
            service.init();

            const expectedEctopicChildren = [
                    {
                        "pageKey": "SVE3",
                        "parentPageKey": "ECTOPICS",
                        "name": "SVE Triplets",
                        "metricType": 1,
                        "url": "ectopics/SVE3",
                        "params": {
                            "sortType": "LONGEST"
                        }
                    },
                    {
                        "pageKey": "SVE2",
                        "parentPageKey": "ECTOPICS",
                        "name": "SVE Couplets",
                        "metricType": 1,
                        "url": "ectopics/SVE2",
                        "params": {
                            "sortType": "LONGEST"
                        }
                    },
                    {
                        "pageKey": "SVE1",
                        "parentPageKey": "ECTOPICS",
                        "name": "SVE Singles",
                        "metricType": 1,
                        "url": "ectopics/SVE1",
                        "params": {
                            "sortType": "LONGEST"
                        }
                    },
                    {
                        "pageKey": "VE3",
                        "parentPageKey": "ECTOPICS",
                        "name": "VE Triplets",
                        "metricType": 1,
                        "url": "ectopics/VE3",
                        "params": {
                            "sortType": "LONGEST"
                        }
                    },
                    {
                        "pageKey": "VE2",
                        "parentPageKey": "ECTOPICS",
                        "name": "VE Couplets",
                        "metricType": 1,
                        "url": "ectopics/VE2",
                        "params": {
                            "sortType": "LONGEST"
                        }
                    },
                    {
                        "pageKey": "VE1",
                        "parentPageKey": "ECTOPICS",
                        "name": "VE Singles",
                        "metricType": 1,
                        "url": "ectopics/VE1",
                        "params": {
                            "sortType": "LONGEST"
                        }
                    },

                ];

            expect(recordDto.navigationItems[2].children).toEqual(expectedEctopicChildren);
        });
    });

});

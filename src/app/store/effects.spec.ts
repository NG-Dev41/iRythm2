import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { FindingsEffects } from './effects';
import { retrieveFindingsAction, setFindingsAction } from './actions';
import {
    FindingsType,
    IFinding,
    IProcessDataResponse,
    ProcessDataDao,
} from 'app/commons/services/dao/process-data-dao.service';

import { IAppState, IFindingsState } from './state';
import { ProcessDataDaoMock } from '../../test/mocks/services/dao/process-data-dao-mock.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from '../../test/mocks/services/translation/translate-mock.service';
import { PageNotifier } from 'app/commons/services/notifiers/page-notifier.service';
import { PageNotifierMock } from '../../test/mocks/services/notifier/page-notifier-mock.service';

describe('FindingsEffects', () => {
    let actions$: Observable<Action>;
    let effects: FindingsEffects;
    let processDataDao: ProcessDataDaoMock;
    let translateService: TranslateServiceMock;
    let pageNotifier: PageNotifierMock = new PageNotifierMock();
    let store: Store<IAppState>;

    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                FindingsEffects,
                { provide: ProcessDataDao, useClass: ProcessDataDaoMock },
                { provide: TranslateService, useClass:  TranslateServiceMock },
                { provide: PageNotifier, useClass:  PageNotifierMock },
                provideMockActions(() => actions$),
                {
                    provide: Store,
                    useValue: {
                        select: () =>
                            of({
                                serialNumber: '123',
                                rawServerResponse: null,
                                findingsList: null,
                            } as IFindingsState),
                    },
                },
            ],
        });

        effects = TestBed.inject(FindingsEffects);
        processDataDao = TestBed.inject(ProcessDataDao) as ProcessDataDaoMock;
        translateService = TestBed.inject(TranslateService) as TranslateServiceMock;
        pageNotifier = TestBed.inject(PageNotifier) as PageNotifierMock;
        store = TestBed.inject(Store);
    });

    describe('retrieveFindings$', () => {

        it('should retrieve findings and dispatch setFindingsAction', () => {
            const serialNumber = '123';
            const action = retrieveFindingsAction({ serialNumber });
            const mockFindingsResponse: IProcessDataResponse = {
                findingsResponse: {
                    reportFindings: {
                        findingList: [
                            {
                                key: 'intro',
                                findingsType: 'AUTO_GENERATED' as FindingsType,
                                sequence: 100,
                            },
                            {
                                key: 'predominant2',
                                findingsType: 'AUTO_GENERATED' as FindingsType,
                                sequence: 200,
                            },
                        ],
                        keyValueMap: { maxHR: '999', minHR: '47', avgHR: "68"},
                    },
                },
            };
            const mockFindingsList: IFinding[] = [
                {
                    key: 'intro',
                    findingsType: 'AUTO_GENERATED' as FindingsType,
                    sequence: 100,
	                content: 'Patient had a min HR of ${minHR} bpm, max HR of ${maxHR} bpm, and avg HR of ${avgHR} bpm.',
                },
                {
                    key: 'predominant2',
                    findingsType: 'AUTO_GENERATED' as FindingsType,
                    sequence: 200,
                    content: 'Predominant underlying rhythm was',
                },
            ];

            jest.spyOn(processDataDao, 'processDataRequest').mockReturnValue(of(mockFindingsResponse));

            const translateSpy = jest.spyOn(translateService, 'get').mockReturnValue(
                of({
                    intro: 'Patient had a min HR of ${minHR} bpm, max HR of ${maxHR} bpm, and avg HR of ${avgHR} bpm.',
                    predominant2: 'Predominant underlying rhythm was',
                })
            );

            const expectedResultAction = setFindingsAction({
                findings: {
                    serialNumber: '123',
                    rawServerResponse: JSON.stringify(mockFindingsResponse.findingsResponse.reportFindings),
                    findingsList: mockFindingsList,
	                keyValueMap: { maxHR: '999', minHR: '47', avgHR: "68"}
                },
            });


            actions$ = hot('a', { a: action });
            const expected = cold('b', { b: expectedResultAction });

            expect(effects.retrieveFindings$).toBeObservable(expected);

        });

    });
});

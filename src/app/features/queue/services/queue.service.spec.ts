import { TestBed } from '@angular/core/testing';
import { QueueService } from './queue.service';
import { UserDto } from 'app/commons/services/dtos/user-dto.service';
import { SnackbarService } from 'app/modules/snackbar/snackbar.service';
import { IQueueResponse, IQueueRecord, QueueDao, IQueueRequest, QueueAction } from 'app/features/queue/daos/queue-dao.service';
import { QueueUtils } from 'app/modules/queue/services/queue-utils.service';
import { QueueDaoMock } from 'test/mocks/services/dao/queue-dao-mock.service';
import { SnackbarServiceMock } from 'test/mocks/services/snackbar-service-mock.service';
import { UserDtoMock } from 'test/mocks/services/dto/user-dto-mock.service';
import { of } from 'rxjs';
import { newTransferSuccess, newReassignMessage } from 'app/commons/constants/common.const';

describe('QueueService', () => {
    let service: QueueService;
    let queueDao: QueueDao;
    let snackbarService: SnackbarService;
    let queueUtils: QueueUtils;
    let userDto: UserDto;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                QueueService,
                { provide: QueueDao, useClass: QueueDaoMock },
                { provide: SnackbarService, useClass: SnackbarServiceMock },
                { provide: QueueUtils, useValue: { getDiff: () => [] } },
                { provide: UserDto, useClass: UserDtoMock },
            ]
        });

        service = TestBed.inject(QueueService);
        queueDao = TestBed.inject(QueueDao);
        snackbarService = TestBed.inject(SnackbarService);
        queueUtils = TestBed.inject(QueueUtils);
        userDto = TestBed.inject(UserDto);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('initQueue', () => {
        it('should set queuePoll subscriber', () => {
            const expectedResponse = { key: 'test' };
            const spyProcessQueue = jest.spyOn(service as any, 'processQueue').mockReturnValue(of(expectedResponse) as any);
            service.initQueue(undefined);
            expect(service.queuePoll$).toBeDefined();
        })
    })

    describe('makeQueueRequest', () => {
        it('should push ecgSerialNumber to userOnHoldList if queueAction is ON_HOLD or ON_HOLD_CONSULTATION', () => {
            const payload: any = { queueAction: QueueAction.ON_HOLD, ecgSerialNumber: '10' };
            const spyProcessQueue = jest.spyOn(service as any, 'processQueue');
            service.makeQueueRequest(payload);
            expect(service.userOnHoldList.includes(payload.ecgSerialNumber)).toBe(true);
            expect(spyProcessQueue).toHaveBeenCalled();
        })

        it('should set userInProgress to true if QueueAction is IN_PROGRESS', () => {
            const payload: any = { queueAction: QueueAction.IN_PROGRESS, ecgSerialNumber: '10' };
            const spyProcessQueue = jest.spyOn(service as any, 'processQueue');
            service.makeQueueRequest(payload);
            expect(service.userInProgress).toBe(true);
            expect(spyProcessQueue).toHaveBeenCalled();
        })
    })

    describe('checkForNewTransferSnackbar', () => {
        it('should open openSnackBar if prevLength < currLength', () => {
            const spyOpenSnackBar = jest.spyOn(snackbarService, 'openSnackBar');
            service['checkForNewTransferSnackbar'](10, 100);
            expect(spyOpenSnackBar).toHaveBeenCalledWith(newTransferSuccess, 'x');
        })
    })

    describe('checkForNewReassignSnackbar', () => {
        it('should open openSnackBar if prevLength > currLength', () => {
            const spyOpenSnackBar = jest.spyOn(snackbarService, 'openSnackBar');
            service['checkForNewReassignSnackbar'](100, 8, '4aq');
            expect(spyOpenSnackBar).toHaveBeenCalledWith(newReassignMessage('4aq'), 'x');
        })
    })

    describe('processQueue', () => {
        it('should set queue data', () => {
            const payload: any = { user: {} };
            const spyOpenSnackBar = jest.spyOn(queueDao, 'processQueue');
            service['prevResponse'] = undefined;
            const result = service['processQueue'](payload);
            expect(spyOpenSnackBar).toHaveBeenCalledWith(payload);

            queueDao.processQueue(payload).subscribe(res => {
                expect(service.queueData).toBe(service['processResponse'](res));
                expect(service['prevResponse']).toBe(res);
            })
        })
    })

    describe('checkLength', () => {
        it('should return true if cur and prev onHoldList is []', () => {
            const prev: any = { queueRecordList: { onHoldList: [] } };
            const curr: any = { queueRecordList: { onHoldList: [] } };

            const spyGetNewRecords = jest.spyOn(service, 'getNewRecords');
            service['prevResponse'] = undefined;
            const result = service['checkLength'](prev, curr);
            expect(spyGetNewRecords).toHaveBeenCalledWith([], []);
            expect(result).toBe(true);
        })
    })

    describe('stopPolling', () => {
        it('should unsubscribe the queuePoll$', () => {
            service.initQueue(undefined);
            const spyUnsubscribe = jest.spyOn(service['queuePoll$'], 'unsubscribe');
            service.stopPolling();
            expect(spyUnsubscribe).toHaveBeenCalled();
        })
    })

    describe('isRecordOlderThanThreeDays', () => {
        it('should return true if record is older than three days', () => {
            const record: any = { lockedDateTime: new Date('10/10/1950') };
            const result = service['isRecordOlderThanThreeDays'](record);
            expect(result).toBe(true);
        })

        it('should return false if record is not older than three days', () => {
            const record: any = { lockedDateTime: new Date() };
            const result = service['isRecordOlderThanThreeDays'](record);
            expect(result).toBe(false);
        })
    })

    describe('getNewRecords', () => {
        it('should call checkForNewReassignSnackbar and removeRecordFromCache if userInProgress is false', () => {
            const prev: any = { queueRecordList: { onHoldList: [{ ecgSerialNumber: 'e10' }] } };
            const curr: any = { queueRecordList: { onHoldList: [{ ecgSerialNumber: '0ju' }] } };
            const spyCheckForNewReassignSnackbar = jest.spyOn(service as any, 'checkForNewReassignSnackbar');
            const spyRemoveRecordFromCache = jest.spyOn(service, 'removeRecordFromCache');
            const reassignedFromUserDiff = service['queueUtils'].getDiff(prev, curr);
            service.getNewRecords(prev, curr);
            expect(service.userInProgress).toBe(false);
            expect(spyCheckForNewReassignSnackbar).toHaveBeenCalledWith(prev.length, curr.length, reassignedFromUserDiff[0]?.ecgSerialNumber);
            expect(spyRemoveRecordFromCache).toHaveBeenCalledWith(reassignedFromUserDiff[0]?.ecgSerialNumber);
        })

        it('test result when diffRecords has no items', () => {
            const curr: any = { queueRecordList: { onHoldList: [{ ecgSerialNumber: 'e10' }, { ecgSerialNumber: '457' }] } };
            const prev: any = { queueRecordList: { onHoldList: [{ ecgSerialNumber: '478' }, { ecgSerialNumber: '748' }] } };

            jest.spyOn(queueUtils, 'getDiff').mockReturnValue([{ ecgSerialNumber: 'e10' }, { ecgSerialNumber: '457' }] as any);
            const newTransferRecord = { ecgSerialNumber: 'e10' } as any;
            const spyCheckForNewReassignSnackbar = jest.spyOn(service as any, 'checkForNewReassignSnackbar');

            service.userOnHoldList = [];
            service.diffRecords = [];

            const result = service.getNewRecords(prev, curr);
            expect(newTransferRecord).toBeDefined();
            expect(service.userOnHoldList?.some(ecg => ecg === newTransferRecord.ecgSerialNumber)).toBe(false);
            expect(spyCheckForNewReassignSnackbar).toHaveBeenCalled();
            expect(service.diffRecords.length).toBe(1);
            expect(service.diffRecords[0]).toStrictEqual(newTransferRecord);
        })

        it('test result when diffRecords has items and its ecgSerialNumber not match with newTransferRecord ecgSerialNumber', () => {
            const curr: any = { queueRecordList: { onHoldList: [{ ecgSerialNumber: 'e10' }, { ecgSerialNumber: '457' }] } };
            const prev: any = { queueRecordList: { onHoldList: [{ ecgSerialNumber: '478' }, { ecgSerialNumber: '748' }] } };

            jest.spyOn(queueUtils, 'getDiff').mockReturnValue([{ ecgSerialNumber: 'e10' }, { ecgSerialNumber: '457' }] as any);
            const newTransferRecord = { ecgSerialNumber: 'e10' } as any;

            service.userOnHoldList = [];
            service.diffRecords = [{ ecgSerialNumber: '457' }] as any;

            const index = service.diffRecords.findIndex(object => object?.ecgSerialNumber === newTransferRecord.ecgSerialNumber);

            const result = service.getNewRecords(prev, curr);
            expect(newTransferRecord).toBeDefined();
            expect(index).toBe(-1);
            expect(service.diffRecords.length).toBe(2);
            expect(service.diffRecords[1]).toStrictEqual(newTransferRecord);
        })

        it('test result when diffRecords has items and its ecgSerialNumber match with newTransferRecord ecgSerialNumber', () => {
            const curr: any = { queueRecordList: { onHoldList: [{ ecgSerialNumber: 'e10' }, { ecgSerialNumber: '457' }] } };
            const prev: any = { queueRecordList: { onHoldList: [{ ecgSerialNumber: '478' }, { ecgSerialNumber: '748' }] } };

            jest.spyOn(queueUtils, 'getDiff').mockReturnValue([{ ecgSerialNumber: 'e10' }, { ecgSerialNumber: '457' }] as any);
            const newTransferRecord = { ecgSerialNumber: 'e10' } as any;

            service.userOnHoldList = [];
            service.diffRecords = [newTransferRecord] as any;

            const result = service.getNewRecords(prev, curr);
            expect(newTransferRecord).toBeDefined();
            expect(service.diffRecords.length).toBe(1);
        })
    })

    describe('isNewRecord', () => {
        it('should return true if loadQueueDiffFromCache response ecgSerialNumber is match with given record ecgSerialNumber', async () => {
            const record: any = { lockedDateTime: new Date('10/10/1950'), ecgSerialNumber: '1010' };
            const res: any = { diffRecords: [{ ecgSerialNumber: '1010' }] }
            const spyQueueDao = jest.spyOn(queueDao, 'loadQueueDiffFromCache').mockReturnValue(of(res) as any);
            const result = service['isNewRecord'](record);
            expect(spyQueueDao).toHaveBeenCalledWith(service.user);
            expect(await result.toPromise()).toBe(true);
            expect(service.diffRecords).toBe(res.diffRecords);
        })

        it('should return true if loadQueueDiffFromCache response ecgSerialNumber is not match with given record ecgSerialNumber', async () => {
            const record: any = { lockedDateTime: new Date('10/10/1950'), ecgSerialNumber: 'aws' };
            const res: any = { diffRecords: [{ ecgSerialNumber: '1010' }] }
            const spyQueueDao = jest.spyOn(queueDao, 'loadQueueDiffFromCache').mockReturnValue(of(res) as any);
            const result = service['isNewRecord'](record);
            expect(spyQueueDao).toHaveBeenCalledWith(service.user);
            expect(await result.toPromise()).toBe(false);
            expect(service.diffRecords).toBe(res.diffRecords);
        })
    })

    describe('removeRecordFromCache', () => {
        it('should change and set new diffRecords', () => {
            service.diffRecords = [{ ecgSerialNumber: '1010' }] as any;
            const result = service.removeRecordFromCache('1010');
            expect(service.diffRecords).toStrictEqual([]);
        })

        it('should return saveQueueDiffToCache subscriber', () => {
            service.diffRecords = [{ ecgSerialNumber: '1010' }] as any;
            const spySaveQueueDiffToCache = jest.spyOn(queueDao, 'saveQueueDiffToCache').mockReturnValue(of(true) as any);
            const result = service.removeRecordFromCache('1010');
            expect(spySaveQueueDiffToCache).toHaveBeenCalledWith(service.user, service.diffRecords);
            expect(result).toBeDefined();
        })
    })

    describe('getCachedValues', () => {
        it('should set user', () => {
            const user = { ecgSerialNumber: '1010' } as any;
            service.getCachedValues(user);
            expect(service.user).toBe(user);
        })

        it('should set onHoldRecords value by calling loadQueueHoldFromCache', () => {
            const user = { ecgSerialNumber: '1010' } as any;
            const spyLoadQueueHoldFromCache = jest.spyOn(queueDao, 'loadQueueHoldFromCache').mockReturnValue(of({ onHoldRecords: 10 }) as any);
            service.getCachedValues(user);
            expect(spyLoadQueueHoldFromCache).toHaveBeenCalledWith(service.user);
            expect(service.onHoldRecords).toBe(10);
        });

        it('should set diffRecords value by calling loadQueueDiffFromCache', () => {
            const user = { ecgSerialNumber: '1010' } as any;
            const spyLoadQueueDiffFromCache = jest.spyOn(queueDao, 'loadQueueDiffFromCache').mockReturnValue(of({ diffRecords: 10 }) as any);
            service.getCachedValues(user);
            expect(spyLoadQueueDiffFromCache).toHaveBeenCalledWith(service.user);
            expect(service.diffRecords).toBe(10);
        });
    })
});

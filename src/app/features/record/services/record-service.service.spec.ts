import { TestBed } from '@angular/core/testing';

import { RecordService } from './record-service.service';
import { ProcessDataDaoMock } from 'test/mocks/services/dao/process-data-dao-mock.service';
import { ProcessDataDao } from 'app/commons/services/dao/process-data-dao.service';
import { PageDto } from 'app/commons/services/dtos/page-dto.service';
import { PageNotifier } from 'app/commons/services/notifiers/page-notifier.service';
import { EcgDaoNotifier } from 'app/modules/ecg/services/notifier/dao/ecg-dao-notifier.service';
import { PageDtoMock } from 'test/mocks/services/dto/page-dto-mock.service';
import { RecordDtoMock } from 'test/mocks/services/dto/record-dto-mock.service';
import { EcgDaoNotifierMock } from 'test/mocks/services/notifier/ecg-dao-notifier-mock.service';
import { PageNotifierMock } from 'test/mocks/services/notifier/page-notifier-mock.service';
import { RecordNotifierMock } from 'test/mocks/services/notifier/record-notifier-mock.service';
import { RecordMetricsDao } from './daos/record-metrics-dao.service';
import { RecordDto, RecordStateDto } from './dtos/record-dto.service';
import { RecordNotifier } from './notifiers/record-notifier.service';
import { RecordStateDtoMock } from 'test/mocks/services/dto/record-state-dto-mock.service';
import { RecordMetricsDaoMock } from 'test/mocks/services/dao/record-metrics-dao-mock.service';
import { RecordDaoMock } from 'test/mocks/services/dao/record-dao-mock.service';
import { RecordDao } from './daos/record-dao.service';

describe('RecordService', () => {
    let service: RecordService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                RecordService,
                { provide: RecordDto, useClass: RecordDtoMock },
                { provide: RecordDao, useClass: RecordDaoMock },
                { provide: RecordStateDto, useClass: RecordStateDtoMock },
                { provide: ProcessDataDao, useClass: ProcessDataDaoMock },
                { provide: RecordMetricsDao, useClass: RecordMetricsDaoMock },
                { provide: PageDto, useClass: PageDtoMock },
                { provide: PageNotifier, useClass: PageNotifierMock },
                { provide: EcgDaoNotifier, useClass: EcgDaoNotifierMock },
                { provide: RecordNotifier, useClass: RecordNotifierMock }
            ]
        });
        service = TestBed.inject(RecordService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

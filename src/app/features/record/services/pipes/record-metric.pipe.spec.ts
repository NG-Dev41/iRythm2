import { PageDto } from 'app/commons/services/dtos/page-dto.service';
import { RecordMetricPipe } from './record-metric.pipe';
import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { RecordDtoMock } from "test/mocks/services/dto/record-dto-mock.service";
import { TestBed } from '@angular/core/testing';
import { RecordMetricType } from '../enums/record-navigation.enum';

describe('RecordMetricPipe', () => {
    let pipe: RecordMetricPipe;
    let recordDto: RecordDto;
    const metrics: any = {
        rhythmMetrics: { rhythms: 15, rhythms2: 41 },
        ectopicMetrics: { ectopics: 12 },
        recordPage: 10,
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RecordMetricPipe, { provide: RecordDto, useClass: RecordDtoMock }],
        });

        pipe = TestBed.inject(RecordMetricPipe);

        recordDto = TestBed.inject(RecordDto) as RecordDto;
        recordDto['metrics'] = metrics as any;
    });

    it('should create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('test value when metricType is RHYTHMS', () => {
        const result = pipe.transform(RecordMetricType.RHYTHMS, 'rhythms')
        expect(result).toBe(15);
    });

    it('test value when metricType is ECTOPICS', () => {
        const result = pipe.transform(RecordMetricType.ECTOPICS, 'ectopics')
        expect(result).toBe(12);
    });

    it('test value when metricType is RECORD_PAGE', () => {
        const result = pipe.transform(RecordMetricType.RECORD_PAGE, 'recordPage')
        expect(result).toBe(10);
    });

    it('test value when metricType is RHYTHMS', () => {
        const result = pipe.transform(RecordMetricType.RHYTHMS, 'rhythms2')
        expect(result).toBe(41);
    });

    it('should return 0 if no RecordMetricType match', () => {
        const result = pipe.transform('test' as any, 'rhythms2')
        expect(result).toBe(0);
    });
});

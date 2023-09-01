import { TestBed } from '@angular/core/testing';
import { NewRecordPipe } from './new-record.pipe';
import { QueueServiceMock } from 'test/mocks/services/queue-mock.service';
import { QueueService } from 'app/features/queue/services/queue.service';

describe('NewRecordPipe', () => {
    let pipe: NewRecordPipe;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: QueueService, useClass: QueueServiceMock }
            ]
        });
        const service = TestBed.inject(QueueService);
        pipe = new NewRecordPipe(service);
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });
});

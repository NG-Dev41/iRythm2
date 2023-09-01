import { TestBed } from "@angular/core/testing";
import { QueueUtils } from "../services/queue-utils.service";
import { DaysInQueuePipe } from "./days-in-queue.pipe";

describe('DaysInQueuePipe', () => {
    let pipe: DaysInQueuePipe;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: QueueUtils, useValue: {} }
            ]
        });
        const service = TestBed.inject(QueueUtils);
        pipe = new DaysInQueuePipe(service);
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });
});
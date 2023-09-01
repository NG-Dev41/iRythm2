import { TestBed } from "@angular/core/testing";
import { QueueUtils } from "../services/queue-utils.service";
import { DaysInQueueCellPipe } from "./days-in-queue-cell.pipe";

describe('DaysInQueueCellPipe', () => {
    let pipe: DaysInQueueCellPipe;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: QueueUtils, useValue: {} }
            ]
        });
        const service = TestBed.inject(QueueUtils);
        pipe = new DaysInQueueCellPipe(service);
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });
});
import { of } from "rxjs";

export class QueueDaoMock {
    processQueue() { return of({}) }
    loadQueueDiffFromCache() { return of({}) }
    saveQueueDiffToCache() { return of({}) }
    loadQueueHoldFromCache() { return of({}) }
}
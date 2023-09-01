import { UserDto } from '../../../app/commons/services/dtos/user-dto.service';
import {IQueueRecord, IQueueRequest, QueueAction} from 'app/features/queue/daos/queue-dao.service';
import { Observable, of, Subscription } from 'rxjs';

export class QueueServiceMock {
    public onHoldRecords = [];

    public getNewRecords(prev: IQueueRecord[], curr: IQueueRecord[]): IQueueRecord[] {
        return new Array<IQueueRecord>();
    }

    /**
     * Returns a boolean based on if record is a new transfer. Used with newRecordPipe
     */

    public isNewRecord(record: IQueueRecord): Observable<boolean> {
        return of(true);
    }

    /**
     * Local Storage Handlers
     * @param serialNumber
     */
    public removeRecordFromCache(serialNumber): Subscription {
        return of('').subscribe();
    }


    public initQueue(payload: IQueueRequest): void {}

    public stopPolling() { }

    public getCachedValues(user: UserDto) { }
}

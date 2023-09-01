import { Pipe, PipeTransform } from '@angular/core';
import { IQueueRecord } from 'app/features/queue/daos/queue-dao.service';
import { QueueUtils } from 'app/modules/queue/services/queue-utils.service';

@Pipe({
  name: 'daysInQueue'
})
export class DaysInQueuePipe implements PipeTransform {
    constructor(public queueUtils: QueueUtils) {

    }

  transform(record: IQueueRecord): number {
    return this.queueUtils.calcDaysInQueue(record.lockedDateTime);
  }

}

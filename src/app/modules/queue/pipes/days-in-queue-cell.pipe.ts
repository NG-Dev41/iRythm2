import { Pipe, PipeTransform } from '@angular/core';
import { IQueueRecord } from 'app/features/queue/daos/queue-dao.service';
import { QueueUtils } from 'app/modules/queue/services/queue-utils.service';
import { differenceInDays } from 'date-fns';

@Pipe({
    name: 'daysInQueueCell'
})
export class DaysInQueueCellPipe implements PipeTransform {
    constructor(public queueUtils: QueueUtils) {

    }

    transform(record: IQueueRecord, lessThanTwoDaysCell: boolean = false): number {
        let diffInDays = differenceInDays( new Date(), record.lockedDateTime);
        if(lessThanTwoDaysCell) {
            return diffInDays + 1;
        } else {
            return Math.min(diffInDays, 3);
        }
    }

}

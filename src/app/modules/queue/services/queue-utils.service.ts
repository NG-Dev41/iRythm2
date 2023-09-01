import { Injectable } from '@angular/core';

import { IQueueRecord } from 'app/features/queue/daos/queue-dao.service';



// TODO: This isn't a service but a utility class as the class name suggests.
// Should not be a provider but static methods - we don't need an instance of this class.
@Injectable({
    providedIn: 'root',
})
export class QueueUtils {

    public constructor() {
    }

    /**
     * Returns the number of days from a given start date time that a record has been in queue
     * @param lockedDateTime
     */
    public calcDaysInQueue(lockedDateTime: Date): number {
        if(lockedDateTime) {
            let differenceInTime = new Date().getTime() - lockedDateTime.getTime();
            let daysInQueue = differenceInTime / (1000 * 3600 * 24);
            return daysInQueue;
        } else {
            return -1;
        }
    }

    /**
     * Copies a URL to the users clipboard
     */
    public writeUrlToClipboard() {
        navigator.clipboard.writeText(atob('aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1kUXc0dzlXZ1hjUQ=='));
    }

    /**
     * Returns a boolean representing if the record has been in the queue longer than three days
     * @param record
     */
    public calcIsRecordLongerThanThreeDays(record: IQueueRecord) {
        if(!record) {
            return;
        }
        if(this.calcDaysInQueue(record.lockedDateTime) >= 3) {
            return true;
        }
        return false;
    }

    /**
     * Returns diff of two arrays as new array
     * @param array1
     * @param array2
     */

    public getDiff(array1: IQueueRecord[], array2: IQueueRecord[]): IQueueRecord[] {
        return array1.filter(object1 => {
            return !array2.some(object2 => {
                return object1.ecgSerialNumber === object2.ecgSerialNumber;
            });
        });
    }
}


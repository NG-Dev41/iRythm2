import { Pipe, PipeTransform } from '@angular/core';
import { QueueService } from 'app/features/queue/services/queue.service';
import { Observable } from 'rxjs';

@Pipe({
  name: 'newRecord'
})
export class NewRecordPipe implements PipeTransform {

    /**
     * Ctor
     * @param queueService
     */
    constructor( public queueService: QueueService) {}

    /**
     * Transform
     * Returns a boolean based on if record is a new transfer
     * @param record
     */
    public transform(record): Observable<boolean> {
        return  this.queueService.isNewRecord(record);
    }

}

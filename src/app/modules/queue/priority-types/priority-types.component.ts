import { Component, Input } from '@angular/core';

import { IQueueRecord, QueueRecordPriority } from 'app/features/queue/daos/queue-dao.service';


@Component({
    selector: 'app-priority-types',
    templateUrl: './priority-types.component.html',
    styleUrls: ['./priority-types.component.scss']
})
export class PriorityTypesComponent {

    // Record Input
    @Input() record: IQueueRecord;

    // For use with comparisons in template
    public QueueRecordPriority = QueueRecordPriority;
}

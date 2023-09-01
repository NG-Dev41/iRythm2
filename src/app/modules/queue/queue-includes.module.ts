import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DateFnsModule } from 'ngx-date-fns';

import { NotesModule } from 'app/modules/notes/notes.module';
import { OnHoldTableComponent } from './on-hold-table/on-hold-table.component';
import { InProgressTableComponent } from './in-progress-table/in-progress-table.component';
import { MaterialModule } from 'app/modules/material/material.module';
import { QueueUtils } from 'app/modules/queue/services/queue-utils.service';
import { DaysInQueueCellPipe } from 'app/modules/queue/pipes/days-in-queue-cell.pipe';
import { DaysInQueuePipe } from './pipes/days-in-queue.pipe';
import { JoinWithCommaPipe } from 'app/core/pipes/join-with-comma.pipe';
import { PriorityTypesComponent } from './priority-types/priority-types.component';
import { AgingRecordsModalComponent } from './aging-records-modal/aging-records-modal.component';
import { OnHoldModalComponent } from './on-hold-modal/on-hold-modal.component';
import { ProductivityDashboardComponent } from './productivity-dashboard/productivity-dashboard.component';
import { NewRecordPipe } from './pipes/new-record.pipe';


@NgModule({
    declarations: [
        DaysInQueueCellPipe,
        DaysInQueuePipe,
        OnHoldTableComponent,
        InProgressTableComponent,
        JoinWithCommaPipe,
        PriorityTypesComponent,
        AgingRecordsModalComponent,
        OnHoldModalComponent,
        ProductivityDashboardComponent,
        NewRecordPipe
    ],
    imports: [
        RouterModule,
        CommonModule,
        MaterialModule,
        NotesModule,
        // forRoot() to work with tree shaking
        DateFnsModule.forRoot()
        //MomentModule
    ],
    exports: [
        DaysInQueueCellPipe,
        DaysInQueuePipe,
        OnHoldTableComponent,
        InProgressTableComponent,
        JoinWithCommaPipe,
        PriorityTypesComponent,
        ProductivityDashboardComponent
    ],
    providers: [
        QueueUtils
    ]
})

export class QueueIncludesModule {
}

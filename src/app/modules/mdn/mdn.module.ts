import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DateFnsModule } from 'ngx-date-fns';

import { MaterialModule } from 'app/modules/material/material.module';
import { PatchNotificationTableComponent } from './patch-notification-table/patch-notification-table.component';
import { PatchNotificationCriteriaComponent } from './patch-notification-criteria/patch-notification-criteria.component';
import { InfoListCardComponent } from './info-list-card/info-list-card.component';


@NgModule({
    declarations: [
        PatchNotificationTableComponent,
        PatchNotificationCriteriaComponent,
        InfoListCardComponent
    ],
    exports: [
        PatchNotificationTableComponent,
        PatchNotificationCriteriaComponent,
        InfoListCardComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        MatIconModule,
        DateFnsModule.forRoot()
    ]
})
export class MdnModule { }

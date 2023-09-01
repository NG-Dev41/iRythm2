import { Component, OnInit } from '@angular/core';
import { format } from 'date-fns';

import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';

@Component({
    selector: 'app-patch-notification-criteria',
    templateUrl: './patch-notification-criteria.component.html',
    styleUrls: ['./patch-notification-criteria.component.scss']
})
export class PatchNotificationCriteriaComponent implements OnInit {

    constructor(public recordDto: RecordDto) {
    }

    ngOnInit(): void {
    }

}

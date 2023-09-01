import { Component, OnInit } from '@angular/core';

import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';

@Component({
	selector: 'app-record-patient-info',
	templateUrl: './record-patient-info.component.html',
	styleUrls: ['./record-patient-info.component.scss']
})
export class RecordPatientInfoComponent implements OnInit {

    constructor(public recordDto: RecordDto) {
    }

    public ngOnInit(): void {
	}
}

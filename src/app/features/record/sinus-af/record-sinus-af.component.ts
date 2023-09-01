import { Component, OnInit } from '@angular/core';

import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';

@Component({
	selector: 'app-record-sinus-af',
	templateUrl: './record-sinus-af.component.html',
	styleUrls: ['./record-sinus-af.component.scss']
})
export class RecordSinusAfComponent implements OnInit {

	public constructor(
		public recordDto: RecordDto
	) {}


	public ngOnInit(): void {

	}
}

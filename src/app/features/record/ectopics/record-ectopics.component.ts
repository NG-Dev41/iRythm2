import { Component, OnInit } from '@angular/core';

import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';


/**
 * Record Overiew component.
 */
@Component({
	selector: 'app-record-ectopics',
	templateUrl: './record-ectopics.component.html',
	styleUrls: ['./record-ectopics.component.scss']
})
export class RecordEctopicsComponent implements OnInit {


	/**
	 * Ctor
	 */
	public constructor(
		public recordDto: RecordDto
	) {}


	/**
	 * OnInit
	 */
	public ngOnInit(): void {

	}
}

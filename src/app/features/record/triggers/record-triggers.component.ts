import { Component, OnInit } from '@angular/core';

import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';


/**
 * Record Overiew component.
 */
@Component({
	selector: 'app-record-triggers',
	templateUrl: './record-triggers.component.html',
	styleUrls: ['./record-triggers.component.scss']
})
export class RecordTriggersComponent implements OnInit {


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

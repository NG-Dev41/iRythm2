import { Component, OnInit } from '@angular/core';

import { RecordDto } from '../services/dtos/record-dto.service';



/**
 * Record Overiew component.
 */
@Component({
	selector: 'app-record-diaries',
	templateUrl: './record-diaries.component.html',
	styleUrls: ['./record-diaries.component.scss']
})
export class RecordDiariesComponent implements OnInit {


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

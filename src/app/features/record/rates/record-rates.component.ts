import { Component, OnInit } from '@angular/core';

import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';


/**
 * Record Overiew component.
 */
@Component({
	selector: 'app-record-rates',
	templateUrl: './record-rates.component.html',
	styleUrls: ['./record-rates.component.scss']
})
export class RecordRatesComponent implements OnInit {


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

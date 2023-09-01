import { Component, OnInit } from '@angular/core';

import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';


/**
 * Record Overiew component.
 */
@Component({
	selector: 'app-record-event-chart',
	templateUrl: './record-event-chart.component.html',
	styleUrls: ['./record-event-chart.component.scss']
})
export class RecordEventChartComponent implements OnInit {


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

import { Component } from '@angular/core';
import { RecordService } from '../services/record-service.service';
import { RecordDto } from '../services/dtos/record-dto.service';
import { EcgLayoutType } from '../services/enums';


@Component({
	selector: 'app-record-layout-toggle',
	templateUrl: './record-layout-toggle.component.html',
	styleUrls: ['./record-layout-toggle.component.scss']
})
export class RecordLayoutToggleComponent {

	// For use in the template
	public EcgLayoutType = EcgLayoutType;


	/**
	 * Ctor
	 *
	 * @param {RecordService} public recordService
	 * @param {RecordDto}     public recordDto
	 */
	public constructor(
		public recordService: RecordService,
		public recordDto: RecordDto
	) {}
}

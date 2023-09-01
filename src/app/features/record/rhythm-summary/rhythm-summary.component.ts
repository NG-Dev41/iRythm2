import { Component } from '@angular/core';

import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { RecordRhythmsDto } from 'app/features/record/rhythms/record-rhythms.service';

@Component( {
	selector: 'app-header-rhythm-summary',
	templateUrl: './rhythm-summary.component.html',
	styleUrls: [ './rhythm-summary.component.scss' ]
} )
export class RhythmSummaryComponent {

	public longestEpisodeDurationString: string = '000:00:00';

	constructor( public recordDto: RecordDto, public rhythmsDto: RecordRhythmsDto ) {}
}

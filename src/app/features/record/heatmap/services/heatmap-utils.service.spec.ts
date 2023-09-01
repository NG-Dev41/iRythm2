import { TestBed } from '@angular/core/testing';

import { HeatmapUtilsService } from './heatmap-utils.service';
import { RecordRhythmsDtoMock } from 'test/mocks/services/dto/record-rhythms-dto-mock.service';
import { RecordRhythmsDto } from '../../rhythms/record-rhythms.service';

describe( 'HeatmapUtilsService', () => {
	let service: HeatmapUtilsService;

	beforeEach( () => {
		TestBed.configureTestingModule( {
			providers: [ 
				HeatmapUtilsService,
				{ provide: RecordRhythmsDto, useClass: RecordRhythmsDtoMock } ]
		} );
		service = TestBed.inject( HeatmapUtilsService );
	} );

	it( 'should be created', () => {
		expect( service ).toBeTruthy();
	} );
} );

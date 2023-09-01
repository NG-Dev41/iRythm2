import { TestBed } from '@angular/core/testing';

import { HeatmapRectanglesService } from './heatmap-rectangles.service';

describe( 'HeatmapRectanglesService', () => {
	let service: HeatmapRectanglesService;

	beforeEach( () => {
		TestBed.configureTestingModule( {
			providers: [ HeatmapRectanglesService ]
		} );
		service = TestBed.inject( HeatmapRectanglesService );
	} );

	it( 'should be created', () => {
		expect( service ).toBeTruthy();
	} );
} );

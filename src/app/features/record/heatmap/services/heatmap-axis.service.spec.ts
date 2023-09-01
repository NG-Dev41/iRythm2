import { TestBed } from '@angular/core/testing';

import { HeatmapAxisService } from './heatmap-axis.service';

describe('HeatmapAxisService', () => {
    let service: HeatmapAxisService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ HeatmapAxisService ]
        });
        service = TestBed.inject(HeatmapAxisService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

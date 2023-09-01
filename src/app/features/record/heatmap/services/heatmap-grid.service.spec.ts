import { TestBed } from '@angular/core/testing';

import { HeatmapGridService } from './heatmap-grid.service';

describe('HeatmapGridService', () => {
	let service: HeatmapGridService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [HeatmapGridService]
		});
		service = TestBed.inject(HeatmapGridService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('init', () => {
		it('should set canvas, config and heatmapUtils', () => {
			const heatmapCanvasFabric: any = {};
			const config: any = {};
			const heatmapUtils: any = {};

			service.init(heatmapCanvasFabric, config, heatmapUtils);

			expect(service['canvas']).toBe(heatmapCanvasFabric);
			expect(service['config']).toBe(config);
			expect(service['heatmapUtils']).toBe(heatmapUtils);
		})
	})
});

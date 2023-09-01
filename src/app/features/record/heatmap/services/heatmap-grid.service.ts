import { Injectable } from '@angular/core';
import { StaticCanvas } from 'fabric/fabric-impl';
import { IHeatMapCell, IHeatMapComputedBound } from 'app/modules/ecg/interfaces';
import { IHeatMapConfig } from 'app/features/record/heatmap/heatmap.component';
import { fabric } from 'fabric';
import { HeatmapUtilsService } from 'app/features/record/heatmap/services/heatmap-utils.service';

@Injectable()
export class HeatmapGridService {
	private heatmapUtils: HeatmapUtilsService;

	private canvas: StaticCanvas;
	private config: IHeatMapConfig;

	constructor() {
	}

	public init(heatmapCanvasFabric: StaticCanvas, config: IHeatMapConfig, heatmapUtils: HeatmapUtilsService) {
		this.canvas = heatmapCanvasFabric;
		this.config = config;
		this.heatmapUtils = heatmapUtils;
	}

	/**
	 * Renders the grid lines for the HeatMap
	 * The grid lines are the lines separating the colored cells
	 * @param bound
	 * @param grid
	 */
	public render(bound: IHeatMapComputedBound, grid: IHeatMapCell[][]): void {

		// Render Horizontal lines
		for (let curRowIndex = 0; curRowIndex < this.heatmapUtils.getNumRows() + 1; curRowIndex++) {
			let horziontalLine = new fabric.Line([
				this.config.leftAxisHeaderWidth + this.config.leftMargin,
				(curRowIndex * this.heatmapUtils.getRowHeight()) + this.config.topMargin,
				this.heatmapUtils.getCanvasWidth() + this.config.leftMargin,
				(curRowIndex * this.heatmapUtils.getRowHeight()) + this.config.topMargin
			], {
				stroke: '#ECEEEF',
				strokeWidth: this.config.gridLineThickness
			});

			this.canvas.add(horziontalLine);

		}

		// Render Vertical lines
		for (let curColumnIndex = 0; curColumnIndex < this.heatmapUtils.getNumColumns() + 1; curColumnIndex++) {
			let verticalLine = new fabric.Line([
				this.config.leftAxisHeaderWidth + this.config.leftMargin +
				(curColumnIndex * this.heatmapUtils.getRowWidth()), this.config.topMargin,
				this.config.leftAxisHeaderWidth + this.config.leftMargin +
				(curColumnIndex * this.heatmapUtils.getRowWidth()),
				this.heatmapUtils.getGridHeight() + this.config.topMargin
			], {
				stroke: '#ECEEEF',
				strokeWidth: this.config.gridLineThickness
			});

			this.canvas.add(verticalLine);
		}
	}
}

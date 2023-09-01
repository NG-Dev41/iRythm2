import { Injectable } from '@angular/core';
import { IHeatMapCell, IHeatMapComputedBound } from 'app/modules/ecg/interfaces';
import { StaticCanvas } from 'fabric/fabric-impl';
import { IHeatMapConfig } from 'app/features/record/heatmap/heatmap.component';
import { RecordRhythmsDto } from 'app/features/record/rhythms/record-rhythms.service';

@Injectable()
export class HeatmapUtilsService {
	private canvas: StaticCanvas;
	private config: IHeatMapConfig;

	constructor(private rhythmsDto: RecordRhythmsDto,) {
	}

	public init( heatmapCanvasFabric: StaticCanvas, config: IHeatMapConfig ): void {
		this.canvas = heatmapCanvasFabric;
		this.config = config;
	}

	public getNumRows(): number {
		return this.rhythmsDto.response.heatMapResponse.heatMapGrid.length;
	}

	public getNumColumns(): number {
		return this.rhythmsDto.response.heatMapResponse.heatMapGrid[0].length;
	}

	public getCanvasHeight(): number {
		return this.canvas.getHeight() - this.config.bottomMargin - this.config.topMargin;
	}

	public getCanvasWidth(): number {
		return this.canvas.getWidth() - this.config.leftMargin - this.config.rightMargin;
	}

	public getGridHeight(): number {
		return this.getCanvasHeight() - this.config.bottomAxisHeaderHeight;
	}

	public getGridWidth(): number {
		return this.getCanvasWidth() - this.config.leftAxisHeaderWidth - this.config.gridLineThickness;
	}

	public getRowHeight(): number {
		return this.getGridHeight() / this.getNumRows();
	}

	public getRowWidth(): number {
		return this.getGridWidth() / this.getNumColumns();
	}

	public getCellHeight(): number {
		return this.getRowHeight() - this.config.gridLineThickness;
	}

	public getCellWidth(): number {
		return this.getRowWidth() - this.config.gridLineThickness;
	}

	public getCellLeftOffset(): number {
		return this.config.gridLineThickness;
	}

	public getCellTopOffset(): number {
		return this.config.gridLineThickness;
	}
}

import { Injectable } from '@angular/core';
import { StaticCanvas } from 'fabric/fabric-impl';
import { IHeatMapCell, IHeatMapComputedBound } from 'app/modules/ecg/interfaces';
import { IHeatMapConfig } from 'app/features/record/heatmap/heatmap.component';
import { fabric } from 'fabric';
import { intervalToDuration } from 'date-fns';
import { HeatmapUtilsService } from 'app/features/record/heatmap/services/heatmap-utils.service';

@Injectable()
export class HeatmapAxisService {
	private heatmapUtils: HeatmapUtilsService;
	private canvas: StaticCanvas;
	private config: IHeatMapConfig;

	constructor() {
	}

	public init( heatmapCanvasFabric: StaticCanvas, config: IHeatMapConfig, heatmapUtils: HeatmapUtilsService ) {
		this.canvas = heatmapCanvasFabric;
		this.config = config;
		this.heatmapUtils = heatmapUtils;
	}

	/**
	 * Renders the axis labels and titles
	 * @param bound
	 * @param grid
	 */
	public render( bound: IHeatMapComputedBound, grid: IHeatMapCell[][] ): void {

		// Render the horizontal axis title and labels
		this.renderHorizontalAxis( bound, grid );

		// Render the veritcal axis title and labels
		this.renderVerticalAxis( bound, grid );

	}

	/**
	 * Renders the horizontal axis title and labels
	 * @param bound
	 * @param grid
	 * @private
	 */
	private renderHorizontalAxis( bound: IHeatMapComputedBound, grid: IHeatMapCell[][] ): void {

		// Render the Horizontal Axis labels
		for( let curColumnIndex = 0; curColumnIndex < this.heatmapUtils.getNumColumns() + 2; curColumnIndex += 2 ) {

			let horizontalAxisLabelString = this.calcHorizAxisText( curColumnIndex * bound.cellDurationSize + bound.gridMinBoundX );

			let horizontalAxisLabel = new fabric.Text( horizontalAxisLabelString, {
				fontFamily: 'SoehneWebBuch',
				fontSize: 12,
				fill: '#323E48',
				left: this.config.leftAxisHeaderWidth + ( curColumnIndex * this.heatmapUtils.getRowWidth() ) + this.config.leftMargin,
				top: this.heatmapUtils.getGridHeight() + this.config.topMargin + this.config.axisLabelMargin,
				textAlign: 'right'
			} );

			// Center the horizontal label text
			horizontalAxisLabel.left = horizontalAxisLabel.left - .5 * horizontalAxisLabel.width;

			this.canvas.add( horizontalAxisLabel );
		}


		// Render the Horizontal Axis Title
		let horizontalAxisTitleText = 'Duration';

		let horizontalAxisTitle = new fabric.Text( horizontalAxisTitleText, {
			fontFamily: 'SoehneWebKraftig',
			fontSize: 12,
			fontWeight: 500,
			fill: '#323E48',
			left: .5 * this.heatmapUtils.getGridWidth() + this.config.bottomAxisHeaderHeight + this.config.leftMargin,
			width: this.config.leftAxisHeaderWidth,
			top: this.heatmapUtils.getCanvasHeight(), //angle: 0,
			textAlign: 'right'
		} );

		this.canvas.add( horizontalAxisTitle );
	}

	/**
	 * Renders the Vertical Axis title and labels
	 * @param bound
	 * @param grid
	 * @private
	 */
	private renderVerticalAxis( bound: IHeatMapComputedBound, grid: IHeatMapCell[][] ): void {

		// Render the Vertical Axis Labels
		for( let curRowIndex = 0; curRowIndex < this.heatmapUtils.getNumRows() + 1; curRowIndex += 2 ) {
			let verticalAxisLabelString = `${ bound.gridMaxBoundY -  ( 20 * curRowIndex ) }`;
			
			let verticalAxisLabel = new fabric.Text( verticalAxisLabelString, {
				fontFamily: 'SoehneWebBuch',
				fontSize: 12,
				fill: '#323E48',
				top: curRowIndex * this.heatmapUtils.getRowHeight() + this.config.topMargin,
				textAlign: 'right'
			} );

			// Horizontally Center the vertical axis label
			verticalAxisLabel.left = this.config.leftAxisHeaderWidth - verticalAxisLabel.width - this.config.axisLabelMargin;

			// Vertically Center the vertical axis label
			verticalAxisLabel.top = verticalAxisLabel.top - .5 * verticalAxisLabel.height;

			this.canvas.add( verticalAxisLabel );
		}


		// Render Vertical Axis Title
		let verticalAxisTitleText = 'Avg HR';

		let verticalAxisTitle = new fabric.Text( verticalAxisTitleText, {
			fontFamily: 'SoehneWebKraftig',
			fontSize: 12,
			fontWeight: 500,
			fill: '#323E48',
			left: 5 + this.config.leftMargin,
			width: this.config.leftAxisHeaderWidth,
			top: this.heatmapUtils.getGridHeight() / 2 + this.config.topMargin,
			angle: 270,
			textAlign: 'right'
		} );

		verticalAxisTitle.top = verticalAxisTitle.top + .5 * verticalAxisTitle.width;

		this.canvas.add( verticalAxisTitle );
	}

	/**
	 * Creates the timestamps to show as the horizontal axis labels
	 * Timestamps vary in format based on longest value
	 * 30 Seconds => 30
	 * 90 Seconds => 1:30
	 * 3600 Seconds => 1:00:00
	 * @param numSeconds
	 * @private
	 */
	private calcHorizAxisText( numSeconds: number ): string {

		// Convert the number of seconds of the episode to a DateFns duration to get access to the years/days/hours/mins/seconds
		const duration = intervalToDuration( {
			                                     start: 0,
			                                     end: numSeconds * 1000
		                                     } );

		// Throw the duration values in to an array
		let durationArray = [ duration.years, duration.days, duration.hours, duration.minutes, duration.seconds ];

		// Remove the zero values from the array until the first non-zero value is found
		while( durationArray.indexOf( 0 ) === 0 ) {
			durationArray.shift();
		}

		// If all values removed, then there are zero seconds in the array
		if( durationArray.length === 0 ) {
			return '0';
		}

		// Join the values of the array by a ":" to get a timestamp the looks like 00:00:00, 00:00, etc...
		return durationArray.join( ':' );

	}
}

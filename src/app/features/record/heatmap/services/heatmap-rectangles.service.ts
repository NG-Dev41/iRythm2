import { Injectable } from '@angular/core';
import { Group, Rect, StaticCanvas } from 'fabric/fabric-impl';
import { IHeatMapCell, IHeatMapComputedBound } from 'app/modules/ecg/interfaces';
import { IHeatMapConfig } from 'app/features/record/heatmap/heatmap.component';
import { fabric } from 'fabric';
import { HeatmapUtilsService } from 'app/features/record/heatmap/services/heatmap-utils.service';

@Injectable()
export class HeatmapRectanglesService {
	private heatmapUtils: HeatmapUtilsService;

	private canvas: StaticCanvas;
	private config: IHeatMapConfig;
	private min: number;
	private max: number;

	constructor() {
	}

	public init( heatmapCanvasFabric: StaticCanvas, config: IHeatMapConfig, heatmapUtils: HeatmapUtilsService ) {
		this.canvas = heatmapCanvasFabric;
		this.config = config;
		this.heatmapUtils = heatmapUtils;
	}

	/**
	 * Renders the cells in the HeatMap as colored rectangles, which vary color intensity based on the the number of episodes in the cell
	 * relative to the cell with the highest number of episodes (i.e. The cell with the highest number of episodes will have the most intense color)
	 * @param bound
	 * @param grid
	 */
	public render( bound: IHeatMapComputedBound, grid: IHeatMapCell[][] ): void {

		// Convert the 2D Array of cells into a 1D Array of cell counts
		// IHeatMapCell[][] => number[]
		let cellCounts = grid.flat( 2 ).filter( cell => cell.count !== 0 ).map( cell => cell.count );

		// Get the highest and lowest episode counts from the flattened array
		// Used to calculate a color intensity scale based on the number of episodes
		[ this.min, this.max ] = [ Math.min( ...cellCounts ), Math.max( ...cellCounts ) ];

		for( let curRowIndex = 0; curRowIndex < this.heatmapUtils.getNumRows(); curRowIndex++ ) {
			for( let curColumnIndex = 0; curColumnIndex < this.heatmapUtils.getNumColumns(); curColumnIndex++ ) {

				// Set the current cell
				let curCell = grid[curRowIndex][curColumnIndex];

				// If the  cell has no episodes, there is nothing to render, so skip
				if( curCell.count === 0 ) {
					continue;
				}

				// If the episodes list is populated, then the cell contains primary episodes
				let isPrimary = curCell.episodesList.length > 0;

				// If the number of episodes in the episodes list, and the total count of episodes for the cell are different,
				// then the cell contains both primary and non-primary episodes, and is rendered as a split cell
				if( isPrimary && curCell.episodesList.length !== curCell.count ) {
					this.canvas.add( this.buildTwoToneRectangle( curCell, curColumnIndex, curRowIndex, isPrimary ) );
				} else {
					this.canvas.add( this.buildSingleToneRectangle( curCell, curColumnIndex, curRowIndex, isPrimary ) );
				}
			}
		}
	}

	/**
	 * Returns a two-colored rectangle for a given cell
	 * If a Cell has both primary and non primary episodes, these episodes are represented visually by a diagonal split from top left to bottom right.
	 * This is rendered as two triangles (fabric.Polygon), a bottom one which represents the non primary episodes and color,
	 * and a top one which represents the primary episodes
	 * @param curCell
	 * @param curColumnIndex
	 * @param curRowIndex
	 * @param isPrimary
	 * @private
	 */
	private buildTwoToneRectangle( curCell: IHeatMapCell, curColumnIndex: number, curRowIndex: number, isPrimary?: boolean ): Group {

		let cellLeft = ( curColumnIndex * this.heatmapUtils.getRowWidth() ) + this.heatmapUtils.getCellLeftOffset() +
		               this.config.leftMargin + this.config.leftAxisHeaderWidth;

		let cellTop = ( curRowIndex * this.heatmapUtils.getRowHeight() ) + this.heatmapUtils.getCellTopOffset() + this.config.topMargin;

		// Top triangle for primary episodes
		let topTriangle = new fabric.Polygon( [
			                                      {
				                                      x: cellLeft,
				                                      y: cellTop
			                                      }, {
													x: cellLeft + this.heatmapUtils.getCellWidth(),
													y: cellTop
												}, {
													x: cellLeft + this.heatmapUtils.getCellWidth(),
													y: cellTop + this.heatmapUtils.getCellHeight()
												}
		                                      ], { fill: this.rectangleColorCalc( curCell.count, true, curCell.episodesList.length ) } );

		// Bottom triangle for non-primary episodes
		let bottomTriangle = new fabric.Polygon( [
			                                         {
				                                         x: cellLeft,
				                                         y: cellTop
			                                         }, {
				                                         x: cellLeft,
				                                         y: cellTop + this.heatmapUtils.getCellHeight()
			                                         }, {
				                                         x: cellLeft + this.heatmapUtils.getCellWidth(),
				                                         y: cellTop + this.heatmapUtils.getCellHeight()
			                                         }
		                                         ],
		                                         { fill: this.rectangleColorCalc( curCell.count - curCell.episodesList.length, false ) } );

		// Group the two triangles together
		let twoToneRectangle = new fabric.Group( [ topTriangle, bottomTriangle ], {} );

		return twoToneRectangle;
	}

	/**
	 * Returns a solid colored rectangle for a given cell
	 * If a cell is contains exclusively primary or non-primary episodes, it is rendered as a single solid color rectangle
	 * @param curCell
	 * @param curColumnIndex
	 * @param curRowIndex
	 * @param isPrimary
	 * @private
	 */
	private buildSingleToneRectangle( curCell: IHeatMapCell, curColumnIndex: number, curRowIndex: number, isPrimary?: boolean ): Rect {
		let cellRect = new fabric.Rect( {
			                                left: ( curColumnIndex * this.heatmapUtils.getRowWidth() ) +
			                                      this.heatmapUtils.getCellLeftOffset() + this.config.leftMargin +
			                                      this.config.leftAxisHeaderWidth,
			                                top: ( curRowIndex * this.heatmapUtils.getRowHeight() ) + this.heatmapUtils.getCellTopOffset() +
			                                     this.config.topMargin,
			                                width: this.heatmapUtils.getCellWidth(),
			                                height: this.heatmapUtils.getCellHeight(),
			                                strokeWidth: 0,
			                                fill: this.rectangleColorCalc( curCell.count, isPrimary, curCell.episodesList.length )
		                                } );

		return cellRect;
	}

	/**
	 * Calculates the correct color for a given cell to be
	 * Color intensity is correlated to the number of episodes in a cell, in ratio to the number of episodes in the highest cell
	 * @param count
	 * @param isPrimary
	 * @param numPrimaryEpisodes
	 * @private
	 */
	private rectangleColorCalc( count: number, isPrimary: boolean, numPrimaryEpisodes?: number ): string {
		if( isPrimary ) {
			let opacityPercent = .2 + .8 * ( numPrimaryEpisodes / 5 );
			return `rgba(59, 59, 189, ${ opacityPercent })`;
		} else {
			let opacityPercent = .2 + .8 * ( ( count - this.min ) / ( this.max - this.min ) );
			return `rgba(72, 79, 82, ${ opacityPercent })`;
		}
	}
}

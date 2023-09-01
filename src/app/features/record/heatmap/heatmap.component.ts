import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { fabric } from 'fabric';
import { StaticCanvas } from 'fabric/fabric-impl';

import { HeatmapRectanglesService } from './services/heatmap-rectangles.service';
import { HeatmapGridService } from 'app/features/record/heatmap/services/heatmap-grid.service';
import { HeatmapAxisService } from 'app/features/record/heatmap/services/heatmap-axis.service';
import { EcgAnalyzerLoader } from 'app/modules/ecg/services/daos/ecg-analyzer/ecg-analyzer-loader.service';
import { EcgDaoChannelKey } from 'app/modules/ecg/enums';
import { HeatmapUtilsService } from 'app/features/record/heatmap/services/heatmap-utils.service';
import { RecordRhythmsDto } from 'app/features/record/rhythms/record-rhythms.service';
import { EcgDaoController } from 'app/modules/ecg/services/controller/dao/ecg-dao-controller.service';
import { IRouteChangeChannel, PageChannelKey, PageNotifier } from 'app/commons/services/notifiers/page-notifier.service';
import { IEcgDaoEditChannel, EcgDaoEditChannelStatus, IEcgAnalyzeChannel, EcgAnalyzeChannelStatus } from 'app/modules/ecg/interfaces';


@Component({
	selector: 'app-header-heatmap',
	templateUrl: './heatmap.component.html',
	styleUrls: [ './heatmap.component.scss' ],
	providers: [
		EcgAnalyzerLoader,
		HeatmapUtilsService,
		HeatmapGridService,
		HeatmapAxisService,
		HeatmapRectanglesService
	]
})
export class HeatmapComponent implements AfterViewInit, OnDestroy {
	@ViewChild( 'heatMapCanvas' ) private heatmapCanvasHtml: ElementRef<HTMLCanvasElement>;
	@ViewChild( 'heatMapCanvasContainer' ) private heatmapCanvasContainer: ElementRef<HTMLDivElement>;

	public heatmapCanvasFabric: StaticCanvas;
    private allSubscriptions = new Subscription();

	private heatMapConfig: IHeatMapConfig = {

		// The width of the whole left Axis header
		leftAxisHeaderWidth: 47,

		// The Height of the whole Bottom Axis
		bottomAxisHeaderHeight: 30,

		// Thickness of the lines separating the colored rectangles
		gridLineThickness: 1,

		// Margin at the top of the heatmap
		topMargin: 10,

		// Margin on the right of the heatmap
		rightMargin: 25,

		// Margin on the bottom of the heatmap
		bottomMargin: 10,

		// Margin on the left of the heatmap
		leftMargin: 0,

		// How far the labels are from the grid of the heatmap
		axisLabelMargin: 5

	};

	constructor(
		private heatmapRectanglesService: HeatmapRectanglesService,
		private heatmapGridService: HeatmapGridService,
		private heatmapAxisService: HeatmapAxisService,
		private heatMapUtils: HeatmapUtilsService,
		private rhythmsDto: RecordRhythmsDto,
		private ecgDaoController: EcgDaoController,
		private pageNotifier: PageNotifier)
	{}

	ngAfterViewInit(): void {
		this.heatmapCanvasFabric = new fabric.StaticCanvas( this.heatmapCanvasHtml.nativeElement, {
			selection: false,
			width: this.heatmapCanvasContainer.nativeElement.clientWidth,
			height: this.heatmapCanvasContainer.nativeElement.clientHeight
		} );

		this.initServices();

		// Re-render heatmap on sub-tab navigation change
		this.allSubscriptions.add(this.pageNotifier.listen(PageChannelKey.ROUTE_CHANGE).subscribe((res: IRouteChangeChannel) => {
			this.renderHeatmap(true);
		}));

		// Re-render heatmap on edit changes
		this.allSubscriptions.add(this.ecgDaoController.daoNotifier
			.listen(EcgDaoChannelKey.DAO_EDIT)
			.subscribe((channelData: IEcgDaoEditChannel) => {
				if(channelData.status === EcgDaoEditChannelStatus.EDIT_REQUEST_PENDING) {
					this.renderHeatmap(true);
				}

				if(channelData.status === EcgDaoEditChannelStatus.EDIT_PROCESSING_COMPLETE) {
					this.renderHeatmap();
				}
			}));

		// Re-render heatmap when new EcgAnalyzer request
		this.allSubscriptions.add(this.ecgDaoController.daoNotifier
			.listen(EcgDaoChannelKey.ANALYZE)
			.subscribe((channelData: IEcgAnalyzeChannel) => {
				if(channelData.status === EcgAnalyzeChannelStatus.ANALYZE_RESPONSE_PROCESSING_COMPLETE) {
					this.renderHeatmap();
				}
			}));

		// Heatmap initial render
		this.renderHeatmap();
	}

	/**
	 * Initializes the serviecs used in rendering the Heatmap
	 * @private
	 */
	private initServices(): void {
		this.heatMapUtils.init( this.heatmapCanvasFabric, this.heatMapConfig );
		this.heatmapRectanglesService.init( this.heatmapCanvasFabric, this.heatMapConfig, this.heatMapUtils );
		this.heatmapGridService.init( this.heatmapCanvasFabric, this.heatMapConfig, this.heatMapUtils );
		this.heatmapAxisService.init( this.heatmapCanvasFabric, this.heatMapConfig, this.heatMapUtils );
	}

	/**
	 * Render the heatmap
	 * @param renderBlankHeatmap - Whether to fill in and color the heatmap cells or not
	 * @private
	 */
	private renderHeatmap(renderBlankHeatmap?: boolean): void {
		let heatMapResponse = this.rhythmsDto.response.heatMapResponse;
		let bound = heatMapResponse.heatMapComputedBound, grid = heatMapResponse.heatMapGrid;

		// Don't render heatmap if the bound or grid is undefined/null
		if(!bound || !grid) return;

		this.heatmapCanvasFabric.clear();
		if(!renderBlankHeatmap) this.heatmapRectanglesService.render( bound, grid );
		this.heatmapGridService.render( bound, grid );
		this.heatmapAxisService.render( bound, grid );
	}

	public ngOnDestroy(): void {
		this.allSubscriptions.unsubscribe();
	}

}

export interface IHeatMapConfig {
	leftAxisHeaderWidth: number;
	bottomAxisHeaderHeight: number;
	gridLineThickness: number;
	topMargin: number;
	rightMargin: number;
	bottomMargin: number;
	leftMargin: number;
	axisLabelMargin: number;
}

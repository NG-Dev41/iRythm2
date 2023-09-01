import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PageDto } from 'app/commons/services/dtos/page-dto.service';
import { RecordDto } from '../services/dtos/record-dto.service';
import { PageKey } from 'app/commons/constants/page-meta.const';
import { RecordChannelKey, RecordReportChannelAction } from '../services/enums';
import { RecordNotifier } from '../services/notifiers/record-notifier.service';
import { IRecordReportChannel } from '../services/interfaces/channel.interface';
import { filter } from 'rxjs/operators';
import { PageChannelKey, PageNotifier } from 'app/commons/services/notifiers/page-notifier.service';


@Component({
    selector: 'app-record-header',
    templateUrl: './record-header.component.html',
    styleUrls: [ './record-header.component.scss' ]
})
export class RecordHeaderComponent implements OnInit{

	public showRecordApproveSection: boolean = false;

	/**
	 * Ctor
	 *
	 * @param {ActivatedRoute} public route
	 * @param {PageDto}        public pageDto
	 */
	public constructor(
		public route: ActivatedRoute,
		public pageDto: PageDto,
		public recordDto: RecordDto,
		private recordNotifier: RecordNotifier,
		private pageNotifier: PageNotifier
	) {}

	ngOnInit() {
		this.recordNotifier
			.listen(RecordChannelKey.REPORT_ACTION)
			.pipe(
				filter((data: IRecordReportChannel) => data.action === RecordReportChannelAction.REPORT_GENERATED)
			)
			.subscribe(() => {
				this.showRecordApproveSection = true;
			});
		// Navigation away from report preview should hide the record approval section
		// Until the REPORT_GENERATED action on recordNotifier is sent again
		this.pageNotifier.listen(PageChannelKey.ROUTE_CHANGE)
			.subscribe(() => {
				if (this.pageDto.key !== PageKey.REPORT_PREVIEW) {
					this.showRecordApproveSection = false;
				}
			});
	}
}

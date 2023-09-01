import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonsModule } from 'app/commons/commons.module';
import { RecordReportPreviewRoutingModule } from './record-report-preview-routing.module';
import { RecordReportPreviewComponent } from './record-report-preview.component';



@NgModule({
	declarations: [
		RecordReportPreviewComponent
	],
	imports: [
		CommonModule,
		CommonsModule,
		RecordReportPreviewRoutingModule
	]
})
export class RecordReportPreviewModule { }

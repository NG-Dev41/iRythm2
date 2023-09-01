import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EcgModule } from 'app/modules/ecg/ecg.module';
import { CommonsModule } from 'app/commons/commons.module';
import { RecordReportPrepAdditionalStripsRoutingModule } from './record-report-prep-additional-strips-routing.module';
import { RecordReportPrepAdditionalStripsComponent } from './record-report-prep-additional-strips.component';


@NgModule({
	declarations: [
		RecordReportPrepAdditionalStripsComponent
	],
	imports: [
		CommonModule,
		CommonsModule,
		EcgModule,
		RecordReportPrepAdditionalStripsRoutingModule
	]
})
export class RecordReportPrepAdditionalStripsModule { }

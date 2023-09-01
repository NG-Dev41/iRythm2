import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonsModule } from 'app/commons/commons.module';
import { RecordReportPrepPreliminaryFindingsRoutingModule } from './record-report-prep-preliminary-findings-routing.module';
import { RecordReportPrepPreliminaryFindingsComponent } from './record-report-prep-preliminary-findings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../modules/material/material.module';


@NgModule({
	declarations: [
		RecordReportPrepPreliminaryFindingsComponent
	],
	imports: [
		CommonModule,
		CommonsModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
		RecordReportPrepPreliminaryFindingsRoutingModule,
	]
})
export class RecordReportPrepPreliminaryFindingsModule { }

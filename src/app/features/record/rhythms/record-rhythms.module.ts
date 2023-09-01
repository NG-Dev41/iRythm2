import { NgModule } from '@angular/core';

import { EcgModule } from 'app/modules/ecg/ecg.module';
import { RecordRhythmsRoutingModule } from './record-rhythms-routing.module';
import { RecordRhythmsComponent } from './record-rhythms.component';
import { HeatmapComponent } from 'app/features/record/heatmap/heatmap.component';
import { RhythmSummaryComponent } from 'app/features/record/rhythm-summary/rhythm-summary.component';
import { CommonsModule } from 'app/commons/commons.module';


@NgModule({
	declarations: [
		RecordRhythmsComponent,
		HeatmapComponent,
		RhythmSummaryComponent
	],
	imports: [
		CommonsModule,
		EcgModule,
		RecordRhythmsRoutingModule
	]
})
export class RecordRhythmsModule { }

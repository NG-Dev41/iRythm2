import { NgModule } from '@angular/core';

import { RecordEventChartRoutingModule } from './record-event-chart-routing.module';
import { RecordEventChartComponent } from './record-event-chart.component';


@NgModule({
	declarations: [
		RecordEventChartComponent
	],
	imports: [
		RecordEventChartRoutingModule
	]
})
export class RecordEventChartModule { }

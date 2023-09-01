import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRoutes } from 'app/core/router/app-routes.type';
import { RecordEventChartComponent } from './record-event-chart.component';


// Routes
const routes: AppRoutes = [
	{
		path: '',
		component: RecordEventChartComponent
	}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecordEventChartRoutingModule { }

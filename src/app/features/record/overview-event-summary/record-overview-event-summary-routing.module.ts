import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRoutes } from 'app/core/router/app-routes.type';
import { RecordOverviewEventSummaryComponent } from './record-overview-event-summary.component';


// Routes
const routes: AppRoutes = [
	{
		path: '',
		component: RecordOverviewEventSummaryComponent
	}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecordOverviewEventSummaryRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


// Routes
const routes: Routes = [
	{
		path: '',
		redirectTo: 'mdn',
		pathMatch: 'full'
	},
	{
		path: 'mdn',
		loadChildren: () => import('app/features/record/overview-mdn/record-overview-mdn.module').then(m => m.RecordOverviewMdnModule)
	},
	{
		path: 'event-summary',
		loadChildren: () => import('app/features/record/overview-event-summary/record-overview-event-summary.module').then(m => m.RecordOverviewEventSummaryModule)
	},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecordOverviewRoutingModule { }

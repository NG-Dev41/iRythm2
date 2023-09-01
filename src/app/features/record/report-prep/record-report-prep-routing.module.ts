import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


// Routes
const routes: Routes = [
	{
		path: '',
		redirectTo: 'preliminary-findings',
		pathMatch: 'full'
	},
	{
		path: 'additional-strips',
		loadChildren: () => import('app/features/record/report-prep-additional-strips/record-report-prep-additional-strips.module').then(m => m.RecordReportPrepAdditionalStripsModule)
	},
	{
		path: 'preliminary-findings',
		loadChildren: () => import('app/features/record/report-prep-preliminary-findings/record-report-prep-preliminary-findings.module').then(m => m.RecordReportPrepPreliminaryFindingsModule)
	},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecordReportPrepRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordComponent } from './record.component';


// Routes
const routes: Routes = [

	{
		path: '',
		component: RecordComponent,

		children: [
			{

				path: '',
				redirectTo: 'overview/mdn',
				pathMatch: 'full'

			},

			{
				path: 'overview',
				loadChildren: () => import('app/features/record/overview/record-overview.module').then(m => m.RecordOverviewModule)
			},

			{
				path: 'rhythms/:rhythmType',
                loadChildren: () => import('app/features/record/rhythms/record-rhythms.module').then(m => m.RecordRhythmsModule)
			},

			{
				path: 'ectopics/:rhythmType',
				loadChildren: () => import('app/features/record/ectopics/record-ectopics.module').then(m => m.RecordEctopicsModule)
			},

            {
                path: 'ectopic-patterns/:rhythmType',
                loadChildren: () => import('app/features/record/rhythms/record-rhythms.module').then(m => m.RecordRhythmsModule)
            },

			{
				path: 'rates',
				loadChildren: () => import('app/features/record/rates/record-rates.module').then(m => m.RecordRatesModule)
			},

			{
				path: 'event-chart',
				loadChildren: () => import('app/features/record/event-chart/record-event-chart.module').then(m => m.RecordEventChartModule)
			},

			{
				path: 'triggers',
				loadChildren: () => import('app/features/record/triggers/record-triggers.module').then(m => m.RecordTriggersModule)
			},

			{
				path: 'diaries',
				loadChildren: () => import('app/features/record/diaries/record-diaries.module').then(m => m.RecordDiariesModule)
			},

			{
				path: 'report-prep',
				loadChildren: () => import('app/features/record/report-prep/record-report-prep.module').then(m => m.RecordReportPrepModule)
			},

			{
				path: 'report-preview',
				loadChildren: () => import('app/features/record/report-preview/record-report-preview.module').then(m => m.RecordReportPreviewModule)
			}
		]
	}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecordRoutingModule { }

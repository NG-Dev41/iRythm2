import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRoutes } from 'app/core/router/app-routes.type';
import { RecordReportPreviewComponent } from './record-report-preview.component';


// Routes
const routes: AppRoutes = [
	{
		path: '',
		component: RecordReportPreviewComponent
	}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecordReportPreviewRoutingModule { }

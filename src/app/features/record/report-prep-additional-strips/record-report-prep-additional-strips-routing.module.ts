import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRoutes } from 'app/core/router/app-routes.type';
import { RecordReportPrepAdditionalStripsComponent } from './record-report-prep-additional-strips.component';


// Routes
const routes: AppRoutes = [
	{
		path: '',
		component: RecordReportPrepAdditionalStripsComponent
	}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecordReportPrepAdditionalStripsRoutingModule { }

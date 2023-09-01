import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRoutes } from 'app/core/router/app-routes.type';
import { RecordReportPrepPreliminaryFindingsComponent } from './record-report-prep-preliminary-findings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


// Routes
const routes: AppRoutes = [
	{
		path: '',
		component: RecordReportPrepPreliminaryFindingsComponent
	}
];

@NgModule({
    imports: [RouterModule.forChild(routes), FormsModule, ReactiveFormsModule],
    exports: [RouterModule],
})
export class RecordReportPrepPreliminaryFindingsRoutingModule {}

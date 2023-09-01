import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRoutes } from 'app/core/router/app-routes.type';
import { PageKey } from 'app/commons/constants/page-meta.const';
import { RecordOverviewMdnComponent } from './record-overview-mdn.component';


// Routes
const routes: AppRoutes = [
	{
		path: '',
		data: {
			pageKey: PageKey.OVERVIEW_MDN
		},
		component: RecordOverviewMdnComponent
	}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecordOverviewMdnRoutingModule { }

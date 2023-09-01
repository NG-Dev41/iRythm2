import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRoutes } from 'app/core/router/app-routes.type';
import { RecordDiariesComponent } from './record-diaries.component';


// Routes
const routes: AppRoutes = [
	{
		path: '',
		component: RecordDiariesComponent
	}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecordDiariesRoutingModule { }

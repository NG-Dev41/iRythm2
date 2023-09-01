import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRoutes } from 'app/core/router/app-routes.type';
import { RecordEctopicsComponent } from './record-ectopics.component';


// Routes
const routes: AppRoutes = [
	{
		path: '',
		component: RecordEctopicsComponent
	}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecordEctopicsRoutingModule { }

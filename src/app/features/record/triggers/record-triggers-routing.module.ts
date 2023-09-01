import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRoutes } from 'app/core/router/app-routes.type';
import { RecordTriggersComponent } from './record-triggers.component';


// Routes
const routes: AppRoutes = [
	{
		path: '',
		component: RecordTriggersComponent
	}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecordTriggersRoutingModule { }

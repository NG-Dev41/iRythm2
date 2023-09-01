import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRoutes } from 'app/core/router/app-routes.type';
import { RecordRhythmsComponent } from './record-rhythms.component';
import { preventNagivationGuard } from 'app/commons/guards/prevent-navigation.guard';


// Routes
const routes: AppRoutes = [
	{
		path: '',
		component: RecordRhythmsComponent,
        canDeactivate: [preventNagivationGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecordRhythmsRoutingModule { }

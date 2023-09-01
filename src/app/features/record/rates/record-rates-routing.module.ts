import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRoutes } from 'app/core/router/app-routes.type';
import { RecordRatesComponent } from './record-rates.component';


// Routes
const routes: AppRoutes = [
	{
		path: '',
		component: RecordRatesComponent
	}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecordRatesRoutingModule { }

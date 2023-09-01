import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRoutes } from 'app/core/router/app-routes.type';
import { PdfViewComponent } from './pdf-view.component';


// Routes
const routes: AppRoutes = [
	{
		path: '',
		component: PdfViewComponent
	}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PdfViewRoutingModule { }

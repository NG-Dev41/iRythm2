import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OktaCallbackComponent } from '@okta/okta-angular';

// Core
import { AppRoutes } from './core/router/app-routes.type';
// Components

// Routes
const routes: AppRoutes = [

	{
		path: '',
		redirectTo: '/queue',
		pathMatch: 'full'
	},

	{
		path: 'queue',
		loadChildren: () => import('app/features/queue/queue.module').then(m => m.QueueModule)
	},

	{
		path: 'record/:serialNumber',
		loadChildren: () => import('app/features/record/record.module').then(m => m.RecordModule)
	},

    {
        path: 'auth/callback',
        component: OktaCallbackComponent
    },

	{
		path: 'info',
		loadChildren: () => import('app/features/info/info.module').then(m => m.InfoModule)
	},


    {
        path: 'admin',
        loadChildren: () => import('app/features/admin/admin.module').then(m => m.AdminModule)
    },

	// Report pdf opened in a new tab after generating
	{
		path: 'pdf-view/:serialNumber',
		loadChildren: () => import('app/features/record/pdf-view/pdf-view.module').then(m => m.PdfViewModule)
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, {})],
	exports: [RouterModule]
})
export class AppRoutingModule { }

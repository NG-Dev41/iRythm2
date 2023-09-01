import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Layout
import { InfoComponent } from './info.component';


// Routes
const routes: Routes = [
	{
		path: '',
		component: InfoComponent
	}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InfoRoutingModule { }


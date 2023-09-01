import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Layout
import { QueueComponent } from './queue.component';


// Routes
const routes: Routes = [
	{
		path: '',
		component: QueueComponent
	}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class QueueRoutingModule { }

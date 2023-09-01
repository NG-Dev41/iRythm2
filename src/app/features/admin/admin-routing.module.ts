// Routes
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AdminPanelComponent } from './admin-panel/admin-panel.component';


const routes: Routes = [
    {
        path: 'reset/:serialNumber',
        component: AdminPanelComponent
    },
    {
        path: '',
        component: AdminPanelComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {
}

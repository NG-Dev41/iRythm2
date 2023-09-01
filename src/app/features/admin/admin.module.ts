import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ResetEcgFieldComponent } from './reset-ecg-field/reset-ecg-field.component';
import { AdminFormMessageComponent } from './admin-form-message/admin-form-message.component';
import { MaterialModule } from 'app/modules/material/material.module';



@NgModule({
    declarations: [
        AdminPanelComponent,
        ResetEcgFieldComponent,
        AdminFormMessageComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        AdminRoutingModule,
        MaterialModule,
        ReactiveFormsModule
    ]
})
export class AdminModule {
}

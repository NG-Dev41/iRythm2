import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/modules/material/material.module';

import { HeaderOptionsComponent } from 'app/features/record/header-options/header-options.component';
import { ReasonDialogComponent } from 'app/features/record/header-options/reason-dialog/reason-dialog.component';


@NgModule({
    imports:[
        MaterialModule,
        ReactiveFormsModule,
        CommonModule
    ],
    declarations: [
        HeaderOptionsComponent,
        ReasonDialogComponent
    ],
    exports: [
        HeaderOptionsComponent
    ]
})
export class HeaderOptionsModule {}


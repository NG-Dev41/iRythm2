import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { NotesComponent } from 'app/modules/notes/notes.component';
import { NotesHistoryDialogComponent } from 'app/modules/notes/notes-history/notes-history-dialog.component';
import { MaterialModule } from 'app/modules/material/material.module';


@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        MaterialModule,
        ReactiveFormsModule
    ],
    declarations: [
        NotesComponent,
        NotesHistoryDialogComponent
    ],
    exports:[
        NotesComponent
    ]
})
export class NotesModule {}

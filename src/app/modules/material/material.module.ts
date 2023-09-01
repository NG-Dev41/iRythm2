import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


@NgModule({
    imports: [
	    MatFormFieldModule,
	    MatIconModule,
	    MatInputModule,
	    MatAutocompleteModule,
        MatToolbarModule,
        MatSidenavModule,
        MatIconModule,
        MatDialogModule,
        MatListModule,
        MatMenuModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatTooltipModule,
        MatInputModule,
        MatButtonModule,
        MatSnackBarModule,
        MatDialogModule,
        MatCheckboxModule,
        MatChipsModule,
        MatFormFieldModule,
        MatTabsModule,
        MatCardModule,
        MatButtonToggleModule
    ],
    exports: [
	    MatFormFieldModule,
	    MatIconModule,
	    MatInputModule,
	    MatAutocompleteModule,
        MatToolbarModule,
        MatSidenavModule,
        MatIconModule,
        MatDialogModule,
        MatListModule,
        MatMenuModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSnackBarModule,
        MatDialogModule,
        MatCheckboxModule,
        MatChipsModule,
        MatTabsModule,
        MatCardModule,
        MatButtonToggleModule
    ]
})
export class MaterialModule {}

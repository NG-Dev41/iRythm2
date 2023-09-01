import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonsModule } from 'app/commons/commons.module';
import { PdfViewComponent } from './pdf-view.component';
import { PdfViewRoutingModule } from './pdf-view-routing.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DateFnsModule } from 'ngx-date-fns';



@NgModule({
	declarations: [
		PdfViewComponent
	],
	imports: [
		CommonModule,
		CommonsModule,
		PdfViewRoutingModule,
		MatToolbarModule,
		DateFnsModule
	]
})
export class PdfViewModule { }

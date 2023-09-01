import { NgModule } from '@angular/core';

import { RecordDiariesRoutingModule } from './record-diaries-routing.module';
import { RecordDiariesComponent } from './record-diaries.component';


@NgModule({
	declarations: [
		RecordDiariesComponent
	],
	imports: [
		RecordDiariesRoutingModule
	]
})
export class RecordDiariesModule { }

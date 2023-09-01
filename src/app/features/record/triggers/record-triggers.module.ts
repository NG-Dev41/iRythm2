import { NgModule } from '@angular/core';

import { RecordTriggersRoutingModule } from './record-triggers-routing.module';
import { RecordTriggersComponent } from './record-triggers.component';


@NgModule({
	declarations: [
		RecordTriggersComponent
	],
	imports: [
		RecordTriggersRoutingModule
	]
})
export class RecordTriggersModule { }

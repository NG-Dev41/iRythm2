import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { QueueRoutingModule } from './queue-routing.module';
import { MaterialModule } from 'app/modules/material/material.module';
import { QueueIncludesModule } from 'app/modules/queue/queue-includes.module';

// Components
import { QueueComponent } from './queue.component';

// Providers
import { QueueService } from './services/queue.service';

@NgModule({
	declarations: [
		QueueComponent
	],
	imports: [
		CommonModule,
		QueueRoutingModule,
		QueueIncludesModule,
		MaterialModule
	]
})
export class QueueModule { }

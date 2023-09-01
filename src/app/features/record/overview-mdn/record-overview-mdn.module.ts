import { NgModule } from '@angular/core';

import { RecordOverviewMdnRoutingModule } from './record-overview-mdn-routing.module';
import { RecordOverviewMdnComponent } from './record-overview-mdn.component';
import { MdnModule } from 'app/modules/mdn/mdn.module';


@NgModule({
	declarations: [
		RecordOverviewMdnComponent
	],
    imports: [
        RecordOverviewMdnRoutingModule,
        MdnModule
    ]
})
export class RecordOverviewMdnModule { }

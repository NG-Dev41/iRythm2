import { Component, Input } from "@angular/core";

import { IEcgCardConfig } from "app/modules/ecg/interfaces";

@Component({
    selector: 'app-split-strip',
    template: ''
})
export class SplitStripComponentMock {
    @Input() ecgCardConfig: IEcgCardConfig;
    @Input() stripConfig; 
}
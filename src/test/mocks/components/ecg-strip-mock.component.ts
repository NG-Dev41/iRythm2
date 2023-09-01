import { Component, Input } from "@angular/core";
import { IEcgCardConfig, IEcgConfigStrip } from "app/modules/ecg/interfaces";

@Component({
    selector: 'app-ecg-strip',
    template: ''
})
export class EcgStripComponentMock {
    @Input() cssContainerClass: string;
    @Input() config: IEcgConfigStrip;
    @Input() ecgCardConfig: IEcgCardConfig;
}
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { EcgStripConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-strip-config-dto.service';
import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';


/**
 * EcgBeatsComponent
 * Note: This component is only for rendering the beat add line b/c we're using html
 */
@Component({
    selector: 'app-ecg-beats-add-line',
    templateUrl: './ecg-beats-add-line.component.html',
    styleUrls: ['./ecg-beats-add-line.component.scss']
})
export class EcgBeatsAddLineComponent implements OnInit {

    @ViewChild('beatAddLine')
    public beatAddLine: ElementRef<HTMLCanvasElement>;

    // Width of the beat add line - could have calculated in the template but this is a little cleaner
    public lineWidth: number;

    /**
     * Ctor
     *
     * @param {EcgController}             private ecgController
     * @param {EcgConvertSinusController} public  componentController
     */
    public constructor(
        public stripConfig: EcgStripConfigDto
    ) {}


    /**
     * On Init
     */
    public ngOnInit(): void {

        // Calculate the width of the add beat line
        this.lineWidth = (1 * this.stripConfig.ct.global.resolutionScale);

        // As alaways we need this to grab the add line child and add to our beats config obj
        setTimeout(() => {
            this.stripConfig.ct.beats.addLineElement = this.beatAddLine.nativeElement;
        }, 0);
    }
}

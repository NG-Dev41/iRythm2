import { Component } from '@angular/core';

import { EcgSecondsViewType } from 'app/modules/ecg/enums';
import { EcgStripConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-strip-config-dto.service';


@Component({
    selector: 'app-ecg-seconds-text',
    templateUrl: './ecg-seconds-text.component.html',
    styleUrls: ['./ecg-seconds-text.component.scss']
})
export class EcgSecondsTextComponent {

    // For use in template
    public EcgSecondsViewType = EcgSecondsViewType;

    /**
     * Ctor
     *
     * @param {EcgStripConfigDto} public config
     */
    public constructor(
        public config: EcgStripConfigDto
    ) { }
}

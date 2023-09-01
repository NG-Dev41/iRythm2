import { Injectable } from '@angular/core';
import { IEcgData, IEpisodeDataRegion, IEcgSampleCursorResult } from 'app/modules/ecg/interfaces';


/**
 * EcgDto
 *
 * Sole purpose is transfer data around between ecg components.
 */
@Injectable()
export class EcgDto {

    public data: IEcgData;

    public config: any = {};

    public regions: { [key: string]: IEpisodeDataRegion | IEcgSampleCursorResult; };

    /**
     * Basic setter
     *
     * @param {IEcgData} data
     */
    public setData(data: IEcgData): void {
        this.data = data;
    }
}

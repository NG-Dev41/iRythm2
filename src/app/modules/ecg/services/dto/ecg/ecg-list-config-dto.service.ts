import { Injectable } from '@angular/core';
import { IEcgConfigList } from 'app/modules/ecg/interfaces';


/**
 * Object to move the top level config around from controller to component, etc..
 */
@Injectable()
export class EcgListConfigDto {

    // Main config property
    public ct: IEcgConfigList = {};

    /**
     * Resets the episode list back to an empty arrays
     */
    public resetEpisodes(): void {
        this.ct.episodes = [];
    }
}

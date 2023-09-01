import { Injectable } from '@angular/core';

import { IEcgConfig } from 'app/modules/ecg/interfaces';
import { EcgDefaultConfig } from 'app/modules/ecg/constants/ecg-default.config';


/**
 * Object to move the top level config around from controller to component, etc..
 */
@Injectable()
export class EcgConfigDto {

    // Main config property
    public ct: IEcgConfig = {};


    /**
     * Sets and merges user input config on top of the default config.
     * This is a 'deep' merge for top level children of the config object
     * Ex. global, gain, actionMenu, info, etc...
     * TODO: At some point we may want to look at a legimate lib (lodash) for deep merging
     * instead of using my jankity method :/
     *
     * @param {IEcgConfig} config
     */
    public setConfig(config: IEcgConfig): void {

        // Set base config
        this.ct = config;
    }


    public static mergeConfig(key: string, config: any): any {
        return Object.assign({}, EcgDefaultConfig[key], config[key])
    }
}



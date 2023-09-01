import { Injectable } from '@angular/core';

import { EcgDefaultParentStripConfig, EcgDefaultChildStripConfig } from 'app/modules/ecg/constants/ecg-default.config';
import { IEcgConfigStrip } from 'app/modules/ecg/interfaces';


/**
 * EcgDto
 *
 * Sole purpose is transfer data around between ecg components.
 */
@Injectable()
export class EcgStripConfigDto {

    // Main config property
    public ct: IEcgConfigStrip;


    /**
     * Merges input strip config on top of default (parent or child) strip config
     *
     * @param {IEcgConfigStrip} config
     */
    public setConfig(config: IEcgConfigStrip, width: number, height: number): void {
        this.ct = config;
		this.ct.width = width;
		this.ct.global.height = height;
    }


    /**
     * Convience method to merge strip related properties.
     *
     * @param  {string}    key
     * @param  {any}       config
     * @param  {typeof EcgDefaultParentStripConfig | typeof EcgDefaultChildStripConfig} defaultConfig
     * @return {any}
     */
    public static mergeConfig(
        key: string,
        config: any,
        defaultConfig: typeof EcgDefaultParentStripConfig | typeof EcgDefaultChildStripConfig
    ): any {
        return Object.assign({}, (defaultConfig[key]) ? defaultConfig[key] : {}, (config[key]) ? config[key] : {});
    }
}

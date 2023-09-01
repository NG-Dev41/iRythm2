import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of } from 'rxjs';

import { EcgDefaultParentStripConfig, EcgDefaultChildStripConfig } from 'app/modules/ecg/constants/ecg-default.config';
import { EcgComponentKey } from 'app/modules/ecg/enums';
import { IEcgControllerInit, IEcgParentConfigStrip, IEcgConfigStrip } from 'app/modules/ecg/interfaces';
import { EcgBaseController } from 'app/modules/ecg/services/controller/base/ecg-base-controller.service';
import { EcgStripConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-strip-config-dto.service';


@Injectable()
export class EcgStripGroupController extends EcgBaseController implements OnDestroy {

    /**
     * Ctor
     */
    public constructor() {
        super();
        this.setComponentKey();
    }


    /**
     * Set component key
     */
    protected setComponentKey(): void {
        this.componentKey = EcgComponentKey.STRIP_GROUP;
    }


    public init(): Observable<IEcgControllerInit> {

    	return of({
    		success: true
    	});
    }


    /**
     * Merges all default strip config with input config.
     * TODO: Needs work but for now this gets the job done.
     *
     * @param  {IEcgParentConfigStrip} inputConfig
     * @return {IEcgConfigStrip}
     */
    public processConfig(inputConfig: IEcgParentConfigStrip): IEcgConfigStrip {

        // TODO: Look into _underscore for deep merging

        // Build out parent strip config
        // Merging input config on top of default parent config
        let parentConfig: IEcgConfigStrip = {
            global: EcgStripConfigDto.mergeConfig('global', inputConfig, EcgDefaultParentStripConfig),
            beats: EcgStripConfigDto.mergeConfig('beats', inputConfig, EcgDefaultParentStripConfig),
            line: EcgStripConfigDto.mergeConfig('line', inputConfig, EcgDefaultParentStripConfig),
            highlighter: EcgStripConfigDto.mergeConfig('highlighter', inputConfig, EcgDefaultParentStripConfig),
            primaryEpisodeIndicator: EcgStripConfigDto.mergeConfig('primaryEpisodeIndicator', inputConfig, EcgDefaultParentStripConfig),
            axisGrid: EcgStripConfigDto.mergeConfig('axisGrid', inputConfig, EcgDefaultParentStripConfig),
            html: EcgStripConfigDto.mergeConfig('html', inputConfig, EcgDefaultParentStripConfig),
            caliper: EcgStripConfigDto.mergeConfig('caliper', inputConfig, EcgDefaultParentStripConfig),
            navigationArrow: EcgStripConfigDto.mergeConfig('navigationArrow', inputConfig, EcgDefaultParentStripConfig),
            parent: null,
            children: new Array<IEcgConfigStrip>()
        };

        // Build out child config
        if(inputConfig?.children.length > 0) {

            // Loop over children, merge default config, add to the main mergecConfig
            inputConfig.children.forEach((childInput: IEcgConfigStrip, i: number) => {

                // Merge child global config and add to parent config
                parentConfig.children.push({
                    global: EcgStripConfigDto.mergeConfig('global', childInput, EcgDefaultChildStripConfig),
                    beats: EcgStripConfigDto.mergeConfig('beats', childInput, EcgDefaultChildStripConfig),
                    line: EcgStripConfigDto.mergeConfig('line', childInput, EcgDefaultChildStripConfig),
                    highlighter: EcgStripConfigDto.mergeConfig('highlighter', childInput, EcgDefaultChildStripConfig),
                    primaryEpisodeIndicator: EcgStripConfigDto.mergeConfig('primaryEpisodeIndicator', childInput, EcgDefaultChildStripConfig),
                    axisGrid: EcgStripConfigDto.mergeConfig('axisGrid', childInput, EcgDefaultChildStripConfig),
                    html: EcgStripConfigDto.mergeConfig('html', childInput, EcgDefaultChildStripConfig),
                    caliper: EcgStripConfigDto.mergeConfig('caliper', childInput, EcgDefaultChildStripConfig),
                    navigationArrow: EcgStripConfigDto.mergeConfig('navigationArrow', childInput, EcgDefaultChildStripConfig),
                    parent: parentConfig,
                    children: null
                });
            });
        }

        return parentConfig;
    }

    public ngOnDestroy(): void{
        this.destroy();
    }
    public destroy(){}
}

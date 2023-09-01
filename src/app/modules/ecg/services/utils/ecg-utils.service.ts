import { Injectable } from '@angular/core';

import { EcgChannelKey, EcgComponentState } from 'app/modules/ecg/enums';
import { ISurroundingEpisode, RegionType } from 'app/modules/ecg/interfaces';
import { EcgBaseController } from 'app/modules/ecg/services/controller/base/ecg-base-controller.service';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';
import { EcgDto } from 'app/modules/ecg/services/dto/ecg/ecg-dto.service';
import { EcgNotifier } from 'app/modules/ecg/services/notifier/ecg/ecg-notifier.service';


@Injectable()
export class EcgUtils {


	public constructor(
		private notifier: EcgNotifier,
		private config: EcgConfigDto,
		private dto: EcgDto
	) {}


	/**
	 * Set component/controller loadState to ready and emits
	 * a notification that the component is ready.
	 *
	 * TODO: Revisit this at some point because this may not be needed.
	 *
	 * @param {EcgBaseController} controller
	 */
    public ready(controller: EcgBaseController): void {

    	controller.componentLoadState = EcgComponentState.READY;

        this.notifier.send(EcgChannelKey.COMPONENT_STATE, {
            component: controller.componentKey,
            state: EcgComponentState.READY
        });
    }
	

    /**
     * Encodes an episode's rhythmType, startIndex, and endIndex as a string
     * @param episode
     * @private
     */
    public episodeStringKeyCreator(episode: ISurroundingEpisode) {
        return `${episode.rhythmType}-${episode.interval.startIndex}-${episode.interval.endIndex}`;
    }


    /**
     * Returns the index of an ecg point in the front end array.
     * Pass the index as it relates to the backend array.
     *
     * TODO: This should be in EcgUtils
     *
     * @param  {number} backendIndex
     * @return {number}
     */
    public getBackendArrayIndex(frontendIndex: number, regionType: string = RegionType.DEFAULT_SAMPLES): number {
        const region = this.dto.regions[regionType];
        return (frontendIndex + region.interval.startIndex);
    }

}

import { IRhythmResponse, IEpisode, IAdditionalStrip, RegionType } from 'app/modules/ecg/interfaces';
import { RhythmType, RhythmTypeMeta } from 'app/commons/constants/rhythms.const';
import { IAdditionalStripsResponse } from 'app/commons/services/dao/additional-strips-dao.service';


/**
 * Purpose of this class is map record related data from object to another.
 */
export class RecordDataMapper {


    /**
     * Method maps and additional strips reponse to an IRhythmResponse which is the object format
     * expected by the ecg strip code.
     *
     * @param  {IAdditionalStripsResponse} response
     * @return {IRhythmResponse}
     */
    public static mapAdditionalStripResponse(response: IAdditionalStripsResponse): IRhythmResponse {

        // Map array of additional strips to array of episodes
        let mappedEpisodes: Array<IEpisode> = response.additionalStripResponse.additionalStripList.map((additionalStrip: IAdditionalStrip) => {

            let episode: IEpisode = {
                rhythmType: null,
                averageHR: null,
                beats: null,
                confidence: null,
                episodeDuration: null,
                minHR: null,
                maxHR: null,
                interval: {
                    startIndex: additionalStrip.dataRegion.interval.startIndex,
                    endIndex: additionalStrip.dataRegion.interval.endIndex
                },
                dataRegionList: [{
                    regionType: RegionType.DEFAULT_SAMPLES,
                    ecgSampleList: additionalStrip.dataRegion.ecgSampleList,
                    beatList: additionalStrip.dataRegion.beatList,
                    interval: additionalStrip.dataRegion.interval,
                    preComputedSubRegionList: null,
                    surroundingEpisodeList: null
                }],
                symptomatic: null,
                mdNotification: null,
                additionalStrip: additionalStrip
            }

            return episode;
        });


        // Build out final rhythms response to be consumed by the ECG module
        let mappedResponse: IRhythmResponse = {
            rhythmType: null,
            episodeList: mappedEpisodes,
            rhythmRequestConfigurationResult: null
        };

        return mappedResponse;
    }
}

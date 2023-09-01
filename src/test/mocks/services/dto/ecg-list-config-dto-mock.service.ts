import { RhythmType } from "app/commons/constants/rhythms.const"

export class EcgListConfigDtoMock {
    public ct = {
        episodes: [
            { rhythmType: RhythmType.SVT, episodeInterval: { startIndex: 2, endIndex: 3 } }
        ]
    }
}
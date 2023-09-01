import { IHeatMapComputedBound, IHeatMapSummaryMetrics } from "app/modules/ecg/interfaces";

export class RecordRhythmsDtoMock {
    public response = {
        heatMapResponse: {
            heatMapComputedBound: {} as IHeatMapComputedBound,
            heatMapSummaryMetrics: {} as IHeatMapSummaryMetrics
        }
    }

    public rhythmType = {};
}

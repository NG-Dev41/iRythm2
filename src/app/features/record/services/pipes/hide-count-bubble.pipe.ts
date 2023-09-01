import { Pipe, PipeTransform } from '@angular/core';

import { RhythmType } from 'app/commons/constants/rhythms.const';
import { RecordMetricPipe } from 'app/features/record/services/pipes/record-metric.pipe';
import { RecordMetricType } from '../enums/record-navigation.enum';
import { IRecordMetrics } from '../interfaces/record-metrics.interface';

@Pipe({
    name: 'hideCountBubble'
})
export class HideCountBubblePipe implements PipeTransform {

    /**
     * Ctor
     * @param recordMetricPipe
     */
    constructor(
        public recordMetricPipe: RecordMetricPipe
    ) {}

    /**
     * For use in Paint Rhythm template to hide count bubble
     * @param value
     * @param metricType
     * @param type
     */
    public transform(metricType: RecordMetricType, value: string, metrics: IRecordMetrics): number {
        if(value === RhythmType.ARTIFACT || value === RhythmType.SINUS){
            return 0;
        } else {
            return this.recordMetricPipe.transform(metricType, value, metrics);
        }
    }

}

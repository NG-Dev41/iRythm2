import { Pipe, PipeTransform } from '@angular/core';

import { rhythmChildren, ectopicPatternsChildren } from 'app/commons/constants/rhythms.const';
import { RecordMetricPipe } from 'app/features/record/services/pipes/record-metric.pipe';
import { IRecordNavigationItem } from '../interfaces/record-navigation.interface';
import { RecordMetricType } from '../enums/record-navigation.enum';
import { IRecordMetrics } from '../interfaces/record-metrics.interface';

@Pipe({
    name: 'recordShowChild'
})
export class RecordShowChildPipe implements PipeTransform {

    /**
     * Ctor
     *
     * @param {RecordMetricPipe} private recordMetricPipe
     */
    public constructor(
        private recordMetricPipe: RecordMetricPipe
    ) {}

    /**
     * Shows children navigation items that need filtering from Record Dto
     *
     * @param {IRecordNavigationItem} childItem
     * @return {boolean}
     */

    transform(childItem: IRecordNavigationItem, metrics: IRecordMetrics): boolean {

        // check if record metric value > 0
        if(this.recordMetricPipe.transform(childItem.metricType, childItem.pageKey, metrics) > 0) {

            // filter out metrics needed for Rhythms section
            if(childItem.metricType === RecordMetricType.RHYTHMS) {
                return rhythmChildren.some(rhythm => rhythm.name === childItem.pageKey);

            // filter out metrics needed for Ectopic Patterns section
            } else if(childItem.metricType === RecordMetricType.ECTOPIC_PATTERNS) {
                return ectopicPatternsChildren.some(metric => metric.name === childItem.pageKey);

            // any other section with child will show all children
            } else {
                return true;
            }
        }
    }
}

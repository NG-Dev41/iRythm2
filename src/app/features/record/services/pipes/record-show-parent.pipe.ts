import { Pipe, PipeTransform } from '@angular/core';

import { ectopicPatternsChildren, rhythmChildren } from 'app/commons/constants/rhythms.const';
import { RecordMetricPipe } from 'app/features/record/services/pipes/record-metric.pipe';
import { RecordShowChildPipe } from 'app/features/record/services/pipes/record-show-child.pipe';
import { RecordMetricType } from '../enums/record-navigation.enum';
import { IRecordNavigationItem } from '../interfaces/record-navigation.interface';
import { IRecordMetrics } from '../interfaces/record-metrics.interface';

@Pipe({
    name: 'recordShowParent'
})
export class RecordShowParentPipe implements PipeTransform {

    /**
     * Ctor
     *
     * @param {RecordShowChildPipe} recordShowChildPipe
     * @param {RecordMetricPipe} recordMetricPipe
     */
    public constructor(
        private recordShowChildPipe: RecordShowChildPipe,
        private recordMetricPipe: RecordMetricPipe
    ) {}

    /**
     * Displays the nav parent based on if it has present child items
     *
     * @param navItem
     * @param metric
     */

    transform(navItem: IRecordNavigationItem, metric: RecordMetricType, metrics: IRecordMetrics): boolean {

        if(navItem.children) {

            // number of present child items counter
            let numTrue = 0;
            navItem.children.forEach((childItem: IRecordNavigationItem) => {

                // check if child items exist
                if(this.recordMetricPipe.transform(childItem.metricType, childItem.pageKey, metrics) > 0) {

                    // check ectopic patterns section
                    if(childItem.metricType === RecordMetricType.ECTOPIC_PATTERNS) {
                        if( ectopicPatternsChildren.some(rhythm => rhythm.name === childItem.pageKey)){
                            numTrue++;
                        }

                    // check rhythms section
                    } else if(childItem.metricType === RecordMetricType.RHYTHMS){
                        if( rhythmChildren.some(child => child.name === childItem.pageKey)){
                            numTrue++;
                        }

                    // always show the rest of the parent sections that aren't special case
                    } else {
                        numTrue++;
                    }
                }
            });
            if(numTrue > 0) {
                return true;
            }

        // if no children, always show
        } else {
            return true;
        }
    }
}

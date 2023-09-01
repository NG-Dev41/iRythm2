import {Injectable} from '@angular/core';

import { ectopicPatternsChildren, rhythmChildren } from 'app/commons/constants/rhythms.const';
import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { RecordMetricType, RecordNavigationKey, RecordNavigationStatus } from '../enums/record-navigation.enum';
import { IRecordNavigationItem } from '../interfaces/record-navigation.interface';
import { MetricsKey } from '../enums/record-metrics.enum';


/**
 * RecordNavigationUtils
 *
 * Static convience methods that need no state can be added here
 */
@Injectable()
export class RecordNavigationUtils {


    /**
     * Ctor
     *
     * @param {RecordDto} private recordDto
     */
    public constructor(
        private recordDto: RecordDto
    ) {}


    /**
     * Returns the status of a record navigation item.
     * This will only be need for top level / parent navigation items
     *
     * @param  {IRecordNavigationItem}  navItem
     * @return {RecordNavigationStatus}
     */
    public getNavItemStatus(navItem: IRecordNavigationItem): RecordNavigationStatus {

        // Nav item status that will determine which CSS class gets added to the hml element
        let navItemStatus: RecordNavigationStatus = RecordNavigationStatus.INCOMPLETE;

        // See if any child navigation items are present (rhythms|ectopics)
        // If so we're dealing with a parent navigation item and the status is determined by the status of the child items
        // const navItem.children = (navItem.children) ? Object.values(navItem.children) : [];
        const totalChildItems = (navItem.children) ? navItem.children.length : 0;

        // Var keeps track of the actual number of child nav items being shown for comparison to number completed
        let numChildItemsShowing = 0;

        // Make sure we have children nav items to work with
        if(totalChildItems > 0) {

            // Determine api response metric property name that needs to be accessed
            let metricType = MetricsKey.RHYTHM_METRICS;
            if(navItem.pageKey === RecordNavigationKey.ECTOPICS) {
                metricType = MetricsKey.ECTOPIC_METRICS;
            }

            // What needs to happen here is...
            // Loop through all child items and increment our counter everytime we find one that is completed
            // Once the loop is complete we're ready to set the status of the parent nav item
            let numChildItemsComplete = 0;

            for(let childNavItem of navItem.children) {

                // Only check this type if the count is greater than 0
                if(this.recordDto.metrics[metricType][childNavItem.pageKey] > 0) {

                    // filter out metric types from dto we want to hide on the panel
                    if(childNavItem.metricType === RecordMetricType.RHYTHMS) {
                        if(rhythmChildren.some(rhythm => rhythm.name === childNavItem.pageKey)){
                            numChildItemsShowing++;
                        }
                    } else if(childNavItem.metricType === RecordMetricType.ECTOPIC_PATTERNS) {
                        if(ectopicPatternsChildren.some(metric => metric.name === childNavItem.pageKey)) {
                            numChildItemsShowing++;
                        }
                    } else {
                        numChildItemsShowing++;
                    }

                    // If child nav item is complete increment comparison value
                    if(childNavItem.status === RecordNavigationStatus.COMPLETE) {
                        numChildItemsComplete++;
                    }
                }
            }

            // If all child nav items are completed then our parent nav item is also completed
            // If 1 or more child nav items are completed but not all of them our parent nav is partial complete
            // If no child items are complete then our parent nav is also incomplete - which is the default status so need to update here
            if(numChildItemsComplete === numChildItemsShowing) {
                navItemStatus = RecordNavigationStatus.COMPLETE;
            }
            else
            if(numChildItemsComplete > 0) {
                navItemStatus = RecordNavigationStatus.PARTIAL_COMPLETE;
            }
        }
        else {


            // Parent nav - set status
            // the child nav status is being checked in record-navigation.component.html
            navItemStatus = (!navItem.status) ? RecordNavigationStatus.INCOMPLETE : navItem.status;
            navItem.status = navItemStatus;
        }

        return navItemStatus;
    }


    /**
     * Helper method to return the CSS class associated with the status of a record navigation item
     *
     * @param  {RecordNavigationStatus} status
     * @return {string}
     */
    public getNavItemStatusCss(status: RecordNavigationStatus): string {

        let cssStatusClass;

        switch(status) {

            case RecordNavigationStatus.COMPLETE:
                cssStatusClass = 'complete';
                break;

            case RecordNavigationStatus.PARTIAL_COMPLETE:
                cssStatusClass = 'partial-complete';
                break;

            default:
                cssStatusClass = 'incomplete';
        }

        return cssStatusClass;
    }
}

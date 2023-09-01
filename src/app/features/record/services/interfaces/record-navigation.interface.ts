import { EctopicType } from "app/commons/constants/ectopics.const";
import { RhythmType } from "app/commons/constants/rhythms.const";
import { RecordNavigationKey, RecordNavigationStatus, RecordMetricType, RecordNavigationToggleStatus } from "../enums/record-navigation.enum";

/**
 * Interface describing a single record navigation item
 */
export interface IRecordNavigationItem {

    // Unique identifier for navigation item
    pageKey: RecordNavigationKey | RhythmType | EctopicType | any;

    // Name to display as the navigation item text
    name: string;

    // Relative url navigation item will route to
    url?: string;

    // Completion status
    status?: RecordNavigationStatus;

    // Metric type (rhythm, ectopic, record page)
    metricType?: RecordMetricType;

    // Parent item if a child item
    parentPageKey?: RecordNavigationKey;

    // Any child navigation items
    children?: Array<IRecordNavigationItem>;

    // Toggle status of navigation item
    toggleStatus?: RecordNavigationToggleStatus;
	
	params?: {[key: string]: string | number };
}

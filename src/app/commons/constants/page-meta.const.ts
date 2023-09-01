import { Params  } from '@angular/router';
import { RecordNavigationKey } from 'app/features/record/services/enums/record-navigation.enum';

/**
 * TODO: My initial plan was to make all this global functionality...not just for record processing.
 * Now I think it should be specific to record processing so ideally we should move this and related services
 * from being 'root' providers to being provided at the root of the RecordComponent and move it to the features/record/services
 * directory
 */
export enum PageKey {
	QUEUE = 'QUEUE',
	OVERVIEW_MDN = 'OVERVIEW_MDN',
	OVERVIEW_EVENT_SUMMARY = 'OVERVIEW_EVENT_SUMMARY',
	RHYTHMS = 'RHYTHMS',
	ECTOPICS = 'ECTOPICS',
    ECTOPIC_PATTERNS = 'ECTOPIC_PATTERNS',
	RATES = 'RATES',
	EVENT_CHART = 'EVENT_CHART',
	TRIGGERS = 'TRIGGERS',
	DIARIES = 'DIARIES',
	REPORT_PREP_PRELIMINARY_FINDINGS = 'REPORT_PREP_PRELIMINARY_FINDINGS',
	REPORT_PREP_ADDITIONAL_STRIPS = 'REPORT_PREP_ADDITIONAL_STRIPS',
	REPORT_PREVIEW = 'REPORT_PREVIEW'
}

/**
 * Meta Data needed by each page within the Application
 */
export const PageMeta: { [key in PageKey]: IPageMeta; } = {

	[PageKey.QUEUE]: {
		title: 'Queue',
		regex: /^\/queue$/,
		navigationKey: null
	},

	[PageKey.OVERVIEW_MDN]: {
		title: 'Case Overview',
		regex: /^\/record\/\w+\/overview\/mdn$/,
		navigationKey: RecordNavigationKey.CASE_OVERVIEW,
		hideSubheader: true
	},

	[PageKey.OVERVIEW_EVENT_SUMMARY]: {
		title: 'Case Overview',
		regex: /^\/record\/\w+\/overview\/event-summary$/,
		navigationKey: RecordNavigationKey.CASE_OVERVIEW,
		hideSubheader: true
	},

	[PageKey.RHYTHMS]: {
		title: '%type%',
		regex: /^\/record\/\w+\/rhythms\/\w+$/,
		navigationKey: RecordNavigationKey.RHYTHMS
	},

	[PageKey.ECTOPICS]: {
		title: '%type%',
		regex: /^\/record\/\w+\/ectopics\/\w+$/,
		navigationKey: RecordNavigationKey.ECTOPICS
	},

    [PageKey.ECTOPIC_PATTERNS]: {
        title: '%type%',
        regex: /^\/record\/\w+\/ectopic-patterns\/\w+$/,
        navigationKey: RecordNavigationKey.ECTOPIC_PATTERNS
    },

	[PageKey.RATES]: {
		title: 'Min/Max Rates',
		regex: /^\/record\/\w+\/rates$/,
		navigationKey: RecordNavigationKey.RATES
	},

	[PageKey.EVENT_CHART]: {
		title: 'Event Chart',
		regex: /^\/record\/\w+\/event-chart/,
		navigationKey: RecordNavigationKey.EVENT_CHART
	},

	[PageKey.TRIGGERS]: {
		title: 'Triggers',
		regex: /^\/record\/\w+\/triggers/,
		navigationKey: RecordNavigationKey.TRIGGERS_DIARIES
	},

	[PageKey.DIARIES]: {
		title: 'Diaries',
		regex: /^\/record\/\w+\/diaries/,
		navigationKey: RecordNavigationKey.TRIGGERS_DIARIES
	},

	[PageKey.REPORT_PREP_PRELIMINARY_FINDINGS]: {
		title: 'Preliminary Findings',
		regex: /^\/record\/\w+\/report-prep\/preliminary-findings$/,
		navigationKey: RecordNavigationKey.REPORT_PREP
	},

	[PageKey.REPORT_PREP_ADDITIONAL_STRIPS]: {
		title: 'Additional Strips',
		regex: /^\/record\/\w+\/report-prep\/additional-strips$/,
		navigationKey: RecordNavigationKey.REPORT_PREP
	},

	[PageKey.REPORT_PREVIEW]: {
		title: 'Report Preview',
		regex: /^\/record\/\w+\/report-preview/,
		navigationKey: RecordNavigationKey.REPORT_PREVIEW,
		hideSubheader: true
	}

};


/**
 * Interface describing a PageMeta object
 */
export interface IPageMeta {
	title: string;
	regex: RegExp;
	hideSubheader?: boolean;

	// This property maps the page to it's corresponding record navigation item
	navigationKey?: RecordNavigationKey;
}


export interface INavigationItem {
	name: string;
	href?: string;
	params?: Params;
	isDefault?: boolean;
}

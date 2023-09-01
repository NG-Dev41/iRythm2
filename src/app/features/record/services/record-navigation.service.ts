import { Injectable, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { PageDto } from 'app/commons/services/dtos/page-dto.service';

import { EctopicTypeMeta } from 'app/commons/constants/ectopics.const';
import { RhythmTypeMeta } from 'app/commons/constants/rhythms.const';
import {
    IRouteChangeChannel,
    PageChannelKey,
    PageNotifier,
} from 'app/commons/services/notifiers/page-notifier.service';
import { RecordDto, RecordStateDto } from './dtos/record-dto.service';
import { MetricsKey } from './enums/record-metrics.enum';
import {
    RecordMetricType,
    RecordNavigationKey,
    RecordNavigationStatus,
    RecordNavigationToggleStatus,
} from './enums/record-navigation.enum';
import { IRecordNavigationItem } from './interfaces/record-navigation.interface';
import { RecordService } from './record-service.service';
import { RhythmSortType } from './enums/rhythm-sort-type.enum';


@Injectable()
export class RecordNavigationService implements OnDestroy {

    // Subscription to route changes
    // Crucial that this subscription gets destroyed
    public pageNotifierSubs: Subscription;


    /**
     * Ctor
     *
     * @param {RecordDto}      private recordDto
     * @param {RecordStateDto} private recordStateDto
     * @param {PageNotifier}   private pageNotifier
     * @param {PageDto}        private pageDto
     * @param {RecordDao}      private recordDao
     */
    public constructor(
        private recordDto: RecordDto,
        private recordStateDto: RecordStateDto,
        private pageNotifier: PageNotifier,
        private pageDto: PageDto,
        private recordService: RecordService
    ) {

        // Init navigation related notifiers/listeners
        this.initRouteChangeListener();
    }


    /**
     * Initializes record navigation related functionality
     */
    public init(): void {

        // Load navigation items
        this.loadNavigationItems();

        // Process intial requested route to mark as completed
        this.processRouteChange();
    }


    /**
     * Returns a navigation item - merged with the cached version of this navigation item...if available.
     *
     * @param  {IRecordNavigationItem}        navItem
     * @param  {Array<IRecordNavigationItem>} cachedNavItems
     * @return {IRecordNavigationItem}
     */
    private getNavigationItem(navItem: IRecordNavigationItem, cachedNavItems: Array<IRecordNavigationItem>): IRecordNavigationItem {

        if(cachedNavItems) {

            for(let cachedNavItem of cachedNavItems) {

                if(cachedNavItem.pageKey == navItem.pageKey) {

                    navItem = Object.assign(cachedNavItem, navItem);
                    break;
                }
            }
        }

        return navItem;
    }


    /**
     * Convience method to create both rhythm and ectopic navigation items plus respective children.
     *
     * @param {RecordNavigationKey} navigationKey
     * @param {RecordMetricType}    metricType
     * @param {Array<any>}          cachedNavItems
     */
    private addChildNavigationItems(navigationKey: RecordNavigationKey, metricType: RecordMetricType, cachedNavItems: Array<any>): void {

        // Based on the type of parent/child items we're dealing we need to set a few
        // initial values
        let metricKey: string;
        let baseUrl: string;
        let parentName: string;
        let meta: typeof RhythmTypeMeta | typeof EctopicTypeMeta;
		let params: {[key: string]: string | number } = {};

        if(navigationKey == RecordNavigationKey.RHYTHMS) {

            // RHYTHMS
            metricKey = MetricsKey.RHYTHM_METRICS;
            baseUrl = 'rhythms';
            parentName = 'Rhythms';
            meta = RhythmTypeMeta;
        }
        else if(navigationKey == RecordNavigationKey.ECTOPICS) {

            // ECTOPICS
            metricKey = MetricsKey.ECTOPIC_METRICS;
            baseUrl = 'ectopics';
            parentName = 'Ectopic Beats';
            meta = EctopicTypeMeta;
	        params.sortType = RhythmSortType.LONGEST;
        }
        else if(navigationKey === RecordNavigationKey.ECTOPIC_PATTERNS) {

            // ECTOPIC PATTERNS
            metricKey = MetricsKey.RHYTHM_METRICS;
            baseUrl = 'ectopic-patterns';
            parentName = 'Ectopic Patterns';
            meta = RhythmTypeMeta;
        }

        // Get most recent metrics which come from the API
        let childMetricItems = Object.entries(this.recordDto.metrics[metricKey]);

        if(metricKey === MetricsKey.ECTOPIC_METRICS){
            //  the desired link order for ectopic beats in the left nav is : SVE3, SVE2, SVE1, VE3, VE2, VE1
            childMetricItems.reverse();
            const SVEsArray= childMetricItems.splice(3);
            childMetricItems = SVEsArray.concat(childMetricItems);
        }

        // Do we have any rhythm metrics to work with?
        // If not we're done here...
        if(childMetricItems.length > 0) {

            // Get cached rhythm type array if available
            let cachedChildNavItems: Array<IRecordNavigationItem> = null;

            // We need to find the list of rhythm types stored in cache
            if(cachedNavItems) {

                for(let cachedNavItem of cachedNavItems) {

                    // TODO: This can probably be cleaned up a little
                    if(navigationKey == RecordNavigationKey.RHYTHMS && cachedNavItem.pageKey == RecordNavigationKey.RHYTHMS) {
                        cachedChildNavItems = (cachedNavItem.children?.length > 0) ? cachedNavItem.children : null;
                        break;
                    }
                    else
                    if(navigationKey == RecordNavigationKey.ECTOPICS && cachedNavItem.pageKey == RecordNavigationKey.ECTOPICS) {
                        cachedChildNavItems = (cachedNavItem.children?.length > 0) ? cachedNavItem.children : null;
                        break;
                    }
                    else
                    if(navigationKey === RecordNavigationKey.ECTOPIC_PATTERNS
                        && cachedNavItem.pageKey === RecordNavigationKey.ECTOPIC_PATTERNS) {
                        cachedChildNavItems = (cachedNavItem.children?.length > 0) ? cachedNavItem.children : null;
                        break;
                    }
                }
            }

            // Array of rhythm child navigation items that will ultimately get pushed onto the parent rhythm nav item
            let childNavItems = new Array<IRecordNavigationItem>();

            for(const [type, count] of childMetricItems) {
                childNavItems.push(
                    this.getNavigationItem({
                        pageKey: type,
                        parentPageKey: navigationKey,
                        name: meta[type].name,
                        metricType: metricType,
                        url: `${baseUrl}/${type}`,
	                    params: params
                    }, cachedChildNavItems)
                );
            }

            // Finally add the parent navigation item and add the child nav items that were just built out onto our parent
            this.recordDto.navigationItems.push(this.getNavigationItem({
                pageKey: navigationKey,
                name: parentName,
                children: childNavItems,
            }, cachedNavItems));
        }

    }


    /**
     * Builds navigation items for display
     */
    private loadNavigationItems(): void {

        // Get the base list of navigation items from cache if available
        const cachedNavItems = (this.recordStateDto.navigationItems?.length) ? this.recordStateDto.navigationItems : null;

        // CASE OVERVIEW
        this.recordDto.navigationItems.push(
            this.getNavigationItem({
                pageKey: RecordNavigationKey.CASE_OVERVIEW,
                name: 'Case Overview',
                metricType: RecordMetricType.RECORD_PAGE,
                url: 'overview'
            }, cachedNavItems)
        );


        // RHYTHMS
        this.addChildNavigationItems(RecordNavigationKey.RHYTHMS, RecordMetricType.RHYTHMS, cachedNavItems);

        // ECTOPIC BEATS
        this.addChildNavigationItems(RecordNavigationKey.ECTOPICS, RecordMetricType.ECTOPICS, cachedNavItems);

        // ECTOPIC PATTERNS
        this.addChildNavigationItems(RecordNavigationKey.ECTOPIC_PATTERNS, RecordMetricType.ECTOPIC_PATTERNS, cachedNavItems);

        // RATES
        this.recordDto.navigationItems.push(
            this.getNavigationItem({
                pageKey: RecordNavigationKey.RATES,
                name: 'Rates',
                metricType: RecordMetricType.RECORD_PAGE,
                url: 'rates'
            }, cachedNavItems)
        );

        // EVENT CHART
        this.recordDto.navigationItems.push(
            this.getNavigationItem({
                pageKey: RecordNavigationKey.EVENT_CHART,
                name: 'Event Chart',
                metricType: RecordMetricType.RECORD_PAGE,
                url: 'event-chart'
            }, cachedNavItems)
        );

        // TRIGGERS/DIARIES
        this.recordDto.navigationItems.push(
            this.getNavigationItem({
                pageKey: RecordNavigationKey.TRIGGERS_DIARIES,
                name: 'Triggers & Diaries',
                metricType: RecordMetricType.RECORD_PAGE,
                url: 'triggers'
            }, cachedNavItems)
        );

        // REPORT PREP
        this.recordDto.navigationItems.push(
            this.getNavigationItem({
                pageKey: RecordNavigationKey.REPORT_PREP,
                name: 'Report Prep',
                metricType: RecordMetricType.RECORD_PAGE,
                url: 'report-prep'
            }, cachedNavItems)
        );

        // REPORT PREVIEW
        this.recordDto.navigationItems.push(
            this.getNavigationItem({
                pageKey: RecordNavigationKey.REPORT_PREVIEW,
                name: 'Report Preview',
                metricType: RecordMetricType.RECORD_PAGE,
                url: 'report-preview'
            }, cachedNavItems)
        );

    }



    /**
     * Initiliazes RouteChangeListener
     *
     * Listens for route changes and calls any methods that need to react.
     */
    private initRouteChangeListener(): void {

        // Init listener
        this.pageNotifierSubs = this.pageNotifier
            .listen(PageChannelKey.ROUTE_CHANGE)
            .subscribe((routeData: IRouteChangeChannel) => {

                // Process the route change
                this.processRouteChange();
            });
    }


    /**
     * Process a change in the route.
     * and updates the status of the navigation item the corresponds to the requested route.
     */
    private processRouteChange(): void {

        // Anytime a route changes a notification will be sent out - even if it's not related to the record process pages
        // Check for the presence of the record navigation mapping key in the active page dto
        if(this.pageDto.meta?.navigationKey) {

            for(let i = 0; i < this.recordDto.navigationItems.length; i++) {

                // Does the current page being viewed match the current navigation item in the loop
                if(this.pageDto.meta.navigationKey === this.recordDto.navigationItems[i].pageKey) {



                    // Determine type of page / nav item being viewed
                    // Special treatment is needed for rhythms, ectopics && ectopic patterns

                    if(this.pageDto.meta.navigationKey === RecordNavigationKey.RHYTHMS
                        || this.pageDto.meta.navigationKey === RecordNavigationKey.ECTOPICS
                        || this.pageDto.meta.navigationKey === RecordNavigationKey.ECTOPIC_PATTERNS) {


                        // Get rhythm/ectopic type - last segment in the url path
                        const type = this.pageDto.urlPathSegments[(this.pageDto.urlPathSegments.length - 1)];


                        // Find matching rhythm/ectopic type navigation item
                        for(let x = 0; x < this.recordDto.navigationItems[i].children.length; x++) {

                            if(this.recordDto.navigationItems[i].children[x].pageKey === type.toUpperCase()) {

                                this.recordDto.navigationItems[i].children[x].status = RecordNavigationStatus.COMPLETE;
                                break;
                            }
                        }
                    }
                    else {

                        // Normal pages / nav items that don't have child items
                        // Update the status and the get the outta the loop
                        this.recordDto.navigationItems[i].status = RecordNavigationStatus.COMPLETE;
                        break;
                    }
                }
            }

            // Save navigation to client cache (indexedDB)
            this.recordService.cacheRecord();
        }
    }


    /**
     * Toggles open/close status of a navigation parent item
     *
     * @param {IRecordNavigationItem} navItem
     */
    public toggleNavigation(navItem: IRecordNavigationItem): void {

        navItem.toggleStatus = (!navItem.toggleStatus) ? RecordNavigationToggleStatus.OPEN : navItem.toggleStatus;

        if(navItem.toggleStatus == RecordNavigationToggleStatus.OPEN) {
            navItem.toggleStatus = RecordNavigationToggleStatus.CLOSED;
        }
        else {
            navItem.toggleStatus = RecordNavigationToggleStatus.OPEN;
        }

        this.recordService.cacheRecord();
    }

    ngOnDestroy(){
        this.pageNotifierSubs.unsubscribe();
    }
}

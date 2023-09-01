import { Injectable } from '@angular/core';

import { PageMeta, PageKey, INavigationItem } from 'app/commons/constants/page-meta.const';
import { PageDto } from 'app/commons/services/dtos/page-dto.service';
import { PageNotifier, PageChannelKey } from 'app/commons/services/notifiers/page-notifier.service';


@Injectable()
export class PageService {


    public constructor(
        private pageDto: PageDto,
        private pageNotifier: PageNotifier
    ) { }


    /**
     * Method loads top level PageDto properties.
     *
     * @param {IPageServiceLoadInput} input
     */
    public loadPage(input: IPageServiceLoadInput): void {

        // Set pageDto urls
        this.pageDto.url = input.url;
        this.pageDto.previousUrl = input.previousUrl;
        this.pageDto.urlPathSegments = input.url.split('/');

        // Set page meta based on the current url being viewed
        this.setPageMeta(input.url);

        // Do we need to do anything related to page sub tab navigation?

        // this.pageNotifier.listen(PageChannelKey.NAVIGATION_SUB_TABS).subscribe((data: INavigationSubTabChannel) => {

        //     console.log('got it ', data);
        //     this.pageDto.navigationSubTabs = data.subTabs;
        // });


        // Send out notification that page has been reloaded
        this.pageNotifier.send(PageChannelKey.ROUTE_CHANGE, {});
    }


    /**
     * Method will take a url and try to find a match on the PageMeta.regex property.
     * If a match is found the PageMeta object is set.
     *
     * @param  {string}    url
     * @return {IPageMeta}
     */
    private setPageMeta(url: string): void {

        // Loop over the PageMeta object
        for(const [pageKey, meta] of Object.entries(PageMeta)) {

            // Attempt to match active route url to the pageMeta regular expression
            if(url.match(new RegExp(meta.regex))) {

                // Match found
                // Set our pageMeta object to return and break out of this loop
                this.pageDto.key = <PageKey>pageKey;
                this.pageDto.meta = meta;

                break;
            }
        }
    }


    public addNavigationSubTabs(tabs: Array<INavigationItem>): void {
        this.pageDto.navigationSubTabs = tabs;
    }
}


/**
 * Defines the properties that can be passed into the PageService.loadPage method
 */
export interface IPageServiceLoadInput {
    url: string;
    previousUrl: string;
}

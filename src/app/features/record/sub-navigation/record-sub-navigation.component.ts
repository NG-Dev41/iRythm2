import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { INavigationItem } from 'app/commons/constants/page-meta.const';
import { PageDto } from 'app/commons/services/dtos/page-dto.service';
import { PageNotifier, PageChannelKey, INavigationSubTabChannel } from 'app/commons/services/notifiers/page-notifier.service';
import { Subscription } from 'rxjs';


@Component({
	selector: 'app-record-sub-navigation',
	templateUrl: './record-sub-navigation.component.html',
	styleUrls: ['./record-sub-navigation.component.scss']
})
export class RecordSubNavigationComponent implements OnInit, OnDestroy {

 private subTabNavSubs:Subscription;
	/**
	 * Ctor
	 *
	 * @param {PageDto}      public  pageDto
	 * @param {PageNotifier} private pageNotifier
	 */
	public constructor(
		public pageDto: PageDto,
		private pageNotifier: PageNotifier,
		private router: Router,
		private activeRoute: ActivatedRoute
	) { }


	public ngOnInit(): void {

		// Listening for changes to the sub navigation tabs
		this.subTabNavSubs = this.pageNotifier
			.listen(PageChannelKey.NAVIGATION_SUB_TABS)
			.subscribe((data: INavigationSubTabChannel) => {

				// Using setTimeout to make things work then updating our tabs array
				setTimeout(() => {
					this.pageDto.navigationSubTabs = data.subTabs;
				}, 0);
			});
	}


	/**
	 * Process a sub tab navigation click
	 *
	 * @param {INavigationItem} navItem
	 */
	public processNavItemClick(navItem: INavigationItem): void {

		if (navItem.href) {

			// This is used to redirect to a completely different route/url
			// TODO: This will most likely need some work in the future when we start dealing with other pages that have sub nav tabs
			this.router.navigate([navItem.href]);
		}
		else {

			// This is used to redirect to the current url most likely with query params included in the url
			// TODO: Some of the properties below (queryParamsHandling, skipLocationChange) may or may not be needed
			// If they're need we can update the INavItem with these properties

			this.router.navigate([], {
				relativeTo: this.activeRoute,
				queryParams: navItem.params,

				// Merge params with any existing params already in the url
				// queryParamsHandling: 'merge'

				// Do not do not trigger navigation
				// skipLocationChange: true
			});
		}
	}

    ngOnDestroy(){
        this.subTabNavSubs?.unsubscribe();
    }
}

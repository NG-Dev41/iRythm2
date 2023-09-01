import { Pipe, PipeTransform } from '@angular/core';

import { INavigationItem } from 'app/commons/constants/page-meta.const';


@Pipe({
	name: 'activeNavSubTab'
})
export class ActiveNavSubTab implements PipeTransform {


	/**
	 * Method returns true if the navItem matches the current URL.
	 *
	 * TODO: This will need work when we begin to develop tabs related to other pages besides 'Rhythms'
	 * This is quick and 'dirty' for the Rhythms prototype.
	 *
	 * @param  {INavigationItem} navItem
	 * @return {boolean}
	 */
	public transform(navItem: INavigationItem): boolean {

		// Get url query params
		const queryString = window.location.search;

		if(queryString && queryString.length > 0) {

			// If we have query params attempt to make a match
			const urlParams = new URLSearchParams(queryString);
			return (urlParams.get('sortType') == navItem.params['sortType']);
		}
		else {

			// No query params - look for default
			return (navItem.isDefault) ? true : false;
		}

	}
}

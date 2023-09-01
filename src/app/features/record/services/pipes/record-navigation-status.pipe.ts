import { Pipe, PipeTransform } from '@angular/core';

import { RecordNavigationUtils } from 'app/features/record/services/utils/record-navigation-utils';
import { IRecordNavigationItem } from '../interfaces/record-navigation.interface';


@Pipe({
	name: 'recordNavigationStatus',
	pure: false
})
export class RecordNavigationStatusPipe implements PipeTransform {


	/**
	 * Ctor
	 *
	 * @param {RecordDto} private recordDto
	 */
	public constructor(
		private navUtils: RecordNavigationUtils
	) {}


	/**
	 * Returns status of navigation item.
	 *
	 * @param  {IRecordNavigationItem} navItem
	 * @return {string}
	 */
	public transform(navItem: IRecordNavigationItem): string {
		return this.navUtils.getNavItemStatus(navItem);
	}
}

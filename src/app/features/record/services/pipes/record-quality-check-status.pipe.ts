import { Pipe, PipeTransform } from '@angular/core';
import { IRecordNavigationItem } from '../interfaces/record-navigation.interface';
import { IRecordActionChannel, IRecordReportChannel } from '../interfaces/channel.interface';

@Pipe({
	name: 'recordQualityCheckStatus'
})
export class RecordQualityCheckStatusPipe implements PipeTransform {

	/**
	 * Returns classes to display red/yellow error/warning dots next to a nav item
	 */
	transform(navItem: IRecordNavigationItem, qualityCheckStatuses: IRecordReportChannel): string {
		// Error check is first on purpose - if both an error and warning are present for a given link we only show the error
		if (
			qualityCheckStatuses &&
			qualityCheckStatuses.qualityCheckErrors &&
			qualityCheckStatuses.qualityCheckErrors.includes(navItem.pageKey)
		) {
			return 'quality-check-alert error';
		} else if (
			qualityCheckStatuses &&
			qualityCheckStatuses.qualityCheckWarnings &&
			qualityCheckStatuses.qualityCheckWarnings.includes(navItem.pageKey)
		) {
			return 'quality-check-alert warning';
		} else {
			return '';
		}
	}
}
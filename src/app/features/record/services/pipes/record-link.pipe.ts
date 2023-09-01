import { Pipe, PipeTransform } from '@angular/core';

import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { RecordUtils } from 'app/features/record/services/utils/record-utils';


@Pipe({
	name: 'recordLink'
})
export class RecordLinkPipe implements PipeTransform {


	/**
	 * Ctor
	 *
	 * @param {RecordDto} private recordDto
	 */
	public constructor(
		private recordDto: RecordDto
	) {}


	/**
	 * Convience method for building out record related urls.
	 * Returns fully constructed relative record url.
	 *
	 * See RecordUtils for full implementation.
	 *
	 * @param  {string} serialNumber
	 * @param  {string} url
	 * @return {string}
	 */
	public transform(url: string): string {
		return RecordUtils.buildUrl(this.recordDto.serialNumber, url.toLowerCase());
	}
}

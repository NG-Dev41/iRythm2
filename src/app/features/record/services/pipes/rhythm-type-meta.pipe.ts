import { Pipe, PipeTransform } from '@angular/core';

import { RhythmType, RhythmTypeMeta } from 'app/commons/constants/rhythms.const';


@Pipe({
	name: 'rhythmTypeMeta'
})
export class RhythmTypeMetaPipe implements PipeTransform {

	/**
	 * Convience pipe to access RhythmTypeMeta properties.
	 * Pass in the RhythmType and optional property on the RhythmTypeMeta object
	 * to access. If no property is given it will return the RhythmTypeMeta.name
	 * value as the default.
	 *
	 * @param  {RhythmType} 	   rhythmType
	 * @param  {string = 'name'}   propertyName
	 * @return {any}
	 */
	public transform(rhythmType: RhythmType, propertyName: string = 'name'): any {
		return RhythmTypeMeta[rhythmType][propertyName];
	}
}

import { Pipe, PipeTransform } from '@angular/core';
import { RhythmSortType } from 'app/features/record/services/enums/rhythm-sort-type.enum';

@Pipe({
    name: 'displaySortType'
})
export class DisplaySortTypePipe implements PipeTransform {

    private readonly RHYTHM_SORT_TRANSLATE_KEY: string = 'record.rhythm.sort.';

    transform(sortType: RhythmSortType): string {
        return `${this.RHYTHM_SORT_TRANSLATE_KEY}${sortType}`;
    }
}

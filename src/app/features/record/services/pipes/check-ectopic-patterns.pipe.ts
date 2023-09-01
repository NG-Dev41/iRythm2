
import { Pipe, PipeTransform } from '@angular/core';
import { RhythmType } from 'app/commons/constants/rhythms.const';

@Pipe({
    name: 'checkEctopicPatterns'
})
export class CheckEctopicPatternsPipe implements PipeTransform {

    /**
     * For use in Paint Rhythm template to display correct name for BIGEM and TRIGEM
     * @param value
     */
    public transform(value: string): boolean {
        if(value === RhythmType.BIGEMINY || value === RhythmType.TRIGEMINY){
          return true;
        } else {
          return false;
        }
    }

}

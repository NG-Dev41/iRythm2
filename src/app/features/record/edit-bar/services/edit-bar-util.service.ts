import { Injectable } from '@angular/core';
import { EctopicType, IEctopicTypeMeta } from 'app/commons/constants/ectopics.const';
import { RhythmType, IRhythmTypeMeta } from 'app/commons/constants/rhythms.const';

@Injectable()
export class EditBarUtilService {

    constructor() { }


    /**
     * When used with keyValue pipe, maintains original order
     */
    public returnZero(): number {
        return 0;
    }

    /**
     * Set the rectangle color
     * @param meta
     * @param value
     */

    public getRectangleColor(
        meta: { [key in EctopicType]: IEctopicTypeMeta; } | { [key in RhythmType]: IRhythmTypeMeta; },
        value: string
    ): string {
        return `${meta[value].color}`;
    }
}

import { TestBed } from "@angular/core/testing";
import { DisplaySortTypePipe } from "./display-sort-type.pipe";
import { RhythmSortType } from "app/features/record/services/enums/rhythm-sort-type.enum";

describe('DisplaySortTypePipe', () => {
    let pipe: DisplaySortTypePipe = new DisplaySortTypePipe();

    it('should create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('adds translate key prefix to the rhythmSortType', () => {
        const result = pipe.transform(RhythmSortType.FASTEST);
        expect(result).toBe(pipe['RHYTHM_SORT_TRANSLATE_KEY'] + RhythmSortType.FASTEST);
    });
});
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'recordChapterPage'
})
export class RecordChapterPagePipe implements PipeTransform {
    /**
     * Returns css value based on chapter page boolean
     * @param chapterPage
     */

    transform(chapterPage: boolean ): string {
    return chapterPage ? 'pill pill-indigo' : 'pill pill-gray';
    }

}

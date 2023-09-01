import { Pipe, PipeTransform } from '@angular/core';

import { PageDto } from 'app/commons/services/dtos/page-dto.service';
import { IRecordNavigationItem } from '../interfaces/record-navigation.interface';

@Pipe({
    name: 'recordActiveNavigation',
    pure: false,
})
export class RecordActiveNavigationPipe implements PipeTransform {
    /**
     * Ctor
     *
     * @param {PageDto} private pageDto
     */
    public constructor(private pageDto: PageDto) {}

    /**
     * Method determines if the given navigation item matches the current page being viewed.
     *
     * @param  {IRecordNavigationItem} navItem
     * @return {boolean}
     */
    public transform(navItem: IRecordNavigationItem): boolean {
        // Default value if a navigation item is active or not
        let isActive: boolean = false;

        if (this.pageDto.meta?.navigationKey) {

            // This is comparing rhythm and ectopic types
            if (
                this.pageDto.urlPathSegments[4]?.toUpperCase() == navItem.pageKey &&
                this.pageDto.meta?.navigationKey == navItem.parentPageKey
            ) {
                isActive = true;
            } else {
                // This is comparing regular pages that don't have child pages
                isActive = this.pageDto.meta.navigationKey == navItem.pageKey;
            }
        }

        return isActive;
    }
}

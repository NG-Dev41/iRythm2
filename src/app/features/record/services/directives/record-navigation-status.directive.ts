import { Directive, OnInit, ElementRef, Input, Renderer2 } from '@angular/core';

import { RecordNavigationUtils } from 'app/features/record/services/utils/record-navigation-utils';
import { IRecordNavigationItem } from 'app/features/record/services/interfaces/record-navigation.interface';


@Directive({
    selector: '[recordNavigationStatus]'
})
export class RecordNavigationStatusDirective implements OnInit {

    // Navigation input item
    @Input('recordNavigationStatus') public navItem: IRecordNavigationItem;


    /**
     * Ctor
     *
     * @param {ElementRef} private el
     * @param {Renderer2}  private renderer
     */
    public constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private navUtils: RecordNavigationUtils
    ) {}


    /**
     * OnInit
     *
     * Sets the appropriate css status class onto the given HTML element
     */
    public ngOnInit(): void {

        // Get the status and css class associated with the status
        let navItemStatus = this.navUtils.getNavItemStatus(this.navItem);
        let navItemCssClass = this.navUtils.getNavItemStatusCss(navItemStatus);

        // Finally update our HTML with the css status class
        this.renderer.addClass(this.el.nativeElement, navItemCssClass);
    }
}

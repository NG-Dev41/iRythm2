import { AfterViewInit, Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[tqaAutosizeTextArea]'
})
export class AutosizeTextAreaDirective implements AfterViewInit {
    private textareaElement: HTMLTextAreaElement;

    constructor(private elementRef: ElementRef<HTMLTextAreaElement>) {
        this.textareaElement = this.elementRef.nativeElement;
    }

    public ngAfterViewInit(): void {
        this.onInputChange();
    }

    @HostListener('input') 
    private onInputChange(): void {
        // Reset rows attribute to get accurate scrollHeight
        this.textareaElement.setAttribute('rows', '1');

        // Get the computed values object reference
        const cs: CSSStyleDeclaration = getComputedStyle(this.textareaElement);

        // Force content-box for size accurate line-height calculation
        // Remove scrollbars, lock width (subtract inline padding and inline border widths)
        // and remove inline padding and borders to keep width consistent (for text wrapping accuracy)
        this.textareaElement.style.setProperty('box-sizing', 'content-box');
        this.textareaElement.style.setProperty('padding-inline', '0');
        this.textareaElement.style.setProperty('border-width', '0');

        // Get the base line height, and top / bottom padding.
        const block_padding = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
        // If line-height is not explicitly set, use the computed height value (ignore padding due to content-box)
        const line_height = cs['line-height'] === 'normal' ? parseFloat(cs.height) : parseFloat(cs.lineHeight);

        // Get the scroll height (rounding to be safe to ensure cross browser consistency)
        const scroll_height = Math.round(this.textareaElement.scrollHeight);

        // Undo border-width, box-sizing & inline padding override
        this.textareaElement.style.removeProperty('box-sizing');
        this.textareaElement.style.removeProperty('padding-inline');
        this.textareaElement.style.removeProperty('border-width');

        // Subtract block_padding from scroll_height and divide that by our line_height to get the row count.
        // Round to nearest integer as it will always be within ~.1 of the correct whole number.
        const rows = Math.round((scroll_height - block_padding) / line_height);

        // Set the calculated rows attribute (limited by row_limit)
        this.textareaElement.setAttribute('rows', `${rows}`);
    }
}

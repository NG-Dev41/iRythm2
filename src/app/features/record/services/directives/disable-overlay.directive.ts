import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[disableOverlay]'
})
export class DisableOverlayDirective implements OnChanges {

    @Input() disableOverlay: boolean;

    constructor(
        private el: ElementRef
    ) {}

    ngOnChanges() {
        // if disableOverlay is true: set opacity to half and turn off pointer events
        if(this.disableOverlay){
            this.el.nativeElement.style.opacity = .50;
            this.el.nativeElement.style.pointerEvents = 'none';

        // once disableOverlay is false, unset the changes
        } else if(!this.disableOverlay){
            this.el.nativeElement.style.opacity = 1;
            this.el.nativeElement.style.pointerEvents = 'auto';
        }
    }
}

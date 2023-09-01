import { Injectable, OnDestroy } from '@angular/core';

import { Observable, of } from 'rxjs';

import { IEcgControllerInit } from 'app/modules/ecg/interfaces';
import { EcgComponentKey } from 'app/modules/ecg/enums';
import { EcgBaseController } from 'app/modules/ecg/services/controller/base/ecg-base-controller.service';
import { EcgStripConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-strip-config-dto.service';


@Injectable()
export class EcgNavigationArrowController extends EcgBaseController implements OnDestroy {

    /**
     * Ctor
     */
    public constructor(
        public config: EcgStripConfigDto,
    ) {
        super();
        this.setComponentKey();
    }


    /**
     * Init Top Level Navigation Arrow Functionality:
     *
     * @return {Observable<IEcgControllerInit>}
     */
    public init(): Observable<IEcgControllerInit> {

        // Init Logic/Properties

        // Set top position of the arrow containers
        this.config.ct.navigationArrow.containerTop = this.config.ct.beats.lineHeight;

        // Set top position of circle/arrow
        this.config.ct.navigationArrow.arrowTop = (this.config.ct.line.height / 2) - (this.config.ct.navigationArrow.width / 2);

    	return of({
    		success: true
    	});
    }


    /**
     * Navigates the scroll container/line on nav arrow click.
     * Pass the desired direction to navigate to.
     *
     * @param {'START' | 'END'} direction
     */
    public navigateArrowClick(direction: 'START' | 'END'): void {

        // Left coord to navigate to
        let leftX: number;

        // Switch on direction and set our leftX coordinate to navigate to
        switch(direction) {

            case 'START':
                leftX = 0;
                break;

            case 'END':
                leftX = this.config.ct.global.overflowWidth;
                break;
        }

        // Finally scroll the container/line
        this.config.ct.html.scrollContainer.scrollTo({
            behavior: 'smooth',
            left: leftX
        });
    }


    /**
     * Set component key
     */
    protected setComponentKey(): void {
        this.componentKey = EcgComponentKey.NAVIGATION_ARROW;
    }

    public ngOnDestroy():void {
        this.destroy();
    }

    public destroy():void {}
}

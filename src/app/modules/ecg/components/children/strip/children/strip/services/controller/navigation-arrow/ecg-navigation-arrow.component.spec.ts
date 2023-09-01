import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
    EcgNavigationArrowComponent
} from 'app/modules/ecg/components/children/strip/children/strip/services/controller/navigation-arrow/ecg-navigation-arrow.component';

import { EcgStripConfigDtoMock } from 'test/mocks/services/dto/ecg-strip-config-dto-mock.service';
import { EcgUtilsMock } from 'test/mocks/services/ecg-utils-mock.service';
import { EcgStripNotifierMock } from 'test/mocks/services/notifier/ecg-strip-notifier-mock.service';
import { EcgNavigationArrowControllerMock } from 'test/mocks/services/ecg-navigation-arrow-controller-mock.service';
import { EcgStripConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-strip-config-dto.service';
import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';
import { EcgStripNotifier } from '../../../../../services/notifier/ecg-strip-notifier.service';
import { EcgNavigationArrowController } from './ecg-navigation-arrow-controller.service';

describe('EcgNavigationArrowComponent', () => {
    let component: EcgNavigationArrowComponent;
    let fixture: ComponentFixture<EcgNavigationArrowComponent>;

    beforeEach(async () => {
        TestBed.overrideComponent(
            EcgNavigationArrowComponent,
            {
                set: {
                    providers: [
                        { provide: EcgNavigationArrowController, useClass: EcgNavigationArrowControllerMock }
                    ]
                }
            }
        );
        await TestBed.configureTestingModule({
            declarations: [ EcgNavigationArrowComponent ],
            providers: [
                { provide: EcgUtils, useClass: EcgUtilsMock },
                { provide: EcgNavigationArrowController, useClass: EcgNavigationArrowControllerMock },
                { provide: EcgStripConfigDto, useClass: EcgStripConfigDtoMock },
                { provide: EcgStripNotifier, useClass: EcgStripNotifierMock }
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EcgNavigationArrowComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();

    });

    it('should create the navigation controller', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should init', () => {
            const controllerInitSpy = jest.spyOn(component.controller, 'init');
            const ecgUtilsreadySpy = jest.spyOn(component['ecgUtils'], 'ready');

            component.ngOnInit();

            fixture.detectChanges();

            component.controller.init();

            expect(ecgUtilsreadySpy).toHaveBeenCalled();
            expect(controllerInitSpy).toHaveBeenCalled();
        });
    });
});

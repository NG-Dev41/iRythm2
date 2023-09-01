import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IEcgConfigStrip } from 'app/modules/ecg/interfaces';
import {
    EcgAxisGridComponent
} from 'app/modules/ecg/components/children/strip/children/strip/services/controller/axis-grid/ecg-axis-grid.component';
import { EcgStripConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-strip-config-dto.service';
import { EcgNotifier } from 'app/modules/ecg/services/notifier/ecg/ecg-notifier.service';
import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';
import { EcgStripConfigDtoMock } from 'test/mocks/services/dto/ecg-strip-config-dto-mock.service';
import { EcgUtilsMock } from 'test/mocks/services/ecg-utils-mock.service';
import { EcgNotifierMock } from 'test/mocks/services/notifier/ecg-notifier-mock.service';
import { EcgAxisGridControllerMock } from 'test/mocks/services/ecg-axis-grid-controller-mock.service';
import { EcgAxisGridController } from './ecg-axis-grid-controller.service';

describe('EcgAxisGridComponent', () => {
    let component: EcgAxisGridComponent;
    let fixture: ComponentFixture<EcgAxisGridComponent>;

    beforeEach(async () => {
        TestBed.overrideComponent(
            EcgAxisGridComponent,
            {
                set: {
                    providers: [
                        { provide: EcgAxisGridController, useClass: EcgAxisGridControllerMock }
                    ]
                }
            }
        );

        await TestBed.configureTestingModule({
            declarations: [EcgAxisGridComponent],
            providers: [
                { provide: EcgAxisGridController, useClass: EcgAxisGridControllerMock },
                { provide: EcgStripConfigDto, useClass: EcgStripConfigDtoMock },
                { provide: EcgNotifier, useClass: EcgNotifierMock },
                { provide: EcgUtils, useClass: EcgUtilsMock }
            ] 
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EcgAxisGridComponent);
        component = fixture.componentInstance;

        component.controller.config = {
            ct: {
                axisGrid: {
                    show: true,
                    xAxisLineFrequency: 4,
                    color: 'blue'
                }
            } as IEcgConfigStrip
        } as EcgStripConfigDto;

        fixture.detectChanges();

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should initialize the axis grid controller', () => {
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

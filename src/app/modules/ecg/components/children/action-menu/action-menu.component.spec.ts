import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionMenuComponent } from './action-menu.component';
import { EcgUtilsMock } from 'test/mocks/services/ecg-utils-mock.service';
import { EcgActionMenuController } from './services/controller/action-menu-controller.service';
import { EcgConfigDtoMock } from 'test/mocks/services/dto/ecg-config-dto-mock.service';
import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';
import { EcgConvertSinusComponentMock } from 'test/mocks/components/ecg-convert-sinus-mock.component';
import { EcgGainComponentMock } from 'test/mocks/components/ecg-gain-mock.component';
import { MatMenuModule } from '@angular/material/menu';
import { EcgActionMenuControllerMock } from 'test/mocks/services/ecg-action-menu-controller-mock.service';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatIconModule } from '@angular/material/icon';

describe('ActionMenuComponent', () => {
    let component: ActionMenuComponent;
    let fixture: ComponentFixture<ActionMenuComponent>;

    beforeEach(async () => {
        TestBed.overrideComponent(
            ActionMenuComponent,
            {
                set: {
                    providers: [
                        { provide: EcgActionMenuController, useClass: EcgActionMenuControllerMock }
                    ]
                }
            });
        await TestBed.configureTestingModule({
            imports: [ MatIconTestingModule, MatIconModule, MatMenuModule ],
            declarations: [
                ActionMenuComponent,
                EcgConvertSinusComponentMock,
                EcgGainComponentMock
            ],
            providers: [
                { provide: EcgUtils, useClass: EcgUtilsMock },
                { provide: EcgActionMenuController, useClass: EcgActionMenuControllerMock },
                { provide: EcgConfigDto, useClass: EcgConfigDtoMock }
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ActionMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should initialize the controller', () => {
            jest.spyOn(component.controller, 'init');
            jest.spyOn(component['ecgUtils'], 'ready');

            component.ngOnInit();

            fixture.detectChanges();

            component.controller.init().subscribe(() => {
                expect(component['ecgUtils'].ready).toHaveBeenCalled();
            });

            expect(component.controller.init).toHaveBeenCalled();
        });
    });
});

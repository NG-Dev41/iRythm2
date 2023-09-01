import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';

import { EcgBeatsAddLineComponent } from 'app/modules/ecg/components/children/strip/children/strip/services/controller/beats/ecg-beats-add-line.component';
import { EcgStripConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-strip-config-dto.service';
import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';
import { EcgStripConfigDtoMock } from 'test/mocks/services/dto/ecg-strip-config-dto-mock.service';
import { EcgUtilsMock } from 'test/mocks/services/ecg-utils-mock.service';

describe('EcgBeatsAddLineComponent', () => {
    let component: EcgBeatsAddLineComponent;
    let fixture: ComponentFixture<EcgBeatsAddLineComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EcgBeatsAddLineComponent],
            providers: [
                { provide: EcgStripConfigDto, useClass: EcgStripConfigDtoMock },
                { provide: EcgUtils, useClass: EcgUtilsMock }
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EcgBeatsAddLineComponent);
        component = fixture.componentInstance;

        component.beatAddLine =  {} as ElementRef;
        fixture.detectChanges();

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should set the line width', () => {
            component.ngOnInit();

            fixture.detectChanges();

            expect(component.lineWidth).toBe(3);
        });
    });
});

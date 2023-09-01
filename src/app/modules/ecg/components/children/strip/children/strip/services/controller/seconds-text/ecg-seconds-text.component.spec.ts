import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcgStripConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-strip-config-dto.service';
import { EcgStripConfigDtoMock } from 'test/mocks/services/dto/ecg-strip-config-dto-mock.service';
import { EcgSecondsTextComponent } from './ecg-seconds-text.component';


describe('EcgSecondsTextComponent', () => {
    let component: EcgSecondsTextComponent;
    let fixture: ComponentFixture<EcgSecondsTextComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ EcgSecondsTextComponent ],
            providers: [
                { provide: EcgStripConfigDto, useClass: EcgStripConfigDtoMock }
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EcgSecondsTextComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();

    });

    it('should create the ecg seconds component', () => {
        expect(component).toBeTruthy();
    });
});

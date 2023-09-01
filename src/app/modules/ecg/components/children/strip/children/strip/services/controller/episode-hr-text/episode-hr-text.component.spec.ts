import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodeHRTextComponent } from './episode-hr-text.component';
import { EcgDto } from 'app/modules/ecg/services/dto/ecg/ecg-dto.service';
import { EcgStripConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-strip-config-dto.service';
import { EcgDtoMock } from 'test/mocks/services/dto/ecg-dto-mock.service';
import { EcgStripConfigDtoMock } from 'test/mocks/services/dto/ecg-strip-config-dto-mock.service';

describe('EpisodeHRTextComponent', () => {
    let component: EpisodeHRTextComponent;
    let fixture: ComponentFixture<EpisodeHRTextComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EpisodeHRTextComponent],
            providers: [
                { provide: EcgDto, useClass: EcgDtoMock },
                { provide: EcgStripConfigDto, useClass: EcgStripConfigDtoMock }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(EpisodeHRTextComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

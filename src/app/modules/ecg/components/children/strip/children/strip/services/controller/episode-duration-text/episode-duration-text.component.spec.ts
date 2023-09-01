import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodeDurationTextComponent } from './episode-duration-text.component';
import { EcgDto } from 'app/modules/ecg/services/dto/ecg/ecg-dto.service';
import { EcgStripConfigDtoMock } from 'test/mocks/services/dto/ecg-strip-config-dto-mock.service';
import { EcgStripConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-strip-config-dto.service';
import { EcgDtoMock } from 'test/mocks/services/dto/ecg-dto-mock.service';
import { RecordLongestEpisodeTimeFormatPipeMock } from 'test/mocks/pipes/record-longest-episode-time-format-mock.pipe';

describe('EpisodeDurationTextComponent', () => {
    let component: EpisodeDurationTextComponent;
    let fixture: ComponentFixture<EpisodeDurationTextComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                EpisodeDurationTextComponent,
                RecordLongestEpisodeTimeFormatPipeMock
            ],
            providers: [
                { provide: EcgDto, useClass: EcgDtoMock },
                { provide: EcgStripConfigDto, useClass: EcgStripConfigDtoMock }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(EpisodeDurationTextComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

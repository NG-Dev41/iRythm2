import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RhythmSummaryComponent } from './rhythm-summary.component';
import { RecordDto } from '../services/dtos/record-dto.service';
import { RecordRhythmsDto } from '../rhythms/record-rhythms.service';
import { RecordDtoMock } from 'test/mocks/services/dto/record-dto-mock.service';
import { RecordRhythmsDtoMock } from 'test/mocks/services/dto/record-rhythms-dto-mock.service';
import { RecordLongestEpisodeTimeFormatPipeMock } from 'test/mocks/pipes/record-longest-episode-time-format-mock.pipe';

describe('HeaderRhythmSummaryComponent', () => {
    let component: RhythmSummaryComponent;
    let fixture: ComponentFixture<RhythmSummaryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                RhythmSummaryComponent,
                RecordLongestEpisodeTimeFormatPipeMock
            ],
            providers: [
                { provide: RecordDto, useClass: RecordDtoMock },
                { provide: RecordRhythmsDto, useClass: RecordRhythmsDtoMock }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(RhythmSummaryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

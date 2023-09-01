import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordPaintRhythmsComponent } from './record-paint-rhythms.component';
import { EditBarUtilService } from '../services/edit-bar-util.service';
import { RecordDto } from '../../services/dtos/record-dto.service';
import { RecordNotifier } from '../../services/notifiers/record-notifier.service';
import { RecordDtoMock } from 'test/mocks/services/dto/record-dto-mock.service';
import { RecordNotifierMock } from 'test/mocks/services/notifier/record-notifier-mock.service';
import { EditBarUtilServiceMock } from 'test/mocks/services/edit-bar-util-service-mock.service';
import { CheckEctopicPatternsPipe } from '../../services/pipes/check-ectopic-patterns.pipe';
import { HideCountBubblePipe } from '../../services/pipes/hide-count-bubble.pipe';
import { RecordMetricPipe } from '../../services/pipes/record-metric.pipe';
import { RecordKeyboardShortcutPipe } from '../../services/pipes/record-keyboard-shortcut.pipe';
import { DisableOverlayDirective } from '../../services/directives/disable-overlay.directive';


describe('RecordPaintRhythmsComponent', () => {
    let component: RecordPaintRhythmsComponent;
    let fixture: ComponentFixture<RecordPaintRhythmsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ 
                RecordPaintRhythmsComponent,
                CheckEctopicPatternsPipe,
                HideCountBubblePipe,
                RecordKeyboardShortcutPipe,
                DisableOverlayDirective
            ],
            providers: [
                { provide: RecordMetricPipe, useValue: { transform: (val) => val }} ,
                { provide: EditBarUtilService, useClass: EditBarUtilServiceMock },
                { provide: RecordDto, useClass: RecordDtoMock },
                { provide: RecordNotifier, useClass: RecordNotifierMock}
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(RecordPaintRhythmsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

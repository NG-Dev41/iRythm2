import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordMarkEctopyComponent } from './record-mark-ectopy.component';
import { RecordDto } from '../../services/dtos/record-dto.service';
import { RecordNotifier } from '../../services/notifiers/record-notifier.service';
import { RecordSessionEditService } from '../../services/record-service.service';
import { EditBarUtilService } from '../services/edit-bar-util.service';
import { RecordMetricPipe } from '../../services/pipes/record-metric.pipe';
import { RecordKeyboardShortcutPipe } from '../../services/pipes/record-keyboard-shortcut.pipe';

import { EditBarUtilServiceMock } from 'test/mocks/services/edit-bar-util-service-mock.service';
import { RecordDtoMock } from 'test/mocks/services/dto/record-dto-mock.service';
import { RecordNotifierMock } from 'test/mocks/services/notifier/record-notifier-mock.service';
import { RecordSessionEditServiceMock } from 'test/mocks/services/record-session-edit-service-mock.service';
import { DisableOverlayDirective } from '../../services/directives/disable-overlay.directive';


describe('RecordMarkEctopyComponent', () => {
    let component: RecordMarkEctopyComponent;
    let fixture: ComponentFixture<RecordMarkEctopyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                RecordMarkEctopyComponent,
                RecordMetricPipe,
                RecordKeyboardShortcutPipe,
                DisableOverlayDirective
            ],
            providers: [
                { provide: EditBarUtilService, useClass: EditBarUtilServiceMock },
                { provide: RecordDto, useClass: RecordDtoMock },
                { provide: RecordSessionEditService, useClass: RecordSessionEditServiceMock },
                { provide: RecordNotifier, useClass: RecordNotifierMock }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(RecordMarkEctopyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

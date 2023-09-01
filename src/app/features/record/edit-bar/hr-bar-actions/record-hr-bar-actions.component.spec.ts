import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordHrBarActionsComponent } from './record-hr-bar-actions.component';
import { EditBarUtilService } from '../services/edit-bar-util.service';
import { RecordDto } from '../../services/dtos/record-dto.service';
import { RecordSessionEditService } from '../../services/record-service.service';
import { RecordNotifier } from '../../services/notifiers/record-notifier.service';
import { RecordDtoMock } from 'test/mocks/services/dto/record-dto-mock.service';
import { EditBarUtilServiceMock } from 'test/mocks/services/edit-bar-util-service-mock.service';
import { RecordNotifierMock } from 'test/mocks/services/notifier/record-notifier-mock.service';
import { RecordSessionEditServiceMock } from 'test/mocks/services/record-session-edit-service-mock.service';
import { RecordKeyboardShortcutPipe } from '../../services/pipes/record-keyboard-shortcut.pipe';
import { DisableOverlayDirective } from '../../services/directives/disable-overlay.directive';


describe('RecordHrBarActionsComponent', () => {
    let component: RecordHrBarActionsComponent;
    let fixture: ComponentFixture<RecordHrBarActionsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                RecordHrBarActionsComponent,
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

        fixture = TestBed.createComponent(RecordHrBarActionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

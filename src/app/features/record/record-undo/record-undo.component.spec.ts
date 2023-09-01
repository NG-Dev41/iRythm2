import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { RecordUndoComponent } from './record-undo.component';
import { RecordDto } from '../services/dtos/record-dto.service';
import { RecordDtoMock } from 'test/mocks/services/dto/record-dto-mock.service';
import { DisableOverlayDirective } from '../services/directives/disable-overlay.directive';
import { EcgUndoEditDao } from 'app/modules/ecg/services/daos/ecg-undo-edit/ecg-undo-edit-dao.service';
import { EcgUndoEditDaoMock } from 'test/mocks/services/dao/ecg-undo-edit-dao-mock.service';
import { EcgDaoNotifier } from 'app/modules/ecg/services/notifier/dao/ecg-dao-notifier.service';
import { EcgDaoNotifierMock } from 'test/mocks/services/notifier/ecg-dao-notifier-mock.service';
import { MatDialog } from '@angular/material/dialog';
import { RecordNotifier } from '../services/notifiers/record-notifier.service';
import { RecordNotifierMock } from 'test/mocks/services/notifier/record-notifier-mock.service';
import { MatMenuModule } from '@angular/material/menu';
import { PageNotifier } from 'app/commons/services/notifiers/page-notifier.service';
import { PageNotifierMock } from 'test/mocks/services/notifier/page-notifier-mock.service';


describe('RecordUndoComponent', () => {
    let component: RecordUndoComponent;
    let fixture: ComponentFixture<RecordUndoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                MatIconTestingModule,
                MatIconModule,
                MatMenuModule
            ],
            declarations: [
                RecordUndoComponent,
                DisableOverlayDirective
            ],
            providers: [
                { provide: RecordDto, useClass: RecordDtoMock },
                { provide: EcgUndoEditDao, useClass: EcgUndoEditDaoMock },
                { provide: EcgDaoNotifier, useClass: EcgDaoNotifierMock },
                { provide: MatDialog, useValue: {} },
                { provide: RecordNotifier, useClass: RecordNotifierMock },
                { provide: PageNotifier, useClass: PageNotifierMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(RecordUndoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

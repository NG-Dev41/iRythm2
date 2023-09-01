import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordSidebarService } from 'app/features/record/services/record-sidebar.service';
import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { RecordEditBarComponent } from './record-edit-bar.component';
import { RecordHrBarActionsComponentMock } from 'test/mocks/components/record-hr-bar-actions-mock.component';
import { RecordMarkEctopyComponentMock } from 'test/mocks/components/record-mark-ectopy-mock.component';
import { RecordPaintRhythmsComponentMock } from 'test/mocks/components/record-paint-rhythms-mock.component';
import { RecordDtoMock } from 'test/mocks/services/dto/record-dto-mock.service';
import { RecordSidebarServiceMock } from 'test/mocks/services/record-sidebar-service-mock.service';


describe('RecordEditBarComponent', () => {
    let component: RecordEditBarComponent;
    let fixture: ComponentFixture<RecordEditBarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations:
                [
                    RecordEditBarComponent,
                    RecordHrBarActionsComponentMock,
                    RecordPaintRhythmsComponentMock,
                    RecordMarkEctopyComponentMock
                ],
            providers: [
                { provide: RecordDto, useClass: RecordDtoMock },
                { provide: RecordSidebarService, useClass: RecordSidebarServiceMock }
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RecordEditBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

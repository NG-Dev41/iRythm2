import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatchNotificationTableComponent } from './patch-notification-table.component';
import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { RecordDtoMock } from 'test/mocks/services/dto/record-dto-mock.service';
import { MatTableModule } from '@angular/material/table';

describe('PatchNotificationTableComponent', () => {
    let component: PatchNotificationTableComponent;
    let fixture: ComponentFixture<PatchNotificationTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ MatTableModule ],
            declarations: [PatchNotificationTableComponent],
            providers: [
                { provide: RecordDto, useClass: RecordDtoMock }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PatchNotificationTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

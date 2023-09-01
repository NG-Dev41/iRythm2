import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgingRecordsModalComponent } from './aging-records-modal.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDialogRefMock } from 'test/mocks/services/mat-dialog-ref-mock.service';
import { QueueService } from 'app/features/queue/services/queue.service';
import { UserDto } from 'app/commons/services/dtos/user-dto.service';
import { UserDtoMock } from 'test/mocks/services/dto/user-dto-mock.service';
import { QueueServiceMock } from 'test/mocks/services/queue-mock.service';

describe('AgingRecordsModalComponent', () => {
    let component: AgingRecordsModalComponent;
    let fixture: ComponentFixture<AgingRecordsModalComponent>;

    beforeEach(async() => {
        await TestBed.configureTestingModule({
            imports: [ MatDialogModule ],
            declarations: [AgingRecordsModalComponent],
            providers: [
                { provide: MatDialogRef, useClass: MatDialogRefMock },
                { provide: QueueService, useClass: QueueServiceMock },
                { provide: UserDto, useClass: UserDtoMock }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AgingRecordsModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

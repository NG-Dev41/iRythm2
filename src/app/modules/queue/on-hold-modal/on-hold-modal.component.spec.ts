import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { OnHoldModalComponent } from './on-hold-modal.component';
import { QueueServiceMock } from 'test/mocks/services/queue-mock.service';
import { QueueService } from 'app/features/queue/services/queue.service';
import { QueueDao } from 'app/features/queue/daos/queue-dao.service';
import { QueueDaoMock } from 'test/mocks/services/dao/queue-dao-mock.service';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

describe('OnHoldModalComponent', () => {
    let component: OnHoldModalComponent;
    let fixture: ComponentFixture<OnHoldModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                MatDialogModule,
                RouterTestingModule
            ],
            declarations: [OnHoldModalComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: { data: { title: '', message: '', summary: 'summary' } } },
                { provide: QueueService, useClass: QueueServiceMock },
                { provide: QueueDao, useClass: QueueDaoMock }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(OnHoldModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

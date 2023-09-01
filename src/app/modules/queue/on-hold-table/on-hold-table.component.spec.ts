import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnHoldTableComponent } from './on-hold-table.component';
import { QueueServiceMock } from 'test/mocks/services/queue-mock.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserDto } from 'app/commons/services/dtos/user-dto.service';
import { QueueDao } from 'app/features/queue/daos/queue-dao.service';
import { QueueService } from 'app/features/queue/services/queue.service';
import { QueueDaoMock } from 'test/mocks/services/dao/queue-dao-mock.service';
import { UserDtoMock } from 'test/mocks/services/dto/user-dto-mock.service';
import { MatDialogMock } from 'test/mocks/services/mat-dialog-mock.service';
import { QueueUtils } from '../services/queue-utils.service';

describe('OnHoldTableComponent', () => {
    let component: OnHoldTableComponent;
    let fixture: ComponentFixture<OnHoldTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OnHoldTableComponent],
            providers: [
                { provide: QueueService, useClass: QueueServiceMock },
                { provide: QueueUtils, useValue: {} },
                { provide: MatDialog, useClass: MatDialogMock },
                { provide: Router, useValue: {} },
                { provide: UserDto, useClass: UserDtoMock },
                { provide: QueueDao, useClass: QueueDaoMock },
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(OnHoldTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InProgressTableComponent } from './in-progress-table.component';
import { QueueService } from 'app/features/queue/services/queue.service';
import { QueueServiceMock } from 'test/mocks/services/queue-mock.service';
import { QueueUtils } from '../services/queue-utils.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogMock } from 'test/mocks/services/mat-dialog-mock.service';
import { Router } from '@angular/router';
import { UserDto } from 'app/commons/services/dtos/user-dto.service';
import { UserDtoMock } from 'test/mocks/services/dto/user-dto-mock.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatIconModule } from '@angular/material/icon';

describe('InProgressTableComponent', () => {
    let component: InProgressTableComponent;
    let fixture: ComponentFixture<InProgressTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                MatIconTestingModule,
                MatIconModule,
                MatTooltipModule
            ],
            declarations: [InProgressTableComponent],
            providers: [
                { provide: QueueService, useClass: QueueServiceMock },
                { provide: QueueUtils, useValue: {} },
                { provide: MatDialog, useClass: MatDialogMock },
                { provide: Router, useValue: {} },
                { provide: UserDto, useClass: UserDtoMock }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(InProgressTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

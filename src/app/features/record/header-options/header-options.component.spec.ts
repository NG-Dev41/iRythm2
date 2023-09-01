import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

import { HeaderOptionsComponent } from './header-options.component';
import { QueueDao } from 'app/features/queue/daos/queue-dao.service';
import { MaterialModule } from 'app/modules/material/material.module';
import { RecordDto } from '../services/dtos/record-dto.service';
import { UserDto } from 'app/commons/services/dtos/user-dto.service';
import { UserDtoMock } from 'test/mocks/services/dto/user-dto-mock.service';
import { RecordDtoMock } from 'test/mocks/services/dto/record-dto-mock.service';
import { QueueDaoMock } from 'test/mocks/services/dao/queue-dao-mock.service';
import { MatDialogMock } from 'test/mocks/services/mat-dialog-mock.service';

describe('HeaderMenuEllipsisComponent', () => {
    let component: HeaderOptionsComponent;
    let fixture: ComponentFixture<HeaderOptionsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports:[
                MaterialModule
            ],
            declarations: [HeaderOptionsComponent],
            providers: [ 
                { provide: MatDialog, useClass: MatDialogMock },
                { provide: RecordDto, useClass: RecordDtoMock },
                { provide: QueueDao, useClass: QueueDaoMock },
                { provide: UserDto, useClass: UserDtoMock }
            ] 
        })
            .compileComponents();

        fixture = TestBed.createComponent(HeaderOptionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

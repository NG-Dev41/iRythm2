import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatchNotificationCriteriaComponent } from './patch-notification-criteria.component';
import { PatchNotificationTableComponentMock } from 'test/mocks/components/patch-notification-table-mock.component';
import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { RecordDtoMock } from 'test/mocks/services/dto/record-dto-mock.service';
import { FormatPipe } from 'ngx-date-fns';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatIconModule } from '@angular/material/icon';

describe('PatchNotificationCriteriaComponent', () => {
    let component: PatchNotificationCriteriaComponent;
    let fixture: ComponentFixture<PatchNotificationCriteriaComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ MatIconTestingModule, MatIconModule ],
            declarations: [
                FormatPipe,
                PatchNotificationCriteriaComponent,
                PatchNotificationTableComponentMock
            ],
            providers: [
                { provide: RecordDto, useClass: RecordDtoMock }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PatchNotificationCriteriaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

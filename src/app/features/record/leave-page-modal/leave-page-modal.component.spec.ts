import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { LeavePageModalComponent } from './leave-page-modal.component';
import { MatDialogRefMock } from 'test/mocks/services/mat-dialog-ref-mock.service';

describe('LeavePageModalComponent', () => {
    let component: LeavePageModalComponent;
    let fixture: ComponentFixture<LeavePageModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ MatDialogModule ],
            declarations: [LeavePageModalComponent],
            providers: [ { provide: MatDialogRef, useClass: MatDialogRefMock } ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(LeavePageModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

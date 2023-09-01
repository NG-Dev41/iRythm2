import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveReportModalComponent } from './approve-report-modal.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDialogRefMock } from 'test/mocks/services/mat-dialog-ref-mock.service';

describe('ApproveReportModalComponent', () => {
    let component: ApproveReportModalComponent;
    let dialogRef;
    let fixture: ComponentFixture<ApproveReportModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                MatDialogModule
            ],
            declarations: [ApproveReportModalComponent],
            providers: [ { provide: MatDialogRef, useClass: MatDialogRefMock } ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ApproveReportModalComponent);
        component = fixture.componentInstance;
        dialogRef = fixture.debugElement.injector.get(MatDialogRef);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('approveReport is called', () => {
        it('should call close on dialogRef', () => {
            const dialogRefCloseSpy = jest.spyOn(dialogRef, 'close');

            component.approveReport();

            expect(dialogRefCloseSpy).toHaveBeenCalledWith(true);
        });
    });
});

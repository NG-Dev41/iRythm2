import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDialogRefMock } from 'test/mocks/services/mat-dialog-ref-mock.service';
import { ReportPreviewModalComponent } from './report-preview-modal.component';
import { TranslatePipeMock } from 'test/mocks/pipes/translate-mock.pipe';
import { NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('ReportPreviewModalComponent', () => {
    let component: ReportPreviewModalComponent;
    let dialogRef;
    let fixture: ComponentFixture<ReportPreviewModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                MatDialogModule,
                RouterTestingModule
            ],
            declarations: [
                ReportPreviewModalComponent,
                TranslatePipeMock
            ],
            providers: [ 
                { provide: MatDialogRef, useClass: MatDialogRefMock },
                { provide: MAT_DIALOG_DATA,
                    useValue: {
                        data: {
                            errorList: [{ errorCode: "AF_EPISODE_DURATION_ERROR" }],
                            warningList: [{ errorCode: "MAX_HR_EXCEEDED" }, { errorCode: "AF_BURDEN_ERROR" }]
                        }
                    }
                },
                { provide: Router, useValue: { events: of(new NavigationStart(1, 'test-url')), navigateByUrl: () => { of({}) } } as any as Router }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ReportPreviewModalComponent);
        component = fixture.componentInstance;
        dialogRef = fixture.debugElement.injector.get(MatDialogRef);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('proceedWithReportGeneration is called', () => {
        it('should call close on dialogRef', () => {
            const dialogRefCloseSpy = jest.spyOn(dialogRef, 'close');

            component.proceedWithReportGeneration();

            expect(dialogRefCloseSpy).toHaveBeenCalledWith(true);
        });
    });
    describe('sidebar/modal closing behavior', () => {
        it('should close the modal when a router NavigationStart event occurs', () => {
            const dialogRefCloseSpy = jest.spyOn(dialogRef, 'close');
            (component['router'].events as any) = new BehaviorSubject(
                new NavigationStart(0, 'report-preview')
            );
            component.ngOnInit();

            // Verify that the modal was closed
            expect(dialogRefCloseSpy).toHaveBeenCalled();
        });
    });
});

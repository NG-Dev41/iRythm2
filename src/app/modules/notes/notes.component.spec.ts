import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotesComponent } from './notes.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogMock } from 'test/mocks/services/mat-dialog-mock.service';
import { NotesHistoryDialogComponent } from 'app/modules/notes/notes-history/notes-history-dialog.component';
import { of } from "rxjs";

describe('NotesModalComponent', () => {
    let component: NotesComponent;
    let fixture: ComponentFixture<NotesComponent>;
    let dialog: MatDialog;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NotesComponent],
            providers: [
                { provide: MatDialog, useClass: MatDialogMock }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(NotesComponent);
        dialog = fixture.debugElement.injector.get(MatDialog);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should set dialogConfig', () => {
            component.ngOnInit();
            expect(component.dialogConfig.disableClose).toBe(true);
            expect(component.dialogConfig.data).toStrictEqual({
                serialNumber: component['serialNumber'],
                newNoteNumber: component.newNoteNumber,
                disableClose: true
            });
            expect(component.dialogConfig.panelClass).toBe('modal-standard');
        })
    })

    describe('openDialog', () => {
        it('should open dialog', () => {
            const spyOpen = jest.spyOn(dialog, 'open');
            component.openDialog();
            expect(spyOpen).toHaveBeenCalledWith(NotesHistoryDialogComponent, component.dialogConfig);
        })

        it('should open dialog', () => {
            const dialogRef: any = { afterClosed: () => of(true) };
            const spyOpen = jest.spyOn(dialog, 'open').mockReturnValue(dialogRef);
            component.newNoteNumber = 0;
            component.openDialog();
            dialogRef.afterClosed().subscribe();
            expect(component.newNoteNumber).toBe(1);
        })
    })
});

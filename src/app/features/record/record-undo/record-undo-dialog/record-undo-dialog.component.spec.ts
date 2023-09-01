import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordUndoDialogComponent } from './record-undo-dialog.component';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';


describe('RecordUndoDialogComponent', () => {
    let component: RecordUndoDialogComponent;
    let fixture: ComponentFixture<RecordUndoDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ MatDialogModule ],
            declarations: [RecordUndoDialogComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(RecordUndoDialogComponent);
        component = fixture.componentInstance;
        component.data.undoList = [];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

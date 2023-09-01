import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RecordMdnModalComponent } from './record-mdn-modal.component';
import { ProcessDataDao } from 'app/commons/services/dao/process-data-dao.service';
import { ProcessDataDaoMock } from 'test/mocks/services/dao/process-data-dao-mock.service';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';


describe('MdnModalComponent', () => {
    let component: RecordMdnModalComponent;
    let fixture: ComponentFixture<RecordMdnModalComponent>;
    
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ 
                FormsModule,
                ReactiveFormsModule,
                MatDialogModule
            ],
            declarations: [ RecordMdnModalComponent ],
            providers: [
                FormBuilder,
                { provide: ProcessDataDao, useClass: ProcessDataDaoMock },
                { provide: MAT_DIALOG_DATA, useValue: { data: { title: '', message: '', summary: 'summary' } } }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(RecordMdnModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

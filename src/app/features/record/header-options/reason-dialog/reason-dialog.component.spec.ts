import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReasonDialogComponent } from './reason-dialog.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { QueueDao, QueueAction, IQueueResponse } from 'app/features/queue/daos/queue-dao.service';
import { UserDto } from 'app/commons/services/dtos/user-dto.service';
import { UserDtoMock } from 'test/mocks/services/dto/user-dto-mock.service';
import { QueueDaoMock } from 'test/mocks/services/dao/queue-dao-mock.service';
import { Router } from '@angular/router';
import { RouterMock } from 'test/mocks/services/router-mock.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('ReasonDialogComponent', () => {
    let component: ReasonDialogComponent;
    let fixture: ComponentFixture<ReasonDialogComponent>;
    let queueDao: QueueDao;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, MatDialogModule, MatCheckboxModule, FormsModule, ReactiveFormsModule],
            declarations: [ReasonDialogComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: { data: { serialNumber: '10' } } },
                { provide: QueueDao, useClass: QueueDaoMock },
                { provide: UserDto, useClass: UserDtoMock },
                { provide: Router, useValue: RouterMock },
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ReasonDialogComponent);
        component = fixture.componentInstance;
        queueDao = fixture.debugElement.injector.get(QueueDao);
        router = fixture.debugElement.injector.get(Router);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should init the form group', () => {
            component.ngOnInit();
            expect(component.form).toBeDefined();
            expect(component.form.get('reasonList')).toBeDefined();
        })

        it('should add form control dynamically to each reasonList checkbox', () => {
            component.ngOnInit();
            expect(component.reasonsFormArray.length).toBe(component.reasons.length);
        })
    })

    describe('sendBack', () => {
        it('should call processQueue and navigate to queue on subscribe processQueue', () => {
            const spyNavigate = jest.spyOn(router, 'navigate');
            const spyProcessQueue = jest.spyOn(queueDao, 'processQueue');
            component.ngOnInit();
            component.form.patchValue({ reasonList: [{ isChecked: true }, { isChecked: false }] })
            component.sendBack();
            expect(spyProcessQueue).toHaveBeenCalled();
            expect(spyNavigate).toHaveBeenCalledWith(['/queue']);
        })
    })

    describe('reasonsFormArray', () => {
        it('should return reasonList formArray from form', () => {
            const result = component.reasonsFormArray;
            expect(result).toStrictEqual(component.form.controls.reasonList);
        })
    })
});

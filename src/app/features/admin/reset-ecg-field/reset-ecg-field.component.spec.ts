import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ResetEcgFieldComponent } from './reset-ecg-field.component';
import { EcgResetDao } from '../services/daos/ecg-reset.dao';
import { EcgResetDaoMock } from 'test/mocks/services/dao/ecg-reset-dao-mock.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { of, Observable, throwError } from "rxjs";
import { IAdminMessageType } from '../admin-form-message/admin-form-message.component';

describe('ResetEcgFieldComponent', () => {
    let component: ResetEcgFieldComponent;
    let ecgResetDao: EcgResetDao;
    let fixture: ComponentFixture<ResetEcgFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                FormsModule,
                MatFormFieldModule,
                MatInputModule
            ],
            declarations: [ResetEcgFieldComponent],
            providers: [
                provideAnimations(),
                { provide: EcgResetDao, useClass: EcgResetDaoMock }
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ResetEcgFieldComponent);
        ecgResetDao = fixture.debugElement.injector.get(EcgResetDao);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('postEcgReset', () => {
        it('test responseMessageType and responseMessage when response has no errors', () => {
            const response: any = { errorInfo: { hasError: false } };
            const spyResetEcg = jest.spyOn(ecgResetDao, 'resetEcg').mockReturnValue(of(response) as any);
            const ecgSerialNumber = '10';
            component['postEcgReset'](ecgSerialNumber);
            expect(spyResetEcg).toHaveBeenCalledWith({ ecgSerialNumber: ecgSerialNumber });
            expect(component.responseData).toBe(response);
            expect(response.errorInfo.hasError).toBe(false);
            expect(component.responseMessageType).toBe(IAdminMessageType.SUCCESS);
            expect(component.responseMessage).toBe('ECG Reset request successful');
        })

        it('test responseMessageType and responseMessage when response has errors', () => {
            const response: any = { errorInfo: { hasError: true, errorRecordList: [{ errorCode: null }] } };
            const spyResetEcg = jest.spyOn(ecgResetDao, 'resetEcg').mockReturnValue(of(response) as any);
            const ecgSerialNumber = '10';
            component['postEcgReset'](ecgSerialNumber);
            expect(spyResetEcg).toHaveBeenCalledWith({ ecgSerialNumber: ecgSerialNumber });
            expect(component.responseData).toBe(response);
            expect(response.errorInfo.hasError).toBe(true);
            expect(component.responseMessageType).toBe(IAdminMessageType.ERROR);
            expect(component.responseMessage).toBe(`Error: ${response.errorInfo.errorRecordList[0].errorCode}`);
        })

        it('test responseMessageType and responseMessage when response has errors and errorCode is INVALID_DEVICE_STATE', () => {
            const response: any = { errorInfo: { hasError: true, errorRecordList: [{ errorCode: component['INVALID_DEVICE_STATE'], throwableMessage: 'error' }] } };
            const spyResetEcg = jest.spyOn(ecgResetDao, 'resetEcg').mockReturnValue(of(response) as any);
            const ecgSerialNumber = '10';
            component['postEcgReset'](ecgSerialNumber);
            expect(spyResetEcg).toHaveBeenCalledWith({ ecgSerialNumber: ecgSerialNumber });
            expect(component.responseData).toBe(response);
            expect(response.errorInfo.hasError).toBe(true);
            expect(component.responseMessageType).toBe(IAdminMessageType.ERROR);
            expect(component.responseMessage).toBe(`Error: ${component['INVALID_DEVICE_STATE']} -> ${response.errorInfo.errorRecordList[0].throwableMessage.split("=")[1]}`);
        })

        it('test responseMessageType and responseMessage when response has errors and errorCode is INVALID_DEVICE_STATE', () => {
            const error: any = { message: 'Error' };
            const spyResetEcg = jest.spyOn(ecgResetDao, 'resetEcg').mockReturnValue(throwError(error));
            const ecgSerialNumber = '10';
            component['postEcgReset'](ecgSerialNumber);
            expect(spyResetEcg).toHaveBeenCalledWith({ ecgSerialNumber: ecgSerialNumber });
            expect(component.responseMessageType).toBe(IAdminMessageType.ERROR);
            expect(component.responseMessage).toBe(`Error: ${error.message}`);
        })
    })

    describe('resetEcg', () => {
        it('should call postEcgReset method', () => {
            const spyResetEcg = jest.spyOn(component as any, 'postEcgReset');
            const formValue: any = { value: { serialNumber: 10 } }
            component.resetEcg(formValue);
            expect(spyResetEcg).toHaveBeenCalledWith(formValue.value.serialNumber);
        })
    })

    describe('resetMessage', () => {
        it('should responseMessage and responseMessageType value', () => {
            component.resetMessage();
            expect(component.responseMessage).toBe("");
            expect(component.responseMessageType).toBeNull();
        })
    })
});

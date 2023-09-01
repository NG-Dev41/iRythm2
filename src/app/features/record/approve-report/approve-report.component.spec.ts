import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { of } from "rxjs";

import { MatToolbarModule } from "@angular/material/toolbar";
import { HeaderNotificationsComponentMock } from "test/mocks/components/header-notifications-mock.component";
import { HeaderOptionsComponentMock } from "test/mocks/components/header-options-mock.component";
import { RecordFindingsComponentMock } from "test/mocks/components/record-findings-mock.component";
import { RecordPatientInfoComponentMock } from "test/mocks/components/record-patient-info-mock.component";
import { RecordSubNavigationComponentMock } from "test/mocks/components/record-sub-navigation-mock.component";
import { RecordUndoComponentMock } from "test/mocks/components/record-undo-mock.component";
import { RecordLayoutToggleComponentMock } from "test/mocks/components/record-layout-toggle-mock.component";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { ProcessReportDao, ReportActionType } from "app/commons/services/dao/process-report-dao.service";
import { UserDto } from "app/commons/services/dtos/user-dto.service";
import { ProcessReportDaoMock } from "test/mocks/services/dao/process-report-dao-mock.service";
import { RecordDtoMock } from "test/mocks/services/dto/record-dto-mock.service";
import { UserDtoMock } from "test/mocks/services/dto/user-dto-mock.service";
import { RecordDto } from "../services/dtos/record-dto.service";
import { ApproveReportModalComponent } from "./approve-report-modal/approve-report-modal/approve-report-modal.component";
import { ApproveReportComponent } from "./approve-report.component";
import { MatDialogMock } from "test/mocks/services/mat-dialog-mock.service";
import { MatIconModule } from "@angular/material/icon";


describe('ApproveReportComponent', () => {
    let component: ApproveReportComponent;
    let fixture: ComponentFixture<ApproveReportComponent>;
    let dialog: MatDialog;
    let reportDao: ProcessReportDao;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                MatToolbarModule,
                MatDialogModule,
                MatIconModule
            ],
            declarations:
                [
                    ApproveReportComponent,
                    RecordPatientInfoComponentMock,
                    HeaderNotificationsComponentMock,
                    RecordFindingsComponentMock,
                    RecordUndoComponentMock,
                    HeaderOptionsComponentMock,
                    RecordSubNavigationComponentMock,
                    RecordLayoutToggleComponentMock
                ],
            providers: [
                { provide: ActivatedRoute, useValue: { params: of([{}]) } },
                { provide: RecordDto, useClass: RecordDtoMock },
                { provide: MatDialog, useClass: MatDialogMock },
                { provide: UserDto, useClass: UserDtoMock },
                { provide: ProcessReportDao, useClass: ProcessReportDaoMock },
                { provide: Router, useValue: { navigate: () => {}, createUrlTree: () => {}, serializeUrl: () => {} } }
            ]        
        })
            .compileComponents();
    });

    beforeEach(() => {
        Object.defineProperty(window, 'open', {
            configurable: true,
            value: jest.fn(),
        });
        fixture = TestBed.createComponent(ApproveReportComponent);
        component = fixture.componentInstance;
        dialog = fixture.debugElement.injector.get(MatDialog);
        reportDao = fixture.debugElement.injector.get(ProcessReportDao)
        router = fixture.debugElement.injector.get(Router);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('openRecordApproveModal is called', () => {
        it('should open the approve report modal', () => {
            const dialogRefSpy = jest.spyOn(dialog, 'open');

            component.openRecordApproveModal();

            expect(dialogRefSpy).toHaveBeenCalledWith(ApproveReportModalComponent, {
                panelClass: ['modal-standard', 'modal-content-no-scroll'],
            });
        });

        it('should process report request on approve confirmation', () => {
            const processReportRequestSpy = jest.spyOn(reportDao, 'processReportRequest');

            component.openRecordApproveModal();

            expect(processReportRequestSpy).toHaveBeenCalledWith({
                ecgSerialNumber: component['recordDto'].serialNumber,
                reportAction: ReportActionType.APPROVE,
                user: component['user'].id,
            });
        });

        it('should navigate to the queue when no error occurs', () => {
            jest.spyOn(reportDao, 'processReportRequest').mockReturnValue(of({ reportInfo: { errorList: [] } } as any));
            const navigateSpy = jest.spyOn(router, 'navigate');

            component.openRecordApproveModal();

            expect(navigateSpy).toHaveBeenCalledWith(['/queue'], { queryParams: { fromSerial: component['recordDto'].serialNumber } });
        });

        //Fill out when error handling story is implemented
        xit('should handle errors', () => {
        });
    });
    describe('openPdfNewTab is called', () => {
        it('should open the pdf in a new tab', () => {
            const recordDto = { reportUrl: 'http://example.com/pdf-report.pdf', serialNumber: '12345' };
            const spyCreateUrlTree = jest.spyOn(router, 'createUrlTree').mockReturnValue({} as any);
            const spySerializeUrl = jest.spyOn(router, 'serializeUrl').mockReturnValue('http://example.com/pdf-view/12345');
            const windowOpenSpy = jest.spyOn(window, 'open');

            component['recordDto'] = recordDto as any as RecordDto;
            component.openPdfNewTab();
        
            expect(spyCreateUrlTree).toHaveBeenCalledWith(['pdf-view', '12345'], { queryParams: { reportUrl: encodeURI(recordDto.reportUrl) } });
            expect(spySerializeUrl).toHaveBeenCalled();
            expect(windowOpenSpy).toHaveBeenCalledWith('http://example.com/pdf-view/12345', '_blank');
          });
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordReportPreviewComponent } from './record-report-preview.component';
import { RecordDtoMock } from 'test/mocks/services/dto/record-dto-mock.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProcessDataDaoMock } from 'test/mocks/services/dao/process-data-dao-mock.service';
import { EcgEditDaoMock } from 'test/mocks/services/dao/ecg-edit-dao-mock.service';
import { IProcessReportResponse, IReportError, ProcessReportDao, ReportActionType } from 'app/commons/services/dao/process-report-dao.service';
import { ProcessReportDaoMock } from 'test/mocks/services/dao/process-report-dao-mock.service';
import { UserDtoMock } from 'test/mocks/services/dto/user-dto-mock.service';
import { TranslateServiceMock } from 'test/mocks/services/translation/translate-mock.service';
import { RecordDto } from '../services/dtos/record-dto.service';
import { FindingActionsType, IProcessDataResponse, ProcessDataDao } from 'app/commons/services/dao/process-data-dao.service';
import { EcgEditDao } from 'app/modules/ecg/services/daos/ecg-edit/ecg-edit-dao.service';
import { UserDto } from 'app/commons/services/dtos/user-dto.service';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { IEcgEditResponse } from 'app/modules/ecg/interfaces';
import { EcgRhythmTypeEdit } from 'app/modules/ecg/enums';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogMock } from 'test/mocks/services/mat-dialog-mock.service';
import { RecordNotifier } from '../services/notifiers/record-notifier.service';
import { RecordNotifierMock } from 'test/mocks/services/notifier/record-notifier-mock.service';
import { RecordChannelKey, RecordReportChannelAction } from '../services/enums';
import { TranslatePipeMock } from 'test/mocks/pipes/translate-mock.pipe';
import { LoadingSpinnerComponentMock } from 'test/mocks/components/loading-spinner-mock.component';
import { ErrorCode } from 'app/commons/enums/error-codes.enum';
import { RhythmType } from 'app/commons/constants/rhythms.const';
import { RecordNavigationKey } from '../services/enums/record-navigation.enum';

describe('RecordReportPreviewComponent', () => {
    let component: RecordReportPreviewComponent;
    let fixture: ComponentFixture<RecordReportPreviewComponent>;  
    let processDataDao: ProcessDataDao;  
    let translateService: TranslateService;
    let editDao: EcgEditDao;
    let processReportDao: ProcessReportDao;
    let recordNotifier: RecordNotifier;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                RecordReportPreviewComponent,
                TranslatePipeMock,
                LoadingSpinnerComponentMock
            ],
            imports: [HttpClientTestingModule],
            providers: [
                { provide: RecordDto, useClass: RecordDtoMock },
                { provide: ProcessDataDao, useClass: ProcessDataDaoMock },
                { provide: EcgEditDao, useClass: EcgEditDaoMock },
                { provide: ProcessReportDao, useClass: ProcessReportDaoMock },
                { provide: UserDto, useClass: UserDtoMock },
                { provide: DomSanitizer, useValue: {bypassSecurityTrustResourceUrl: ( value ) => { return value; }} },
                { provide: TranslateService, useClass: TranslateServiceMock },
                { provide: MatDialog, useClass: MatDialogMock },
                { provide: RecordNotifier, useClass: RecordNotifierMock }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RecordReportPreviewComponent);
        component = fixture.componentInstance;

        processDataDao = fixture.debugElement.injector.get(ProcessDataDao);
        translateService = fixture.debugElement.injector.get(TranslateService);
        editDao = fixture.debugElement.injector.get(EcgEditDao);
        processReportDao = fixture.debugElement.injector.get(ProcessReportDao);
        recordNotifier = fixture.debugElement.injector.get(RecordNotifier);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {

        it('should request findings', () => {
            const obtainFindingsSpy = jest.spyOn(processDataDao, 'processDataRequest').mockReturnValue(of({} as IProcessDataResponse));
            component.ngOnInit();

            expect(obtainFindingsSpy).toHaveBeenCalled();
            expect(obtainFindingsSpy).toHaveBeenCalledWith({ ecgSerialNumber: 'UNIT_TEST', findingsRequest: { findingRequestItemList: [{ findingsActionType: FindingActionsType.OBTAIN_FINDINGS }] }});
        });

        it('should call translate with all findings, concatenate results and call processDataDao', () => {
            // chaining mockReturnValueOnce will allow us to change the returned value
            // first call, first chain; second call, second chain etc.
            const obtainFindingsSpy = jest.spyOn(processDataDao, 'processDataRequest').mockReturnValueOnce(of({findingsResponse: { reportFindings: { findingList: [{key: 'test'}] }}} as IProcessDataResponse))
                                                                                      .mockReturnValueOnce(of({} as IProcessDataResponse));
            const translateSpy = jest.spyOn(translateService, 'get').mockReturnValue(of({unit: 'test'}));
            
            component.ngOnInit();
            
            expect(obtainFindingsSpy).toHaveBeenCalledTimes(2);
            expect(translateSpy).toHaveBeenCalled();
            expect(translateSpy).toHaveBeenCalledWith([`${component['AUTO_FINDINGS_TRANSLATE_PREFIX']}test`]);
        });

        it('should make call to generate addtional strips after pushing concatenated findings to server ', () => {
            const obtainFindingsSpy = jest.spyOn(processDataDao, 'processDataRequest').mockReturnValueOnce(of({findingsResponse: { reportFindings: { findingList: [{key: 'test'}] }}} as IProcessDataResponse))
                                                                                      .mockReturnValueOnce(of({} as IProcessDataResponse));
            const translateSpy = jest.spyOn(translateService, 'get').mockReturnValue(of({unit: 'test'}));
            const additionalStripsSpy = jest.spyOn(editDao, 'edit').mockReturnValue(of({} as IEcgEditResponse));
            
            component.ngOnInit();
            
            expect(obtainFindingsSpy).toHaveBeenCalledTimes(2);
            expect(translateSpy).toHaveBeenCalled();
            expect(additionalStripsSpy).toHaveBeenCalled();
            expect(additionalStripsSpy).toHaveBeenCalledWith({ ecgSerialNumber: 'UNIT_TEST', ecgRangeEditList: [{ rhythmTypeEdit: EcgRhythmTypeEdit.ADDITIONAL_STRIP_AUTO_CREATE, paintModeEdit: false }] } );
        });

        it('should make call to preview deidentified report if no errors or warnings are present', () => {
            const obtainFindingsSpy = jest.spyOn(processDataDao, 'processDataRequest').mockReturnValueOnce(of({findingsResponse: { reportFindings: { findingList: [{key: 'test'}] }}} as IProcessDataResponse))
                                                                                      .mockReturnValueOnce(of({} as IProcessDataResponse));
            const translateSpy = jest.spyOn(translateService, 'get').mockReturnValue(of({unit: 'test'}));
            const additionalStripsSpy = jest.spyOn(editDao, 'edit').mockReturnValue(of({} as IEcgEditResponse));
            const processReportSpy = jest.spyOn(processReportDao, 'processReportRequest').mockReturnValue(of({ reportInfo: {url: 'unit_test'} } as IProcessReportResponse));
            
            component.ngOnInit();

            expect(obtainFindingsSpy).toHaveBeenCalledTimes(2);
            expect(translateSpy).toHaveBeenCalled();
            expect(additionalStripsSpy).toHaveBeenCalled();
            expect(processReportSpy).toHaveBeenCalledWith({ ecgSerialNumber: 'UNIT_TEST', reportAction: ReportActionType.PREVIEW, user: 'traceqa_queue@irhythmtech.com'});
            expect(component['recordDto'].reportUrl).toBe('unit_test');
        });

        it('should send a REPORT_GENERATED action via the recordNotifier if no errors or warnings are present', () => {
            jest.spyOn(processDataDao, 'processDataRequest').mockReturnValueOnce(of({findingsResponse: { reportFindings: { findingList: [{key: 'test'}] }}} as IProcessDataResponse))
                                                                                      .mockReturnValueOnce(of({} as IProcessDataResponse));
            jest.spyOn(translateService, 'get').mockReturnValue(of({unit: 'test'}));
            jest.spyOn(editDao, 'edit').mockReturnValue(of({} as IEcgEditResponse));
            jest.spyOn(processReportDao, 'processReportRequest').mockReturnValue(of({ reportInfo: {url: 'unit_test'} } as IProcessReportResponse));
            const recordNotifierSendSpy = jest.spyOn(recordNotifier, 'send');

            component.ngOnInit();

            expect(recordNotifierSendSpy).toHaveBeenCalledWith(RecordChannelKey.REPORT_ACTION, { action: RecordReportChannelAction.REPORT_GENERATED });
        });

        it('should open the error/warning list dialog if errorList or warningList is populated and call the report endpoint again w/ override flags if modal passes back true', () => {
            jest.spyOn(processDataDao, 'processDataRequest').mockReturnValueOnce(of({ findingsResponse: { reportFindings: { findingList: [{ key: 'test' }] } } } as IProcessDataResponse))
                .mockReturnValueOnce(of({} as IProcessDataResponse));
            jest.spyOn(translateService, 'get').mockReturnValue(of({ unit: 'test' }));
            jest.spyOn(editDao, 'edit').mockReturnValue(of({} as IEcgEditResponse));
            const processReportSpy = jest.spyOn(processReportDao, 'processReportRequest').mockReturnValue(of({
                reportInfo: {
                    url: 'unit_test',
                    warningList: [{ errorCode: ErrorCode.MAX_HR_EXCEEDED }, { errorCode: ErrorCode.AF_BURDEN_ERROR }]
                }
            } as IProcessReportResponse));

            const dialogRefOpenSpy = jest.spyOn(component['dialog'], 'open').mockReturnValueOnce({ afterClosed: () => of(true) } as any);

            component.ngOnInit();

            expect(dialogRefOpenSpy).toHaveBeenCalled();
            expect(processReportSpy).toHaveBeenCalledWith({ ecgSerialNumber: 'UNIT_TEST', reportAction: ReportActionType.PREVIEW, user: 'traceqa_queue@irhythmtech.com', reportWarningIgnoreList: ["ALL"] });
        });
    });

    describe('populateNavQualityChecks', () => {
        it('should call recordNotifier.send', () => {
            const errorList: IReportError[] = [
                {
                    errorCode: ErrorCode.ADDITIONAL_STRIPS_NOT_FOUND,
                    errorValueMap: {},
                } as any
            ];

            const warningList: IReportError[] = [
                {
                    errorCode: ErrorCode.MDN_PRIORITY_ERROR,
                    errorValueMap: {},
                } as any
            ];

            const recordSendSpy = jest.spyOn(component['recordNotifier'], 'send');

            component['populateNavQualityChecks'](errorList, warningList);

            expect(recordSendSpy).toHaveBeenCalledWith(
                RecordChannelKey.REPORT_ACTION,
                {
                    qualityCheckErrors: [RecordNavigationKey.REPORT_PREP],
                    qualityCheckWarnings: [RecordNavigationKey.REPORT_PREP],
                    action: RecordReportChannelAction.REPORT_QUALITY_CHECK_FAILURE
                })
        });
    });

    describe('getNavLocations', () => {
        it('should return the correct navigation locations for an error', () => {
            const errorList: IReportError[] = [
                {
                    errorCode: ErrorCode.VT_AVG_HR_LOW_ERROR,
                    errorValueMap: {},
                } as any
            ];

            const result = component['getNavLocations'](errorList);

            // Expectations
            expect(result).toEqual([RhythmType.VT]);
        });
    });
});

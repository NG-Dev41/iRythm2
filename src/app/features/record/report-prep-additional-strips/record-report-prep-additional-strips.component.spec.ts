import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordReportPrepPreliminaryFindingsComponent } from './record-report-prep-preliminary-findings.component'
import { RecordDtoMock } from 'test/mocks/services/dto/record-dto-mock.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProcessDataDaoMock } from 'test/mocks/services/dao/process-data-dao-mock.service';
import { EcgEditDaoMock } from 'test/mocks/services/dao/ecg-edit-dao-mock.service';
import { IProcessReportResponse, ReportActionType } from 'app/commons/services/dao/process-report-dao.service';
import { ProcessReportDaoMock } from 'test/mocks/services/dao/process-report-dao-mock.service';
import { UserDtoMock } from 'test/mocks/services/dto/user-dto-mock.service';
import { TranslateServiceMock } from 'test/mocks/services/translation/translate-mock.service';
import { RecordDto } from '../services/dtos/record-dto.service';
import { FindingActionsType, IProcessDataResponse, ProcessDataDao } from 'app/commons/services/dao/process-data-dao.service';
import { UserDto } from 'app/commons/services/dtos/user-dto.service';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { IEcgEditResponse } from 'app/modules/ecg/interfaces';
import { EcgRhythmTypeEdit } from 'app/modules/ecg/enums';

describe('RecordReportPrepPreliminaryFindingsComponent', () => {
    let component: RecordReportPrepPreliminaryFindingsComponent;
    let fixture: ComponentFixture<RecordReportPrepPreliminaryFindingsComponent>;
    let processDataDao: ProcessDataDao;
    let translateService: TranslateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                RecordReportPrepPreliminaryFindingsComponent
            ],
            imports: [HttpClientTestingModule],
            providers: [
                { provide: RecordDto, useClass: RecordDtoMock },
                { provide: ProcessDataDao, useClass: ProcessDataDaoMock },
                { provide: UserDto, useClass: UserDtoMock },
                { provide: TranslateService, useClass: TranslateServiceMock }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RecordReportPrepPreliminaryFindingsComponent);
        component = fixture.componentInstance;

        processDataDao = fixture.debugElement.injector.get(ProcessDataDao);
        translateService = fixture.debugElement.injector.get(TranslateService);

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

            expect(obtainFindingsSpy).toHaveBeenCalled();
            expect(translateSpy).toHaveBeenCalled();
            expect(translateSpy).toHaveBeenCalledWith(`${component['FINDINGS_TRANSLATE_PREFIX']}`);
        });
    });
});

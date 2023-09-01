import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { RecordReportPrepPreliminaryFindingsComponent } from './record-report-prep-preliminary-findings.component';
import { RecordDtoMock } from 'test/mocks/services/dto/record-dto-mock.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RecordDto } from '../services/dtos/record-dto.service';
import { of } from 'rxjs';
import { retrieveFindingsAction } from 'app/store/actions';
import { Store} from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from '../../../../test/mocks/services/translation/translate-mock.service';
import { ChangeDetectorRef } from '@angular/core';
import { FindingsType } from 'app/commons/services/dao/process-data-dao.service';

describe('RecordReportPrepPreliminaryFindingsComponent', () => {
    let component: RecordReportPrepPreliminaryFindingsComponent;
    let fixture: ComponentFixture<RecordReportPrepPreliminaryFindingsComponent>;
    let cdRef: ChangeDetectorRef;
    let storeService: Store;
    const mockStoreService = { dispatch: jest.fn(), pipe: () => of('')};

    beforeEach(() => {
        void TestBed.configureTestingModule({
            declarations: [
                RecordReportPrepPreliminaryFindingsComponent
            ],
            imports: [HttpClientTestingModule],
            providers: [
                { provide: RecordDto, useClass: RecordDtoMock },
                { provide: Store, useValue: mockStoreService },
	            { provide: TranslateService, useClass: TranslateServiceMock}
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RecordReportPrepPreliminaryFindingsComponent);
        component = fixture.componentInstance;

        storeService = fixture.debugElement.injector.get(Store) as Store;
        cdRef = fixture.debugElement.injector.get(ChangeDetectorRef) as ChangeDetectorRef;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should dispatch ngrx "retrieveFindings Action"', () => {
            const retrieveFindingsSpy = jest.spyOn(storeService, 'dispatch');
            expect(retrieveFindingsSpy).toHaveBeenCalled();
            expect(retrieveFindingsSpy).toHaveBeenCalledWith(retrieveFindingsAction({ serialNumber: 'UNIT_TEST' }));
        });
    });

    describe('_filterUserFindings', () => {
        it('should filter user findings', () => {
            const [VALUE_1, VALUE_2, VALUE_3] = ['a', 'b', 'c'];

            const userFindings = [
                {key: '1', value: VALUE_1},
                {key: '2', value: VALUE_2},
                {key: '3', value: VALUE_3}
            ];
            component.possibleUserFindings = userFindings;
            component.currentFindings = [];
            const filteredFindings = component.filterUserFindings('b').map(finding => finding.value);
            expect(filteredFindings.includes(VALUE_1)).toBeFalsy();
            expect(filteredFindings.includes(VALUE_2)).toBeTruthy();
            expect(filteredFindings.includes(VALUE_3)).toBeFalsy();
        });

        it('should filter out ALL user findings', () => {
            const [VALUE_1, VALUE_2, VALUE_3] = ['a', 'b', 'c'];

            const userFindings = [
                {key: '1', value: VALUE_1},
                {key: '2', value: VALUE_2},
                {key: '3', value: VALUE_3}
            ];
            component.possibleUserFindings = userFindings;
            component.currentFindings = [];
            const filteredFindings = component.filterUserFindings('asdasdasdasdasdasdasd').map(finding => finding.value);
            expect(filteredFindings.includes(VALUE_1)).toBeFalsy();
            expect(filteredFindings.includes(VALUE_2)).toBeFalsy();
            expect(filteredFindings.includes(VALUE_3)).toBeFalsy();
        });

        it('should filter out part of a word', () => {
            const [VALUE_1, VALUE_2, VALUE_3] = ['aaa', 'aab', 'caa'];

            const userFindings = [
                {key: '1', value: VALUE_1},
                {key: '2', value: VALUE_2},
                {key: '3', value: VALUE_3}
            ];
            component.possibleUserFindings = userFindings;
            component.currentFindings = [];
            const filteredFindings = component.filterUserFindings('aa').map(finding => finding.value);
            expect(filteredFindings.includes(VALUE_1)).toBeTruthy();
            expect(filteredFindings.includes(VALUE_2)).toBeTruthy();
            expect(filteredFindings.includes(VALUE_3)).toBeFalsy();
        });

        it('include all words when search bar is blank', () => {
            const [VALUE_1, VALUE_2, VALUE_3] = ['a', 'b', 'c'];

            const userFindings = [
                {key: '1', value: VALUE_1},
                {key: '2', value: VALUE_2},
                {key: '3', value: VALUE_3}
            ];
            component.possibleUserFindings = userFindings;
            component.currentFindings = [];
            const filteredFindings = component.filterUserFindings('').map(finding => finding.value);
            expect(filteredFindings.includes(VALUE_1)).toBeTruthy();
            expect(filteredFindings.includes(VALUE_2)).toBeTruthy();
            expect(filteredFindings.includes(VALUE_3)).toBeTruthy();
        });

        it('should filter for whole words', () => {
            const [VALUE_1, VALUE_2, VALUE_3] = ['aaa', 'aab', 'aac'];

            const userFindings = [
                {key: '1', value: VALUE_1},
                {key: '2', value: VALUE_2},
                {key: '3', value: VALUE_3}
            ];
            component.possibleUserFindings = userFindings;
            component.currentFindings = [];
            const filteredFindings = component.filterUserFindings('aaa').map(finding => finding.value);
            expect(filteredFindings.includes(VALUE_1)).toBeTruthy();
            expect(filteredFindings.includes(VALUE_2)).toBeFalsy();
            expect(filteredFindings.includes(VALUE_3)).toBeFalsy();
        });

        it('should filter when matching some words of a sentence', () => {
            const [VALUE_1, VALUE_2, VALUE_3] = ['one two three', 'four five six', 'one two six'];

            const userFindings = [
                {key: '1', value: VALUE_1},
                {key: '2', value: VALUE_2},
                {key: '3', value: VALUE_3}
            ];
            component.possibleUserFindings = userFindings;
            component.currentFindings = [];
            const filteredFindings = component.filterUserFindings('one three').map(finding => finding.value);
            expect(filteredFindings.includes(VALUE_1)).toBeTruthy();
            expect(filteredFindings.includes(VALUE_2)).toBeFalsy();
            expect(filteredFindings.includes(VALUE_3)).toBeFalsy();
        });

        it('should filter when too many words were entered', () => {
            const [VALUE_1, VALUE_2, VALUE_3] = ['one two three', 'four five six', 'one two six'];

            const userFindings = [
                {key: '1', value: VALUE_1},
                {key: '2', value: VALUE_2},
                {key: '3', value: VALUE_3}
            ];
            component.possibleUserFindings = userFindings;
            component.currentFindings = [];
            const filteredFindings = component.filterUserFindings('one two three four five six').map(finding => finding.value);
            expect(filteredFindings.includes(VALUE_1)).toBeFalsy();
            expect(filteredFindings.includes(VALUE_2)).toBeFalsy();
            expect(filteredFindings.includes(VALUE_3)).toBeFalsy();
        });
    });

    describe('clean up input', () => {
        it('should not clean up good input', () => {
            const INPUT_VALUE = 'This is a clean sentence.';
            const EXPECTED_OUTPUT = INPUT_VALUE;
            const OUTPUT_VALUE = component.cleanUpInputValue(INPUT_VALUE);
            expect(OUTPUT_VALUE).toBe(EXPECTED_OUTPUT);
        });

	    it('should trim extra spaces', () => {
		    const INPUT_VALUE = '            This is a clean sentence.                    ';
		    const EXPECTED_OUTPUT = 'This is a clean sentence.';
		    const OUTPUT_VALUE = component.cleanUpInputValue(INPUT_VALUE);
		    expect(OUTPUT_VALUE).toBe(EXPECTED_OUTPUT);
	    });

        it('should clean up multiple spaces in middle of sentence', () => {
            const INPUT_VALUE = 'This              is             a         clean          sentence.';
            const EXPECTED_OUTPUT = 'This is a clean sentence.';
            const OUTPUT_VALUE = component.cleanUpInputValue(INPUT_VALUE);
            expect(OUTPUT_VALUE).toBe(EXPECTED_OUTPUT);
        });

	    it('should Remove new lines', () => {
		    const INPUT_VALUE = 'This is a \n clean sentence.';
		    const EXPECTED_OUTPUT = 'This is a clean sentence.';
		    const OUTPUT_VALUE = component.cleanUpInputValue(INPUT_VALUE);
		    expect(OUTPUT_VALUE).toBe(EXPECTED_OUTPUT);
	    });

        it('should remove multiple spaces and new lines in a sentence', () => {
            const INPUT_VALUE = '\n\n\n\n    \n\n\n\n     \n   \n\n  This \n\n\n\n is a \n clean         \n   sentence.             \n';
            const EXPECTED_OUTPUT = 'This is a clean sentence.';
            const OUTPUT_VALUE = component.cleanUpInputValue(INPUT_VALUE);
            expect(OUTPUT_VALUE).toBe(EXPECTED_OUTPUT);
        });
    });

    describe('setEditable', () => {
        beforeEach(() => {
            let map = new Map<string, boolean>([
                ['ud1', false],
                ['ud2', false],
                ['ud3', false]
            ]);
            component.isEditableMap = map;
        });

        it('does nothing if findingsType is other than USER_DEFINED', () => {
            const cdRefSpy = jest.spyOn(cdRef, 'detectChanges');
            const setFocusSpy = jest.spyOn(component as any, 'setFocus');
            component.setEditable('key', true, FindingsType.AUTO_GENERATED);
            expect(cdRefSpy).not.toHaveBeenCalled();
            expect(setFocusSpy).not.toHaveBeenCalled();
        });

        it('sets isEditable in the isEditableMap for key passed in, calls detectChanges manually, and calls setFocus with element dblclicked', () => {
            const cdRefSpy = jest.spyOn(cdRef, 'detectChanges');
            const setFocusSpy = jest.spyOn(component as any, 'setFocus').mockImplementation(() => {});
            component.setEditable('ud1', true, FindingsType.USER_DEFINED);
            expect(component.isEditableMap.get('ud1')).toBe(true);
            expect(cdRefSpy).toHaveBeenCalled();
            expect(setFocusSpy).toHaveBeenCalled();
        });
    });

    describe('setFocus', () => {
        it('sets the selectionRange as the length of the value and calls focus', () => {
            const elementRef = { nativeElement: {value: 'Unit Test', setSelectionRange: () => {}, focus: () => {}} } as any as ElementRef<HTMLTextAreaElement>;
            const setSelectionSpy = jest.spyOn(elementRef.nativeElement, 'setSelectionRange');
            const focusSpy = jest.spyOn(elementRef.nativeElement, 'focus');
            (component as any).setFocus(elementRef);
            expect(setSelectionSpy).toHaveBeenCalled();
            expect(focusSpy).toHaveBeenCalled();
        });
    });
});

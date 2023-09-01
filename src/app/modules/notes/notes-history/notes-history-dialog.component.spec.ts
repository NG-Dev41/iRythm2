import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotesHistoryDialogComponent } from './notes-history-dialog.component';
import { MatDialogRefMock } from 'test/mocks/services/mat-dialog-ref-mock.service';
import { NotesService, INotesConfig } from 'app/modules/notes/service/notes.service';
import { NotesServiceMock } from "test/mocks/services/notes-mock.service";
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from "rxjs";
import {
	INote,
	IProcessDataRequest,
	IProcessDataResponse,
	ProcessDataDao,
	RequestTypeEnum
} from 'app/commons/services/dao/process-data-dao.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('NotesHistoryDialogComponent', () => {
	let component: NotesHistoryDialogComponent;
	let fixture: ComponentFixture<NotesHistoryDialogComponent>;
	let matDialogRef: MatDialogRef<any, any>;
	let notesService: NotesService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [BrowserAnimationsModule,
				MatDialogModule,
				HttpClientTestingModule,
				FormsModule,
				ReactiveFormsModule,
				MatFormFieldModule,
				MatInputModule,
				MatDividerModule
			],
			declarations: [NotesHistoryDialogComponent],
			providers: [
				{ provide: MatDialogRef, useClass: MatDialogRefMock },
				{ provide: NotesService, useClass: NotesServiceMock },
				{ provide: MAT_DIALOG_DATA, useValue: { data: { serialNumber: '10', newNoteNumber: 2 } } },
			]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(NotesHistoryDialogComponent);
		matDialogRef = fixture.debugElement.injector.get(MatDialogRef);
		notesService = fixture.debugElement.injector.get(NotesService);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe("ngOnInit", () => {
		it("should set ecgSerialNumber and newNotesNumber and form", () => {
			component.ngOnInit();
			expect(component.ecgSerialNumber).toBe(component.dialogConfigData.serialNumber);
			expect(component.newNotesNumber).toBe(component.dialogConfigData.newNoteNumber);
			expect(component.form.get("note")).toBeDefined();
		})

		it("should set notes subscriber", () => {
			const data: any = { noteList: [{ user: "" }] };
			const spyMakeNotesRequest = jest.spyOn(notesService, "makeNotesRequest").mockReturnValue(of(data) as any);
			component.ngOnInit();
			expect(spyMakeNotesRequest).toHaveBeenCalledWith({
				ecgSerialNumber: component.ecgSerialNumber,
				notesRequest: {
					requestType: RequestTypeEnum.READ
				}
			});
			component.notes$.subscribe(d => {
				expect(d).toBe(data.noteList);
			});
		})

		it("should log error if makeNotesRequest throws any error", () => {
			const data: any = { noteList: [{ user: "" }] };
			const spyLog = jest.spyOn(console, "log");
			const spyMakeNotesRequest = jest.spyOn(notesService, "makeNotesRequest").mockReturnValue(throwError('404'));
			component.ngOnInit();
			expect(spyMakeNotesRequest).toHaveBeenCalledWith({
				ecgSerialNumber: component.ecgSerialNumber,
				notesRequest: {
					requestType: RequestTypeEnum.READ
				}
			});
			component.notes$.subscribe(d => {
				expect(d).toBe([]);
			});
		})
	})

	describe("close", () => {
		it("should close the dialog ref", () => {
			const spyClose = jest.spyOn(matDialogRef, "close");
			component.close(true);
			expect(spyClose).toHaveBeenCalledWith(true);
		})
	})

	describe("addNote", () => {
		it("should set newNote value", () => {
			component.ngOnInit();
			component.form.patchValue({ note: "note1  " });
			fixture.detectChanges();
			component.addNote();
			expect(component.newNote).toStrictEqual({
				content: "note1",
				user: 'CurrentUser@irhythmtech.com'
			});
		})

		it("should set pageDto navigationSubTabs", () => {
			const data: any = { data: {} };
			const spyMakeNotesRequest = jest.spyOn(notesService, "makeNotesRequest").mockReturnValue(of(data) as any);
			const spyClose = jest.spyOn(component, "close");

			component.ngOnInit();
			component.addNote();
			expect(spyMakeNotesRequest).toHaveBeenCalled();
			expect(spyClose).toHaveBeenCalled();
		})
	})
});

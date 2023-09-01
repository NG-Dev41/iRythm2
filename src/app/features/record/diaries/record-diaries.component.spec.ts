import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordDiariesComponent } from './record-diaries.component';
import { RecordDto } from '../services/dtos/record-dto.service';
import { RecordDtoMock } from "test/mocks/services/dto/record-dto-mock.service";

describe('RecordDiariesComponent', () => {
	let component: RecordDiariesComponent;
	let fixture: ComponentFixture<RecordDiariesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [],
			declarations: [RecordDiariesComponent],
			providers: [
				{ provide: RecordDto, useClass: RecordDtoMock },
			]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(RecordDiariesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

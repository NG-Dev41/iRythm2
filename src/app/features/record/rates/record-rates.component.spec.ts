import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordRatesComponent } from './record-rates.component';
import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { RecordDtoMock } from "test/mocks/services/dto/record-dto-mock.service";

describe('RecordRatesComponent', () => {
	let component: RecordRatesComponent;
	let fixture: ComponentFixture<RecordRatesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [],
			declarations: [RecordRatesComponent],
			providers: [
				{ provide: RecordDto, useClass: RecordDtoMock },
			]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(RecordRatesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

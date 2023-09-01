import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordSinusAfComponent } from './record-sinus-af.component';
import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { RecordDtoMock } from "test/mocks/services/dto/record-dto-mock.service";

describe('RecordSinusAfComponent', () => {
	let component: RecordSinusAfComponent;
	let fixture: ComponentFixture<RecordSinusAfComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [],
			declarations: [RecordSinusAfComponent],
			providers: [
				{ provide: RecordDto, useClass: RecordDtoMock },
			]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(RecordSinusAfComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

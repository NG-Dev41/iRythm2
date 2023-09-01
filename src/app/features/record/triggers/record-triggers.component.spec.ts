import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordTriggersComponent } from './record-triggers.component';
import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { RecordDtoMock } from "test/mocks/services/dto/record-dto-mock.service";

describe('RecordTriggersComponent', () => {
	let component: RecordTriggersComponent;
	let fixture: ComponentFixture<RecordTriggersComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [],
			declarations: [RecordTriggersComponent],
			providers: [
				{ provide: RecordDto, useClass: RecordDtoMock },
			]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(RecordTriggersComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

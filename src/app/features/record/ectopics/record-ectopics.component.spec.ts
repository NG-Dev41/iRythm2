import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordEctopicsComponent } from './record-ectopics.component';
import { RecordDto } from '../services/dtos/record-dto.service';
import { RecordDtoMock } from "test/mocks/services/dto/record-dto-mock.service";
import { RouterTestingModule } from '@angular/router/testing';

describe('RecordEctopicsComponent', () => {
	let component: RecordEctopicsComponent;
	let fixture: ComponentFixture<RecordEctopicsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [RecordEctopicsComponent],
			providers: [
				{ provide: RecordDto, useClass: RecordDtoMock },
			]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(RecordEctopicsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

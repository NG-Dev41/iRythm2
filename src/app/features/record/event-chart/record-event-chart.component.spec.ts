import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordEventChartComponent } from './record-event-chart.component';
import { RecordDto } from '../services/dtos/record-dto.service';
import { RecordDtoMock } from "test/mocks/services/dto/record-dto-mock.service";
import { RouterTestingModule } from '@angular/router/testing';

describe('RecordEventChartComponent', () => {
	let component: RecordEventChartComponent;
	let fixture: ComponentFixture<RecordEventChartComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [RecordEventChartComponent],
			providers: [
				{ provide: RecordDto, useClass: RecordDtoMock },
			]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(RecordEventChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

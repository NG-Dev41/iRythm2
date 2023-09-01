import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordSidebarComponent } from './record-sidebar.component';
import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { RecordDtoMock } from "test/mocks/services/dto/record-dto-mock.service";
import { RecordSessionEditServiceMock } from "test/mocks/services/record-session-edit-service-mock.service";
import { RecordSessionEditService } from 'app/features/record/services/record-service.service';
import { RecordSidebarService } from 'app/features/record/services/record-sidebar.service';
import { RecordSidebarServiceMock } from "test/mocks/services/record-sidebar-service-mock.service";
import { RecordEditBarComponentMock } from 'test/mocks/components/record-edit-bar-mock.component';
import { RecordHrBarActionsComponent } from 'app/features/record/edit-bar/hr-bar-actions/record-hr-bar-actions.component';
import { RecordHrBarActionsComponentMock } from 'test/mocks/components/record-hr-bar-actions-mock.component';
import { RecordNavigationComponentMock } from 'test/mocks/components/record-navigation-mock.component';
import { RecordSinusAfComponentMock } from 'test/mocks/components/record-sinus-af-mock.component';
import { AppLogoComponentMock } from 'test/mocks/components/app-logo-mock.component';

describe('RecordSidebarComponent', () => {
	let component: RecordSidebarComponent;
	let fixture: ComponentFixture<RecordSidebarComponent>;
	let sidebarService: RecordSidebarService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [],
			declarations: [RecordSidebarComponent,
				RecordEditBarComponentMock,
				RecordHrBarActionsComponentMock,
				RecordNavigationComponentMock,
				RecordSinusAfComponentMock,
				AppLogoComponentMock],
			providers: [
				{ provide: RecordSidebarService, useClass: RecordSidebarServiceMock },
				{ provide: RecordDto, useClass: RecordDtoMock },
				{ provide: RecordSessionEditService, useClass: RecordSessionEditServiceMock }
			]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(RecordSidebarComponent);
		component = fixture.componentInstance;
		sidebarService = fixture.debugElement.injector.get(RecordSidebarService);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('ngOnInit', () => {
		it('should call init from sidebarService', () => {
			const spyInit = jest.spyOn(sidebarService, 'init');
			component.ngOnInit();
			expect(spyInit).toHaveBeenCalled();
		})
	})
});

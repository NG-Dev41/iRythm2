import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { RecordSubNavigationComponent } from './record-sub-navigation.component';
import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { RecordDtoMock } from "test/mocks/services/dto/record-dto-mock.service";
import { PageDto } from 'app/commons/services/dtos/page-dto.service';
import { PageDtoMock } from 'test/mocks/services/dto/page-dto-mock.service';
import { PageNotifier, PageChannelKey } from 'app/commons/services/notifiers/page-notifier.service';
import { PageNotifierMock } from 'test/mocks/services/notifier/page-notifier-mock.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterMock } from 'test/mocks/services/router-mock.service';
import { ActivatedRouteMock } from 'test/mocks/services/activated-route-mock.service';
import { of } from "rxjs";

describe('RecordSubNavigationComponent', () => {
	let component: RecordSubNavigationComponent;
	let fixture: ComponentFixture<RecordSubNavigationComponent>;
	let pageDto: PageDto;
	let pageNotifier: PageNotifier;
	let router: Router;
	let activatedRoute: ActivatedRoute;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [],
			declarations: [RecordSubNavigationComponent],
			providers: [
				{ provide: PageDto, useClass: PageDtoMock },
				{ provide: RecordDto, useClass: RecordDtoMock },
				{ provide: PageNotifier, useClass: PageNotifierMock },
				{ provide: Router, useValue: RouterMock },
				{ provide: ActivatedRoute, useValue: ActivatedRouteMock },
			]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(RecordSubNavigationComponent);
		pageDto = fixture.debugElement.injector.get(PageDto);
		pageNotifier = fixture.debugElement.injector.get(PageNotifier);
		router = fixture.debugElement.injector.get(Router);
		activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe("ngOnInit", () => {
		it("should set pageDto navigationSubTabs", () => {
			jest.useFakeTimers();

			const data: any = { subTabs: 2 }
			const spyListen = jest.spyOn(pageNotifier, "listen").mockReturnValue(of(data) as any);
			component.ngOnInit();

			jest.advanceTimersByTime(10);
			expect(spyListen).toHaveBeenCalledWith(PageChannelKey.NAVIGATION_SUB_TABS);
			expect(component.pageDto.navigationSubTabs).toBe(2);
		})
	})

	describe("processNavItemClick", () => {
		it("should redirect to href if navItem has href defined", () => {
			const navItem: any = { href: "test" }
			const spyRouter = jest.spyOn(router, "navigate");
			component.processNavItemClick(navItem);
			expect(navItem).toBeTruthy();
			expect(spyRouter).toHaveBeenCalledWith([navItem.href]);
		})

		it("should redirect with relative path if navItem has href not defined", () => {
			const navItem: any = { params: [] }
			const spyRouter = jest.spyOn(router, "navigate");
			component.processNavItemClick(navItem);
			expect(spyRouter).toHaveBeenCalledWith([], {
				relativeTo: component['activeRoute'],
				queryParams: navItem.params,
			});
		})
	})
});

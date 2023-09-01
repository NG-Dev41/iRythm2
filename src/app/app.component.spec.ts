import { AppComponent } from './app.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, NavigationEnd, NavigationStart, Params, RouterEvent } from '@angular/router';
import { PageService } from './commons/services/page/page.service';
import { PageServiceMock } from '../test/mocks/services/page-mock.service';
import { UserDto } from './commons/services/dtos/user-dto.service';
import { UserDtoMock } from 'test/mocks/services/dto/user-dto-mock.service';
import { MatIconGeneratorService } from './core/services/mat-icon-generator.service';
import { MatIconGeneratorServiceMock } from 'test/mocks/services/mat-icon-generator-mock.service';
import { QueueService } from './features/queue/services/queue.service';
import { QueueServiceMock } from 'test/mocks/services/queue-mock.service';
import { RouterOutletMock } from 'test/mocks/components/router-outlet-mock.component';
import { Subject } from 'rxjs';
import { TranslatePipeMock } from '../test/mocks/pipes/translate-mock.pipe';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from '../test/mocks/services/translation/translate-mock.service';
import { HeaderNotificationsComponentMock } from 'test/mocks/components/header-notifications-mock.component';



describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  let mockActivatedRoute;
  let mockPageService;
  let mockQueueService;
  let mockTranslateService;
  let mockIconGeneratorService;

  let translateAddLangsSpy;
  let getCachedValuesSpy;
  let loadPageSpy;
  let generateIconsSpy;

  const eventsSubject: Subject<RouterEvent> = new Subject<RouterEvent>();
  const routerMock = {events: eventsSubject};

  beforeEach(async () => {
        TestBed.overrideComponent(AppComponent, {
            set: {
                providers: [
                    {provide: PageService, useClass: PageServiceMock}
                ]
            }
        });
        await TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                HeaderNotificationsComponentMock,
                RouterOutletMock,
                TranslatePipeMock
            ],
            providers: [
                { provide: MatIconGeneratorService, useClass: MatIconGeneratorServiceMock },
                { provide: PageService, useClass: PageServiceMock },
                { provide: Router, useValue: routerMock },
                { provide: ActivatedRoute, useValue: {queryParams: new Subject<Params>()} },
                { provide: UserDto, useClass: UserDtoMock },
                { provide: QueueService, useClass: QueueServiceMock },
                { provide: TranslateService, useClass: TranslateServiceMock }
            ]
        }).compileComponents();

    });

  beforeEach(() => {

      mockActivatedRoute = TestBed.inject(ActivatedRoute);
      mockIconGeneratorService = TestBed.inject(MatIconGeneratorService) as MatIconGeneratorServiceMock;
      mockQueueService = TestBed.inject(QueueService);
      mockTranslateService = TestBed.inject(TranslateService);

      // These spies must  be set up here because the methods are called in the constructor of the component
      translateAddLangsSpy = jest.spyOn(mockTranslateService, 'addLangs');
      generateIconsSpy = jest.spyOn(mockIconGeneratorService, 'generateIcons');

      fixture = TestBed.createComponent(AppComponent);

      // This mock service has to be accessed via the component injector and cannot be accessed using
      // the TestBed.inject() because the provider is defined in the
      // component itself and not the module
      mockPageService = fixture.debugElement.injector.get(PageService);
      component = fixture.componentInstance;
  });

  it('should create the app', () => {
        expect(component).toBeTruthy();
  });

  it('should add languages to translations', () => {
      expect(translateAddLangsSpy).toHaveBeenCalledWith(['en']);
  });

  it('should generate icons', () => {
      expect(generateIconsSpy).toHaveBeenCalled();
  });

  describe('Router Navigation Event Handling', () => {

      beforeEach(() => {
          loadPageSpy = jest.spyOn(mockPageService, 'loadPage');
      });

      it('should invoke pageService.loadPage() on NavigationEnd event', () => {
          const navigationEndEvent = new NavigationEnd(0, '/mock-url', '/mock-url');
          fixture.detectChanges();
          eventsSubject.next(navigationEndEvent);
          expect(loadPageSpy).toHaveBeenCalled();
      });

      it('should NOT invoke pageService.loadPage() if event is not of type NavigationEnd', () => {
          const navigationStartEvent = new NavigationStart(0, '/mock-url');
          fixture.detectChanges();
          eventsSubject.next(navigationStartEvent);
          expect(loadPageSpy).not.toHaveBeenCalled();
      });
  });

  describe('Route Query Param Changes', () => {

      beforeEach(() => {
          getCachedValuesSpy = jest.spyOn(mockQueueService, 'getCachedValues');
      });

      it('should invoke QueueService.getCachedValues()', () => {
          const queryParams = {user: 'testuser@irhythmtech.com'};
          fixture.detectChanges();
          mockActivatedRoute.queryParams.next(queryParams);
          expect(getCachedValuesSpy).toHaveBeenCalled();
      });

      it('should NOT invoke QueueService.getCachedValues()', () => {
          const queryParams = {user: null};
          fixture.detectChanges();
          mockActivatedRoute.queryParams.next(queryParams);
          expect(getCachedValuesSpy).not.toHaveBeenCalled();
      });
  });

});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QueueComponent } from './queue.component';
import { of } from "rxjs";
import { UserDto } from 'app/commons/services/dtos/user-dto.service';
import { QueueService } from './services/queue.service';
import { SnackbarService } from 'app/modules/snackbar/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PageNotifier } from 'app/commons/services/notifiers/page-notifier.service';
import { QueueServiceMock } from 'test/mocks/services/queue-mock.service';
import { SnackbarServiceMock } from 'test/mocks/services/snackbar-service-mock.service';
import { UserDtoMock } from 'test/mocks/services/dto/user-dto-mock.service';
import { ActivatedRouteMock } from 'test/mocks/services/activated-route-mock.service';
import { RouterMock } from 'test/mocks/services/router-mock.service';
import { PageNotifierMock } from "test/mocks/services/notifier/page-notifier-mock.service";
import { QueueRoutingModule } from './queue-routing.module';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { QueueIncludesModule } from 'app/modules/queue/queue-includes.module';
import { QueueAction } from 'app/features/queue/daos/queue-dao.service';

describe('QueueComponent', () => {
    let component: QueueComponent;
    let fixture: ComponentFixture<QueueComponent>;
    let router: Router;
    let queueService: QueueService;
    let pageNotifier: PageNotifier;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                QueueRoutingModule,
                QueueIncludesModule,
                MatIconTestingModule
            ],
            declarations: [QueueComponent],
            providers: [
                { provide: QueueService, useClass: QueueServiceMock },
                { provide: SnackbarService, useClass: SnackbarServiceMock },
                { provide: UserDto, useClass: UserDtoMock },
                { provide: ActivatedRoute, useValue: ActivatedRouteMock },
                { provide: PageNotifier, useClass: PageNotifierMock },
                { provide: Router, useValue: RouterMock },
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(QueueComponent);
        component = fixture.componentInstance;
        router = fixture.debugElement.injector.get(Router);
        queueService = fixture.debugElement.injector.get(QueueService);
        pageNotifier = fixture.debugElement.injector.get(PageNotifier);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should call initQueue from queueService', () => {
            const spyInitQueue = jest.spyOn(queueService, 'initQueue');
            component.ngOnInit();
            expect(spyInitQueue).toHaveBeenCalledWith({
                queueAction: QueueAction.POLL_QUEUE,
                user: component.userDto.id
            });
        })

        it('should call send method from pageNotifier if prevSerialNumber is defined', () => {
            component['prevSerialNumber'] = '10';
            const spySend = jest.spyOn(pageNotifier, 'send');
            const spyClearFromSerialParam = jest.spyOn(component as any, 'clearFromSerialParam');
            component.ngOnInit();
            expect(spySend).toHaveBeenCalled();
            expect(spyClearFromSerialParam).toHaveBeenCalled();
        })
    })

    describe('ngOnDestroy', () => {
        it('should call stopPolling from queueService', () => {
            const spyStopPolling = jest.spyOn(queueService, 'stopPolling');
            component.ngOnDestroy();
            expect(spyStopPolling).toHaveBeenCalled();
        })
    })

    describe('clearFromSerialParam', () => {
        it('should navigate to given route', () => {
            const spyNavigate = jest.spyOn(router, 'navigate');
            component['clearFromSerialParam']();
            expect(spyNavigate).toHaveBeenCalledWith(
                ['.'],
                { relativeTo: component['route'], queryParams: { fromSerial: null } }
            );
        })
    })
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderNotificationsComponent } from './header-notifications.component';
import { PageNotifier } from 'app/commons/services/notifiers/page-notifier.service';
import { PageNotifierMock } from 'test/mocks/services/notifier/page-notifier-mock.service';
import { Subject } from 'rxjs';
import { IHeaderNotifyAction, Snackbar } from '../../../commons/interfaces/channel.interface';

describe('HeaderNotificationsComponent', () => {
    let component: HeaderNotificationsComponent;
    let fixture: ComponentFixture<HeaderNotificationsComponent>;
    let pageNotifierService: PageNotifierMock;
    let pageNotifierSpy;
    const mockSubject = new Subject();

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HeaderNotificationsComponent],
            providers: [{ provide: PageNotifier, useClass: PageNotifierMock }],
        }).compileComponents();

        fixture = TestBed.createComponent(HeaderNotificationsComponent);
        pageNotifierService = fixture.debugElement.injector.get(PageNotifier) as PageNotifierMock;
        pageNotifierSpy = jest.spyOn(pageNotifierService, 'listen').mockReturnValue(mockSubject);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a default duration of 5 seconds', () => {
        expect(component.DEFAULT_SNACKBAR_DURATION).toEqual(5000);
    });

    describe('Adding Notifications', () => {
        it('should add a notification using the default duration if, not specified by caller', () => {
            const testSnackbar: Snackbar = { text: 'HELLO', shouldHaveCloseButton: true };

            const pageNotifierArg = {
                action: IHeaderNotifyAction.ADD,
                snackbars: [testSnackbar],
            };

            mockSubject.next(pageNotifierArg);

            expect(pageNotifierSpy).toHaveBeenCalled();
            expect(component.snackbars.length).toEqual(1);
            expect(component.snackbars[0].durationMs).toEqual(5000);
        });

        it('should add a notification using the specified duration', () => {
            const testSnackbar: Snackbar = { text: 'HELLO', shouldHaveCloseButton: true, durationMs: 10000 };

            const pageNotifierArg = {
                action: IHeaderNotifyAction.ADD,
                snackbars: [testSnackbar],
            };

            mockSubject.next(pageNotifierArg);

            expect(component.snackbars.length).toEqual(1);
            expect(component.snackbars[0].durationMs).toEqual(10000);
        });
    });
});

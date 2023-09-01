import { TestBed } from '@angular/core/testing';
import { PageService, IPageServiceLoadInput } from './page.service'
import { PageDto } from 'app/commons/services/dtos/page-dto.service';
import { PageNotifier, PageChannelKey } from 'app/commons/services/notifiers/page-notifier.service';
import { PageMeta, PageKey, INavigationItem } from 'app/commons/constants/page-meta.const';
import { PageNotifierMock } from 'test/mocks/services/notifier/page-notifier-mock.service';
import { PageDtoMock } from 'test/mocks/services/dto/page-dto-mock.service';

describe('PageService', () => {
    let service: PageService;
    let pageNotifierMock: PageNotifier;
    let pageDtoMock: PageDto;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                PageService,
                { provide: PageNotifier, useClass: PageNotifierMock},
                { provide: PageDto, useClass: PageDtoMock }
            ]
        });
        service = TestBed.inject(PageService);
        pageNotifierMock = TestBed.inject(PageNotifier);
        pageDtoMock = TestBed.inject(PageDto);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('loadPage', () => {
        it('should set url data to pageDto and call setPageMeta and send methods', () => {
            const spySetPageMeta = jest.spyOn(service as any, 'setPageMeta');
            const spySend = jest.spyOn(pageNotifierMock, 'send');
            const input: IPageServiceLoadInput = { url: 'w3.com', previousUrl: 'twitter.com' };
            service.loadPage(input);
            expect(pageDtoMock.url).toBe(input.url);
            expect(pageDtoMock.previousUrl).toBe(input.previousUrl);
            expect(pageDtoMock.urlPathSegments).toStrictEqual(input.url.split('/'));
            expect(spySetPageMeta).toHaveBeenCalledWith(input.url);
        expect(spySend).toHaveBeenCalledWith(PageChannelKey.ROUTE_CHANGE, {});
        })
    })

    describe('setPageMeta', () => {
        it('should set set pageDto key, meta if url pass the regex from PageMeta', () => {
            const url: string = '/queue';
            service['setPageMeta'](url);
            expect(url.match(new RegExp(PageMeta.QUEUE.regex))).toBeTruthy();
            expect(pageDtoMock.key).toBe(PageKey.QUEUE);
            expect(pageDtoMock.meta).toBe(PageMeta.QUEUE);
        })
    })

    describe('addNavigationSubTabs', () => {
        it('should set pageDto navigationSubTabs value', () => {
            const tabs: Array<INavigationItem> = [{ name: 'test' }];
            service.addNavigationSubTabs(tabs);
            expect(pageDtoMock.navigationSubTabs).toStrictEqual(tabs);
        })
    })
});

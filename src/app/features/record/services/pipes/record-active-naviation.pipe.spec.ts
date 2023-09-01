import { PageDto } from 'app/commons/services/dtos/page-dto.service';
import { PageDtoMock } from '../../../../../test/mocks/services/dto/page-dto-mock.service';
import { RecordActiveNavigationPipe } from './record-active-navigation.pipe';
import { IRecordNavigationItem } from '../interfaces/record-navigation.interface';
import { RecordNavigationKey } from '../enums/record-navigation.enum';
import { TestBed } from '@angular/core/testing';

describe('RecordActiveNavigationPipe', () => {
    let pipe: RecordActiveNavigationPipe;
    let mockPageDto: PageDto;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RecordActiveNavigationPipe, { provide: PageDto, useClass: PageDtoMock }],
        });

        pipe = TestBed.inject(RecordActiveNavigationPipe);
        mockPageDto = TestBed.inject(PageDto) as PageDtoMock;

        // Set up mock data for the PageDto
        mockPageDto.meta = {
            navigationKey: RecordNavigationKey.ECTOPICS,
            regex: /some-pattern/,
            hideSubheader: false,
            title: 'some_title',
        };
        mockPageDto.urlPathSegments = ['', '', '', '', 'PAGE_KEY'];
    });

    it('should create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should return true for an active navigation item with parentPageKey', () => {
        const navItem: IRecordNavigationItem = {
            name: 'some_name',
            pageKey: 'PAGE_KEY',
            parentPageKey: RecordNavigationKey.ECTOPICS,
        };
        expect(pipe.transform(navItem)).toBe(true);
    });

    it('should return true for an active navigation item without parentPageKey', () => {
        mockPageDto.meta.navigationKey = RecordNavigationKey.CASE_OVERVIEW;
        const navItem: IRecordNavigationItem = {
            name: 'some_name',
            pageKey: RecordNavigationKey.CASE_OVERVIEW,
        };
        expect(pipe.transform(navItem)).toBe(true);
    });

    it('should return false for an inactive navigation item with parentPageKey', () => {
        const navItem: IRecordNavigationItem = {
            name: 'some_name',
            pageKey: 'OTHER_KEY',
            parentPageKey: RecordNavigationKey.ECTOPICS,
        };
        expect(pipe.transform(navItem)).toBe(false);
    });

    it('should return false for an inactive navigation item without parentPageKey', () => {
        const navItem: IRecordNavigationItem = {
            name: 'some_name',
            pageKey: 'OTHER_KEY',
        };
        expect(pipe.transform(navItem)).toBe(false);
    });

    it('should return false when pageDto.meta.navigationKey is undefined', () => {
        mockPageDto.meta.navigationKey = undefined;
        const navItem: IRecordNavigationItem = {
            name: 'some_name',
            pageKey: 'some_key',
        };
        expect(pipe.transform(navItem)).toBe(false);
    });

    it('should return false when pageDto.urlPathSegments[4] is undefined', () => {
        mockPageDto.urlPathSegments = ['', '', '', '']; // Make the 5th element undefined
        const navItem: IRecordNavigationItem = {
            name: 'some_name',
            pageKey: 'PAGE_KEY',
            parentPageKey: RecordNavigationKey.ECTOPICS,
        };
        expect(pipe.transform(navItem)).toBe(false);
    });
});

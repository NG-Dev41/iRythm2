import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { of } from 'rxjs';

import { PdfViewComponent } from './pdf-view.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipeMock } from 'test/mocks/pipes/translate-mock.pipe';
import { DateFnsModule } from 'ngx-date-fns';

describe('PdfViewComponent', () => {
    let component: PdfViewComponent;
    let fixture: ComponentFixture<PdfViewComponent>;
    let mockUrl = 'http://example.com/UNITTEST_reportUrl="HTTP%UNIT%TEST_NTEST9643B_230714191254.pdf'

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                PdfViewComponent,
                TranslatePipeMock
            ],
            imports: [
                MatToolbarModule,
                DateFnsModule,
                BrowserModule
            ],
            providers: [
                { provide: ActivatedRoute, useValue: { queryParams: of( { reportUrl: encodeURI(mockUrl) } ) }}
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PdfViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize component with safe URL and parsed datetime', () => {
        const mockParsedDate = new Date('2023-07-14T19:12:54.000Z');
        const mockParseDatetimeFromUrl = jest.spyOn(component as any, 'parseDatetimeFromUrl').mockReturnValue(mockParsedDate);

        component.ngOnInit();

        expect(component['url']).toBe(mockUrl);
        expect(component.parsedDateTime).toEqual(mockParsedDate);
        expect(mockParseDatetimeFromUrl).toHaveBeenCalled();
    });

    it('should parse datetime from URL correctly', () => {
        const mockParsedDate = new Date('2023-07-14T19:12:54.000Z');

        const parsedDate = component['parseDatetimeFromUrl'](mockUrl);

        expect(parsedDate).toEqual(mockParsedDate);
    });
});
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RecordNavigationComponent } from "./record-navigation.component";
import { RecordNavigationService } from "../services/record-navigation.service";
import { RecordDto } from "../services/dtos/record-dto.service";
import { RecordDtoMock } from "test/mocks/services/dto/record-dto-mock.service";
import { RecordNavigationServiceMock } from "test/mocks/services/record-navigation-mock.service";
import { of } from "rxjs";
import { RecordReportChannelAction } from "../services/enums";
import { RecordNotifier } from "../services/notifiers/record-notifier.service";
import { RecordNotifierMock } from "test/mocks/services/notifier/record-notifier-mock.service";
import { PageDto } from "app/commons/services/dtos/page-dto.service";
import { PageDtoMock } from "test/mocks/services/dto/page-dto-mock.service";
import { PageChannelKey, PageNotifier } from "app/commons/services/notifiers/page-notifier.service";
import { RecordNavigationKey } from "../services/enums/record-navigation.enum";
import { RhythmType } from "app/commons/constants/rhythms.const";

describe('RecordNavigationComponent', () => {
    let component: RecordNavigationComponent;
    let fixture: ComponentFixture<RecordNavigationComponent>;
    let recordNotifier: RecordNotifier;
    let pageNotifier: PageNotifier;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ RecordNavigationComponent ],
            providers: [
                { provide: RecordNavigationService, useClass: RecordNavigationServiceMock },
                { provide: RecordDto, useClass: RecordDtoMock },
                { provide: RecordNotifier, useClass: RecordNotifierMock },
                { provide: PageDto, useClass: PageDtoMock },
                { provide: PageNotifier, useClass: PageNotifier }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(RecordNavigationComponent);
        component = fixture.componentInstance;
        recordNotifier = fixture.debugElement.injector.get(RecordNotifier);
        pageNotifier = fixture.debugElement.injector.get(PageNotifier);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit is called', () => {
        it('should subscribe to RecordNotifier with proper filter and update qualityCheckStatuses', () => {
            const recordReportChannelData = {
                action: RecordReportChannelAction.REPORT_QUALITY_CHECK_FAILURE,
            };

            jest.spyOn(recordNotifier, 'listen').mockReturnValueOnce(of(recordReportChannelData) as any);

            component.ngOnInit();
            fixture.detectChanges();

            expect(component.qualityCheckStatuses).toEqual(recordReportChannelData);
        });

        it('should handle route change for a top level tab and update qualityCheckStatuses accordingly', () => {
            const activeTopLevelTab = {
                pageKey: RecordNavigationKey.RATES
            };

            component.recordDto = {
                navigationItems: [activeTopLevelTab]
            } as any;

            component['pageDto'] = {
                meta: {
                    navigationKey: RecordNavigationKey.RATES
                },
                urlPathSegments: ['some', 'path', 'segments', RecordNavigationKey.RATES]
            } as any;

            component.qualityCheckStatuses = {
                action: RecordReportChannelAction.REPORT_QUALITY_CHECK_FAILURE,
                qualityCheckErrors: [RecordNavigationKey.RATES],
                qualityCheckWarnings: [RecordNavigationKey.RATES]
            };

            component.ngOnInit()

            pageNotifier.send(PageChannelKey.ROUTE_CHANGE, {});

            // Expectations
            expect(component.qualityCheckStatuses.qualityCheckErrors).toEqual([]);
            expect(component.qualityCheckStatuses.qualityCheckWarnings).toEqual([]);
        });

        it('should handle route change for a sub-tab and update qualityCheckStatuses accordingly', () => {
            const activeTopLevelTab = {
                pageKey: RecordNavigationKey.RHYTHMS,
                children: [
                    { pageKey: RhythmType.SVT}
                ]
            };

            component.recordDto = {
                navigationItems: [activeTopLevelTab]
            } as any;

            component['pageDto'] = {
                meta: {
                    navigationKey: RecordNavigationKey.RHYTHMS
                },
                urlPathSegments: ['some', 'path', 'segments', RecordNavigationKey.RHYTHMS, RhythmType.SVT]
            } as any;

            component.qualityCheckStatuses = {
                action: RecordReportChannelAction.REPORT_QUALITY_CHECK_FAILURE,
                qualityCheckErrors: [RhythmType.SVT],
                qualityCheckWarnings: [RhythmType.SVT]
            };

            component.ngOnInit()

            pageNotifier.send(PageChannelKey.ROUTE_CHANGE, {});

            expect(component.qualityCheckStatuses.qualityCheckErrors).toEqual([]);
            expect(component.qualityCheckStatuses.qualityCheckWarnings).toEqual([]);
        });
    });
});

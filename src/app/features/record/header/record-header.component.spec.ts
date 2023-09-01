import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";

import { RecordHeaderComponent } from "./record-header.component";
import { PageDto } from "app/commons/services/dtos/page-dto.service";
import { PageDtoMock } from "test/mocks/services/dto/page-dto-mock.service";
import { MatToolbarModule } from "@angular/material/toolbar";
import { HeaderNotificationsComponentMock } from "test/mocks/components/header-notifications-mock.component";
import { HeaderOptionsComponentMock } from "test/mocks/components/header-options-mock.component";
import { RecordFindingsComponentMock } from "test/mocks/components/record-findings-mock.component";
import { RecordPatientInfoComponentMock } from "test/mocks/components/record-patient-info-mock.component";
import { RecordSubNavigationComponentMock } from "test/mocks/components/record-sub-navigation-mock.component";
import { RecordUndoComponentMock } from "test/mocks/components/record-undo-mock.component";
import { RecordLayoutToggleComponentMock } from "test/mocks/components/record-layout-toggle-mock.component";
import { ApproveReportComponentMock } from "test/mocks/components/approve-report-mock.component";
import { RecordDtoMock } from "test/mocks/services/dto/record-dto-mock.service";
import { RecordDto } from "../services/dtos/record-dto.service";
import { RecordNotifier } from "../services/notifiers/record-notifier.service";
import { RecordNotifierMock } from "test/mocks/services/notifier/record-notifier-mock.service";
import { PageNotifierMock } from "test/mocks/services/notifier/page-notifier-mock.service";
import { PageNotifier } from "app/commons/services/notifiers/page-notifier.service";


describe('RecordFindings', () => {
    let component: RecordHeaderComponent;
    let fixture: ComponentFixture<RecordHeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                MatToolbarModule
            ],
            declarations:
                [
                    RecordHeaderComponent,
                    RecordPatientInfoComponentMock,
                    HeaderNotificationsComponentMock,
                    RecordFindingsComponentMock,
                    RecordUndoComponentMock,
                    HeaderOptionsComponentMock,
                    RecordSubNavigationComponentMock,
                    RecordLayoutToggleComponentMock,
                    ApproveReportComponentMock
                ],
            providers: [
                { provide: ActivatedRoute, useValue: { params: of([{}])} },
                { provide: PageDto, useClass: PageDtoMock },
                { provide: RecordDto, useClass: RecordDtoMock },
                { provide: RecordNotifier, useClass: RecordNotifierMock },
                { provide: PageNotifier, useClass: PageNotifierMock }
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RecordHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

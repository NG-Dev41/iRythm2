import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RecordFindingsComponent } from "./record-findings.component";
import { MatChipsModule } from "@angular/material/chips";

describe('RecordFindings', () => {
    let component: RecordFindingsComponent;
    let fixture: ComponentFixture<RecordFindingsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                MatChipsModule
            ],
            declarations:
                [
                    RecordFindingsComponent
                ],
            providers: []
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RecordFindingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

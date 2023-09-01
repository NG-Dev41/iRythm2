import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordOverviewMdnComponent } from './record-overview-mdn.component';
import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { RecordDtoMock } from "test/mocks/services/dto/record-dto-mock.service";

describe('RecordOverviewMdnComponent', () => {
    let component: RecordOverviewMdnComponent;
    let fixture: ComponentFixture<RecordOverviewMdnComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [],
            declarations: [RecordOverviewMdnComponent],
            providers: [
                { provide: RecordDto, useClass: RecordDtoMock },
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RecordOverviewMdnComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should set patientCardConfig data', () => {
            component.ngOnInit();
            expect(component.patientCardConfig.data).toBeDefined();
            expect(component.patientCardConfig.data.length).toBeGreaterThan(1);
        })

        it('should set accountCardConfig data', () => {
            component.ngOnInit();
            expect(component.patientCardConfig.data).toBeDefined();
            expect(component.patientCardConfig.data.length).toBeGreaterThan(1);
        })
    })
});

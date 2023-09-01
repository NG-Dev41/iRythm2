import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RecordPatientInfoComponent } from "./record-patient-info.component";
import { RecordDtoMock } from "test/mocks/services/dto/record-dto-mock.service";
import { RecordDto } from "../services/dtos/record-dto.service";
import { MatMenuModule } from "@angular/material/menu";


describe('RecordPatientInfoComponent', () => {
    let component: RecordPatientInfoComponent;
    let fixture: ComponentFixture<RecordPatientInfoComponent>;
    
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ MatMenuModule ],
            declarations: [ RecordPatientInfoComponent ],
            providers: [
                { provide: RecordDto, useClass: RecordDtoMock }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(RecordPatientInfoComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

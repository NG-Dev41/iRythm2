import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordLayoutToggleComponent } from './record-layout-toggle.component';
import { RecordService } from '../services/record-service.service';
import { RecordServiceMock } from 'test/mocks/services/record-service-mock.service';
import { RecordDto } from '../services/dtos/record-dto.service';
import { RecordDtoMock } from 'test/mocks/services/dto/record-dto-mock.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

describe('RecordLayoutToggleComponent', () => {
    let component: RecordLayoutToggleComponent;
    let fixture: ComponentFixture<RecordLayoutToggleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ 
                MatButtonModule, 
                MatButtonToggleModule, 
                MatIconModule, 
                MatIconTestingModule 
            ],
            declarations: [RecordLayoutToggleComponent],
            providers: [ 
                { provide: RecordService, useClass: RecordServiceMock },
                { provide: RecordDto, useClass: RecordDtoMock },
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(RecordLayoutToggleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

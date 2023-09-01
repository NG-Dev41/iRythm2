import { ComponentFixture, TestBed } from '@angular/core/testing';


import { EcgListComponent } from './ecg-list.component';
import { EcgListController } from './services/controller/ecg-list-controller.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RecordRhythmsDto } from 'app/features/record/rhythms/record-rhythms.service';
import { RecordRhythmsDtoMock } from 'test/mocks/services/dto/record-rhythms-dto-mock.service';
import { EcgListControllerMock } from 'test/mocks/services/ecg-list-controller-mock.service';
import { EcgListNotifierMock } from 'test/mocks/services/notifier/ecg-list-notifier-mock.service';
import { EcgListNotifier } from './services/notifier/ecg-list-notifier.service';
import { MatMenuModule } from '@angular/material/menu';
import { EcgComponentMock } from 'test/mocks/components/ecg-mock.component';
import { RecordDtoMock } from 'test/mocks/services/dto/record-dto-mock.service';
import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { RecordNotifier } from '../../../../features/record/services/notifiers/record-notifier.service';
import { RecordNotifierMock } from '../../../../../test/mocks/services/notifier/record-notifier-mock.service';

describe('EcgListComponent', () => {
    let component: EcgListComponent;
    let fixture: ComponentFixture<EcgListComponent>;    
    
    beforeEach(async () => {
        TestBed.overrideComponent(
            EcgListComponent,
            {
                set: {
                    providers: [
                        { provide: EcgListNotifier, useClass: EcgListNotifierMock },
                        { provide: EcgListController, useClass: EcgListControllerMock },
                        { provide: RecordRhythmsDto, useClass: RecordRhythmsDtoMock },
                        { provide: RecordDto, useClass: RecordDtoMock },
	                    { provide: RecordNotifier, useClass: RecordNotifierMock }
                    ]
                }
            }
        );
        await TestBed.configureTestingModule({
            declarations: [
                EcgListComponent,
                EcgComponentMock
            ],
            imports: [ MatMenuModule,
                HttpClientTestingModule
            ],
            providers: [
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EcgListComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});


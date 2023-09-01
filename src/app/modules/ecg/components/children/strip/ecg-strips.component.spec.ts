import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcgStripsComponent } from './ecg-strips.component';
import { EcgController } from 'app/modules/ecg/services/controller/ecg/ecg-controller.service';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';
import { EcgConfigDtoMock } from 'test/mocks/services/dto/ecg-config-dto-mock.service';
import { EcgListNotifierMock } from 'test/mocks/services/notifier/ecg-list-notifier-mock.service';
import { EcgListController } from '../../list/services/controller/ecg-list-controller.service';
import { EcgListNotifier } from '../../list/services/notifier/ecg-list-notifier.service';
import { EcgControllerMock } from 'test/mocks/services/ecg-controller-mock.service';
import { EcgListControllerMock } from 'test/mocks/services/ecg-list-controller-mock.service';



describe('EcgStripsComponent', () => {
    let component: EcgStripsComponent;
    let fixture: ComponentFixture<EcgStripsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ EcgStripsComponent ],
            providers: [
                { provide: EcgController, useClass: EcgControllerMock },
                { provide: EcgConfigDto, useClass: EcgConfigDtoMock },
                { provide: EcgListNotifier, useClass: EcgListNotifierMock },
                { provide: EcgListController, useClass: EcgListControllerMock },
                
            ]
        });

        fixture = TestBed.createComponent(EcgStripsComponent);
        component = fixture.componentInstance;
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

});

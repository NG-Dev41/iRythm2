import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FocusIndicatorComponent } from './focus-indicator.component';
import { EcgUtils } from '../../../../../../../../services/utils/ecg-utils.service';
import { EcgUtilsMock } from '../../../../../../../../../../../test/mocks/services/ecg-utils-mock.service';
import { EcgPrimaryEpisodeIndicatorController } from '../primary-episode-indicator/ecg-primary-episode-indicator-controller.service';
import { EcgPrimaryEpisodeIndicatorControllerMock } from '../../../../../../../../../../../test/mocks/services/ecg-primary-episode-indicator-controller-mock.service';
import { EcgConfigDto } from '../../../../../../../../services/dto/ecg/ecg-config-dto.service';
import { EcgConfigDtoMock } from '../../../../../../../../../../../test/mocks/services/dto/ecg-config-dto-mock.service';
import { EcgStripConfigDto } from '../../../../../../../../services/dto/ecg/ecg-strip-config-dto.service';
import { EcgStripConfigDtoMock } from '../../../../../../../../../../../test/mocks/services/dto/ecg-strip-config-dto-mock.service';
import { EcgStripUtils } from '../../../../../../../../services/utils/ecg-strip-utils.service';
import { EcgStripUtilsMock } from '../../../../../../../../../../../test/mocks/services/ecg-strip-utils-mock.service';

describe('FocusIndicatorComponent', () => {
  let component: FocusIndicatorComponent;
  let fixture: ComponentFixture<FocusIndicatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FocusIndicatorComponent],
	    providers: [
		    { provide: EcgUtils, useClass: EcgUtilsMock },
		    { provide: EcgPrimaryEpisodeIndicatorController, useClass: EcgPrimaryEpisodeIndicatorControllerMock },
		    { provide: EcgConfigDto, useClass: EcgConfigDtoMock },
		    { provide: EcgStripConfigDto, useClass: EcgStripConfigDtoMock },
		    { provide: EcgStripUtils, useClass: EcgStripUtilsMock }
	    ]
    });
    fixture = TestBed.createComponent(FocusIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

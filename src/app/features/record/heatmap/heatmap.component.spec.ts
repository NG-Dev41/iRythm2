import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { HeatmapComponent } from './heatmap.component';
import { HeatmapRectanglesService } from './services/heatmap-rectangles.service';
import { HeatmapGridService } from './services/heatmap-grid.service';
import { HeatmapAxisService } from './services/heatmap-axis.service';
import { PageNotifier } from 'app/commons/services/notifiers/page-notifier.service';
import { EcgDaoController } from 'app/modules/ecg/services/controller/dao/ecg-dao-controller.service';
import { EcgEditDao } from 'app/modules/ecg/services/daos/ecg-edit/ecg-edit-dao.service';
import { RecordRhythmsDto } from '../rhythms/record-rhythms.service';
import { HeatmapUtilsService } from './services/heatmap-utils.service';
import { EcgEditDaoMock } from 'test/mocks/services/dao/ecg-edit-dao-mock.service';
import { RecordRhythmsDtoMock } from 'test/mocks/services/dto/record-rhythms-dto-mock.service';
import { HeatmapGridServiceMock } from 'test/mocks/services/heatmap-grid-mock.service';
import { EcgDaoControllerMock } from 'test/mocks/services/dao/ecg-dao-controller-mock.service';
import { HeatmapRectanglesServiceMock } from 'test/mocks/services/heatmap-rectangle-mock.service';
import { HeatmapUtilsServiceMock } from 'test/mocks/services/heatmap-utils.service';
import { PageNotifierMock } from 'test/mocks/services/notifier/page-notifier-mock.service';
import { HeatmapAxisServiceMock } from 'test/mocks/services/heatmap-axis-service-mock.service';
import 'jest-canvas-mock';

describe('HeaderHeatmapComponent', () => {
	let component: HeatmapComponent;
	let fixture: ComponentFixture<HeatmapComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule
			],
			declarations: [HeatmapComponent],
			providers: [
				{ provide: HeatmapRectanglesService, useClass: HeatmapRectanglesServiceMock },
				{ provide: HeatmapGridService, useClass: HeatmapGridServiceMock },
				{ provide: EcgEditDao, useClass: EcgEditDaoMock },
				{ provide: HeatmapUtilsService, useClass: HeatmapUtilsServiceMock },
				{ provide: RecordRhythmsDto, useClass: RecordRhythmsDtoMock },
				{ provide: EcgDaoController, useClass: EcgDaoControllerMock },
				{ provide: PageNotifier, useClass: PageNotifierMock },
				{ provide: HeatmapAxisService, useClass: HeatmapAxisServiceMock },
			]
		})
			.compileComponents();

		fixture = TestBed.createComponent(HeatmapComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

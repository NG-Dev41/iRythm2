import { Injectable } from '@angular/core';

import { EcgListNotifier } from 'app/modules/ecg/components/list/services/notifier/ecg-list-notifier.service';
import { EcgEditDao } from 'app/modules/ecg/services/daos/ecg-edit/ecg-edit-dao.service';
import { EcgDaoNotifier } from 'app/modules/ecg/services/notifier/dao/ecg-dao-notifier.service';
import { EcgListController } from 'app/modules/ecg/components/list/services/controller/ecg-list-controller.service';
import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { RecordNotifier } from 'app/features/record/services/notifiers/record-notifier.service';
import { RecordSessionEditService } from 'app/features/record/services/record-service.service';
import { EcgBeatController } from 'app/modules/ecg/services/controller/beat-controller/ecg-beat-controller.service';
import { EcgController } from 'app/modules/ecg/services/controller/ecg/ecg-controller.service';
import { EcgLineController } from 'app/modules/ecg/services/controller/line-controller/ecg-line-controller.service';
import { EcgConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-config-dto.service';
import { EcgDto } from 'app/modules/ecg/services/dto/ecg/ecg-dto.service';
import { EcgListConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-list-config-dto.service';
import { EcgStripConfigDto } from 'app/modules/ecg/services/dto/ecg/ecg-strip-config-dto.service';
import { EcgNotifier } from 'app/modules/ecg/services/notifier/ecg/ecg-notifier.service';
import { EcgStripUtils } from 'app/modules/ecg/services/utils/ecg-strip-utils.service';
import { EcgStripNotifier } from 'app/modules/ecg/components/children/strip/services/notifier/ecg-strip-notifier.service';
import { EcgCaliperRenderer } from './caliper/ecg-caliper-renderer.service';
import { EcgHighlighterRenderer } from './highlighter/ecg-highlighter-renderer.service';
import { EcgUtils } from '../../../../../../../services/utils/ecg-utils.service';
import { PageNotifier } from 'app/commons/services/notifiers/page-notifier.service';

@Injectable()
export class EcgStripControllerFactory {

	// TODO: Inject necessary DAOs here then pass the to the controllers
	public constructor(
		private stripNotifier: EcgStripNotifier,
		private dto: EcgDto,
		private globalConfig: EcgConfigDto,
		private config: EcgStripConfigDto,
		private stripUtils: EcgStripUtils,
		private ecgNotifier: EcgNotifier,
		private listNotifier: EcgListNotifier,
		private utils: EcgUtils,
		private ecgController: EcgController,
        private editDao: EcgEditDao,
        private daoNotifier: EcgDaoNotifier,
        private listConfig: EcgListConfigDto,
		private recordDto: RecordDto,
		private recordNotifier: RecordNotifier,
        private ecgListController: EcgListController,
        private recordSessionEditService: RecordSessionEditService,
		private pageNotifier: PageNotifier
	) {}

	public getBeatsController(): EcgBeatController {
        return new EcgBeatController(
            this.listNotifier,
            this.editDao,
            this.ecgNotifier,
			this.recordNotifier,
            this.stripNotifier,
            this.utils,
            this.stripUtils,
            this.dto,
            this.globalConfig,
            this.config,
            this.daoNotifier,
            this.listConfig,
            this.ecgController,
	        this.recordDto,
            this.recordSessionEditService,
			this.pageNotifier
        );
        /**
		return new EcgBeatsRenderer(
			this.config,
			this.dto,
			this.stripNotifier,
			this.stripUtils,
			this.notifier,
			this.utils,
			this.ecgController
		);
         */
	}

	public getHighlighterRenderer(): EcgHighlighterRenderer {
		return new EcgHighlighterRenderer(
			this.config,
			this.dto,
			this.stripNotifier,
			this.stripUtils,
			this.ecgNotifier
		);
	}

	public getLineController(): EcgLineController {
		return new EcgLineController(
            this.ecgNotifier,
            this.recordSessionEditService,
            this.utils,
            this.stripUtils,
            this.globalConfig,
            this.config,
            this.recordDto,
            this.recordNotifier,
            this.ecgListController,
            this.listNotifier,
            this.dto,
            this.listConfig,
        );
	}

	public getCaliperRenderer(): EcgCaliperRenderer {
		return new EcgCaliperRenderer(
			this.config,
			this.dto,
			this.stripNotifier,
            this.stripUtils,
			this.utils
		);
	}
}

import { Component, OnInit } from '@angular/core';

import { EditBarUtilService } from 'app/features/record/edit-bar/services/edit-bar-util.service';
import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { HRBarActionTypeMeta, HRBarActionType } from 'app/commons/constants/rhythms.const';
import { RecordChannelKey } from 'app/features/record/services/enums/channel.enum';
import { RecordNotifier } from 'app/features/record/services/notifiers/record-notifier.service';
import { RecordSessionEditService } from 'app/features/record/services/record-service.service';
import { Observable } from 'rxjs';
import { LoadingSpinnerService } from 'app/commons/services/loading-spinner/loading-spinner.service';

@Component({
    selector: 'app-record-hr-bar-actions',
    templateUrl: './record-hr-bar-actions.component.html',
    styleUrls: ['./record-hr-bar-actions.component.scss'],
})
export class RecordHrBarActionsComponent implements OnInit {
    public HRBarActionTypeMeta = HRBarActionTypeMeta;
    public HRBarActionType = HRBarActionType;
    public isLoading: Observable<boolean>;
    public selected: HRBarActionType = HRBarActionType.BLANK_BEATS;

    /**
     * Ctor
     * @param controller
     * @param editBarUtils
     * @param recordDto
     * @param sessionEditService
     */
    constructor(
        public editBarUtils: EditBarUtilService,
        public recordDto: RecordDto,
        public sessionEditService: RecordSessionEditService,
        public recordNotifier: RecordNotifier,
        private loadingSpinnerService: LoadingSpinnerService
    ) { }

    ngOnInit() {
        // Subscribe to the isLoading BehaviourSubject to receive loading status changes.
        this.isLoading = this.loadingSpinnerService.isLoading.asObservable();
    }

    /**
     * Send the action type to the editBarController
     * @param actionType
     */
    public selectActionType(actionType: HRBarActionType | null): void {
        if (actionType) {
            this.selected = actionType;
            this.recordNotifier.send(RecordChannelKey.HR_BAR_ACTION, { selectedAction: this.selected });
        }
    }
}
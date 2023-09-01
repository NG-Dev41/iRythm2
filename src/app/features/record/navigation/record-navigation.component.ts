import { Component, OnDestroy, OnInit } from '@angular/core';
import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { RecordNavigationService } from 'app/features/record/services/record-navigation.service';
import { RecordNavigationKey, RecordNavigationToggleStatus } from '../services/enums/record-navigation.enum';
import { RecordNotifier } from '../services/notifiers/record-notifier.service';
import { RecordChannelKey, RecordReportChannelAction } from '../services/enums';
import { IRecordReportChannel } from '../services/interfaces/channel.interface';
import { filter } from 'rxjs/operators';
import {
    IRouteChangeChannel,
    PageChannelKey,
    PageNotifier,
} from 'app/commons/services/notifiers/page-notifier.service';
import { PageDto } from 'app/commons/services/dtos/page-dto.service';
import { IRecordNavigationItem } from '../services/interfaces/record-navigation.interface';
import { RecordActiveNavigationPipe } from '../services/pipes/record-active-navigation.pipe';
import { Subscription, Observable } from 'rxjs';
import { EctopicCategory } from '../../../commons/constants/ectopics.const';
import { LoadingSpinnerService } from 'app/commons/services/loading-spinner/loading-spinner.service';

@Component({
    selector: 'app-record-navigation',
    templateUrl: './record-navigation.component.html',
    styleUrls: ['./record-navigation.component.scss'],
    providers: [RecordActiveNavigationPipe],
})
export class RecordNavigationComponent implements OnInit, OnDestroy {
    // For use in the template for catching undefined child status
    // public status: RecordNavigationStatus = RecordNavigationStatus.INCOMPLETE;

    // For use in the template
    public RecordNavigationKey = RecordNavigationKey;

    // For use in the template
    public RecordNavigationToggleStatus = RecordNavigationToggleStatus;

    public qualityCheckStatuses: IRecordReportChannel;

    // expose constant to the template
    public ectopicCategory = EctopicCategory;

    public isLoading: Observable<boolean>;
    private routeChangeSub: Subscription;

    /**
     * Ctor
     *
     * @param {RecordNavigationService} public navigationService
     * @param {RecordDto}               public recordDto
     */
    public constructor(
        public navigationService: RecordNavigationService,
        public recordDto: RecordDto,
        private recordNotifier: RecordNotifier,
        private pageNotifier: PageNotifier,
        private pageDto: PageDto,
        private loadingSpinnerService: LoadingSpinnerService
    ) { }

    /**
     * Initialize navigation
     */
    public ngOnInit(): void {
        // Process data retrieved from the /metrics to build out sidebar navigation
        this.navigationService.init();

        // Subscribe to the isLoading BehaviourSubject to receive loading status changes.
        this.isLoading = this.loadingSpinnerService.isLoading.asObservable();

		this.recordNotifier.listen(RecordChannelKey.REPORT_ACTION)
            .pipe(
				filter((data: IRecordReportChannel) => data.action === RecordReportChannelAction.REPORT_QUALITY_CHECK_FAILURE)
            )
            .subscribe((data: IRecordReportChannel) => {
                this.qualityCheckStatuses = data;
            });

		this.routeChangeSub = this.pageNotifier.listen(PageChannelKey.ROUTE_CHANGE)
			.subscribe(() => {
            //When there are quality checks present on tabs we want to clear them upon visiting that tab
            //Once we determine the active tab or sub-tab we remove that item from the quality check status arrays which removes the display icon
            if (this.qualityCheckStatuses) {

                let tabHasQualityCheckError: boolean;
                let tabHasQualityCheckWarning: boolean;

					const activeTopLevelTab = this.recordDto.navigationItems.find((navItem: IRecordNavigationItem) => this.pageDto.meta.navigationKey == navItem.pageKey);
                //If the top level tab has children (rhythms, ectopics) we need to drill down and find the active sub tab
                if (activeTopLevelTab.children) {
                    activeTopLevelTab.children.forEach((childNavItem: IRecordNavigationItem) => {
                        if (childNavItem.pageKey === this.pageDto.urlPathSegments[4].toUpperCase()) {
								tabHasQualityCheckError = this.qualityCheckStatuses?.qualityCheckErrors?.includes(childNavItem.pageKey);
								tabHasQualityCheckWarning = this.qualityCheckStatuses?.qualityCheckWarnings?.includes(childNavItem.pageKey);
                            if (tabHasQualityCheckError) {
									this.qualityCheckStatuses.qualityCheckErrors.splice(this.qualityCheckStatuses.qualityCheckErrors.indexOf(childNavItem.pageKey), 1);
                            }
                            if (tabHasQualityCheckWarning) {
									this.qualityCheckStatuses.qualityCheckWarnings.splice(this.qualityCheckStatuses.qualityCheckErrors.indexOf(childNavItem.pageKey), 1);
                            }
                        }
                    });
                    //No children means it's a top level tab
                } else {
						tabHasQualityCheckError = this.qualityCheckStatuses?.qualityCheckErrors?.includes(activeTopLevelTab.pageKey);
						tabHasQualityCheckWarning = this.qualityCheckStatuses?.qualityCheckWarnings?.includes(activeTopLevelTab.pageKey);

                    if (tabHasQualityCheckError) {
							this.qualityCheckStatuses.qualityCheckErrors.splice(this.qualityCheckStatuses.qualityCheckErrors.indexOf(activeTopLevelTab.pageKey), 1);
                    }
                    if (tabHasQualityCheckWarning) {
							this.qualityCheckStatuses.qualityCheckWarnings.splice(this.qualityCheckStatuses.qualityCheckErrors.indexOf(activeTopLevelTab.pageKey), 1);
                    }
                }
                if (tabHasQualityCheckError || tabHasQualityCheckWarning) {
                    // Create a new object reference to trigger change detection on recordQualityCheckStatus pipe
						this.qualityCheckStatuses = Object.assign({}, this.qualityCheckStatuses)
                }
            }
        });
    }

    /**
     * Destory any necessary subscriptions.
     */
    public ngOnDestroy(): void {
        this.routeChangeSub.unsubscribe();
    }
}
import { Component, OnInit } from '@angular/core';
import { LoadingSpinnerService } from 'app/commons/services/loading-spinner/loading-spinner.service';

import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { SidebarTab } from 'app/features/record/services/enums/channel.enum';
import { RecordSessionEditService } from 'app/features/record/services/record-service.service';
import { RecordSidebarService } from 'app/features/record/services/record-sidebar.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-record-sidebar',
    templateUrl: './record-sidebar.component.html',
    styleUrls: ['./record-sidebar.component.scss'],
})
export class RecordSidebarComponent implements OnInit {
    // For use in the template
    public SidebarTab = SidebarTab;
    public isLoading: Observable<boolean>;

    /**
     * Ctor
     *
     * @param {RecordSidebarService}     public sidebarService
     * @param {RecordDto}                public recordDto
     * @param {RecordSessionEditService} public sessionEditService
     */
    public constructor(
        public sidebarService: RecordSidebarService,
        public recordDto: RecordDto,
        public sessionEditService: RecordSessionEditService,
        private loadingSpinnerService: LoadingSpinnerService
    ) { }

    /**
     * Init sidebar
     */
    public ngOnInit(): void {
        this.sidebarService.init();

        // Subscribe to the isLoading BehaviourSubject to receive loading status changes.
        this.isLoading = this.loadingSpinnerService.isLoading.asObservable();
    }
}
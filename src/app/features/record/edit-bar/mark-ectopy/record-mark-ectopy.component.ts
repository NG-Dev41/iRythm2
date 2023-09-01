import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';

import { EctopicType, EctopicTypeMeta } from 'app/commons/constants/ectopics.const';
import { EditBarUtilService } from 'app/features/record/edit-bar/services/edit-bar-util.service';
import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { RecordChannelKey, RecordChannelAction } from 'app/features/record/services/enums/channel.enum';
import { IRecordActionChannel } from 'app/features/record/services/interfaces/channel.interface';
import { RecordNotifier } from 'app/features/record/services/notifiers/record-notifier.service';
import { RecordSessionEditService } from 'app/features/record/services/record-service.service';
import { RecordMetricType } from 'app/features/record/services/enums/record-navigation.enum';
import { LoadingSpinnerService } from 'app/commons/services/loading-spinner/loading-spinner.service';

@Component({
    selector: 'app-record-mark-ectopy',
    templateUrl: './record-mark-ectopy.component.html',
    styleUrls: ['./record-mark-ectopy.component.scss'],
})
export class RecordMarkEctopyComponent implements OnInit, AfterViewInit, OnDestroy {
    public EctopicTypeMeta = EctopicTypeMeta;
    public selected: EctopicType | null = null;
    public RecordMetricType = RecordMetricType;
    private allSubscriptions: Subscription = new Subscription();
    public isLoading: Observable<boolean>;
    public ectopicTypes$ = new Subject<EctopicType[]>();

    private observableFireTimeout: ReturnType<typeof setTimeout>;

    // this ordered array will be emitted ba the ectopicTypes$ Subject Observable
    // in order to cause the ectopies list to be re-rendered
    readonly ectopicKeys: Array<EctopicType> = [
        EctopicType.VE1,
        EctopicType.VE2,
        EctopicType.VE3,
        EctopicType.SVE1,
        EctopicType.SVE2,
        EctopicType.SVE3,
    ];

    /**
     * Ctor
     * @param recordDto
     * @param editBarUtils
     * @param sessionEditService
     */
    constructor(
        public recordDto: RecordDto,
        public editBarUtils: EditBarUtilService,
        public sessionEditService: RecordSessionEditService,
        private recordNotifier: RecordNotifier,
        private loadingSpinnerService: LoadingSpinnerService
    ) { }

    ngOnInit() {
        this.initListeners();
        
        // Subscribe to the isLoading BehaviourSubject to receive loading status changes.
        this.isLoading = this.loadingSpinnerService.isLoading.asObservable();
    }

    ngAfterViewInit(){

        // the timeout here is to handle the classic: 'expression changed after checked' issue
        this.observableFireTimeout = setTimeout(() => {
            // fire the observable to draw the ectopics list
            this.ectopicTypes$.next(this.ectopicKeys);
            },0);
    }

    ngOnDestroy(){
        this.allSubscriptions.unsubscribe();
        clearTimeout(this.observableFireTimeout);
    }

    initListeners(): void {

        // When the user marks an ectopy we will deselect any
        // selected ectopy entry and force the user to re-select if they wish to mark another
        this.allSubscriptions.add(this.recordNotifier.listen(RecordChannelKey.ACTION).subscribe((data: IRecordActionChannel) => {
            if(data.action === RecordChannelAction.ECTOPY_MARKED){
                    this.selected = null;
                }
        }));

        // When the ectopy data is updated in the recordDto we will fire the observable to
        // re-render the ectopy list with the new ectopic numbers
        this.allSubscriptions.add(this.recordNotifier.listen(RecordChannelKey.ACTION).subscribe((data: IRecordActionChannel) => {
            if(data.action === RecordChannelAction.METRIC_DATA_UPDATED) {
                    this.ectopicTypes$.next(this.ectopicKeys);
                }
        }));

    }


    /**
     * Send the edit type to the editBarController
     * @param ectopicType
     */
    public submitEdit(ectopicType: EctopicType | null): void {
        this.selected = ectopicType;
        this.recordNotifier.send(RecordChannelKey.MARK_ECTOPY, {ectopicType: ectopicType});
    }

}

import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';

import { EcgDaoChannelKey, EcgDaoComponentKey } from 'app/modules/ecg/enums';
import { EcgDaoEditChannelStatus, IEcgDaoControllerInit, IEcgDaoEditChannel, IEcgEditResponse } from 'app/modules/ecg/interfaces';
import { EcgDaoNotifier } from 'app/modules/ecg/services/notifier/dao/ecg-dao-notifier.service';
import { EcgEditDao } from 'app/modules/ecg/services/daos/ecg-edit/ecg-edit-dao.service';
import { PageChannelKey, PageNotifier } from 'app/commons/services/notifiers/page-notifier.service';
import { RecordNotifier } from 'app/features/record/services/notifiers/record-notifier.service';
import { EDIT_SESSION_GENERIC_ERROR } from 'app/commons/constants/common.const';
import { RecordChannelKey, RecordChannelAction } from 'app/features/record/services/enums/channel.enum';
import { IHeaderNotifyAction } from 'app/commons/interfaces/channel.interface';
import { IRHYTHM_COLORS } from 'app/commons/enums/common.enum';
import { LoadingSpinnerService } from 'app/commons/services/loading-spinner/loading-spinner.service';

@Injectable()
export class EcgDaoController implements OnDestroy {

    // Component Key/ID
    public componentKey: EcgDaoComponentKey;

    private daoEditSubs: Subscription = new Subscription();

    /**
     * Ctor
     */
    public constructor(
        public daoNotifier: EcgDaoNotifier,
        private editDao: EcgEditDao,
        private pageNotifier: PageNotifier,
        private recordNotifier: RecordNotifier,
        private loadingSpinnerService: LoadingSpinnerService
    ) {
        this.setComponentKey();
    }


    /**
     * Set component key
     */
    protected setComponentKey(): void {
        this.componentKey = EcgDaoComponentKey.ECG;
    }


    /**
     * Init
     *
     * @return {Observable<IEcgDaoControllerInit>}
     */
    public init(): Observable<IEcgDaoControllerInit> {

        // Init Listeners
        this.initListeners();

        return of({
            success: true
        });
    }


    /**
     * Init all DAO listeners
     */
    private initListeners() {
        this.daoEditListener();
    }


    /**
     * Method is listening for commands to save strip edits (backend request).
     * When a notification is received to save an edit - it will first send out
     * a notification itself to notify any component/controller that is interested in an edit
     * being made. It sends the message with a null value - meaning request has begun.
     * When request is complete it sends out another message over the same channel indicating
     * request is complete, and it passes along the response data.
     */
    private daoEditListener(): void {

        this.daoEditSubs = this.daoNotifier
            .listen(EcgDaoChannelKey.DAO_EDIT)
            .subscribe((data: IEcgDaoEditChannel) => {

                if (data.status === EcgDaoEditChannelStatus.EDIT_REQUEST && data.request.ecgRangeEditList?.length > 0) {
                    // show loader with custom message
                    this.loadingSpinnerService.show('Edits are being saved...');

                    // Emit notification that an edit request is being sent to the backend but not yet completed.
                    this.daoNotifier.send(EcgDaoChannelKey.DAO_EDIT, {
                        status: EcgDaoEditChannelStatus.EDIT_REQUEST_PENDING,
                        serialNumber: data.serialNumber,
                        request: {
                            ecgRangeEditList: data.request.ecgRangeEditList,
                            ecgAnalyzeRequest: data.request.ecgAnalyzeRequest
                        }
                    });

                    // Make the request to save the edit
                    this.editDao
                        .edit({
                            ecgSerialNumber: data.serialNumber,
                            ecgRangeEditList: data.request.ecgRangeEditList,
                            heatMapRequest: data.request.ecgAnalyzeRequest.heatMapRequest
                        })
                        .subscribe((response: IEcgEditResponse) => {

                            //handle any errors if there are any
                            if (response.errorInfo?.hasError) {
                                let errors: string[] = [];

                                //if there are errors they will come in as an array of objects
                                response.errorInfo.errorRecordList.forEach((errorRecord) => {
                                    errors.push(errorRecord.errorCode);
                                });

                                this.pageNotifier.send(PageChannelKey.HEADER_NOTIFY, {
                                    action: IHeaderNotifyAction.ADD,
                                    snackbars: [
                                        {
                                            text: `${EDIT_SESSION_GENERIC_ERROR} ${errors.join( ' \n ')}`,
                                            textColor: IRHYTHM_COLORS.ERROR_RED_TEXT,
                                            backgroundColor: IRHYTHM_COLORS.ERROR_RED_BG
                                        }
                                    ]
                                });


                                this.recordNotifier.send(RecordChannelKey.ACTION, { action: RecordChannelAction.ERROR_ON_EDIT_SESSION_SAVE });

                                // Method of loadingSpinnerService to hide the loading spinner.
                                this.loadingSpinnerService.hide();
                            } else {
                                // Send out a message/notification that edit request is complete
                                this.daoNotifier.send(EcgDaoChannelKey.DAO_EDIT, {
                                    status: EcgDaoEditChannelStatus.EDIT_RESPONSE,
                                    serialNumber: data.serialNumber,
                                    response: response,
	                                request: {
		                                ecgRangeEditList: data.request.ecgRangeEditList,
		                                ecgAnalyzeRequest: data.request.ecgAnalyzeRequest
	                                }
                                });

                                // Method of loadingSpinnerService to hide the loading spinner.
                                this.loadingSpinnerService.hide();
                            }
                        });
                }
            });
    }

    ngOnDestroy() {
        this.daoEditSubs.unsubscribe();
    }

}

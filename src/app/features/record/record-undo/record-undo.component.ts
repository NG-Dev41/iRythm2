import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { IRHYTHM_COLORS } from 'app/commons/enums/common.enum';
import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { EcgDaoChannelKey } from 'app/modules/ecg/enums';
import {
    IEcgCurrentEdit,
    IEcgUndoEditResponse,
    IEcgDaoEditChannel,
    EcgDaoEditChannelStatus,
    EcgAnalyzeChannelStatus,
    IEcgCurrentEditsResponse
} from 'app/modules/ecg/interfaces';
import { EcgUndoEditDao } from 'app/modules/ecg/services/daos/ecg-undo-edit/ecg-undo-edit-dao.service';
import { EcgDaoNotifier } from 'app/modules/ecg/services/notifier/dao/ecg-dao-notifier.service';
import { RecordChannelKey, RecordChannelAction } from '../services/enums';
import { RecordNotifier } from '../services/notifiers/record-notifier.service';
import { RecordUndoDialogComponent } from './record-undo-dialog/record-undo-dialog.component';
import { PageChannelKey, PageNotifier } from 'app/commons/services/notifiers/page-notifier.service';
import { IHeaderNotifyAction } from 'app/commons/interfaces/channel.interface';
import { LoadingSpinnerService } from 'app/commons/services/loading-spinner/loading-spinner.service';

@Component({
    selector: 'app-record-undo',
    templateUrl: './record-undo.component.html',
    styleUrls: ['./record-undo.component.scss']
})
export class RecordUndoComponent implements OnInit, OnDestroy {

    public isDisabled = true;
    private currentEdits: IEcgCurrentEditsResponse;
    public recentEditList: Array<IEcgCurrentEdit>;

    // Active edit being processed
    public activeUndoEdit: IEcgCurrentEdit = null;

    // used in template to set hover styles on menu items
    public hoveredItemIndex = -1;

    private allSubscriptions: Subscription = new Subscription();

    constructor(
        public recordDto: RecordDto,
        private undoDao: EcgUndoEditDao,
        private daoNotifier: EcgDaoNotifier,
        private dialog: MatDialog,
        private recordNotifier: RecordNotifier,
        private pageNotifier: PageNotifier,
        private loadingSpinnerService: LoadingSpinnerService
    ) { }

    ngOnInit(): void {
        this.initListeners();
    }

    ngOnDestroy(): void {
        this.allSubscriptions.unsubscribe();
    }

    /**
     * When user clicks the reload / recycle icon button
     */
    public undoLastEdit() {
        this.undoEdit(0);
    }

    /**
     * Starts the process of undoing edit(s)
     * Pass in the index related to the recentEditList to get the UndoEdit obj.
     * Ex. Last Edit, Last 2 Edits, etc...
     *
     * @param {number} undoIndex
     */
    public undoEdit(undoIndex: number): void {
        this.activeUndoEdit = this.recentEditList[undoIndex];

        const dialogRef = this.dialog.open(RecordUndoDialogComponent, {
            panelClass: 'modal-standard',
            disableClose: true,
            data: {
                undoList: this.recentEditList.slice(0, undoIndex + 1)
            }
        });

        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                this.processUndoEdit(undoIndex);
            } else {
                this.endUndoEdit();
            }
        });
    }

    /**
     * Makes request to undo x number of edits.
     * and uses the
     */
    private processUndoEdit(undoIndex: number): void {
        // disable buttons while we make the call
        this.isDisabled = true;

        // Method of loadingSpinnerService to display the loading spinner with custom message.
        this.loadingSpinnerService.show('Changes are being undone...');
        // Make undo edit request to the backend
        this.undoDao
            .undo({
                ecgSerialNumber: this.recordDto.serialNumber,
                checksum: this.currentEdits.checksum,
                undoId: this.activeUndoEdit.undoId,
            })
            .subscribe((data: IEcgUndoEditResponse) => {
                // handle the error if any
                if (data.errorInfo.hasError) {
                    this.pageNotifier.send(PageChannelKey.HEADER_NOTIFY, {
                        action: IHeaderNotifyAction.ADD,
                        snackbars: [
                            {
                                text: 'Undo operation failed. Please reload the page.',
                                textColor: IRHYTHM_COLORS.ERROR_RED_TEXT,
                                backgroundColor: IRHYTHM_COLORS.ERROR_RED_BG
                            },
                        ],
                    });

                    // Method of loadingSpinnerService to hide the loading spinner.
                    this.loadingSpinnerService.hide();
                    this.isDisabled = !!!this.recentEditList?.length;
                } else {
                    // reset the currentEdits list
                    this.recordDto.currentEdits = data.currentEditsResponse;
                    this.currentEdits = data.currentEditsResponse;
                    this.recentEditList = this.currentEdits?.recentEditList;
                    this.isDisabled = !!!this.recentEditList?.length;

                    // Method of loadingSpinnerService to hide the loading spinner.
                    this.loadingSpinnerService.hide();

                    // Send out notification to fetch the record data from the back-end
                    this.recordNotifier.send(RecordChannelKey.ACTION, {
                        action: RecordChannelAction.EDITS_UNDONE,
                    });

                    // show header notification for success
                    this.pageNotifier.send(PageChannelKey.HEADER_NOTIFY, {
                        action: IHeaderNotifyAction.ADD,
                        snackbars: [
                            {
                                text: `${undoIndex + 1} action(s) undone`,
                                backgroundColor: IRHYTHM_COLORS.LIGHT_GREY,
                                shouldHaveCloseButton: true,
                            },
                        ],
                    });
                }
            });
    }

    /**
     * Ends undo edit process.
     */
    private endUndoEdit(): void {
        this.activeUndoEdit = null;
    }

    /**
     * Listens for initial analyze request or session edit request to start and end
     * While the api request for the strip edit is processing (sending request receiving response)
     * we disable the 'Undo Functionality', repopulate the list of undo edits returned from the backend
     * and then finally enable the undo functionality
     */
    private initListeners(): void {

        this.allSubscriptions.add(this.daoNotifier
            .listen(EcgDaoChannelKey.DAO_EDIT)
            .subscribe((data: IEcgDaoEditChannel) => {
                if(data.status === EcgDaoEditChannelStatus.EDIT_REQUEST_PENDING){
                    this.isDisabled = true;
                }else if(data.status === EcgDaoEditChannelStatus.EDIT_RESPONSE){
                    this.currentEdits = data.response.currentEditsResponse;
                    this.recentEditList = this.currentEdits?.recentEditList;
                    this.isDisabled = !!!this.recentEditList?.length;
                }
            }));

        this.allSubscriptions.add(this.daoNotifier.listen(EcgDaoChannelKey.ANALYZE)
            .subscribe((data) => {
                if(data.status === EcgAnalyzeChannelStatus.ANALYZE_RESPONSE_PROCESSING_COMPLETE){
                    this.currentEdits = data.response.currentEditsResponse;
                    this.recentEditList = this.currentEdits?.recentEditList;
                    this.isDisabled = !!!this.recentEditList?.length;
                }
            }));

    }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserDto } from 'app/commons/services/dtos/user-dto.service';
import { QueueService } from './services/queue.service';
import { SnackbarService } from 'app/modules/snackbar/snackbar.service';
import { ComponentLoadState } from 'app/commons/enums';
import { QueueAction } from 'app/features/queue/daos/queue-dao.service';
import { reportApprovedMessage } from 'app/commons/constants/common.const';
import { IRHYTHM_COLORS } from 'app/commons/enums/common.enum';
import { PageNotifier, PageChannelKey } from 'app/commons/services/notifiers/page-notifier.service';
import { IHeaderNotifyAction } from 'app/commons/interfaces/channel.interface';


@Component({
    selector: 'app-queue',
    templateUrl: './queue.component.html',
    styleUrls: ['./queue.component.scss']
})
export class QueueComponent implements OnInit, OnDestroy {

    public hasRecordLongerThanThreeDays: boolean = true;

    // For use in template comparisons
    public ComponentLoadState = ComponentLoadState;

    // If we've returned to queue from the approve flow we retrieve that record's serial number from queryParams
    private prevSerialNumber: string;

    /**
     * Ctor
     *
     * @param {QueueService}    public  queueService
     * @param {SnackbarService} public  snackBarService
     * @param {UserDto}         private userDto
     */
    constructor(
        public queueService: QueueService,
        public snackBarService: SnackbarService,
        public userDto: UserDto,
        private route: ActivatedRoute,
        private pageNotifier: PageNotifier,
        private router: Router
    ) {
        this.prevSerialNumber = this.route.snapshot.queryParams['fromSerial'];
    }


    public ngOnInit(): void {
        this.queueService.initQueue({
            queueAction: QueueAction.POLL_QUEUE,
            user: this.userDto.id
        });
        // Snackbar raised after redirect to queue from report approval
        if (this.prevSerialNumber) {
            this.pageNotifier.send(PageChannelKey.HEADER_NOTIFY, {
                action: IHeaderNotifyAction.ADD,
                snackbars: [
                    {
                        text: reportApprovedMessage(this.prevSerialNumber),
                        textColor: IRHYTHM_COLORS.GREY,
                        backgroundColor: IRHYTHM_COLORS.LIGHT_GREY,
                        shouldHaveCloseButton: true
                    }
                ]
            });

            this.clearFromSerialParam();
        }

    }

    public ngOnDestroy(): void {

        // Stop queue polling
        this.queueService.stopPolling();
    }

    private clearFromSerialParam(): void {
        this.router.navigate(
            ['.'],
            { relativeTo: this.route, queryParams: { fromSerial: null } }
        );
    }
}

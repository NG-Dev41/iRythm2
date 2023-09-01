import { Component } from '@angular/core';

import { RhythmTypeMeta, RhythmType } from 'app/commons/constants/rhythms.const';
import { EditBarUtilService } from 'app/features/record/edit-bar/services/edit-bar-util.service';
import { EcgRhythmTypeEdit } from 'app/modules/ecg/enums';
import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { RecordChannelKey } from 'app/features/record/services/enums/channel.enum';
import { RecordNotifier } from 'app/features/record/services/notifiers/record-notifier.service';
import { RecordMetricType } from 'app/features/record/services/enums/record-navigation.enum';


@Component({
    selector: 'app-record-paint-rhythms',
    templateUrl: './record-paint-rhythms.component.html',
    styleUrls: ['./record-paint-rhythms.component.scss']
})
export class RecordPaintRhythmsComponent {

    public RhythmTypeMeta = RhythmTypeMeta;
    public RhythmType = RhythmType;
    public selected: RhythmType = null;
    public RecordMetricType = RecordMetricType;

    /**
     * Ctor
     * @param editBarUtils
     * @param recordDto
     * @param recordNotifier
     */
    constructor(
        public editBarUtils: EditBarUtilService,
        public recordDto: RecordDto,
        private recordNotifier: RecordNotifier
    ) {}

    /**
     * Send the rhythm type through the record notifier
     * @param rhythmType
     */
    public selectRhythmType(rhythmType: RhythmType): void {
        this.recordNotifier.send(RecordChannelKey.PAINT_RHYTHM,
            {
                rhythmTypeEdit: EcgRhythmTypeEdit.CHANGE_RHYTHM,
                newRhythmType: rhythmType,
                startIndex: this.recordDto.paintIntervalStart,
                endIndex: this.recordDto.paintIntervalEnd,
                paintModeEdit: false
            });
    }
}

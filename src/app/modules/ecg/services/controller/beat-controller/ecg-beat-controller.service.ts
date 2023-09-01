import { Injectable, OnDestroy } from '@angular/core';
import { EcgBaseController } from 'app/modules/ecg/services/controller/base/ecg-base-controller.service';
import { Observable, of, Subscription } from 'rxjs';
import {
	EcgBeatActionType, EcgBeatRenderActionType, EcgBeatType, EcgChannelKey, EcgComponentKey, EcgDaoChannelKey, EcgListChannelKey, EcgRhythmTypeEdit
} from 'app/modules/ecg/enums';
import { EcgListNotifier } from 'app/modules/ecg/components/list/services/notifier/ecg-list-notifier.service';
import { EcgEditDao } from 'app/modules/ecg/services/daos/ecg-edit/ecg-edit-dao.service';
import { EcgNotifier } from 'app/modules/ecg/services/notifier/ecg/ecg-notifier.service';
import { EcgStripUtils } from 'app/modules/ecg/services/utils/ecg-strip-utils.service';
import { EcgUtils } from 'app/modules/ecg/services/utils/ecg-utils.service';
import { EcgDaoNotifier } from 'app/modules/ecg/services/notifier/dao/ecg-dao-notifier.service';
import { EcgBeatsRenderer } from 'app/modules/ecg/components/children/strip/children/strip/services/controller/beats/ecg-beats-renderer.service';
import { EcgStripNotifier } from 'app/modules/ecg/components/children/strip/services/notifier/ecg-strip-notifier.service';
import { EcgController } from 'app/modules/ecg/services/controller/ecg/ecg-controller.service';
import { OptionalBeatAttributes } from 'app/commons/constants/ectopics.const';
import * as snackbarConstants from 'app/commons/constants/common.const';
import { IRHYTHM_COLORS } from 'app/commons/enums/common.enum';
import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { RecordNotifier } from 'app/features/record/services/notifiers/record-notifier.service';
import { RecordSessionEditService } from 'app/features/record/services/record-service.service';
import { IEcgBeatAction, IEcgBeatActionChannel, EcgDaoEditChannelStatus } from 'app/modules/ecg/interfaces/ecg-channel.interface';
import {
	IEpisodeDataRegion, IEcgRangeEdit, IEcgBeat, BlankBeatsRequestType, IEcgSampleCursorResult
} from 'app/modules/ecg/interfaces/ecg-dao.interface';
import { EcgConfigDto } from '../../dto/ecg/ecg-config-dto.service';
import { EcgDto } from '../../dto/ecg/ecg-dto.service';
import { EcgListConfigDto } from '../../dto/ecg/ecg-list-config-dto.service';
import { EcgStripConfigDto } from '../../dto/ecg/ecg-strip-config-dto.service';
import { IEcgControllerInit } from 'app/modules/ecg/interfaces';
import { IHeaderNotifyAction } from 'app/commons/interfaces/channel.interface';
import { PageChannelKey, PageNotifier } from 'app/commons/services/notifiers/page-notifier.service';

@Injectable()
export class EcgBeatController extends EcgBaseController implements OnDestroy{

    // Flag that will prevent the beats from being modified via the ListNotifier
    private processBeats: boolean = true;

    private timeoutIds: ReturnType<typeof setTimeout>[] = [];

    private beatRenderer: EcgBeatsRenderer;

    private region: IEpisodeDataRegion | IEcgSampleCursorResult;

    private beatActionSubs: Subscription;

    /**
     * Ctor
     */
    public constructor(
        private listNotifier: EcgListNotifier,
        private editDao: EcgEditDao,
        private notifier: EcgNotifier,
        private recordNotifier: RecordNotifier,
        private stripNotifier: EcgStripNotifier,
        private utils: EcgUtils,
        private stripUtils: EcgStripUtils,
        private dto: EcgDto,
        private config: EcgConfigDto,
        private stripConfig: EcgStripConfigDto,
        private daoNotifier: EcgDaoNotifier,
        private listConfig: EcgListConfigDto,
        private ecgController: EcgController,
        private recordDto: RecordDto,
        private recordSessionEditService: RecordSessionEditService,
        private pageNotifier: PageNotifier
    ) {
        super();
        this.setComponentKey();
    }

    public init(): Observable<IEcgControllerInit> {

        // Get list o beats to work with from default region
        this.region = this.dto.regions[this.stripUtils.getRegionKey()];

        this.region.beatList = this.stripUtils.processBlankBeats(this.region.beatList);

        // TODO: Should we create a RendererFactory to clean this up ??
        this.beatRenderer = new EcgBeatsRenderer(
            this.stripConfig,
            this.dto,
            this.recordNotifier,
            this.pageNotifier,
            this.stripNotifier,
            this.stripUtils,
            this.notifier,
            this.utils
        );

        this.beatRenderer.init();

        this.initListeners();

        return of({
            success: true
        });
    }

    private initListeners(): void {
        this.beatListener();
    }


    ngOnDestroy(): void{
        this.destroy();
    }

    public destroy(): void {
        this.timeoutIds.forEach(timeoutID => clearTimeout(timeoutID));
        this.beatActionSubs.unsubscribe();
    }

    /**
     * Set component key
     * TODO: I don't like this...
     */
    protected setComponentKey(): void {
        this.componentKey = EcgComponentKey.BEAT;
    }

    /**
     * Adds the mark ectopy request to the session queue
     *
     *  @param {IEcgBeatAction} beatAction
     */
    private  addEctopyToSession(beatAction: IEcgBeatAction): void {

        const editRequestData = {
            rhythmTypeEdit: beatAction.rhythmTypeEdit,
            selectedPeaks: beatAction.selectedPeaks,
            newEctopicType: beatAction.newEctopicType
        };

        // the 'ectopicType' attribute is an optional attribute for the the payload and is only required when
        // the beat changes from one ectopic type to another ectopic type
        if(beatAction.ectopicType){
            editRequestData[OptionalBeatAttributes.ECTOPIC_TYPE] = beatAction.ectopicType;
        }

        this.recordSessionEditService.addSessionEdit(editRequestData);
    }


    /**
     * Listens for beat related commands
     */
    public beatListener(): void {

        // Listening for beat related actions (adding/removing/etc...)
        this.beatActionSubs = this.notifier
            .listen(EcgChannelKey.BEAT_ACTION)
            .subscribe((data: IEcgBeatActionChannel) => {
                // Process beats immediately for this EcgController because this is the one being interacted with AND...
                // Toggle our flag so that when the message is sent out for all EcgControllers to process beat actions
                // This controller won't process b/c its already been done
                data.actions.forEach((beatAction: IEcgBeatAction) => {
                    if (!this.stripConfig.ct.parent) {
                        const beatActionSuccess = this.processBeatAction(beatAction);

                        if (beatActionSuccess) {
                            switch (beatAction.type) {
                                case EcgBeatActionType.BLANK:
                                    this.addBlankBeatsToSession(beatAction);
                                    break;
                                case EcgBeatActionType.REMOVE:
                                    this.addRemoveBeatEditToSession(beatAction);
                                    break;
                                case EcgBeatActionType.ADD_AVG:
                                    this.addAvgBeatEditToSession(beatAction);
                                    break;
                                case EcgBeatActionType.MARK_NORMAL:
                                    this.addMarkNormalEditToSession(beatAction);
                                    break;
                                case EcgBeatActionType.MARK_ECTOPY:
                                    this.addEctopyToSession(beatAction);
                                    break;
                            }

                            // Instant save on beat edit occurs only when not in an active edit session
                            if (!this.recordSessionEditService.hasActiveSession()) {
                                // Array of beat edits that will be sent to the backend
                                let ecgRangeEditList: Array<IEcgRangeEdit> = new Array<IEcgRangeEdit>();

                                //Instant edit
                                ecgRangeEditList.push({
                                    rhythmTypeEdit: beatAction.rhythmTypeEdit,
                                    startIndex: beatAction.backIndexes[0],
                                    endIndex: beatAction.backIndexes[1],
                                    paintModeEdit: false,
                                });

                                this.daoNotifier.send(EcgDaoChannelKey.DAO_EDIT, {
                                    status: EcgDaoEditChannelStatus.EDIT_REQUEST,
                                    serialNumber: this.recordDto.serialNumber,
                                    request: {
                                        ecgAnalyzeRequest: this.recordDto.ecgAnalyzerRequest,
                                        ecgRangeEditList: ecgRangeEditList,
                                    },
                                });
                            }
                        }
                    }
                });

                // Toggle flag to not process beats in this card/controller....because they've already been processed
                this.processBeats = false;

                // Toggle flag to not process beats in this card/controller....because they've already been processed this.processBeats = false;
                // Setting a slight delay before we send out the message for all EcgCards to process the new beat action
                // TODO: Ultimately I think each card should send out a notification when it's done processing beats
                // This way we can stagger the beat processing time which should increase performanc...or appear to at least
                // @ts-ignore
                this.timeoutIds.push(
                    setTimeout(() => {
                        this.listNotifier.send(EcgListChannelKey.BEAT_ACTION, data);
                    }, 1500)
                );
            });


        // Listen to the ListNotifer for beat actions to be processed
        this.listNotifier
            .listen(EcgListChannelKey.BEAT_ACTION)
            .subscribe((data: IEcgBeatActionChannel) => {

                this.processListBeatActionChannel(data);
            });
    }


    /**
     * Will process the list of beatActions unless this is the EcgController that has already been processed.
     *
     * @param {IEcgBeatActionChannel} data
     */
    public processListBeatActionChannel(data: IEcgBeatActionChannel): void {

        if(this.processBeats) {

            data.actions.forEach((beatAction: IEcgBeatAction) => {
                this.processBeatAction(beatAction);
            });
        }
    }


    /**
     * Process a specific beatAction.
     *
     * @param {IEcgBeatAction} beatAction
     * @return {boolean}
     */
    public processBeatAction(beatAction: IEcgBeatAction): boolean {

        let beatModified: boolean = false;

        // Switch on the type of action needed
        switch (beatAction.type) {
            case EcgBeatActionType.ADD:
                beatModified = this.addBeat(beatAction);
                break;
            case EcgBeatActionType.REMOVE:
                beatModified = this.removeBeats(beatAction);
                break;
            case EcgBeatActionType.BLANK:
                beatModified = this.blankBeats(beatAction);
                break;
            case EcgBeatActionType.MARK_NORMAL:
                beatModified = this.markNormalBeats(beatAction);
                break;
            case EcgBeatActionType.ADD_AVG:
                beatModified = this.addAvgBeats(beatAction);
                break;
            case EcgBeatActionType.MARK_ECTOPY:
                beatModified = this.onMarkEctopy(beatAction);
                break;
        }

        // Send out message to rerender beats if any changes were made
        if (beatModified) {
            this.notifier.send(EcgChannelKey.BEAT_RENDER_ACTION, {
                actions: [
                    {
                        type: EcgBeatRenderActionType.RENDER
                    }
                ]
            });
        }
        return beatModified;
    }


    /**
     * Add new beat.
     *
     * @param  {IEcgBeatAction} beatAction
     * @return {boolean}
     */
    public addBeat(beatAction: IEcgBeatAction): boolean {

        // Flag to return if the beatList was modified or not
        let beatModified: boolean = false;

        // Index where new beat should be spliced into the beatList array
        let insertBeatAtIndex: number = null;

        // Only processing beats if the new beat index falls within the strip sample data
        if(beatAction.backIndexes[0] >= this.region.interval.startIndex && beatAction.backIndexes[1] <= this.region.interval.endIndex) {

            // Loop over beats to determine where in the array to insert this new beat
            for(let i: number = 0; i < this.region.beatList.length - 1; i++) {

                // Compare beat indexes
                if(beatAction.backIndexes[0] > this.region.beatList[i].index && beatAction.backIndexes[1] < this.region.beatList[(i + 1)].index) {
                    insertBeatAtIndex = i + 1;
                    break;
                }
            }
        }

        // Splice in new beat
        // Can't use '>=' here as null will pass that check, need to use separate == and > checks with ||
        if(insertBeatAtIndex == 0 || insertBeatAtIndex > 0) {

            // Create new beat object
            const newBeat: IEcgBeat = {
                index: beatAction.backIndexes[0],
                beatType: EcgBeatType.REGULAR,
                effective: true
            };

            //If the beat we're adding is in the middle of a blanked region, we need to un-blank that region
            const nearestBeatLeft = this.stripUtils.findNearestBeat(beatAction.frontIndexes[0], this.region.beatList, 'left');
            if (nearestBeatLeft && nearestBeatLeft.blankProxy) {
                nearestBeatLeft.blankProxy = false;
            }

            // Splice in the new beat and toggle our flag
            this.region.beatList.splice(insertBeatAtIndex, 0, newBeat);
            beatModified = true;

        }

        return beatModified;
    }


    /**
     * Removes beats from the beatList if they exist and returns
     * true if any beats were removed
     *
     * @param  {IEcgBeatAction}  beatAction
     * @return {boolean}
     */
    private removeBeats(beatAction: IEcgBeatAction): boolean {

        const startingBeatListLength = this.region.beatList.length;

        // Only processing beats if the new beat index falls within the strip sample data
        if (this.isBeatActionInCurrentRegion(beatAction)) {

            if(this.isSingleBeatEdit(beatAction)) {
                this.region.beatList.splice(this.region.beatList.findIndex(beat => beat.index === beatAction.backIndexes[0]), 1);
            } else {
                let beatsInSelectionRange: IEcgBeat[] = this.stripUtils.findBeatsInRange(beatAction.frontIndexes[0], beatAction.frontIndexes[1], this.region.beatList);

                //Remove beats in selection range
                this.region.beatList = this.region.beatList.filter((beat) => beatsInSelectionRange.indexOf(beat) === -1);
            }
        }

        return startingBeatListLength > this.region.beatList.length;
    }

    /**
     * Blanks and unblanks the selected range
     *
     * @param  {IEcgBeatAction}  beatAction
     * @return {boolean}
     */
    private blankBeats(beatAction: IEcgBeatAction): boolean {
        if (this.isBeatActionInCurrentRegion(beatAction)) {
            const nearestBeatLeftOfSelection = this.stripUtils.findNearestBeat(beatAction.frontIndexes[0], this.region.beatList, 'left');
            const beatsInSelectionRange = this.stripUtils.findBeatsInRange(this.stripUtils.getLocalArrayIndex(nearestBeatLeftOfSelection.index), beatAction.frontIndexes[1], this.region.beatList);

            beatsInSelectionRange.forEach((beat) => {
                if (beatAction.rhythmTypeEdit === EcgRhythmTypeEdit.BLANK_HR_REGION_CREATE) {
                    beat.blankProxy = true;
                } else if (beatAction.rhythmTypeEdit === EcgRhythmTypeEdit.BLANK_HR_REGION_DELETE) {
                    beat.blankProxy = false;
                }
            });

            return true;
        }
    }

    /**
     * Marks ectopics as normal within the selected range
     *
     * @param  {IEcgBeatAction}  beatAction
     * @return {boolean}
     */
        private markNormalBeats(beatAction: IEcgBeatAction): boolean {
            if (this.isBeatActionInCurrentRegion(beatAction)) {
                const beatsInSelectionRange = this.stripUtils.findBeatsInRange(beatAction.frontIndexes[0], beatAction.frontIndexes[1], this.region.beatList);

                if (!this.stripUtils.isEntireEctopyRangeSelected(beatsInSelectionRange)) {
                    this.pageNotifier.send(PageChannelKey.HEADER_NOTIFY, {
                        action: IHeaderNotifyAction.ADD,
                        snackbars: [
                            {
                                text: snackbarConstants.SUBSET_OF_COUPLET_OR_TRIPLET_WARNING,
                                textColor: IRHYTHM_COLORS.ERROR_RED_TEXT,
                                backgroundColor: IRHYTHM_COLORS.ERROR_RED_BG
                            }
                        ]
                    });

                    return false;
                }
                beatsInSelectionRange.forEach((beat) => {
                    beat.beatType = EcgBeatType.REGULAR;
                    beat.ectopicOtherPeakIndexes = null;
                });

                return true;
            }
        }

    /**
     * Adds beats based on average R-R rate calc
     *
     * @param  {IEcgBeatAction} beatAction
     * @return {boolean} false returns should also be accompanied by a snackbar message
     */
        private addAvgBeats(beatAction: IEcgBeatAction): boolean {
            // Only processing beats if the selection falls within the strip sample data
            if (this.isBeatActionInCurrentRegion(beatAction)) {
                const nearestBeatLeftOfSelection = this.stripUtils.findNearestBeat(beatAction.frontIndexes[0], this.region.beatList, 'left');
                const nearestBeatRightOfSelection = this.stripUtils.findNearestBeat(beatAction.frontIndexes[1], this.region.beatList, 'right');

                const beatsInSelectionRange = this.stripUtils.findBeatsInRange(this.stripUtils.getLocalArrayIndex(nearestBeatLeftOfSelection.index), beatAction.frontIndexes[1], this.region.beatList);

                //Selections containing artifacted beats aren't allowed (including ending beat to right of selection)
                if (this.stripUtils.beatListHasArtifact(beatsInSelectionRange) || this.stripUtils.isBeatArtifact(nearestBeatRightOfSelection)) {
                    this.pageNotifier.send(PageChannelKey.HEADER_NOTIFY, {
                        action: IHeaderNotifyAction.ADD,
                        snackbars: [
                            {
                                text: snackbarConstants.SELECTED_REGION_CONTAINS_ARTIFACT_WARNING,
                                textColor: IRHYTHM_COLORS.ERROR_RED_TEXT,
                                backgroundColor: IRHYTHM_COLORS.ERROR_RED_BG
                            }
                        ]
                    });

                    return false;
                }

                let startingBeat = beatsInSelectionRange[0];

                //Selections containing a subset of a couplet or triplet ectopic OR starting with an ectopic beat aren't allowed
                if (!this.stripUtils.isEntireEctopyRangeSelected(beatsInSelectionRange) || startingBeat.beatType === EcgBeatType.ECTOPY) {
                    this.pageNotifier.send(PageChannelKey.HEADER_NOTIFY, {
                        action: IHeaderNotifyAction.ADD,
                        snackbars: [
                            {
                                text: snackbarConstants.SUBSET_OF_COUPLET_OR_TRIPLET_WARNING,
                                textColor: IRHYTHM_COLORS.ERROR_RED_TEXT,
                                backgroundColor: IRHYTHM_COLORS.ERROR_RED_BG,
                                durationMs: 10000
                            }
                        ]
                    });
                    return false;
                }

                //Blanked and artifacted beats don't count in the average calcs:
                const effectiveBeatList = this.region.beatList.filter((beat) => !this.stripUtils.isBeatArtifactOrBlank(beat));
                //Nearest 4 beats left and right of selection
                const beatsLeftOfSelection = effectiveBeatList.slice(0, effectiveBeatList.indexOf(beatsInSelectionRange[0])).slice(-4);
                const beatsRightOfSelection = effectiveBeatList.slice(effectiveBeatList.indexOf(beatsInSelectionRange[beatsInSelectionRange.length-1]) + 1, effectiveBeatList[effectiveBeatList.length-1].index).slice(0, 4);

                let leftAvgHR: number;
                let rightAvgHR: number;
                let nearestBeatsAvgHR: number;

                if (beatsLeftOfSelection.length === 4) {
                    leftAvgHR = this.stripUtils.calcAvgHeartRate(beatsLeftOfSelection, this.region.beatList);
                }
                if (beatsRightOfSelection.length === 4) {
                    rightAvgHR = this.stripUtils.calcAvgHeartRate(beatsRightOfSelection, this.region.beatList);
                }

                if (leftAvgHR && rightAvgHR) {
                    nearestBeatsAvgHR = (leftAvgHR + rightAvgHR) / 2;
                } else if (leftAvgHR && !rightAvgHR) {
                    nearestBeatsAvgHR = leftAvgHR;
                } else if (!leftAvgHR && rightAvgHR) {
                    nearestBeatsAvgHR = rightAvgHR;
                } else {
                    this.pageNotifier.send(PageChannelKey.HEADER_NOTIFY, {
                        action: IHeaderNotifyAction.ADD,
                        snackbars: [
                            {
                                text: snackbarConstants.NOT_ENOUGH_SURROUNDING_BEATS,
                                textColor: IRHYTHM_COLORS.ERROR_RED_TEXT,
                                backgroundColor: IRHYTHM_COLORS.ERROR_RED_BG,
                                durationMs: 10000
                            }
                        ]
                    });

                    return false;
                }

                const leftInsertBackIndex = startingBeat.index;
                const rightInsertBackIndex = this.region.beatList[this.region.beatList.indexOf(beatsInSelectionRange[beatsInSelectionRange.length-1]) + 1].index;
                const timeInterval = this.stripUtils.getTimeInterval(leftInsertBackIndex, rightInsertBackIndex);

                //Substract 1 so we don't include the starting beat that already exists
                const numBeatsToAdd = (Math.round((nearestBeatsAvgHR / 60) * timeInterval)) - 1;
                if (numBeatsToAdd <= 0) {
                    this.pageNotifier.send(PageChannelKey.HEADER_NOTIFY, {
                        action: IHeaderNotifyAction.ADD,
                        snackbars: [
                            {
                                text: snackbarConstants.SELECTED_REGION_HIGHER_RATE_WARNING,
                                textColor: IRHYTHM_COLORS.ERROR_RED_TEXT,
                                backgroundColor: IRHYTHM_COLORS.ERROR_RED_BG,
                                durationMs: 10000
                            }
                        ]
                    });

                    return false;
                }

                //Remove existing beats in the selection area
                //Ignore the first beat as that's still our starting position (except if blank we remove the blank)
                if (beatsInSelectionRange[0].blankProxy) {
                    beatsInSelectionRange[0].blankProxy = false;
                }
                this.region.beatList = this.region.beatList.filter((beat) => beatsInSelectionRange[0] !== beat ? beatsInSelectionRange.indexOf(beat) === -1 : true);
                const indexMovementPerBeat = ((timeInterval * this.dto.data.metaData.ecgSampleRate) / (numBeatsToAdd + 1));
                let currIndexToAdd = leftInsertBackIndex;

                for (let i = 1; i <= numBeatsToAdd; i++) {
                    currIndexToAdd += indexMovementPerBeat;
                    const newBeat: IEcgBeat = {
                        index: currIndexToAdd,
                        beatType: EcgBeatType.REGULAR,
                        effective: true
                    };
                    this.region.beatList.splice((this.region.beatList.indexOf(startingBeat) + i), 0, newBeat);
                }

                return true;
            }
        }

    /**
     * Creates the blank beat session edit
     *
     *  @param {IEcgBeatAction} beatAction
     */
    private addBlankBeatsToSession(beatAction: IEcgBeatAction): void {
        const editRequestData: IEcgRangeEdit = {
            rhythmTypeEdit: beatAction.rhythmTypeEdit,
            blankBeatsRequest: {
                blankBeatsRequestType: BlankBeatsRequestType.SPECIFIC_REGION,
                interval: {
                    startIndex: this.stripUtils.findNearestBeat(beatAction.frontIndexes[0], this.region.beatList, 'left').index,
                    endIndex: beatAction.backIndexes[1]
                }
            }
        }

        this.recordSessionEditService.addSessionEdit(editRequestData);
    }

    /**
     * Creates a remove beat session edit
     *
     *  @param {IEcgBeatAction} beatAction
     */
    private addRemoveBeatEditToSession(beatAction: IEcgBeatAction): void {
        // !isSingleBeatEdit means we're doing a caliper select, this is always a session edit
        if (!this.isSingleBeatEdit(beatAction)) {
            this.recordSessionEditService.addSessionEdit({
                rhythmTypeEdit: beatAction.rhythmTypeEdit,
                startIndex: beatAction.backIndexes[0],
                endIndex: beatAction.backIndexes[1],
                paintModeEdit: false
            });
        // if it's a single beat edit but we're in an active session, push the single beat edit
        } else if (this.recordSessionEditService.hasActiveSession()) {
            this.recordSessionEditService.addSessionEdit({
                rhythmTypeEdit: beatAction.rhythmTypeEdit,
                startIndex: beatAction.backIndexes[0],
                endIndex: beatAction.backIndexes[1],
                paintModeEdit: false
            });
        }
    }

    /**
     * Creates a remove beat session edit
     *
     *  @param {IEcgBeatAction} beatAction
     */
    private addAvgBeatEditToSession(beatAction: IEcgBeatAction): void {
        const nearestBeatLeftOfSelection = this.stripUtils.findNearestBeat(beatAction.frontIndexes[0], this.region.beatList, 'left');
        const nearestBeatRightOfSelection = this.stripUtils.findNearestBeat(beatAction.frontIndexes[1], this.region.beatList, 'right');

        this.recordSessionEditService.addSessionEdit({
            rhythmTypeEdit: EcgRhythmTypeEdit.INSERT_CONSTANT_RATE_PEAKS,
            startIndex: nearestBeatLeftOfSelection.index,
            endIndex: nearestBeatRightOfSelection.index,
            paintModeEdit: false
        });
    }

    private addMarkNormalEditToSession(beatAction: IEcgBeatAction): void {
        this.recordSessionEditService.addSessionEdit({
            rhythmTypeEdit: EcgRhythmTypeEdit.MARK_NORMAL_PEAK,
            startIndex: beatAction.backIndexes[0],
            endIndex: beatAction.backIndexes[1],
            paintModeEdit: false
        });

    }

    /**
     * Checks if the beatAction being performed is in our current region/strip
     *
     *  @param {IEcgBeatAction} beatAction
     */
    private isBeatActionInCurrentRegion(beatAction: IEcgBeatAction): boolean {
        return (beatAction.backIndexes[0] >= this.region.interval.startIndex) && (beatAction.backIndexes[1] <= this.region.interval.endIndex)
    }

    /**
     * Differentiate a single-click beat edit vs caliper selection by checking indexes
     *
     *  @param {IEcgBeatAction} beatAction
     *  @return {boolean}
     */
    private isSingleBeatEdit(beatAction: IEcgBeatAction): boolean {
        return beatAction.backIndexes[0] === beatAction.backIndexes[1];
    }

    /**
     * marks beats as ectopic
     *
     * @param  {IEcgBeatAction}  beatAction
     * @return {boolean}
     */
    private onMarkEctopy(beatAction: IEcgBeatAction): boolean {

        const index = beatAction.beatListIndex;
        const numBeatsToMark = beatAction.numBeatsToMark;
        const otherPeaksKey: string = OptionalBeatAttributes.ECTOPIC_OTHER_PEAK_INDEXES;


        for (let i = 0; i < beatAction.numBeatsToMark; i++) {

            // mark the beat as being an ectopy and which type of ectopy
            this.region.beatList[index + i].beatType = EcgBeatType.ECTOPY;
            this.region.beatList[index + i][OptionalBeatAttributes.ECTOPIC_TYPE] = beatAction.newEctopicType;

            // delete the 'ectopicsOtherPeakIndexes' attribute completely from any beat getting modified
            // since this is an optional attribute of a beat and will only exist when a beat has a beatType of 'ECTOPY'
            // and additionally, that it is a member of a 'couplet' or 'triplet' grouping
            delete this.region.beatList[index + i][otherPeaksKey];
        }


        // here we will set references to to beats that are part of a 'couplet' or 'triplet' grouping
        if (numBeatsToMark > 1) {

            switch (numBeatsToMark) {
                // marking 2 beats,
                case 2:
                    //give the first beat a reference to the second beat
                    this.region.beatList[index][otherPeaksKey] = [this.region.beatList[index + 1].index];
                    //give the second beat a reference to the starting beat
                    this.region.beatList[index + 1][otherPeaksKey] = [this.region.beatList[index].index];
                    break;
                // marking 3 beats
                case 3:
                    //give the first beat a reference to the second and third beats
                    this.region.beatList[index][otherPeaksKey] = [this.region.beatList[index + 1].index, this.region.beatList[index + 2].index];
                    //give the 2nd beat a reference to the first and third beat,
                    this.region.beatList[index + 1][otherPeaksKey] = [this.region.beatList[index].index, this.region.beatList[index + 2].index];
                    //give the 3rd beat a reference to the first and 2nd beats
                    this.region.beatList[index + 2][otherPeaksKey] = [this.region.beatList[index].index, this.region.beatList[index + 1].index];
            }

        }

        return true;
    }

}

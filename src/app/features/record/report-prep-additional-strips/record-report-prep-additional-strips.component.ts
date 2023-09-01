import { Component, OnInit } from '@angular/core';

import { RecordDto } from 'app/features/record/services/dtos/record-dto.service';
import { AdditionalStripsDao, IAdditionalStripsResponse, AdditionalStripReadType } from 'app/commons/services/dao/additional-strips-dao.service';
import { ComponentLoadState } from 'app/commons/enums';
import { EcgDaoController } from 'app/modules/ecg/services/controller/dao/ecg-dao-controller.service';
import { EcgAnalyzeChannelStatus, IEcgCardConfig } from 'app/modules/ecg/interfaces';
import { EcgDaoChannelKey, EcgViewType } from 'app/modules/ecg/enums';
import { RecordRhythmsDto, RecordRhythmsService } from 'app/features/record/rhythms/record-rhythms.service';
import { RhythmType } from 'app/commons/constants/rhythms.const';


@Component({
	selector: 'app-record-report-prep-additional-strips',
	templateUrl: './record-report-prep-additional-strips.component.html',
	styleUrls: ['./record-report-prep-additional-strips.component.scss'],
	providers: [
		RecordRhythmsService,
		RecordRhythmsDto
	]
})
export class RecordReportPrepAdditionalStripsComponent implements OnInit {

	// ECG Config Object
	public ecgConfig: IEcgCardConfig;

	// For use in template
	public ComponentLoadState = ComponentLoadState;

	// Current load state of processing/analyze request
	public responseLoadState: ComponentLoadState = ComponentLoadState.LOADING;

	// Current load state of component (One time thing)
	public componentLoadState: ComponentLoadState = ComponentLoadState.LOADING;


	/**
	 * Ctor
	 *
	 * @param {RecordDto}           private recordDto
	 * @param {AdditionalStripsDao} private additionalStripsDao
	 */
	public constructor(
		private recordDto: RecordDto,
		private additionalStripsDao: AdditionalStripsDao,
		private ecgDaoController: EcgDaoController,
		private rhythmsService: RecordRhythmsService
	) {}


	/**
	 * Get and process additional strips
	 */
	public ngOnInit(): void {

        this.rhythmsService.init({
            rhythmType: RhythmType.SINUS
        });

		// Make request for additional strips
		this.additionalStripsDao
			.getAdditionalStrips({
				ecgSerialNumber: this.recordDto.serialNumber,
				additionalStripReadType: AdditionalStripReadType.READ_WITH_SAMPLES_USING_CONFIG
			})
			.subscribe((response: IAdditionalStripsResponse) => {

                response.ecgMetaData = {
                    ecgSampleRate: 199.805,
                    availableSamples: 16723968,
                    filename: '150418_NTESTL0357',
                    serialNumber: 'NTESTL0357',
                    valuePermv: 1147
                };

                // Set up the configurationg object that defines how our ECG strips will look/operate
                this.ecgConfig = {
                    config: {

                        viewType: EcgViewType.ADDITIONAL_STRIP,

                        global: {
                        },

                        gain: {
                            show: false
                        },

                        info: {
                            show: false
                        },

                        actionMenu: {
                            show: false
                        },

                        toggleMinMax: {
                            show: false
                        },

                        convertArtifact: {
                            show: false
                        },

                        toggleExpandView: {
                            show: false
                        },

                        convertSinus: {
                            show: false
                        },

                        resetView: {
                            show: false
                        },

                        strips: {
                            parentStrips: [
                                {
                                    global: {
                                        bgColor: '#FFFFFF',
                                    },

                                    line: {
                                        height: 160
                                    },

                                    beats: {
                                        showLines: false,
                                        showTicks: false,
                                        lineHeight: 0
                                    },

                                    highlighter: {
                                        show: false
                                    },

                                    axisGrid: {
                                        show: true,
                                        color: '#B9C0C4',
                                        xAxisLineFrequency: 27
                                    },

                                    caliper: {
                                        show: false
                                    },

                                    // This shouldn't be necessary to include but things break without it so leaving it until we can get some strip refactoring in
                                    children: [
                                        {
                                            global: {
                                                bgColor: '#FFF',
                                            },

                                            line: {
                                                height: 0
                                            },

                                            beats: {
                                                showTicks: false,
                                                showLines: false
                                            },

                                            highlighter: {
                                                show: false,
                                                bgColor: null
                                            },

                                            axisGrid: {
                                                show: false
                                            },

                                            primaryEpisodeIndicator: {
                                                show: false
                                            },

                                            navigationArrow: {
                                                show: false
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                };

                // Update RhythmsDto with response data
                // TODO: Strip Refactor: This is a strange approach to me. I don't remember processing the reponse data like this. Why??
                this.ecgDaoController.daoNotifier.send(EcgDaoChannelKey.ANALYZE, {
                    status: EcgAnalyzeChannelStatus.ANALYZE_RESPONSE,
                    serialNumber: this.recordDto.serialNumber,
                    response: response,
                    additionalStripsResponse: response
                });

                // Update load states
                this.componentLoadState = ComponentLoadState.LOADED;
                this.responseLoadState = ComponentLoadState.LOADED;
			});
	}
}

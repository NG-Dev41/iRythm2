import { EcgSecondsViewType } from "app/modules/ecg/enums";
import { IEcgConfigStripGlobal, IEcgConfigBeats, IEcgConfigLine, IEcgConfigStrip } from "app/modules/ecg/interfaces";


export class EcgStripConfigDtoMock {

    ct = {
        global: {
            resolutionScale: 3,
            secondsViewType: EcgSecondsViewType.IN_VIEW,
            showHrType: false
        } as any as IEcgConfigStripGlobal,
        beats: {
            showLines: false,
            show: false,
            addLineElement: {} as HTMLElement
        } as IEcgConfigBeats,
        line: {
            height: 9
        } as IEcgConfigLine,
        html: {
            canvas: {} as any
        },
        highlighter: {
            width: 200
        },
        axisGrid: {
            show: false
        },
        episodeDurationText: {
            show: false
        },
	    focusIndicator: {
			show: false,
		    duration: -1
	    }
    } as IEcgConfigStrip;


}

import { IEcgConfigBeats, IEcgConfigStrip } from "app/modules/ecg/interfaces";
import { of } from "rxjs";

export class EcgNavigationArrowControllerMock {
    public init = () => of({ success: true });

    config = {
        ct: {
            navigationArrow: {
                containerTop: 12
            },
            beats: {
                show: true
            } as IEcgConfigBeats,
            line: {
                height: 10
            }
        } as IEcgConfigStrip
    }
}
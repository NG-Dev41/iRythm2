import { IEcgConfigStrip } from "app/modules/ecg/interfaces";
import { EcgStripConfigDto } from "app/modules/ecg/services/dto/ecg/ecg-strip-config-dto.service";
import { of } from "rxjs";

export class EcgPrimaryEpisodeIndicatorControllerMock {
    public send = () => {}
    public init = () => of({ success: true })
    config = {
        ct: {
            primaryEpisodeIndicator: {
                width: 12,
                show: true
            }
        } as IEcgConfigStrip
    } as EcgStripConfigDto;

}
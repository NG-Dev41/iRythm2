import { of } from "rxjs";

export class EcgStripGroupControllerMock {
    public init = () => of({ success: true })
}
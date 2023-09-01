import { of } from "rxjs";

export class EcgGainControllerMock {
    public init = () => of({ success: true });
}
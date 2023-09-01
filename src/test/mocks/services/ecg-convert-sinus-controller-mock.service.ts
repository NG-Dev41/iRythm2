import { of } from "rxjs";

export class EcgConvertSinusControllerMock {
    public init = () => of({ success: true });
    public convertToSinus = () => {};
}
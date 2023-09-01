import { of } from "rxjs";

export class EcgControllerMock {
    public init = () => of({ success: true });
}
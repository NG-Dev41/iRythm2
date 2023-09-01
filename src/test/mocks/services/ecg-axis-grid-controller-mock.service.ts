import { of } from "rxjs";

export class EcgAxisGridControllerMock {
    public init = () => of({ success: true });
}
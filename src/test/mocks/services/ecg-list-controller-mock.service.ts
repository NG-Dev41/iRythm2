import { of } from "rxjs";

export class EcgListControllerMock {

    public ecgCards = [];

    init() { return of({ success: true }) }
    processEcgData() {}
}
import { of } from "rxjs";

export class EcgResetDaoMock {
    resetEcg() {
        return of({});
    }
}
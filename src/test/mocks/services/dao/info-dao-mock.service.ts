import { of } from "rxjs";

export class InfoDaoMock {
    getInfo() {
        return of({});
    }
}
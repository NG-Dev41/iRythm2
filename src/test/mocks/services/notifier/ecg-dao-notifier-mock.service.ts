import { IEcgDaoEditChannel } from "app/modules/ecg/interfaces";
import { of } from "rxjs";

export class EcgDaoNotifierMock {
    listen() {return of({} as IEcgDaoEditChannel)}
}
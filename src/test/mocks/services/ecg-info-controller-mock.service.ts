import { of } from "rxjs"

export class EcgInfoControllerMock {
    init() { return of({ success: true }) }
}
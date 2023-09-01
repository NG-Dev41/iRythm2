import { of } from "rxjs"

export class EcgActionMenuControllerMock {
    public init = () => of({ success: true })
}
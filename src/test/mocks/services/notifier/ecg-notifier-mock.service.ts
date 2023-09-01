import { of } from "rxjs";

export class EcgNotifierMock {
    send() {}
    listen() { return of('subscription') }
    stopListening() { return of('abc')}
}
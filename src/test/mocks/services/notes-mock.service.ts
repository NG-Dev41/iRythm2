import { of } from "rxjs";

export class NotesServiceMock {
    public makeNotesRequest() {
        return of({});
    }
}

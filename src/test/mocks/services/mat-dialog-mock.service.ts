import { MatDialogRef } from "@angular/material/dialog";
import { of } from "rxjs";

export class MatDialogMock {
    open(T) { return { afterClosed() { return of(true)} } as MatDialogRef<typeof T>}
}
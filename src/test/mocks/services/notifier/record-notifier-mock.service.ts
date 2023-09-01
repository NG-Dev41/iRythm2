import { of } from "rxjs";

import { IRecordActionChannel } from "app/features/record/services/interfaces/channel.interface";
import { RecordChannelKey } from "app/features/record/services/enums";


export class RecordNotifierMock {
    listen() {return of({} as IRecordActionChannel)}

    send(recordChannelKey: RecordChannelKey, data) {}
}

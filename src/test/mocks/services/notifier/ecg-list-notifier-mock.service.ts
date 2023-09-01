import {
    EcgChannelData,
    EcgChannelName,
    EcgListChannelData,
    EcgListChannelName,
    IEcgBeatActionChannel,
    IEcgLineActionChannel,
    IEcgListActionData,
    IEcgListContextMenuChannel,
} from 'app/modules/ecg/interfaces';
import { of, Subject } from 'rxjs';
import { EcgListChannelKey } from '../../../../app/modules/ecg/enums';
import { Injectable } from '@angular/core';
@Injectable()
export class EcgListNotifierMock {
    /**
     * Channels object.
     */
    private channels;

    /**
     * Ctor
     *
     * Sets key/values fort he notification channels obj.
     */
    public constructor() {
        // Set up different channels that can be listed on
        this.channels = {
            [EcgListChannelKey.ACTION]: new Subject<IEcgListActionData>(),
            [EcgListChannelKey.BEAT_ACTION]: new Subject<IEcgBeatActionChannel>(),
            [EcgListChannelKey.LINE_ACTION]: new Subject<IEcgLineActionChannel>(),
            [EcgListChannelKey.CONTEXT_MENU]: new Subject<IEcgListContextMenuChannel>(),
        };
    }


    public send<T extends EcgListChannelName>(channelKey: T, data: EcgListChannelData[T]): void {
        this.channels[channelKey].next(data);
    }

    /**
     * Listen to notifications on a specific channel
     */
    public listen<T extends EcgListChannelName>(channelKey: T): Subject<EcgListChannelData[T]> {
        return this.channels[channelKey];
    }

    // public listen() {return of({} as IEcgListContextMenuChannel)}

    /**
     * Unsubscribes all of the channels
     * Used when destroying the notifier / component for the notifier
     */
    public stopListening(): void {}
}

import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { EcgListActionType, EcgListChannelKey } from '../../../../enums';
import {
	EcgListChannelData, EcgListChannelName, IEcgListActionData, IEcgBeatActionChannel, IEcgLineActionChannel, EcgChannelName,
	EcgChannelData, IEcgListContextMenuChannel, IEcgMetaData, IEcgEpisodeInterval, IEpisode
} from '../../../../interfaces';
import { RhythmType } from '../../../../../../commons/constants/rhythms.const';


/**
 * EcgListsNotifier
 *
 * Top leve list notifier
 */
@Injectable()
export class EcgListNotifier {
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
	
	/**
	 * Send a notification over a specific channel.
	 *
	 * @type {T}
	 */
	public send<T extends EcgListChannelName>(channelKey: T, data: EcgListChannelData[T]): void {
		this.channels[channelKey].next(data);
	}

    /**
     * Listen to notifications on a specific channel
     */
    public listen<T extends EcgListChannelName>(channelKey: T): Subject<EcgListChannelData[T]> {
        return this.channels[channelKey];
    }

    /**
     * Unsubscribes all of the channels
     * Used when destroying the notifier / component for the notifier
     */
    public stopListening(): void {
        // convert channel object into array, run unsubscribe for each channel
        Object.values(this.channels).forEach(<T extends EcgChannelName>(channelValue: Subject<EcgChannelData[T]>) =>
            channelValue.unsubscribe()
        );
    }
}

import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { EcgDaoChannelKey } from '../../../enums';
import {
	EcgDaoChannelData, EcgDaoChannelName, IEcgAnalyzeChannel, IEcgDaoEditChannel
} from '../../../interfaces';


/**
 * EcgNotifier
 *
 * Top level ecg notifier
 */
@Injectable()
export class EcgDaoNotifier {

    /**
     * Channels object.
     * Holds a list of channales/observables accessed by EcgChannelKey
     *
     * TODO: How do typehint this
     * https://stackoverflow.com/questions/60141960/typescript-key-value-relation-preserving-object-entries-type
     */
    private channels;


    /**
     * Ctor
     *
     * Sets key/values for the notification channels obj.
     */
    public constructor() {

        // Set up different channels that can be listed on
        // TODO: Should make this dynamic so we don't have to add to this everytime we create a new channel
        this.channels = {
            [EcgDaoChannelKey.DAO_EDIT]: new Subject<IEcgDaoEditChannel>(),
	        [EcgDaoChannelKey.ANALYZE]: new Subject<IEcgAnalyzeChannel>()
        };
    }


    /**
     * Send a notification over a specific channel.
     *
     * @type {T}
     */

    // todo: borrowing the type from EcgChannelName
    public send<T extends EcgDaoChannelName>(channelKey: T, data: EcgDaoChannelData[T]): void {
        this.channels[channelKey].next(data);
    }


    /**
     * Listen to notifications on a specific channel
     */
    public listen<T extends EcgDaoChannelName>(channelKey: T): Subject<EcgDaoChannelData[T]> {
        return this.channels[channelKey];
    }
}

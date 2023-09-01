import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { EcgStripChannelKey } from '../../../../../enums';
import {
    IEcgLineActionChannel,
    EcgStripChannelData,
    EcgStripChannelName,
    IEcgCaliperActionChannel,
} from '../../../../../interfaces';


/**
 * EcgStripNotifier
 *
 * Top level ecg strip notifier.
 * This is used to communicate between StripGroupComponent and it child components.
 */
@Injectable()
export class EcgStripNotifier {

	/**
	 * Channels object.
	 * Holds a list of channales/observables accessed by EcgStripChannelKey
	 *
	 * TODO: How do typehint this
	 * https://stackoverflow.com/questions/60141960/typescript-key-value-relation-preserving-object-entries-type
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
            [EcgStripChannelKey.CALIPER_ACTION]: new Subject<IEcgCaliperActionChannel>()
		};
	}


	/**
	 * Send a notification over a specific channel.
	 *
	 * @type {T}
	 */
	public send<T extends EcgStripChannelName>(channelKey: T, data: EcgStripChannelData[T]): void {
		this.channels[channelKey].next(data);
	}


	/**
	 * Listen to notifications on a specific channel
	 */
	public listen<T extends EcgStripChannelName>(channelKey: T): Subject<EcgStripChannelData[T]> {
		return this.channels[channelKey];
	}
}

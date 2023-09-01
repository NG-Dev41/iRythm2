import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { ISidebarActionChannel, SidebarChannelData, SidebarChannelName } from 'app/features/record/services/interfaces/record-sidebar.interface';
import { SidebarChannelKey } from 'app/features/record/services/enums/channel.enum';


/**
 * SidebarNotifier
 *
 * Sidebar Top Level Notifier
 * Channels that all Sidebar child components will have to access to
 */
@Injectable()
export class RecordSidebarNotifier {

	/**
	 * Channels object.
	 * Holds a list of channales/observables accessed by SidebarChannelKey
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
		    [SidebarChannelKey.ACTION]: new Subject<ISidebarActionChannel>()
		};
	}


	/**
	 * Send a notification over a specific channel.
	 *
	 * @type {T}
	 */
	public send<T extends SidebarChannelName>(channelKey: T, data: SidebarChannelData[T]): void {
		this.channels[channelKey].next(data);
	}


	/**
	 * Listen to notifications on a specific channel
	 */
	public listen<T extends SidebarChannelName>(channelKey: T): Subject<SidebarChannelData[T]> {
		return this.channels[channelKey];
	}


    /**
     * Unsubscribe from all channels
     */
    public stopListening(): void {
        // convert channel object into array, run unsubscribe for each channel
        Object
        	.values(this.channels)
        	.forEach(<T extends SidebarChannelName>(channelValue: Subject<SidebarChannelData[T]>) => channelValue.unsubscribe());
    }
}

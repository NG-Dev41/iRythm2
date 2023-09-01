import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import {
	IHRBarActionChannel, IRecordActionChannel, IRecordEcgLayoutTypeChannel, IRecordMarkEctopyChannel, IRecordPaintChannel,
	IRecordReportChannel,
	IRecordRightColModalChannel, RecordChannelData, RecordChannelName
} from '../interfaces/record-sidebar.interface';
import { RecordChannelKey } from '../enums/channel.enum';


/**
 * RecordNotifier
 *
 * Record Top Level Notifier
 * Channels that all Record child components will have to access to
 */
@Injectable()
export class RecordNotifier {

	/**
	 * Channels object.
	 * Holds a list of channales/observables accessed by RecordChannelKey
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
		    [RecordChannelKey.ACTION]: new Subject<IRecordActionChannel>(),
            [RecordChannelKey.LAYOUT_TYPE]: new Subject<IRecordEcgLayoutTypeChannel>(),
			[RecordChannelKey.HR_BAR_ACTION]: new Subject<IHRBarActionChannel>(),
            [RecordChannelKey.MARK_ECTOPY]: new Subject<IRecordMarkEctopyChannel>(),
            [RecordChannelKey.PAINT_RHYTHM]: new Subject<IRecordPaintChannel>(),
            [RecordChannelKey.REPORT_ACTION]: new Subject<IRecordReportChannel>(),
			[RecordChannelKey.OPEN_RIGHT_COL_MODAL]: new Subject<IRecordRightColModalChannel>()
		};
	}


	/**
	 * Send a notification over a specific channel.
	 *
	 * @type {T}
	 */
	public send<T extends RecordChannelName>(channelKey: T, data: RecordChannelData[T]): void {
		this.channels[channelKey].next(data);
	}


	/**
	 * Listen to notifications on a specific channel
	 */
	public listen<T extends RecordChannelName>(channelKey: T): Subject<RecordChannelData[T]> {
		return this.channels[channelKey];
	}


    /**
     * Unsubscribe from all channels
     */
    public stopListening(): void {
        // convert channel object into array, run unsubscribe for each channel
        Object.values(this.channels)
        .forEach(<T extends RecordChannelName>(channelValue: Subject<RecordChannelData[T]>) => channelValue.unsubscribe());
    }
}

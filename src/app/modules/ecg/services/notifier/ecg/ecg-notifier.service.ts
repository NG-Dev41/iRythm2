import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { EcgChannelKey } from 'app/modules/ecg/enums';
import { EcgChannelData, EcgChannelName } from 'app/modules/ecg/interfaces';


/**
 * EcgNotifier
 *
 * Top level ecg notifier
 */
@Injectable()
export class EcgNotifier {

	/**
	 * Channels object.
	 * Holds a list of channales/observables accessed by EcgChannelKey
	 *
	 * TODO: How do typehint this
	 * https://stackoverflow.com/questions/60141960/typescript-key-value-relation-preserving-object-entries-type
	 */
	private channels: { [s in EcgChannelKey]: Subject<EcgChannelData[s]>; }


	/**
	 * Ctor
	 *
	 * Sets key/values for the notification channels obj.
	 */
	public constructor() {

		// Set up different channels that can be listed on
		// TODO: Should make this dynamic so we don't have to add to this everytime we create a new channel
		/**
		this.channels = {
		    [EcgChannelKey.COMPONENT_STATE]: new Subject<IEcgComponentStateChannel>(),
		    [EcgChannelKey.GAIN_CHANGE]: new Subject<IEcgGainChangeChannel>(),
            [EcgChannelKey.MIN_MAX]: new Subject<IEcgToggleMinMaxChannel>(),
            [EcgChannelKey.CONVERT_ARTIFACT]: new Subject<IEcgConvertArtifactChannel>(),
            [EcgChannelKey.EXPAND_VIEW]: new Subject<IEcgToggleExpandChannel>(),
            [EcgChannelKey.RESET_VIEW]: new Subject<IEcgResetViewChannel>(),
            [EcgChannelKey.CONVERT_SINUS]: new Subject<IEcgConvertSinusChannel>(),
            [EcgChannelKey.ACTION_MENU]: new Subject<IEcgActionMenuChannel>(),
            [EcgChannelKey.BEAT_ACTION]: new Subject<IEcgBeatActionChannel>(),
            [EcgChannelKey.PAINT_INTERVAL]: new Subject<IEcgPaintIntervalChannel>(),
            [EcgChannelKey.BEAT_RENDER_ACTION]: new Subject<IEcgBeatRenderActionChannel>(),
            [EcgChannelKey.LINE_RENDER_ACTION]: new Subject<IEcgLineActionChannel>(),
            [EcgChannelKey.HIGHLIGHTER_MOVING]: new Subject<IEcgHighlighterMovingChannel>(),
            [EcgChannelKey.MOVE_HIGHLIGHTER]: new Subject<IEcgMoveHighlighterChannel>(),
            [EcgChannelKey.LINE_IMAGE_LOADED]: new Subject<IEcgLineImageLoadedChannel>()
		};
		*/
		
		let channels = {};
		Object.values(EcgChannelKey).forEach(channelKey => channels[channelKey] = new Subject());
		this.channels = channels as { [s in EcgChannelKey]: Subject<EcgChannelData[s]>; };
	}


	/**
	 * Send a notification over a specific channel.
	 *
	 * @type {T}
	 */
	public send<T extends EcgChannelName>(channelKey: T, data: EcgChannelData[T]): void {
		this.channels[channelKey].next(data);
	}


	/**
	 * Listen to notifications on a specific channel
	 */
	public listen<T extends EcgChannelName>(channelKey: T): Subject<EcgChannelData[T]> {
		return this.channels[channelKey];
	}

    /**
     * Unsubscribe from all channels
     */
    public stopListening(): void {
        // convert channel object into array, run unsubscribe for each channel
        Object.values(this.channels)
        .forEach(<T extends EcgChannelName>(channelValue: Subject<EcgChannelData[T]>) => channelValue.unsubscribe());
    }
}

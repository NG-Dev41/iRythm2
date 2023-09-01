import { GlobalChannelKey, GlobalChannelAction } from '../enums';


/**
 * Channels available with the GlobalNotifier
 * @type {Object}
 */
export type GlobalChannelData = {
    [GlobalChannelKey.ACTION]?: IGlobalActionChannel;
};


/**
 * Data that can be passed over the GlobalChannelKey.ACTION channel.
 * I see this channel being used for very basic actions that require no additional data to be passed along.
 */
export interface IGlobalActionChannel {
	action: GlobalChannelAction;
}

/**
 * Channel Name - Each Key of the ChannelData type.
 */
export type GlobalChannelName = keyof GlobalChannelData;

export interface IHeaderNotifyChannel {
	action: IHeaderNotifyAction;
	snackbars: Snackbar[];
}

export enum IHeaderNotifyAction {
	ADD
}

export interface Snackbar {
	text: string;
	textColor?: string;
	backgroundColor?: string;
	clickFunction?: (($event: MouseEvent) => void);
	durationMs?: number;
	shouldHaveCloseButton?: boolean;
}


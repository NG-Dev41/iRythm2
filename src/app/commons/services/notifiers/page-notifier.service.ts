import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { INavigationItem } from 'app/commons/constants/page-meta.const';
import { IHeaderNotifyChannel } from 'app/commons/interfaces/channel.interface';


/**
 * PageNotifier
 */
@Injectable()
export class PageNotifier {

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
            [PageChannelKey.ROUTE_CHANGE]: new Subject<IRouteChangeChannel>(),
            [PageChannelKey.NAVIGATION_SUB_TABS]: new Subject<INavigationSubTabChannel>(),
            [PageChannelKey.HEADER_NOTIFY]: new Subject<IHeaderNotifyChannel>(),
        };
    }


    /**
     * Send a notification over a specific channel.
     *
     * @type {T}
     */

    // todo: borrowing the type from EcgChannelName
    public send<T extends PageChannelName>(channelKey: T, data: PageChannelData[T]): void {
        this.channels[channelKey].next(data);
    }


    /**
     * Listen to notifications on a specific channel
     */
    public listen<T extends PageChannelName>(channelKey: T): Subject<PageChannelData[T]> {
        return this.channels[channelKey];
    }
}



export enum PageChannelKey {
    ROUTE_CHANGE,
    NAVIGATION_SUB_TABS,
    HEADER_NOTIFY
}

export type PageChannelData = {
    [PageChannelKey.ROUTE_CHANGE]?: IRouteChangeChannel;
    [PageChannelKey.NAVIGATION_SUB_TABS]?: INavigationSubTabChannel;
    [PageChannelKey.HEADER_NOTIFY]?: IHeaderNotifyChannel;
}

export type PageChannelName = keyof PageChannelData;


export interface IRouteChangeChannel {
}

export interface INavigationSubTabChannel {
    subTabs: Array<INavigationItem>;
}

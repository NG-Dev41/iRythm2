import { PageChannelData, PageChannelName } from 'app/commons/services/notifiers/page-notifier.service';
import { of, Subject } from 'rxjs';

export class PageNotifierMock {



    public send<T extends PageChannelName>(channelKey: T, data: PageChannelData[T]): void {

    }


    public listen<T extends PageChannelName>(channelKey: T): Subject<PageChannelData[T]> {
        return new Subject<PageChannelData[T]>();
    }
}

import { INavigationItem } from '../../../app/commons/constants/page-meta.const';
import { IPageServiceLoadInput } from '../../../app/commons/services/page/page.service';

export class PageServiceMock {

    public loadPage(input: IPageServiceLoadInput): void {
    }

    public setPageMeta(url: string): void {

    }

    public addNavigationSubTabs(tabs: Array<INavigationItem>): void {
    }
}

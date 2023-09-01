import { PageKey, IPageMeta, INavigationItem } from 'app/commons/constants/page-meta.const';

export class PageDtoMock {
    // Page Key
    public key: PageKey;

    // Page Meta Data
    public meta: IPageMeta = {} as IPageMeta;

    // Current URL
    public url: string;

    // Segments of a url path as array
    // Ex. /record/1234/overview = ['record', '1234', 'overview']
    public urlPathSegments: Array<string> = new Array<string>();

    // Previous URL
    public previousUrl: string;

    // Page navigation sub tabs
    // Ex. Longest, Fastest, Fastest Average, etc...
    // Ex. Additional Strips, Preliminary Findings
    public navigationSubTabs: Array<INavigationItem> = [];
}

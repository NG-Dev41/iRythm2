import { ActiveNavSubTab } from './active-nav-sub-tab.pipe';
import { INavigationItem } from '../constants/page-meta.const';

describe('ActiveNavSubTab', () => {
    const pipe = new ActiveNavSubTab();
    let locationSpy;

    beforeAll(() => {
        locationSpy = jest.spyOn(window, 'location', 'get');
    });

    beforeEach(() => {
        locationSpy.mockReset();
    });

    it('should return false if navItem does not match window queryString', () => {
        locationSpy.mockReturnValue({search: '?sortType=testing'} as any as Location);
        const navItem = {params: {sortType: 'FASTEST'}} as any as INavigationItem;
        expect(pipe.transform(navItem)).toBe(false);
        expect(locationSpy).toHaveBeenCalledTimes(1);
    });

    it('should return true if navItem matches window queryString', () => {
        locationSpy.mockReturnValue({search: '?sortType=FASTEST'} as any as Location);
        const navItem = {params: {sortType: 'FASTEST'}} as any as INavigationItem;
        expect(pipe.transform(navItem)).toBe(true);
        expect(locationSpy).toHaveBeenCalledTimes(1);
    });

    it('should return false if navItem is not default and there is no queryString', () => {
        locationSpy.mockReturnValue({search: ''} as any as Location);
        const navItem = {isDefault: false} as any as INavigationItem;
        expect(pipe.transform(navItem)).toBe(false);
        expect(locationSpy).toHaveBeenCalledTimes(1);
    });


    it('should return true if navItem is default and there is not queryString', () => {
        locationSpy.mockReturnValue({search: ''} as any as Location);
        const navItem = {isDefault: true} as any as INavigationItem;
        expect(pipe.transform(navItem)).toBe(true);
        expect(locationSpy).toHaveBeenCalledTimes(1);
    });

});
import { TestBed } from '@angular/core/testing';
import { preventNagivationGuard } from "./prevent-navigation.guard";
import { of } from "rxjs";

describe('preventNagivationGuard', () => {
    it('should return component canDeactivate method response if component canDeactivate defined', () => {
        const component = { canDeactivate: () => false }
        const result = preventNagivationGuard(component, undefined, undefined, undefined);
        expect(result).toBe(false);
    });

    it('should return true if component canDeactivate is undefined', () => {
        const result = preventNagivationGuard(undefined, undefined, undefined, undefined);
        expect(result).toBe(true);
    });
});

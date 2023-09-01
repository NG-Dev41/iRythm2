import { Observable } from 'rxjs';
/**
 * Interface that a class can implement to be a guard
 */
export interface ICanComponentDeactivate {
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
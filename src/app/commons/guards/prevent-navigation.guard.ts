import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';
import { ICanComponentDeactivate } from '../interfaces/can-component-deactivate.interface';

export const preventNagivationGuard: CanDeactivateFn<ICanComponentDeactivate> = (component: ICanComponentDeactivate): boolean | Observable<boolean> | Promise<boolean> => {
    return component?.canDeactivate ? component.canDeactivate() : true;
}
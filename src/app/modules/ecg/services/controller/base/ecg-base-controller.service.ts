import { Observable } from 'rxjs';

import { EcgComponentState, EcgComponentKey } from '../../../enums';
import { IEcgControllerInit } from '../../../interfaces';

export abstract class EcgBaseController {

    // Load state of component
    public componentLoadState: EcgComponentState;

    // Component Key/ID
    public componentKey: EcgComponentKey;


    public constructor() {}


    /**
     * Abstract method to force child controllers to set the component key.
     * TODO: Probably a better way to accomplish this...perhaps using generics?
     *
     * @param {EcgComponentKey} key
     */
    protected abstract setComponentKey(): void;


    /**
     * Force all controllers to implement init
     * TODO: get rid of this any
     * @param  {any}                            config
     * @return {Observable<IEcgControllerInit>}
     */
    public abstract init(config?: any): Observable<IEcgControllerInit>;

    /**
     * Many of the controllers we use are not provided by the framework
     * and will not be able to use the ngOnDestroy() feature of the Angular lifecycle which is
     * available for injected services
     */
    public abstract destroy(): void;

}

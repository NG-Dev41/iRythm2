import { Subscription } from "rxjs";


export class RecordNavigationServiceMock {

    public pageNotifierSub$ = Subscription.EMPTY;
    
    public init = () => null;
}
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Module loading error
import { throwIfAlreadyLoaded } from 'app/core/module-load-error';


@NgModule({
    imports: [
        HttpClientModule
    ],
    declarations: [

    ]
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }
}

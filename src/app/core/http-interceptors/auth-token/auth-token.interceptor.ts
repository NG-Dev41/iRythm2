import { Injectable, Inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';


@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {


    /**
     * Ctor
     *
     * @param {OktaAuth} @Inject(OKTA_AUTH)  private oktaAuth
     */
    public constructor(
        @Inject(OKTA_AUTH) private oktaAuth: OktaAuth
    ) {}


    /**
     * Auth token interceptor.
     *
     * @param  {HttpRequest<any>} request
     * @param  {HttpHandler}      next
     * @return {Observable}
     */
    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // Check if we have an auth token available
        if(this.oktaAuth.getAccessToken()) {

            // Add auth token to request header
            request = request.clone({
                setHeaders: {
                    ['Authorization']: `Bearer ${this.oktaAuth.getAccessToken()}`
                }
            });
        }

        return next.handle(request);
    }
}

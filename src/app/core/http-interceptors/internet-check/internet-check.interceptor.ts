import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class InternetCheckInterceptor implements HttpInterceptor {

    /**
     * Checks whether there's a valid internet connect or not.
     * If no connection - HttpErrorResponse is thrown.
     * If valid connection - Request is handled normally.
     *
     * @param  {HttpRequest<any>} request
     * @param  {HttpHandler}      next
     * @return {Observable}
     */
    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // Check internet connection
        if(!window.navigator.onLine) {

            // If there's no internet throw a HttpErrorResponse error
            // Because an error is thrown, the function will terminate here
            return throwError(new HttpErrorResponse({
                error: 'Internet is required.'
            }));
        }
        else {

            // Return the normal request
            return next.handle(request);
        }
    }
}

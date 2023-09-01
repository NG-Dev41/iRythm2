import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UnrecoverableErrorCode } from 'app/commons/enums';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

    constructor(private _router: Router) {}

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            tap({
                next: (response: HttpEvent<any>) => {
                    if(response instanceof HttpResponse
                        && response.body?.errorInfo?.hasError) {
                        let unrecoverableErrors: any[] = this.checkForUnrecoverableError(response.body.errorInfo.errorRecordList);
                        if(unrecoverableErrors && unrecoverableErrors.length > 0) {
                            this.handleUnrecoverableError(unrecoverableErrors);
                        }
                    }
                }
            })
        );
    }

    private checkForUnrecoverableError(errorRecordList: any[]): any[] {
        const unrecoverableErrorArray: string[] = Object.keys(UnrecoverableErrorCode).filter((key) => isNaN(Number(key)));
        return errorRecordList.filter((errorRecord) => unrecoverableErrorArray.includes(errorRecord?.errorCode));
    }

    private handleUnrecoverableError(unrecoverableErrors?: any[]): void {
        const errors = unrecoverableErrors?.map((error) => error.errorCode);
        console.log(`Received unrecoverable error, redirecting to queue `, errors);
        this._router.navigate(['queue']);
    }
}

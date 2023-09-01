import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ErrorHandlerInterceptor } from './error-handler.interceptor';
import { HttpResponse } from '@angular/common/http';
import { UnrecoverableErrorCode } from 'app/commons/enums';

describe('ErrorHandlerInterceptor', () => {
    let mockRouter: Router = { navigate: () => of(true) } as any as Router;
    let mockRouterSpy = jest.spyOn(mockRouter, 'navigate');
    let interceptor = new ErrorHandlerInterceptor(mockRouter);

    beforeEach(() => {
        mockRouterSpy.mockReset();
    });

    describe('intercept', () => {
        let payload;
        let response;
        let httpHanderMock;
        
        beforeEach(() => {
            response = new HttpResponse(payload);
            httpHanderMock = { handle: jest.fn().mockReturnValue( of(response) ) };
            interceptor.intercept(response, httpHanderMock).subscribe();
        });
        describe('HTTP 200 responses', () => {
            beforeAll(() => {
                payload = {
                    status: 200
                };
            });

            it('should intercept 200 response with no errors and do nothing', () => {
                expect(mockRouterSpy).toHaveBeenCalledTimes(0);
            });
    
            describe('HTTP 200 responses with unknown error', () => {
                let errorCode: string = 'RECOVERABLE_ERROR';
                beforeAll(() => {
                    payload = {
                        status: 200,
                        body: {
                            errorInfo: {
                                hasError: true,
                                errorRecordList: [
                                    {
                                        errorCode: errorCode
                                    }
                                ]
                            }
                        }
                    };    
                });
                it('should intercept 200 response with errors and do nothing', () => {
                    expect(mockRouterSpy).toHaveBeenCalledTimes(0);
                });
                
            });
            
            describe('HTTP 200 responses with known unrecoverable error', () => {
                let errorCode: string = UnrecoverableErrorCode[UnrecoverableErrorCode.SERIAL_NUMBER_NOT_FOUND];
                beforeAll(() => {
                    payload = {
                        status: 200,
                        body: {
                            errorInfo: {
                                hasError: true,
                                errorRecordList: [
                                    {
                                        errorCode: errorCode
                                    }
                                ]
                            }
                        }
                    };    
                });
                it('should intercept 200 response with unrecoverable error and redirect user to queue', () => {
                    expect(mockRouterSpy).toHaveBeenCalledTimes(1);
                });

            })
        });
    });

});
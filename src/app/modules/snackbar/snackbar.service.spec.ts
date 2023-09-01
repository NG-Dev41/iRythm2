import { TestBed } from '@angular/core/testing';
import { SnackbarService } from './snackbar.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('SnackbarService', () => {
    let service: SnackbarService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [BrowserAnimationsModule, MatSnackBarModule],
            providers: [
                SnackbarService
            ]
        });
        service = TestBed.inject(SnackbarService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('openSnackBar method', () => {
        it('should open snackbar with given message, action and configuration', () => {
            const spyOpen = jest.spyOn(service['snackBar'], 'open');
            const message = "Image uploaded successfully";
            const action = "Success";
            service.openSnackBar(message, action);
            expect(spyOpen).toHaveBeenCalledWith(message, action, {
                duration: 300000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: 'snackbar',
            });
        })
    })

    describe('error method', () => {
        it('should open snackbar with given message and configuration', () => {
            const spyOpen = jest.spyOn(service['snackBar'], 'open');
            const message = "can't fetch data";
            const result = service.error(message);
            expect(spyOpen).toHaveBeenCalledWith(message, undefined, {
                duration: 10000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: 'snackbar-error'
            });
            expect(result).toBeDefined();
        })
    })

    describe('warning method', () => {
        it('should open snackbar with given message, action and configuration', () => {
            const spyOpen = jest.spyOn(service['snackBar'], 'open');
            const message = "can remove entity";
            const action = "Delete";
            const result = service.warning(message, action);
            expect(spyOpen).toHaveBeenCalledWith(message, action, {
                duration: 10000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                panelClass: 'snackbar-warning'
            });
            expect(result).toBeDefined();
        })
    })

    describe('success method', () => {
        it(`should open snackbar with given message and 'snackbar-success' panelClass`, () => {
            const spyOpen = jest.spyOn(service['snackBar'], 'open');
            const message = "deleted successfully";
            const result = service.success(message);
            expect(spyOpen).toHaveBeenCalledWith(message, undefined, { panelClass: ['snackbar-success'] });
            expect(result).toBeDefined();
        })
    })

    describe('info method', () => {
        it(`should open snackbar with given message and 'snackbar-info' panelClass`, () => {
            const spyOpen = jest.spyOn(service['snackBar'], 'open');
            const message = "information test";
            const result = service.info(message);
            expect(spyOpen).toHaveBeenCalledWith(message, undefined, { panelClass: ['snackbar-info'] });
            expect(result).toBeDefined();
        })
    })
});

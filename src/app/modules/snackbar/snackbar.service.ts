import { Injectable } from '@angular/core';

import {MatSnackBar, MatSnackBarRef, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root' // for use throughout application
})
export class SnackbarService {

    constructor(

        private snackBar: MatSnackBar) {
    }

    public openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 300000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: 'snackbar',


        });
    }

    // use for error handling
    error(message: string) {
        return this.snackBar.open(message, undefined, {
            duration: 10000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: 'snackbar-error'
        });
    }

    warning(message: string, action) {
        return this.snackBar.open(message, action, {
            duration: 10000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: 'snackbar-warning'
        });
    }

    success(message: string) {
        return this.snackBar.open(message, undefined, {panelClass: ['snackbar-success']});
    }

    info(message: string) {
        return this.snackBar.open(message, undefined, {panelClass: ['snackbar-info']});
    }
}

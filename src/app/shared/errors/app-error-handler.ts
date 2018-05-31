import { ErrorHandler } from '@angular/core';
export class AppErrorHanlder implements ErrorHandler {
    handleError() {
        console.error('Damn !!! It seems there is a problem with our server');
    }
}

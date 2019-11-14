import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class Logger {
  private logs: string[] = []; // capture logs for testing

  constructor(private snackBar: MatSnackBar) {}
  log(message: string, duration?: number) {
    this.logs.push(message);
    this.openSnackBar(message, duration);
    console.log(message);
  }

  private openSnackBar(message: string, duration?: number, action?: string) {

    this.snackBar.open(message, action, {
      // tslint:disable-next-line: no-bitwise
      duration: duration | 2000,
    });
  }


  getLogs(): string[] {

    return this.logs;
  }

  error(message: string) {
    console.error(message);
  }

  warn(message: string)  {
    this.logs.push(message);
    console.warn(message);
  }
}

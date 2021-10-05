import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class Logger {

  private logs: string[] = []; // capture logs for testing

  constructor(private snackBar: MatSnackBar) { }

  log(message: string, duration?: number) {

    // add messages to Queue
    this.logs.push(message);

    // Create Material SnackBar and send message by duration
    this.openSnackBar(message, duration);

    // console log
    console.log(message);
  }

  getLogs(): string[] {

    // return this logger Array
    return this.logs;
  }

  error(message: string) {

    // console error message
    console.error(message);
  }

  warn(message: string) {

    // add warning messages to Queue
    this.logs.push(message);

    // console warning message
    console.warn(message);
  }

  private openSnackBar(message: string, duration?: number, action?: string) {

    this.snackBar.open(message, action, {
      // tslint:disable-next-line: no-bitwise
      duration: duration | 2000,
    })
  }
}

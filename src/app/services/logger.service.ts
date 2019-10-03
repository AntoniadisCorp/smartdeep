import { Injectable } from '@angular/core';

@Injectable()
export class Logger {
  logs: string[] = []; // capture logs for testing

  log(message: string) {
    this.logs.push(message);
    console.log(message);
  }

  error(message: string) {
    console.error(message);
  }

  warn(message: string)  {
    this.logs.push(message);
    console.warn(message);
  }
}

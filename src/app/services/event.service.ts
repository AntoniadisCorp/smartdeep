import { Injectable } from '@angular/core';
import { Observable, Subject, from } from 'rxjs';
// import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class EventsService {

    listeners = {};
    eventsSubject = new Subject();
    events = from(this.eventsSubject);

    constructor() {


        this.events.subscribe(
            ({name, args}) => {
                if (this.listeners[name]) {
                    for (const listener of this.listeners[name]) {
                        listener(...args);
                    }
                }
            });
    }

    on(name: any, listener: any) {

        if (!this.listeners[name]) {
            this.listeners[name] = [];
        }

        this.listeners[name].push(listener);
    }

    broadcast(name: any, ...args: any[]) {
        this.eventsSubject.next({
            name,
            args
        });
    }
}

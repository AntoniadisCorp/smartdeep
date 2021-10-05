import { Injectable } from '@angular/core';
import { Observable, Subject, from } from 'rxjs';

@Injectable()
export class EventsService {

    listeners: object = {}

    private eventsSubject = new Subject()

    private events: Observable<any>

    constructor() {

        this.initEvents()
    }

    private initEvents(): void {

        this.events = from(this.eventsSubject)

        this.events.subscribe(({ name, args }) => {
            if (this.listeners[name]) {
                for (const listener of this.listeners[name]) {
                    listener(...args);
                }
            }
        });
    }

    on(name: any, listener: any) {

        // if not exist listener - value then init listeners array
        if (!this.listeners[name]) {
            this.listeners[name] = []
        }

        // any case push listener - data - value 
        this.listeners[name].push(listener);
    }

    broadcast(name: any, ...args: any[]) {

        // broadcast listener value by name to all
        this.eventsSubject.next({
            name,
            args
        });
    }
}

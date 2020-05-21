import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';

@Injectable()
export class SocketService {

    currentDocument = this.socket.fromEvent<Document>('priceUpdate');
    documents = this.socket.fromEvent<string>('priceUpdate');
    
    constructor(private socket: Socket) { }

    getDocument(id: number) {
        this.socket.emit('bid', id);
    }
}
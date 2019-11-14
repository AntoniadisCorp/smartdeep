import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse  } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Logger } from './logger.service';

@Injectable()
export class EmailsService {

    constructor(private http: HttpClient, private logger: Logger) { }

    /**
     * sendEmail
     * @param Object
     */
    public sendEmail(customer: object): Observable<object> {

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        return this.http.post<any>('/task/emails', JSON.stringify(customer), httpOptions)
                    .pipe(tap((customer: any) => this.log(`added hero w/ id=${customer.id}`)),
                    catchError(this.handleError<any>('sendEmail')));
    }

    /** Log a Service message with the MessageService */
    private log(message: string) {
        this.logger.log(message)
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead

        // TODO: better job of transforming error for user consumption
        this.log(`${operation} failed: ${error.message}`);

        // Let the app keep running by returning an empty result.
        return of(result as T);
        };
    }
 

    /**
     * Subscribe
     * @param string
     */
    public subScribe(email: string): Observable<object> {

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        return this.http.post('/task/subscribers', JSON.stringify({email}),httpOptions)
            .pipe(tap((customer: any) => this.log(`added email w/ id=${customer.id}`)),
            catchError(this.handleError<any>('subScribe')));
    }
}

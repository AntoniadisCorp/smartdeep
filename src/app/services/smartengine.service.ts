import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Logger } from '.';
import { Category, DataSource, RESTfulServ } from '../interfaces';
import { setServerUrl } from '../routines';
import { middlebar } from '../variables';


@Injectable({
    providedIn: 'root'
})
export class SmartEngineService {

    taskUrl: string;

    private httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'  })
    };

    constructor(private http: HttpClient) {
        const id = '598cdceb588d161006beef9a';

        this.taskUrl =  setServerUrl('isense.smartdeep.io', 443) + middlebar + 'task'
          + middlebar + 'get' + middlebar + id;
        this.httpOptions.headers.append('Access-Control-Allow-Origin', '*');
    }

    getPlaces(apiURL?: string ): Observable<any | null> {

      this.taskUrl = this.setTaskUrl(apiURL);

      return this.http.get<any>(this.taskUrl).pipe(tap((result => console.log('result->', result)),
        catchError(this.handleError<any>('getPlaces'))));
    }

    getTasks(apiURL?: string): Observable<Category | null> {

      // reset Url if Needed
      this.taskUrl = this.setTaskUrl(apiURL);

      return this.http.get<Category>(this.taskUrl).pipe(
          tap((result) => console.log('result-->', result)),
          catchError(this.handleError<Category>('getCategory')));
    }

    searchTasks(term: string, apiURL?: string): Observable<Category[]> {

      // reset Url if Needed
      this.taskUrl = this.setTaskUrl(apiURL);

      console.log('searching for', term);
      return this.http.get<Category[]>(apiURL, {
        params: {
          q: term || '',
          /* _sort: 'last_name,first_name' */
        }
      }).pipe(
        /* map(list => list.map(e => ({
          _id: e._id,
          name: `${e.name}`,
          icon: `${e.icon}`
        }))) */
        tap((result) => {
          console.log('Search results -->', result);
          return result;
        }),
        catchError(this.handleError<Category[]>('lookupforCategories')));
    }

    saveTasks(task: Category, apiURL?: string): Observable<Category> {

        this.taskUrl = this.setTaskUrl(apiURL);
        return this.http.post<Category>(this.taskUrl, task, this.httpOptions);
    }

    deleteTasks(task: string[], apiURL?: string): Observable<string[]> {

      this.taskUrl = this.setTaskUrl(apiURL);

      return this.http.post<string[]>(this.taskUrl, {
          q: task
        }, this.httpOptions).pipe(
        tap((result) => {
          console.log('Deletion result -->', result);
          return result;
        }),
        catchError(this.handleError<string[]>('deleteCategories')));
    }

    private setTaskUrl(setUrl: string) {

      return setUrl && setUrl.length > 0 ? setUrl : this.taskUrl;
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
      private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
              `Backend returned code ${error.status}, ` +
              `body was: ${error.error}`);
          }
            // TODO: better job of transforming error for user consumption
            // this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
      }
}

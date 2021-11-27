import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse, HttpEvent, HttpEventType, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Category, DataSource, RESTfulServ, BodyObj, OptionEntry } from '../interfaces';
import { setServerUrl, toResponseBody, uploadProgress } from '../routines';
import { middlebar, config } from '../variables';
import { Logger } from './logger.service';



@Injectable({
  providedIn: 'root'
})
export class SmartEngineService {

  taskUrl: string;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient, private logger: Logger) {
    //  setServerUrl('isense.smartdeep.io', 443)
    this.taskUrl = `${config.apiUrl}${middlebar}task`;
    this.httpOptions.headers.append('Access-Control-Allow-Origin', '*');
  }

  getTasks(apiURL: string, collection?: string, term?: string): Observable<any | null> {


    // reset Url if Needed
    this.taskUrl = this.setTaskUrl(apiURL);

    return this.http.get<any>(apiURL, {
      params: new HttpParams()
        .set('filter', term || '')
        .set('col', collection || '')
      /* _sort: 'last_name,first_name' */
    }).pipe(
      tap((result) => console.log('result-->', result)),
      catchError(this.handleError<any>('getCategory')));
  }

  getTask(apiURL: string, collection?: string): Observable<OptionEntry> {

    // reset Url if Needed
    this.taskUrl = this.setTaskUrl(apiURL);

    return this.http.get<any>(apiURL, {
      params: new HttpParams()
        .set('col', collection || '')
    }).pipe(
      tap((result) => console.log('result-->', result)),
      catchError(this.handleError<any>('getCategory')));
  }

  searchTasks(term: string, apiURL?: string, collection?: string): Observable<any | null> {

    // reset Url if Needed
    // this.taskUrl = this.setTaskUrl(apiURL);
    this.taskUrl = this.setTaskUrl(apiURL);
    console.log('searching for', term + ' ', this.taskUrl);

    return this.http.get<any>(this.taskUrl, {
      params: new HttpParams()
        .set('filter', term || '')
        .set('col', collection || '')
    }).pipe(
      tap((result) => {
        console.log('Search results -->', result);
        return result;
      }),
      map((res: OptionEntry) => res.data.result),
      catchError(this.handleError<any[]>('lookupforCategories')));
  }

  saveTaskswithProgress(task: any, apiURL?: string): Observable<HttpEvent<any>> {

    this.taskUrl = this.setTaskUrl(apiURL);

    return this.http.post<any>(this.taskUrl, task, {
      reportProgress: true,
      observe: 'events',
      // headers: new HttpHeaders(/* { 'Access-Control-Allow-Origin': '*'} */).set('Accept', 'application/json')
    });
  }

  saveTasks(task: BodyObj, apiURL?: string): Observable<OptionEntry> {

    this.taskUrl = this.setTaskUrl(apiURL);
    return this.http.post<any>(this.taskUrl, task,
      this.httpOptions).pipe(
        tap((result) => {
          console.log('Saved results -->', result);
          return result;
        }),
        catchError(this.handleError<OptionEntry>('SaveTasks' + JSON.stringify(task.data)))
      );
  }

  updateTaskswithProgress(task: any, apiURL?: string): Observable<HttpEvent<any>> {
    this.taskUrl = this.setTaskUrl(apiURL);

    return this.http.put<any>(this.taskUrl, task, {
      reportProgress: true,
      observe: 'body',
      // headers: new HttpHeaders(/* { 'Access-Control-Allow-Origin': '*'} */).set('Accept', 'application/json')
    });
  }

  deleteTasks(task: string[], apiURL?: string, collectionName?: string): Observable<string[]> {

    this.taskUrl = this.setTaskUrl(apiURL);

    return this.http.post<string[]>(this.taskUrl, {
      q: task,
      col: collectionName
    }, this.httpOptions).pipe(
      tap((result) => {
        console.log('Deletion result -->', result);
        return result;
      }),
      catchError(this.handleError<string[]>('deleteCategories')));
  }

  deleteOneTask(apiURL?: string, params?: BodyObj): Observable<any> {

    this.taskUrl = this.setTaskUrl(apiURL)

    return this.http.delete(this.taskUrl, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      tap((result) => {
        console.log('Deletion result -->', result);
        return result;
      }),
      catchError(this.handleError<string[]>('deleteCategories')));
  }


  find(
    _id: string, filter: string = '', sortOrder: string = 'asc',
    pageNumber: number = 0, pageSize: number = 5, collection?: string, apiURL?: string,
    sortActive?: string, refField?: string): Observable<any[]> {

    this.taskUrl = this.setTaskUrl(apiURL);

    return this.http.get(this.taskUrl, {
      params: new HttpParams()
        .set('_id', String(_id))
        .set('filter', filter)
        .set('sortActive', sortActive || '')
        .set('sortOrder', sortOrder)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
        .set('col', collection || '')
        .set('refField', refField || '')
    }).pipe(
      tap((result: any) => {
        console.log('tableSearch result -->', result);
        return result;
      }),
      map((res: OptionEntry) => res.data),
    );
  }

  private setTaskUrl(setUrl?: string) {

    return setUrl && setUrl.length > 0 ? setUrl : this.taskUrl;
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  public handleError<T>(operation = 'operation', result?: T) {
    return (returnedErr: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      // console.error(error); // log to console instead

      if (returnedErr.error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', returnedErr.error.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(
          `Backend returned code ${returnedErr.error.code}, ` +
          `body was: ${JSON.stringify(returnedErr)}`);
      }
      // TODO: better job of transforming error for user consumption
      if (returnedErr.error.error)
        this.log(`${operation} failed: ${returnedErr.error.status} ${returnedErr.error.error.message}`, 5000);

      result = returnedErr

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a Service message with the MessageService */
  private log(message: string, duration?: number) {
    this.logger.log(message, duration)
  }
}

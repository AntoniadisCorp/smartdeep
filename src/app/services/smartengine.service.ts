import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse, HttpEvent, HttpEventType, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Logger } from '.';
import { Category, DataSource, RESTfulServ, BodyObj, OptionEntry } from '../interfaces';
import { setServerUrl, toResponseBody, uploadProgress } from '../routines';
import { middlebar, config } from '../variables';


@Injectable({
  providedIn: 'root'
})
export class SmartEngineService {

  taskUrl: string;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {
    //  setServerUrl('isense.smartdeep.io', 443)
    this.taskUrl = `${config.apiUrl}${middlebar}task`
    this.httpOptions.headers.append('Access-Control-Allow-Origin', '*');
  }

  getTasks(apiURL: string, collection?: string, term?: string): Observable<any | null> {


    // reset Url if Needed
    // this.taskUrl = this.setTaskUrl(apiURL);

    return this.http.get<any>(apiURL, {
      params: new HttpParams()
        .set('q', term || '' )
        .set('col', collection || '')
          /* _sort: 'last_name,first_name' */
    }).pipe(
      tap((result) => console.log('result-->', result)),
      catchError(this.handleError<any>('getCategory')));
  }

  searchTasks(term: string, apiURL?: string, collection?: string): Observable<OptionEntry> {

    // reset Url if Needed
    this.taskUrl = this.setTaskUrl(apiURL);

    console.log('searching for', term);
    return this.http.get<any>(apiURL, {
      params: new HttpParams()
      .set('q', term || '' )
      .set('col', collection || '')
    }).pipe(
      tap((result) => {
        console.log('Search results -->', result);
        return result;
      }),
      map((res: OptionEntry) => res.data['result']),
      catchError(this.handleError<any[]>('lookupforCategories')));
  }

  saveTaskswithProgress(task: any, apiURL?: string): Observable<HttpEvent<any>> {

    this.taskUrl = this.setTaskUrl(apiURL);

    return this.http.post<any>(this.taskUrl, task, {
      reportProgress: true,
      observe: 'events',
      // headers: new HttpHeaders(/* { 'Access-Control-Allow-Origin': '*'} */).set('Accept', 'application/json')
    })
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


  find(
    _id: string, q: string = '', sortOrder: string = 'asc',
    pageNumber:number = 0, pageSize: number = 3, collection?: string, apiURL?: string): Observable<any[]> {

    this.taskUrl = this.setTaskUrl(apiURL);

    return this.http.get(this.taskUrl, {
      params: new HttpParams()
        .set('_id', String(_id))
        .set('filter', q)
        .set('sortOrder', sortOrder)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
        .set('col', collection || '')
    }).pipe(
      tap((result: any) => {
        console.log('tableSearch result -->', result);
        return result;
      }),
      map((res: OptionEntry) => res.data),
    );
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
          `body was: ${JSON.stringify(error.error)}`);
      }
      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}

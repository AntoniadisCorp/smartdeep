import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { config, middlebar } from '../variables/global.vars';
import { of, Observable } from 'rxjs';
import { OptionEntry } from '../interfaces';
import { SmartEngineService } from './smartengine.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RandomNumberService {

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private apiUrl: string;

  constructor(private http: HttpClient, private httpService: SmartEngineService, private authService: AuthService ) {
    this.apiUrl = `${config.apiUrl}/task`;
    this.httpOptions.headers.append('Access-Control-Allow-Origin', '*');
  }


  getRandomNumber(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/random`)
      .pipe(
        tap((result) => {
          console.log('Number results -->', result);
          return result;
        }),
        map((res: OptionEntry) => res.data['result']),
        catchError(error => {
          alert(JSON.stringify(error.error));
          return of(false);
        }));
  }

  getLibrary(): Observable<any> {
    const dbCollection = 'user'
    const hash = 'user'
    const userId = this.authService.getUserId()
    /// get data from user/library/:id/cache/:hash


    return userId? this.httpService.getTasks(config.apiUrl + middlebar + 'task' + middlebar + 'user' + middlebar +
        'library' + middlebar + userId + middlebar + 'cache' + middlebar + hash, dbCollection)
        .pipe(map((res: OptionEntry) => res ? res.data.result : res))
      : of(false)      
  }
}

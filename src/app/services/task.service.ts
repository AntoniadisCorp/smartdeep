import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { config } from '../variables/global.vars';
import { of } from 'rxjs';
import { OptionEntry } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class RandomNumberService {

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${config.apiUrl}/task`;
    this.httpOptions.headers.append('Access-Control-Allow-Origin', '*');
  }


  getRandomNumber() {
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
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { config } from '../variables/global.vars';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RandomNumberService {

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'  })
  };
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${config.apiUrl}/task`;
    this.httpOptions.headers.append('Access-Control-Allow-Origin', '*');
  }

  getRandomNumber() {
    return this.http.get<any>(`${this.apiUrl}/random`)
      .pipe(map(data => data.value),
      catchError(error => {
        alert(JSON.stringify(error.error));
        return of(false);
      }));
  }
}

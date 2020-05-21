import { Injectable } from '@angular/core';
import { Observable, of, EMPTY } from 'rxjs';
import { map, take, mergeMap } from 'rxjs/operators';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { SmartEngineService } from './smartengine.service';
import { config, middlebar } from '../variables';

@Injectable({
  providedIn: 'root'
})
export class SmartResolveService implements Resolve<any> {
  constructor(private httpService: SmartEngineService, private router: Router) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const id = route.paramMap.get('id');
    const apiUrl = `${config.apiUrl}${middlebar}task${middlebar}library${middlebar}search${middlebar}${id}`;

    return this.httpService.getTasks(apiUrl, route.data['col']).pipe(
      take(1),
      mergeMap(data => {
        if (data) {
          return of(data);
        } else { // id not found
          this.router.navigate([route.data['redirectTo']])
          return EMPTY;
        }
      })
    );
  }
}

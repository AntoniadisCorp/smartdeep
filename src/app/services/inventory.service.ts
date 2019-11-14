import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { InventoryTabs } from '../interfaces';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SmartEngineService } from './smartengine.service';
import { config, middlebar } from '../variables';



@Injectable({
  providedIn: 'root',
})
export class InventoryService implements Resolve<any> {

  constructor(private httpService: SmartEngineService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

    const apiUrl = `${config.apiUrl}${middlebar}task${middlebar}library${middlebar}${route.params['id']}`
    return this.httpService.getTasks(apiUrl, 'book')
  }

  getInventoryTabs(DataTabs: InventoryTabs[]): Observable<InventoryTabs[]> {
    // TODO: send the message _after_ fetching the heroes
    // this.messageService.add('HeroService: fetched heroes');
    return of(DataTabs);
  }

  getData(Data: any[]): Observable<any[]> {
    // TODO: send the message _after_ fetching the heroes
    // this.messageService.add('HeroService: fetched heroes');
    return of(Data);
  }

  getInventoryTab(id: number | string, DataTabs: InventoryTabs[]) {
    return this.getInventoryTabs(DataTabs).pipe(
      // (+) before `id` turns the string into a number
      map((invTabs: InventoryTabs[]) => invTabs.find(invTab => invTab.id === id))
    );
  }
}

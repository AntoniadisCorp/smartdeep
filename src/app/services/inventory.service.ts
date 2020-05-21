import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { InventoryTabs } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  constructor() { }

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
      map((invTabs: InventoryTabs[]) =>
        invTabs.find(invTab => invTab.id === id)
      )
    );
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartEngineService } from 'src/app/services';
import { getPlaceSearchUrl, PlaceParameters } from 'src/app/api';
import { DlvryFilters, MainPageTabIndex } from 'src/app/interfaces';
import { of, Observable, Subscription } from 'rxjs';
import { delay, tap, debounceTime } from 'rxjs/operators';

const api = 'AIzaSyCaabTAo5kpoxa7hFZuVSLfP5CPrssLz0o';
const output = 'json';
const inputtype = 'textquery';
const language = 'el';
const auto = 'autocomplete';

interface AnonymousInterface {
  class: string;
  img: string;
}

@Component({
    selector: 'app-delivery',
    templateUrl: './delivery.component.html',
    styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent implements OnInit, OnDestroy {

    public Placetext: string;
    public deliveryFilters: DlvryFilters;
    subscription: Subscription;
    AnonymousUser: AnonymousInterface;

    public tglBtn: MainPageTabIndex;

    constructor(private httpReq: SmartEngineService) { }

    ngOnInit(): void {

      this.Placetext = 'σιφνος';
      const requrl = getPlaceSearchUrl(output,
          PlaceParameters(api, this.Placetext, language, inputtype), 'findplacefromtext');

      this.tglBtn = { OrderClass: { active: true}, DeliveryClass: { active: false}};

      // Manual subscription handling
      this.subscription = this.getDeliveryImage(1500, 'blur', '')
          .subscribe( (u: AnonymousInterface) => {this.AnonymousUser = u, console.log(this.AnonymousUser); } );
      this.subscription = this.getDeliveryImage(2000, ' ', '//localhost:4200/assets/img/c/delivery-4.jpg')
          .subscribe( (u: AnonymousInterface) => {this.AnonymousUser = u, console.log(this.AnonymousUser); } );

      console.log(requrl);
      // this.httpReq.getPlaces(requrl).subscribe(r => console.log(r));
    }

    ngOnDestroy() {
      // Only need to unsubscribe if its a multi event Observable
      this.subscription.unsubscribe();
    }

    setdel(cl: string) {
        this.AnonymousUser = {class: cl, img: null};
    }

    setDeliveryVars(): void {

      this.deliveryFilters.Title = 'Φίλτρα';
      this.deliveryFilters.Action = 'hide';
    }

    public setDbtn(): void {

      if (!this.tglBtn.DeliveryClass.active) {
        this.tglBtn.DeliveryClass.active = !this.tglBtn.DeliveryClass.active;
        this.tglBtn.OrderClass.active = !this.tglBtn.OrderClass.active;
      }
    }

    public setObtn(): void {
      if (!this.tglBtn.OrderClass.active) {
        this.tglBtn.OrderClass.active = !this.tglBtn.OrderClass.active;
        this.tglBtn.DeliveryClass.active = !this.tglBtn.DeliveryClass.active;
      }
    }

    getDeliveryImage(time: number, cl: string, img: string): Observable<{}> {

      return of({
          firstName: 'Luke',
          lastName: 'Skywalker',
          age: 65,
          height: 172,
          mass: 77,
          homeworld: 'Tatooine',
          img,
          class: cl

        }).pipe(
          delay(time)
        );

    }
}

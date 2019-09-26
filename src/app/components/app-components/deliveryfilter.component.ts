import { Component, ElementRef, Input, OnInit, Renderer2, Output, EventEmitter, forwardRef } from '@angular/core';
import { Router } from '@angular/router';



@Component({
    selector: 'app-delivery-filters',
    template: `
    <div class="delivery-main-sidebar" *ngIf="deliveryFilters">
      <nav class="filters-list ps ps--active-y">
        <ul class="nav">
            <div *ngIf="isTitle()" class="filter-top-actions"><h2>{{deliveryFilters.TopActions.title}}</h2>
              <a class="icon close-filters hide-large-viewport js-close-filters" rel="nofollow" href="">
              </a>
            </div>
            <ng-container *ngFor="let deliver of deliveryFilters.mainFilter">
                <app-delivery-filter-item *ngIf="deliver" [item]="delivery"> </app-delivery-filter-item>
            </ng-container>
        </ul>
      </nav>
    <div>`,
})
export class DeliveryFilterComponent implements OnInit {

    @Input() deliveryFilters;

    ngOnInit(): void {}

    constructor() { }

    isTopAction(): boolean {

      return this.deliveryFilters.TopActions ? true : false;
    }

    isTitle(): boolean {

      return this.deliveryFilters.title ? true : false;
    }
}


@Component({
  selector: 'app-delivery-filter-item',
  template: `
    <div class="filter-group" [ngClass]="{'active': flase}">
      <h3><button class="collapsable-title">Περιοχή Τιμών</button></h3>
      <ng-template *ngFor="let deliver of item">
          <app-delivery-filter-list *ngIf="deliver" [list]="delivery"></app-delivery-filter-list>
      </ng-template>
      <ng-template ngFor="let act of item.actions ">
          <app-delivery-filter-form *ngIf="del" [list]="act"> </app-delivery-filter-form>
      </ng-template>
    </div>
  `,
  styles: [``]
})
export class DeliveryFilterItemComponent implements OnInit {
  @Input() item: any;

  constructor() { }

  ngOnInit(): void { }
}

@Component({
  selector: 'app-delivery-filter-list',
  template: `

    <ul>
    <li class="selected">
      <a class="icon" *ngIf="isTitle()" title="" [href]="{{}}" rel="nofollow">
      {{list.title}} <small>(item.count)</small></a>
    </li>
    </ul>
  `,
  styles: [``]
})
export class DeliveryFilterListComponent implements OnInit {

  @Input() list: any;

  constructor() { }

  ngOnInit(): void { }
}


@Component({
  selector: 'app-delivery-filter-form',
  template: `
  <div class="filters-form" id="custom_price_filters" tabindex="-1">
  <p>
    <input type="text" tabindex="0" name="priceMin" id="price_min" placeholder="" class="filter " value="">
    <input type="text" tabindex="0" name="priceMax" id="price_max" placeholder="" class="filter " value="">
    <button tabindex="0" type="submit" class="icon">›</button>
  </p>
  </div>
  `,
  styles: [``]
})
export class DeliveryFilterFormComponent implements OnInit {

  @Input() list: any;

  constructor() { }

  ngOnInit(): void { }
}


export const APP_DELIVERY_COMPONENT = [

  DeliveryFilterComponent,
  DeliveryFilterItemComponent,
  DeliveryFilterListComponent,
  DeliveryFilterFormComponent
];

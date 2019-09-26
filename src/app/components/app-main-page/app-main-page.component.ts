import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { isEmpty } from '../../routines';


@Component({
    selector: 'app-page-card',
    template: `
    <div class="container-fluid subpage">
        <h1 class="subpage-title-icon" *ngIf="isIcon(categories)" > <i class="{{ categories.icon }}" aria-hidden="true"></i> </h1>
        <h1 class="subpage-title" *ngIf="isTitle(categories)" >{{ categories.title }}</h1>
        <div class= "subpage-divider" > <mat-divider></mat-divider>  </div>
        <div class="card-group subpage-body align-items-center">
            <ng-template ngFor let-item [ngForOf]="products">
                <app-product-card [card]='item'></app-product-card>
            </ng-template>
        </div>
    </div> `
})
export class AppMainPageComponent implements OnInit {

    @Input() categories: any;
    @Input() products: any;


    constructor() {}

    ngOnInit(): void { }

    isIcon(item: any) { return item.icon ? true : false; }
    isTitle(item: any) { return item.title ? true : false; }

}


@Component({
    selector: 'app-product-card',
    template: `
            <div class="results-box card">
                <ng-template [ngIf]="isTitle(card)">
                    <app-product-card-title [cardtitle]='card'></app-product-card-title>
                </ng-template>
                <ng-template [ngIf]="isBody(card)&&isTitle(card)">
                        <app-product-card-item [cardbody]='card.details'></app-product-card-item>
                </ng-template>
            </div>
    `,
    styles: [``]
})
export class AppProductCardComponent implements OnInit {

    @Input() card: any;

    constructor() { }

    ngOnInit(): void { }

    isBody(item: any) { return !isEmpty(item.details) ? true : false; }
    isTitle(item: any) { return item.title ? true : false; }
}


@Component({
    selector: 'app-product-card-item',
    template: `
    <div class="card-body">
            <a class="card-body-pic"> <img src="{{ cardbody.icon }}" class="img-fluid rounded" alt=""></a>
            <div class="card-content">
                <h2>
                    <a class="card-link" href="{{ cardbody.storeAdress}}">  {{cardbody.storeName}} </a>
                </h2>
                <div class="card-star" > <div class="star-rating" > <span style="width: 24%;"></span></div><p>(3)</p></div>
                <div class="card-ship" > <span>μεταφορά</span>{{ cardbody.shipping }}</div><div>
                <div class="card-value"> <span>από</span> 79.00 </div>
                <div class="card-store"> <p> σε 35 καταστήματα </p> </div>
            </div>

        </div>
    </div>
    `,
})
export class AppProductCardItemComponent implements OnInit {

    @Input() cardbody: any;

    constructor() { }

    ngOnInit(): void { }
}

@Component({
    selector: 'app-product-card-title',
    template: `
        <div class="card-header">
            <button class="btn">
                    <i class="fa fa-heart-o fa-lg" aria-hidden="true"></i> <span class="badge badge-"></span>
            </button>

            <a name="" id="" class="btn" href="#" role="button">
                <i class="icon-options-vertical fa-lg" aria-hidden="true"></i>
            </a>
        </div>
    `,
})
export class AppProductCardTitleComponent implements OnInit {
    @Input() cardtitle: any;

    constructor() { }

    ngOnInit(): void { }
}

export const APP_PRODUCT_CARD = [

    AppMainPageComponent,
    AppProductCardComponent,
    AppProductCardItemComponent,
    AppProductCardTitleComponent,
];

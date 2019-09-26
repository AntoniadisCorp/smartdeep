import { Component, OnInit } from '@angular/core';
import { SmartEngineService } from '../../services';
import { Tasks } from '../../interfaces';
@Component({
    selector: 'app-engine',
    templateUrl: './smartengine.component.html',
    styleUrls: ['./smartengine.component.scss']
})
export class SmartEngineComponent implements OnInit {
    product: Tasks[];
    category: object[];

    constructor(private sEngineService: SmartEngineService) { }

    ngOnInit(): void {

        this.product = [{
            _id: '',
            title: 'ASHAIE 26 PCS/Set Silicone Tips Kitchen DIY Icing Piping',
            details: {
                icon: 'assets/img/avatars/8.jpg',
                storeName: 'papagalos',
                storeAdress: 'https://papagalos.io',
                shipping: 'Free Shipping',
                stars: 10,
                orders: 10000,
            },
            isDone: true,
        },
        {
            _id: '',
            title: 'ASHAI',
            details: {
                icon: 'assets/img/avatars/7.jpg',
                storeName: 'papagalos1',
                storeAdress: 'https://papagalos1.io',
                shipping: 'Free Shipping',
                stars: 10,
                orders: 10000,
            },
            isDone: true,
        },
        {
            _id: '',
            title: 'iping',
            details: {
                icon: 'https://a.scdn.gr/images/sku_main_images/017162/17162786/large_20190125132454_bormann_bph4500_020578.jpeg',
                storeName: 'papagalos2',
                storeAdress: 'https://papagalos2.io',
                shipping: 'Free Shipping',
                stars: 10,
                orders: 10000,
            },
            isDone: true,
        },
        {
            _id: '',
            title: 'SAdadadsad',
            details: {
                icon: 'https://d.scdn.gr/images/sku_main_images/000435/435789/large_hr2470.jpg',
                storeName: 'papagalos3',
                storeAdress: 'https://papagalos3.io',
                shipping: 'Free Shipping',
                stars: 10,
                orders: 10000,
            },
            isDone: true,
        },
        {
            _id: '',
            title: 'Dl dpsd',
            details: {
                icon: 'assets/img/avatars/5.jpg',
                storeName: 'papagalos2',
                storeAdress: 'https://papagalos2.io',
                shipping: '230€',
                stars: 10,
                orders: 10000,
            },
            isDone: true,
        }
    ];

        this.category = [{
            title: 'Τεχνολογία',
            icon: 'fa fa-product-hunt'
        }, {
            title: 'Μόδα',
            icon: 'fa fa-address-card'
        }];
    }

    showTasks() {
        /* this.sEngineService.getTasks()
          // clone the data object, using its known Config shape
          .subscribe((data: Tasks) => this.product = [{
            _id: data._id,
            title: data.title,
            details: {
                icon: '',
                storeName: '',
                storeAdress: '',
                shipping: '',
                stars: 10,
                orders: 10000,
            },
            isDone: data.isDone
           }]); */
      }
}

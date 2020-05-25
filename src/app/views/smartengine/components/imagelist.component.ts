import { Component, OnInit } from '@angular/core';
import { ItoggleListMenu } from '../../../interfaces';
import { Router } from '@angular/router';

@Component({
    selector: 'app-smart-imagelist',
    templateUrl: './imagelist.component.html',
    styleUrls: ['./imagelist.component.scss']
})
export class ImageListComponent implements OnInit {

    // tslint:disable-next-line: ban-types
    toggleListValueByid: number;

    toggleListOptions: Array<ItoggleListMenu>;

    constructor(private router: Router) { }

    ngOnInit(): void {

        this.setListViewToggle();
    }


    setListViewToggle(): void {

        this.toggleListOptions = [{
            id: 1,
            value: 'Item List',
            icon: 'list',
            uRL: 'searchit',
        }, {
            id: 2,
            value: 'Image List',
            icon: 'image',
            uRL: 'searchil',
        }];

        this.toggleListValueByid = 2;
    }

    selectionChanged(item): void {
        console.log('Selected value: ' + item.value);

        const iList: ItoggleListMenu =
            this.toggleListOptions.find((k: ItoggleListMenu) => k.id === item.value);

        this.router.navigate(['/smartengine', iList.uRL]);
        /* this.toggleListValueByid.forEach(i => console.log(`Included Item: ${i}`)); */
    }
}

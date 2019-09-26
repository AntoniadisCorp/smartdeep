import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet, ActivatedRoute, Router } from '@angular/router';
import { slideInAnimation } from 'src/app/animations';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { InventoryService } from 'src/app/services';
import { InventoryTabs } from 'src/app/interfaces';
import { INVENTORY_DATA_TABS } from 'src/app/variables';


@Component({
    selector: 'app-inventory',
    templateUrl: './inventory.component.html',
    styleUrls: ['./inventory.component.scss'],
    animations: [ slideInAnimation ]
})
export class InventoryComponent implements OnInit {

    @ViewChild('tabGroup', {static: true}) tabGroup: { _tabHeader: { _elementRef: { nativeElement: { children: any; }; }; }; };

    InvTabs$: Observable<InventoryTabs[]>;
    activeLink: string;

    constructor(private invService: InventoryService, private router: Router,
                private route: ActivatedRoute) { }

    ngOnInit(): void {

        // setup maximum tabs
        this.InvTabs$ = this.route.paramMap.pipe(
            switchMap(params => {
              // (+) before `params.get()` turns the string into a number
              this.activeLink = !params.get('id') ? 'items' : params.get('id');

              this.router.navigate(['/inventory', this.activeLink]);
              return this.invService.getInventoryTabs(INVENTORY_DATA_TABS);
            })
          );
    }

    scrollTabs(event) {
        const children = this.tabGroup._tabHeader._elementRef.nativeElement.children;
        const back = children[0];
        const forward = children[2];
        if (event.deltaY > 0) {
          forward.click();
        } else {
          back.click();
        }
      }

    getAnimationData(outlet: RouterOutlet) {
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
    }
}

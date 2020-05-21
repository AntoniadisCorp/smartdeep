import { Component, OnInit } from '@angular/core';
import { InventoryService, SvgIconService } from 'src/app/services';
import {  } from 'express-serve-static-core';
import { Router, ActivatedRoute, ParamMap, RouterOutlet } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { LIBRARY_LIBMAP_TABS } from 'src/app/variables';
import { InventoryTabs } from 'src/app/interfaces';
import { Observable } from 'rxjs';
import { slideInAnimation } from 'src/app/animations';

@Component({
    selector: 'app-library-map',
    templateUrl: 'libmap.component.html',
    styleUrls: ['libmap.component.scss'],
    animations: [slideInAnimation]
})

export class LibMapComponent implements OnInit {


    InvTabs$: Observable<InventoryTabs[]>;
    activeLink: string;

    constructor(private invService: InventoryService, private router: Router,
        private route: ActivatedRoute, matIconRegistry: SvgIconService) {
        // header Svg icon
        matIconRegistry.setSvg('map', 'assets/img/svg/map.svg')
        matIconRegistry.setSvg('addlibrary', 'assets/img/svg/addlibrary.svg')
        matIconRegistry.setSvg('bookcase', 'assets/img/svg/bookcase.svg')
        matIconRegistry.setSvg('category', 'assets/img/svg/list.svg')
    }

    ngOnInit(): void {

        // setup maximum tabs
        this.InvTabs$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) => {
                // (+) before `params.get()` turns the string into a number
                // this.activeLink = !params.get('id') ? 'addlib' : params.get('id')

                // this.router.navigate(['/library/map', this.activeLink])
                return this.invService.getInventoryTabs(LIBRARY_LIBMAP_TABS);
            })
        )
    }

    /* scrollTabs(event) {
        const children = this.tabGroup._tabHeader._elementRef.nativeElement.children;
        const back = children[0];
        const forward = children[2];
        if (event.deltaY > 0) {
          forward.click();
        } else {
          back.click();
        }
      } */

    getAnimationData(outlet: RouterOutlet) {
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
    }
}
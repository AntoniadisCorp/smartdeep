import { Component, OnInit } from '@angular/core';
import { InventoryService, SvgIconService } from '../../../services';
import { Router, ActivatedRoute, ParamMap, RouterOutlet } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { LIBRARY_LIBALLOC_TABS } from '../../../variables';
import { InventoryTabs } from '../../../interfaces';
import { Observable } from 'rxjs';
import { slideInAnimation } from '../../../animations';

@Component({
    selector: 'app-library-liballoc',
    templateUrl: 'liballoc.component.html',
    animations: [slideInAnimation]
})

export class LibAllocComponent implements OnInit {


    InvTabs$: Observable<InventoryTabs[]>;
    activeLink: string;

    constructor(private invService: InventoryService, private router: Router,
        private route: ActivatedRoute, matIconRegistry: SvgIconService) {
        // header Svg icon
        matIconRegistry.setSvg('alloc', 'assets/img/svg/layer1.svg')
        matIconRegistry.setSvg('distribute', 'assets/img/svg/inventory.svg')
        matIconRegistry.setSvg('bookcase', 'assets/img/svg/bookcase.svg')
    }

    ngOnInit(): void {

        // setup maximum tabs
        this.InvTabs$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) => {
                // (+) before `params.get()` turns the string into a number
                // this.activeLink = !params.get('id') ? 'addlib' : params.get('id')

                // this.router.navigate(['/library/map', this.activeLink])
                return this.invService.getInventoryTabs(LIBRARY_LIBALLOC_TABS);
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
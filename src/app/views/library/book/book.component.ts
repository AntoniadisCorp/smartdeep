import { Component, OnInit } from '@angular/core';
import { InventoryTabs } from 'src/app/interfaces';
import { Observable } from 'rxjs';
import { InventoryService, SvgIconService } from 'src/app/services';
import { Router, ActivatedRoute, ParamMap, RouterOutlet } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { LIBRARY_BOOK_TABS } from 'src/app/variables';
import { slideInAnimation } from 'src/app/animations';

@Component({
    selector: 'app-library-book',
    templateUrl: 'book.component.html',
    styleUrls: ['book.component.scss'],
    animations: [slideInAnimation]
})

export class BookComponent implements OnInit {


    // @ViewChild('tabGroup', {static: true}) tabGroup: { _tabHeader: { _elementRef: { nativeElement: { children: any; }; }; }; };

    InvTabs$: Observable<InventoryTabs[]>;
    activeLink: string;

    constructor(private invService: InventoryService, private router: Router,
        private route: ActivatedRoute, matIconRegistry: SvgIconService) {

        // header Svg icon
        matIconRegistry.setSvg('library', 'assets/img/svg/library.svg')

        matIconRegistry.setSvg('allbooks', 'assets/img/svg/allbooks.svg')
        matIconRegistry.setSvg('book', 'assets/img/svg/book.svg')
        matIconRegistry.setSvg('viewbook', 'assets/img/svg/viewbook.svg')
        matIconRegistry.setSvg('contents', 'assets/img/svg/contents.svg')
    }

    ngOnInit(): void {

        // setup maximum tabs
        this.InvTabs$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) => {
                // (+) before `params.get()` turns the string into a number
                this.activeLink = !params.get('id') ? 'list' : params.get('id')

                this.router.navigate(['/library/book', this.activeLink]);
                return this.invService.getInventoryTabs(LIBRARY_BOOK_TABS);
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
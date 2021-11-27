import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet, ActivatedRoute, Router, ParamMap } from '@angular/router';
import { slideInAnimation } from '../../animations';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { InventoryService, SvgIconService } from '../../services';
import { InventoryTabs } from '../../interfaces';
import { LIBRARY_ITEMS } from '../../variables';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
  animations: [slideInAnimation]
})
export class LibraryComponent implements OnInit {

  // @ViewChild('tabGroup', {static: true}) tabGroup: { _tabHeader: { _elementRef: { nativeElement: { children: any; }; }; }; };

  InvTabs$!: Observable<InventoryTabs[]>;
  activeLink!: string;

  constructor(private invService: InventoryService, private router: Router,
    private route: ActivatedRoute, matIconRegistry: SvgIconService) {
      matIconRegistry.setSvg('map', 'assets/img/svg/map.svg')
      matIconRegistry.setSvg('books', 'assets/img/svg/books.svg')
      matIconRegistry.setSvg('layer1', 'assets/img/svg/layer1.svg')
      matIconRegistry.setSvg('lending', 'assets/img/svg/lending.svg')
  }

  ngOnInit(): void {

    // setup maximum tabs
    this.InvTabs$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        // (+) before `params.get()` turns the string into a number
        // this.activeLink = !params.get('id') ? 'book' : params.get('id')
       
        // this.router.navigate(['/library', this.activeLink]);
        return this.invService.getInventoryTabs(LIBRARY_ITEMS);
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

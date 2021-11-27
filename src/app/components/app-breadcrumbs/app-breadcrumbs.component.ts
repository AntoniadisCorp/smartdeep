import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  template: `
  <ng-template ngFor let-breadcrumb [ngForOf]="breadcrumbs" let-last = last>
    <li class="breadcrumb-item"
        *ngIf="breadcrumb.label.title&&breadcrumb.url.substring(breadcrumb.url.length-1) == '/'||breadcrumb.label.title&&last"
        [ngClass]="{active: last}">
      <a class="btn btn-sm btn-light breadbtn" *ngIf="!last" [routerLink]="breadcrumb.url">{{breadcrumb.label.title}}</a>
      <span class="btn btn-sm breadbtn" *ngIf="last" [routerLink]="breadcrumb.url">{{breadcrumb.label.title}}</span>
    </li>
  </ng-template>`,
  styles: [`
  .btn.breadbtn {
    font-size: 0.885625rem;
    border-radius: 23px;
  }
  `]
})
export class AppBreadcrumbsComponent {
  breadcrumbs: Array<object>;
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event) => {
      this.breadcrumbs = [];
      let currentRoute: ActivatedRoute = this.route.root;
      let url: string;
      url = '';

      do {
        const childrenRoutes: ActivatedRoute[] = currentRoute.children;
        currentRoute = null;

        if (childrenRoutes.length === 0) {
          break;
        }

        // tslint:disable-next-line:no-shadowed-variable
        childrenRoutes.forEach(childroute => {
          if (childroute.outlet === 'primary') {
            const routeSnapshot = childroute.snapshot;
            url += `/${routeSnapshot.url.map(segment => segment.path).join('/')}`;
            this.breadcrumbs.push({
              label: childroute.snapshot.data,
              params: childroute.snapshot.params,
              url
            });
            currentRoute = childroute;
          }
        });
      } while (currentRoute);
    });
  }
}

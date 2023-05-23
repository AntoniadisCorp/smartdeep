import { Component } from '@angular/core'
import { Router, ActivatedRoute, NavigationEnd, Params, Data } from '@angular/router'
import { filter } from 'rxjs/operators'

@Component({
  selector: 'app-breadcrumbs',
  template: `
  <ng-template ngFor let-breadcrumb [ngForOf]="breadcrumbs" let-last = last>
    <li class="flex items-center"
        *ngIf="breadcrumb.label.title&&breadcrumb.url.substring(breadcrumb.url.length-1) == '/'||breadcrumb.label.title&&last"
        [ngClass]="{active: last}">
      <a class="truncate text-sm font-medium hover:text-neutral-300 text-neutral-500 dark:hover:text-neutral-300 dark:text-neutral-400" *ngIf="!last" [routerLink]="breadcrumb.url">{{breadcrumb.label.title}}</a>
      <span class="font-semibold text-slate-900 truncate dark:text-slate-200" *ngIf="last" [routerLink]="breadcrumb.url">{{breadcrumb.label.title}}</span>
      <svg width="3" height="6" aria-hidden="true" *ngIf="!last" class="mx-3 overflow-visible text-slate-400"><path d="M0 0L3 3L0 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path></svg>
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
  breadcrumbs: Array<{ url: string, label: Data | { title: string }, params: Params }>
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event) => {
      this.breadcrumbs = []
      let currentRoute: ActivatedRoute = this.route.root
      let url: string
      url = ''

      do {
        const childrenRoutes: ActivatedRoute[] = currentRoute.children
        currentRoute = null

        if (childrenRoutes.length === 0) {
          break
        }

        // tslint:disable-next-line:no-shadowed-variable
        childrenRoutes.forEach(childroute => {
          if (childroute.outlet === 'primary') {
            const routeSnapshot = childroute.snapshot
            url += `/${routeSnapshot.url.map(segment => segment.path).join('/')}`
            this.breadcrumbs.push({
              label: childroute.snapshot.data,
              params: childroute.snapshot.params,
              url
            })
            currentRoute = childroute
          }
        })
      } while (currentRoute)
    })
  }
}

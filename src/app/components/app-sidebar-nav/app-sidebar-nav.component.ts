import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core'

// Import navigation elements
import { navigation } from './../../_nav'

@Component({
  selector: 'app-sidebar-nav',
  template: `
  <perfect-scrollbar [config]="config">
    <nav class="sidebar-nav ps ps--active-y">
      <ul class="nav">
        <ng-template ngFor let-navitem [ngForOf]="navigation">
          <li *ngIf="isDivider(navitem)" class="nav-divider"></li>
          <ng-template [ngIf]="isTitle(navitem)">
            <app-sidebar-nav-title [title]='navitem'></app-sidebar-nav-title>
          </ng-template>
          <ng-template [ngIf]="!isDivider(navitem)&&!isTitle(navitem)">
            <app-sidebar-nav-item [item]='navitem'></app-sidebar-nav-item>
          </ng-template>
        </ng-template>
      </ul>
    </nav>
</perfect-scrollbar>`
})
export class AppSidebarNavComponent {

  public config: PerfectScrollbarConfigInterface = {}
  public navigation = navigation

  public isDivider(item: any) {
    return item.divider ? true : false
  }

  public isTitle(item: any) {
    return item.title ? true : false
  }

  constructor() { }
}

import { Router } from '@angular/router'
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar'
import { SvgIconService } from '../../services'

@Component({
  selector: 'app-sidebar-nav-item',
  template: `
    <li *ngIf="!isDropdown(); else dropdown" [ngClass]="hasClass() ? 'nav-item ' + item.class : 'nav-item'">
      <app-sidebar-nav-link [link]='item'></app-sidebar-nav-link>
    </li>
    <ng-template #dropdown>
      <li [ngClass]="hasClass() ? 'nav-item nav-dropdown ' + item.class : 'nav-item nav-dropdown'"
          [class.open]="isActive()"
          routerLinkActive="open"
          appNavDropdown>
        <app-sidebar-nav-dropdown [link]='item'></app-sidebar-nav-dropdown>
      </li>
    </ng-template>
    `
})
export class AppSidebarNavItemComponent {
  @Input() item: any

  public hasClass() {
    return this.item.class ? true : false
  }

  public isDropdown() {
    return this.item.children ? true : false
  }

  public thisUrl() {
    return this.item.url
  }

  public isActive() {
    return this.router.isActive(this.thisUrl(), true)
  }

  constructor(private router: Router) { }

}

@Component({
  selector: 'app-sidebar-nav-link',
  template: `
    <a *ngIf="!isServicealLink(); else serviceal"
      [ngClass]="hasVariant() ? 'nav-link nav-link-' + link.variant : 'nav-link'"
      routerLinkActive="active"
      [routerLink]="[link.url]">
      <mat-icon *ngIf="isIcon()" fontSet="fas" svgIcon="{{ link.icon }}" fontIcon="fa-" class="relative top-[0.35rem] mr-2"></mat-icon>
      {{ link.name }}
      <span *ngIf="isBadge()" [ngClass]="'badge badge-' + link.badge.variant">{{ link.badge.text }}</span>
    </a>
    <ng-template #serviceal>
      <a [ngClass]="hasVariant() ? 'nav-link nav-link-' + link.variant : 'nav-link'" href="{{link.url}}">
        <mat-icon *ngIf="isIcon()" fontSet="fas" svgIcon="{{ link.icon }}" fontIcon="fa-" class="relative top-[0.35rem] mr-2"></mat-icon>
        {{ link.name }}
        <span *ngIf="isBadge()" [ngClass]="'badge badge-' + link.badge.variant">{{ link.badge.text }}</span>
      </a>
    </ng-template>
  `
})
export class AppSidebarNavLinkComponent {
  @Input() link: any
  matIconRegistry: SvgIconService

  public hasVariant() {
    return this.link.variant ? true : false
  }

  public isBadge() {
    return this.link.badge ? true : false
  }

  public isServicealLink() {
    return (this.link.url.substring(0, 4) === 'http' || this.link.url.substring(0, 5) === 'https') ? true : false
  }

  public isIcon() {

    const icon = this.link.icon ? true : false

    if (icon) {
      console.log(icon)
      this.matIconRegistry.setSvg(this.link.icon, `assets/img/svg/${this.link.icon}.svg`)
    }

    return icon
  }

  constructor(matIconRegistry: SvgIconService) { this.matIconRegistry = matIconRegistry }
}

@Component({
  selector: 'app-sidebar-nav-dropdown',
  template: `
    <a class="nav-link nav-dropdown-toggle" appNavDropdownToggle>
      <mat-icon *ngIf="isIcon()" fontSet="fas" svgIcon="{{ link.icon }}" fontIcon="fa-" class="relative top-[0.35rem] mr-2" ></mat-icon>
      {{ link.name }}
      <span *ngIf="isBadge()" [ngClass]="'badge badge-' + link.badge.variant">{{ link.badge.text }}</span>
    </a>
    <ul class="nav-dropdown-items">
      <ng-template ngFor let-child [ngForOf]="link.children">
        <app-sidebar-nav-item [item]='child'></app-sidebar-nav-item>
      </ng-template>
    </ul>
  `
})
export class AppSidebarNavDropdownComponent {
  @Input() link: any
  matIconRegistry: SvgIconService

  public isBadge() {
    return this.link.badge ? true : false
  }

  public isIcon() {

    const icon = this.link.icon ? true : false

    if (icon) {
      console.log(icon)
      this.matIconRegistry.setSvg(this.link.icon, `assets/img/svg/${this.link.icon}.svg`)
    }

    return icon
  }
  constructor(matIconRegistry: SvgIconService) { this.matIconRegistry = matIconRegistry }
}

@Component({
  selector: 'app-sidebar-nav-title',
  template: ''
})
export class AppSidebarNavTitleComponent implements OnInit {
  @Input() title: any

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {

    const nativeElement: HTMLElement = this.el.nativeElement
    const li = this.renderer.createElement('li')
    const name = this.renderer.createText(this.title.name)

    this.renderer.addClass(li, 'nav-title')

    if (this.title.class) {
      const classes = this.title.class
      this.renderer.addClass(li, classes)
    }

    if (this.title.wrapper) {
      const wrapper = this.renderer.createElement(this.title.wrapper.element)

      this.renderer.appendChild(wrapper, name)
      this.renderer.appendChild(li, wrapper)
    } else {
      this.renderer.appendChild(li, name)
    }
    this.renderer.appendChild(nativeElement, li)
  }
}

export const APP_SIDEBAR_NAV = [
  AppSidebarNavComponent,
  AppSidebarNavDropdownComponent,
  AppSidebarNavItemComponent,
  AppSidebarNavLinkComponent,
  AppSidebarNavTitleComponent
]

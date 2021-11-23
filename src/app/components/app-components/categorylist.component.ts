import { Component, ElementRef, Input, OnInit, Renderer2, Output, EventEmitter, forwardRef } from '@angular/core';
import { Router } from '@angular/router';

import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MenuAction } from '../../interfaces';
import { strRemofarray } from '../../routines';


@Component({
  selector: 'app-prodcategory-list',
  template: `
  <div class="categories" *ngIf="categories">
    <nav class="category-nav ps ps--active-y">
      <ul class="nav">
          <ng-container *ngFor="let cate of categories">
              <app-category-nav-item *ngIf="cate" [selectaction]='action' [item]="cate"> </app-category-nav-item>
          </ng-container>
      </ul>
    </nav>
  <div>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CategoryComponent),
      multi: true
    }
  ]
})
export class CategoryComponent implements OnInit {

  @Input() categories: any;
  @Input() @Output() action!: MenuAction;

  ngOnInit(): void { }

  public isTitle(item: any) {
    return item.title ? true : false;
  }

  constructor() { }
}


@Component({
  selector: 'app-category-nav-item',
  template: `
    <li *ngIf="!isDropdown(); else dropdown" [ngClass]="hasClass() ? 'nav-item ' + item.class : 'nav-item'">
      <app-category-nav-link *ngIf="item" [selectlink]='selectaction' [link]='item'></app-category-nav-link>
    </li>

    <ng-template #dropdown>
      <li [ngClass]="hasClass() ? 'nav-item nav-dropdown ' + item.class : 'nav-item nav-dropdown'"
        (click)="onSelect()"
        [class.open]="isActive()"
        routerLinkActive="open"
        appNavDropdown>
          <app-category-nav-dropdown [selectdropdown]='selectaction' *ngIf="item" [link]='item'></app-category-nav-dropdown>
      </li>
    </ng-template>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InnerCategoryComponent),
      multi: true
    }
  ]
})
export class InnerCategoryComponent implements OnInit {

  @Input() item: any;
  @Input() @Output() selectaction!: MenuAction;

  selectedItem: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {

    this.selectedItem = false;
  }

  onSelect(): void {

    this.selectedItem = this.isDropdown() ? !this.selectedItem : false;
  }

  isIcon(item: any) { return this.item && item.icon ? true : false; }
  isTitle(item: any) { return this.item && item.title ? true : false; }

  public hasClass() {
    return this.item && this.item.class ? true : false;
  }

  public isDropdown() {

    return this.item && this.item.children ? this.item.children.length > 0 ? true : false : false;
  }

  public thisUrl() {
    return this.item ? this.item.url : false;
  }
  // this.router.isActive(this.thisUrl(), false)
  public isActive() {
    return false;
  }
}


@Component({
  selector: 'app-category-nav-link',
  template: `
    <div class="nav-select">
      <mat-checkbox
          [hidden]="isSelected()"
            class="nav-checkbox"
          [(ngModel)]="selection"
          (ngModelChange)="onChange($event)"
          [(indeterminate)]="indeterminate"
          [labelPosition]="labelPosition"
          [disabled]="disabled">

      </mat-checkbox>

      <a  *ngIf="!isExternalLink(); else external"
          [ngClass]="hasVariant() ? 'nav-link nav-link-' + link.variant : 'nav-link'"
        routerLinkActive="active" >
          <i *ngIf="isIcon()" class="{{ link.icon }}"></i>
          <span class="title" >{{ link.name }}</span>
          <span *ngIf="isBadge()" [ngClass]="'badge badge-' + link.badge.variant">{{ link.badge.text }}</span>
        </a>
    </div>
    <ng-template #external>
      <a [ngClass]="hasVariant() ? 'nav-link nav-link-' + link.variant : 'nav-link'" [routerLink]="['/smartengine/searchit', link._id]"
      routerLinkActive="router-link-active" >
      <i *ngIf="isIcon()" class="{{ link.icon }}"></i>
      <span class="title" >{{ link.name }}</span>
      <span *ngIf="isBadge()" [ngClass]="'badge badge-' + link.badge.variant">{{ link.badge.text }}</span>
      </a>
    </ng-template>`,

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CategoryLinkComponent),
      multi: true
    }
  ]
})
export class CategoryLinkComponent implements OnInit {

  @Input() @Output() link: any;
  @Input() @Output() selectlink!: MenuAction;

  private selection: boolean = false;
  indeterminate = false;
  labelPosition: string = 'before';
  disabled = false;

  onChange(event: any): void {

    this.link.action = { status: this.selection };

    if (!this.isSelected() && this.selection) {

      this.selectlink.CategoryRemList.push(this.link._id);
    } else if (!this.isSelected() && !this.selection) {

      strRemofarray(this.selectlink.CategoryRemList, this.link._id);
    }
  }

  ngOnInit(): void { this.link.action = { status: this.selection, iconclass: 'send' }; }

  constructor(private router: Router) { }

  public hasVariant() {
    return this.link && this.link.variant ? true : false;
  }

  public isSelected() {
    return this.selectlink ? this.selectlink.status : true;
  }

  public isBadge() {
    return this.link && this.link.badge ? true : false;
  }

  openBookbyId() {
    return this.router.navigate(['/smartengine/searchit', this.link._id])
  }

  public isExternalLink() { // (this.link.url.substring(0, 4) === 'http' || this.link.url.substring(0, 5) === 'https') ?
    return true;
  }

  public isIcon() {
    return this.link && this.link.icon ? true : false;
  }
}



@Component({
  selector: 'app-category-nav-dropdown',
  template: `
    <div class="nav-select">
      <mat-checkbox
            [hidden]="isSelected()"
            class="nav-checkbox"
          [(ngModel)]="selection"
          (ngModelChange)="onChange($event)"
          [(indeterminate)]="indeterminate"
          [labelPosition]="labelPosition"
          [disabled]="disabled">
      </mat-checkbox>
      <a class="nav-link nav-dropdown-toggle" appNavDropdownToggle>
        <i *ngIf="isIcon()" class="{{ link.icon }}"></i>
        <span class="link-title"> {{ link.name }}</span>
        <span *ngIf="isBadge()" [ngClass]="'badge badge-' + link.badge.variant">{{ link.badge.text }}</span>
      </a>
    </div>
    <ul class="nav-dropdown-items">
      <ng-template ngFor let-child [ngForOf]="link.children">
        <app-category-nav-item [selectaction]='selectdropdown' [item]='child'></app-category-nav-item>
      </ng-template>
    </ul>
    `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CategoryDropdownComponent),
      multi: true
    }
  ]
})
export class CategoryDropdownComponent implements OnInit {

  @Input() @Output() link: any;
  @Input() @Output() selectdropdown!: MenuAction;

  selection: boolean = false;
  indeterminate = false;
  labelPosition: string = 'before';
  disabled = false;

  public isBadge() {
    return this.link && this.link.badge ? true : false;
  }

  public isSelected() {
    return this.selectdropdown ? this.selectdropdown.status : true;
  }

  public isIcon() {
    return this.link && this.link.icon ? true : false;
  }

  onChange(event: any): void {

    this.link.action = { status: this.selection };

    if (!this.isSelected() && this.selection) {

      this.selectdropdown.CategoryRemList.push(this.link._id);
    } else if (!this.isSelected() && !this.selection) {

      strRemofarray(this.selectdropdown.CategoryRemList, this.link._id);
    }
  }

  ngOnInit(): void { this.link.action = { status: this.selection, iconclass: 'send' }; }


  constructor() { }
}



export const APP_CATEGORY_COMPONENT = [

  CategoryDropdownComponent,
  CategoryComponent,
  InnerCategoryComponent,
  CategoryLinkComponent
];

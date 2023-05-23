import { Directive, HostListener, ElementRef } from '@angular/core'
import { SidebarOffCanvasCloseDirective } from '../sidebar';

@Directive({
  selector: '[appNavDropdown]'
})
export class NavDropdownDirective extends SidebarOffCanvasCloseDirective {

  constructor(private el: ElementRef) {
    super()
  }

  toggle() {

    const dropNodes = document.querySelectorAll('.sidebar-minimized .nav-item.nav-dropdown')
    dropNodes.forEach(el => {
      if (this.el.nativeElement !== el && this.hasClass(el, 'open')) {
        console.log('test', el)
        el.classList.toggle('open')
        // this.toggleClass(el, 'open')
      }
    });

    this.el.nativeElement.classList.toggle('open')
  }

}

/*
 *
 * Allows the dropdown to be toggled via click.
 */

@Directive({
  selector: '[appNavDropdownToggle]'
})
export class NavDropdownToggleDirective {
  constructor(private dropdown: NavDropdownDirective) { }

  @HostListener('click', ['$event'])
  toggleOpen($event: any) {
    $event.preventDefault()
    this.dropdown.toggle()
  }
}

export const NAV_DROPDOWN_DIRECTIVES = [NavDropdownDirective, NavDropdownToggleDirective]

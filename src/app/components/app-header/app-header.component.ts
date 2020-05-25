import { Component, AfterViewInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { AuthService, SmartEngineService, SvgIconService, RandomNumberService } from '../../services';
import { Router } from '@angular/router';
import { config, middlebar, DEFAULT_SESSION } from '../../variables';
import { OptionEntry, Library } from '../../interfaces';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  styleUrls: ['./app-header.component.scss'],
  templateUrl: './app-header.component.html'
})
export class AppHeaderComponent implements AfterViewInit {

  userlibName: Library

  constructor(
    private authService: AuthService,
    private router: Router,
    private randService: RandomNumberService, matIconRegistry: SvgIconService, private cdr: ChangeDetectorRef) {

    if (DEFAULT_SESSION.afterZoneRun && this.authService.isLoggedIn()) this.getlibrary(), DEFAULT_SESSION.afterZoneRun = false
    else this.userlibName = DEFAULT_SESSION.user._session.library
    matIconRegistry.setSvg('userlib', 'assets/img/svg/userlib.svg')
  }


  ngAfterViewInit(): void {
    // console.log(DEFAULT_SESSION.user._session.library)
    this.cdr.detectChanges()
  }


  logout() {
    this.authService.logout()
      .subscribe(success => {
        if (success) {
          this.router.navigate(['/extern/login']);
        }
      });
  }


  // get Current Session Library
  getlibrary(): void {

    this.randService.getLibrary().subscribe((res: any) => {
      if (res && res._session && res._session.library)
        this.userlibName = DEFAULT_SESSION.user._session.library = res._session.library as Library
    })
  }
}

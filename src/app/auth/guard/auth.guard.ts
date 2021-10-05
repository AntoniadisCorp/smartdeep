import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../../app/services';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate() {

    let isLoggedIn: boolean = this.authService.isLoggedIn()

    if (isLoggedIn) {
      this.router.navigate(['/extern/secret-random-number']);
    }

    return !isLoggedIn
  }
}

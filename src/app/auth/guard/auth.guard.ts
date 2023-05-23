import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../../app/services';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate() {

    const isLoggedIn: boolean = this.authService.isLoggedIn()

    if (isLoggedIn) {
      this.router.navigate(['/service/secret-random-number']);
    }

    return !isLoggedIn
  }
}

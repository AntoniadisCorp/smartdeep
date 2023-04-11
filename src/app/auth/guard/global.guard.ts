import { Injectable } from '@angular/core'
import { CanActivate, CanLoad, Router } from '@angular/router'
import { AuthService } from '../../services'


@Injectable({
  providedIn: 'root'
})
export class GlobalGuard implements CanActivate, CanLoad {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate() {
    return this.canLoad()
  }

  canLoad() {

    const isLoggedIn: boolean = this.authService.isLoggedIn()

    if (!isLoggedIn) {
      this.router.navigate(['/extern/login'])
    }

    return isLoggedIn
  }
}

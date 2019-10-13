import { Component } from '@angular/core';
import { AuthService } from 'src/app/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  styleUrls: ['./app-header.component.scss'],
  templateUrl: './app-header.component.html'
})
export class AppHeaderComponent { 

  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout()
      .subscribe(success => {
        if (success) {
          this.router.navigate(['/extern/login']);
        }
      });
  }
}

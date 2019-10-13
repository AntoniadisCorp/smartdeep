import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { RandomNumberService, AuthService } from 'src/app/services';

@Component({
  selector: 'app-random-number',
  templateUrl: 'random-number.component.html',
  styleUrls: ['random-number.component.scss']
})
export class RandomNumberComponent implements OnInit {

  randomNumber: Observable<number>;

  constructor(private random: RandomNumberService,
              private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.randomNumber = this.random.getRandomNumber();
  }

  logout() {
    this.authService.logout()
      .subscribe(success => {
        if (success) {
          this.router.navigate(['/extern/login']);
        }
      });
  }

}

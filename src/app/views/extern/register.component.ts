import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {

  signupForm: FormGroup;
  response: {};

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      username: [''],
      password: [''],
      repeatpassword: ['']
    });
  }

  get f() { return this.signupForm.controls; }

  signup() {

    if (this.f.password.value !== this.f.repeatpassword.value) {
     return;
    }

    this.authService.signup(
      {
        username: this.f.username.value,
        password: this.f.password.value
      }
    )
    .subscribe(success => {
      if (success) {
        this.response = success;
        this.router.navigate(['/extern/login']);
      } else { this.response = success; }
    });
  }

}

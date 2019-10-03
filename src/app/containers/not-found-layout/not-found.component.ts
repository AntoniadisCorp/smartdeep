
import { Component } from '@angular/core';
import { EventsService } from 'src/app/services';
import { Router } from '@angular/router';

@Component({

  template: `
          <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="error-template">
                        <h1>
                        Oops! You're lost.</h1>
                        <h2>
                            404 Page Not Found</h2>
                        <div class="error-details">
                            Sorry, The page you are looking for was not found.!
                        </div>
                        <div class="error-actions">

                                <div class="input-prepend input-group">
                                    <span class="input-group-addon"><i class="fa fa-search"></i></span>
                                    <input id="prependedInput" class="form-control" size="16" type="text"
                                    placeholder="What are you looking for?">
                                    <span class="input-group-btn">
                                    <button class="btn btn-info" type="button">Search</button>
                                    </span>
                                </div>
                              <a (click)="goHome()" class="btn btn-primary btn-lg"><span class="glyphicon glyphicon-home"></span>
                              Take Me Home </a>
                              <a (click)="goContact()" class="btn btn-default btn-lg">
                              <span class="glyphicon glyphicon-envelope"></span> Contact Us </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`,
  styles: [`body {
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMC8yOS8xMiKqq3kAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzVxteM2AAABHklEQVRIib2Vyw6EIAxFW5idr///Qx9sfG3pLEyJ3tAwi5EmBqRo7vHawiEEERHS6x7MTMxMVv6+z3tPMUYSkfTM/R0fEaG2bbMv+Gc4nZzn+dN4HAcREa3r+hi3bcuu68jLskhVIlW073tWaYlQ9+F9IpqmSfq+fwskhdO/AwmUTJXrOuaRQNeRkOd5lq7rXmS5InmERKoER/QMvUAPlZDHcZRhGN4CSeGY+aHMqgcks5RrHv/eeh455x5KrMq2yHQdibDO6ncG/KZWL7M8xDyS1/MIO0NJqdULLS81X6/X6aR0nqBSJcPeZnlZrzN477NKURn2Nus8sjzmEII0TfMiyxUuxphVWjpJkbx0btUnshRihVv70Bv8ItXq6Asoi/ZiCbU6YgAAAABJRU5ErkJggg==);}
.error-template {padding: 40px 15px;text-align: center;}
.error-actions {margin-top:15px;margin-bottom:15px;}
.error-actions .btn { margin-right:10px; }`]

})
export class PageNotFoundComponent {

    constructor(private eS: EventsService, private router: Router) {}

    public goHome() {

        // this.eS.broadcast('routerLink', '/dashboard');
        this.router.navigate(['/dashboard']);
    }
    public goContact() {

        // this.eS.broadcast('routerLink','contact')
    }

}

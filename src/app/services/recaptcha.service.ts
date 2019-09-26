/* import { RecaptchaLoaderService } from 'ng2-recaptcha/ng2-recaptcha';
import { Injectable } from '@angular/core';
import { obs } 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class PreloadedRecaptchaAPIService {
 public ready: Observable<ReCaptchaV2.ReCaptcha>;

 constructor() {
   const readySubject = new BehaviorSubject<ReCaptchaV2.ReCaptcha>(grecaptcha);
   this.ready = readySubject.asObservable();
 }
}
 */
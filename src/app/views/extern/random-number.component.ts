import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { RandomNumberService, AuthService } from '../../services';
import { SocketService } from '../../services/socket.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-random-number',
  templateUrl: 'random-number.component.html',
  styleUrls: ['random-number.component.scss']
})
export class RandomNumberComponent implements OnInit, OnDestroy {

  randomNumber: Observable<number>;
  currentDoc: string
  documents: Observable<string>;

  private _docSub: Subscription;
  constructor(private random: RandomNumberService,
    private authService: AuthService, private router: Router
    , private documentService: SocketService) { }

  ngOnInit() {
    this.randomNumber = this.random.getRandomNumber();
    this._docSub = this.documentService.currentDocument.subscribe((doc: any) => this.currentDoc = doc)
    this.randomNumber.pipe(tap(s => this.documentService.getDocument(s)))

    this.documents = this.documentService.documents;
  }

  logout() {
    this.authService.logout()
      .subscribe(success => {
        if (success) {
          this.router.navigate(['/extern/login']);
        }
      });
  }

  ngOnDestroy() {
    this._docSub.unsubscribe();
  }

}

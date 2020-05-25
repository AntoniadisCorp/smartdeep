import { Component, OnInit, ElementRef, AfterViewInit, HostListener, NgZone } from '@angular/core';
import { FormControl } from '@angular/forms';
import { requiredFileType } from '../../../../routines';
import { ImageSnippet } from '../../../../classes';
import { SmartEngineService, AuthService } from '../../../../services';
import { config, middlebar } from '../../../../variables';
import { OptionEntry } from '../../../../interfaces';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-library-settings',
    templateUrl: 'settings.component.html',
    styleUrls: ['settings.component.scss']
})

export class SettingsComponent implements OnInit, AfterViewInit {

    generals: any[]
    notes: any[]
    generalsAvatar: any[]

    progress: number = 0
    avatar: FormControl

    private nativeElement: HTMLDocument;
    private width: number;
    private height: number;
    avatarFile: ImageSnippet;

    constructor(private elRef: ElementRef, ngZone: NgZone, 
        private httpService: SmartEngineService, private authService: AuthService ) {
        window.onresize = (e) => {
            ngZone.run(() => {
                this.width = window.innerWidth;
                this.height = window.innerHeight;

                // this.refreshLayout()
            });
        };
    }

    ngOnInit() {

        this.avatar = new FormControl([null, requiredFileType(['png', 'jpg'], true)])
        this.avatarFile = new ImageSnippet()
        this.generals = [
            {
                icon: 'book-open',
                name: 'Όνομα Βιβλιοθήκης',
                updated: new Date('1/1/16'),
                selected: 'Ιερά Μονή Τιμίου Προδρόμου',
                options: [
                    {
                        name: 'Ιερά Μονή Τιμίου Προδρόμου',
                    },
                    {
                        name: 'Ιερά Μονή Αγίας Χρυσοβαλάντου',
                    }
                ],
                hint: 'Επιλογή Βιβλιοθήκης'
            },
            {
                icon: 'shield-alt',
                name: 'Πρόσβαση',
                updated: new Date('1/17/16'),
                selected: 'Ιδιωτική',
                options: [
                    {
                        name: 'Δημόσια',
                    },
                    {
                        name: 'Ιδιωτική',
                    }
                ],
                hint: 'Επιλογή Άδειας'
            }
        ];

        // this.getlibrary()
        
        this.generalsAvatar =  [{
            icon: 'photo-video',
            name: 'Φωτογραφία φόντου',
            updated: new Date('1/28/16'),
            selected: 'Ιερά Μονή Τιμίου Προδρόμου',
            options: [
                {
                    name: 'Ιερά Μονή Τιμίου Προδρόμου',
                }
            ],
            hint: ''
        } ]


        this.avatar.valueChanges
        .subscribe(file => {

            // console.log('addbookImageFile: ', file)
            if (file) this.avatarFile.showPreviewPic(file);
        })

        this.notes = [
            {
                icon: 'note',
                name: 'Vacation Itinerary',
                updated: new Date('2/20/16'),
            },
            {
                icon: 'note',
                name: 'Kitchen Remodel',
                updated: new Date('1/18/16'),
            }
        ];
    }

    ngAfterViewInit(): void {
        this.nativeElement = this.elRef.nativeElement
        this.refreshLayout()

        // HttpRequest Get current Library
    }    


    refreshLayout() {
        let htmlCollection: HTMLCollectionOf<Element>

        // if (this.width >= 540) {
        console.log(540)
        htmlCollection = this.nativeElement.getElementsByClassName('mat-list-text')
        this.addClass(htmlCollection, ' col-xs-6')

        htmlCollection = this.nativeElement.getElementsByClassName('mat-form-field')
        this.addClass(htmlCollection, ' col-xs-6 col-md-6')

        htmlCollection = this.nativeElement.getElementsByClassName('mat-selection-list')
        this.addClass(htmlCollection, ' col-xs-6 col-md-6')
        // }
    }

    addClass(t: HTMLCollectionOf<Element>, className: string) {

        for (let i = 0; i < t.length; i++) {
            t[i].className += className;
        }
    }
}
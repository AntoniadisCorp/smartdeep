import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Logger, SmartEngineService } from 'src/app/services';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-library-addlib',
    templateUrl: './addlibrary.component.html',
    styleUrls: ['./addlibrary.component.scss'],
})

export class AddLibraryComponent implements OnInit {


    libForm: FormGroup;
    constructor(
        private formBuilder: FormBuilder,
        private logger: Logger,
        private httpService: SmartEngineService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {

        this.createForm()
    }


    private createForm(): void {
        this.libForm = this.formBuilder.group({
            name: [ '', [Validators.required, Validators.pattern('^[ά-ώΆ-Ώα-ωΑ-Ωa-zA-Z0-9 _-]{1,40}$')]],
            type: ['books'],
            access: [false, Validators.requiredTrue]
        })
    }


    public resetBookForm(): void {
        this.libForm.reset({
            type: 'books'
        })
    }

    get name() {
        return this.libForm.get('name')
    }

    get type() {
        return this.libForm.get('type')
    }

    get access() {
        return this.libForm.get('access')
    }
}
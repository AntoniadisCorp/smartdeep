import { HostListener, ElementRef, Input, Component, forwardRef, Output, SkipSelf, Host, OnInit, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, AbstractControl, ControlContainer } from '@angular/forms';

@Component({
    selector: 'app-file-upload',
    templateUrl: './uploadfile.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FileUploadComponent),
            multi: true
        }
    ]
})
export class FileUploadComponent implements ControlValueAccessor, OnInit {

    @Input() progress: number;
    @Input() upload: boolean = false;

    @Input() formControlName: string;
    @ViewChild('subscribe', { static: true }) form: ElementRef<HTMLFormElement>;

    onChange: Function;
    public file: File | null = null;
    private src: string | null = null;

    private control: AbstractControl;


    @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {

        const file = event && event.item(0);

        this.onChange(file)

        this.file = file;
    }


    constructor(private host: ElementRef<HTMLInputElement>, @Host() @SkipSelf()
    private controlContainer: ControlContainer) {
    }

    ngOnInit() {

        if (this.controlContainer) {
            if (this.formControlName) {
                this.control = this.controlContainer.control.get(this.formControlName)
                // this.control.valueChanges.subscribe(file => { if (!file) this.file = file })
            } else {
                console.warn('Missing FormControlName directive from host element of the component');
            }
        } else {
            console.warn('Can\'t find parent FormGroup directive');
        }

    }

    writeValue(value: any | null) {
        // clear file input

        this.host.nativeElement.value = !value ? '' : value.src;
        this.file = value ? value.file : null;
        // reset to clear form
        if (!value) this.form.nativeElement.reset()
    }

    registerOnChange(fn: Function) {
        this.onChange = fn;
    }

    registerOnTouched(fn: Function) {
    }

}
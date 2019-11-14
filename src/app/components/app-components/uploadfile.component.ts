import { HostListener, ElementRef, Input, Component, forwardRef, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

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
export class FileUploadComponent implements ControlValueAccessor {
    @Input() progress;

    onChange: Function;
    public file: File | null = null;
    private src: string | null = null;


    @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
        const file = event && event.item(0);

        this.onChange(file);
        this.file = file;
    }

    constructor(private host: ElementRef<HTMLInputElement>) {}

    writeValue(value: null) {
        // clear file input
        this.host.nativeElement.value = '';
        this.file = null;
    }

    registerOnChange(fn: Function) {
        this.onChange = fn;
    }

    registerOnTouched(fn: Function) {
    }

}
import { Pipe, PipeTransform} from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'dateFormat'
})
export class DateFormatPipe extends DatePipe implements PipeTransform {

    transform(value: any, format?: any): any {
        // MMM/dd/yyyy
        return super.transform(value, !format ? 'MMM/dd/yyyy' : format);
    }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'diaCritics'
})

export class DiacriticsPipe implements PipeTransform {

    transform(value: string/* , ...args: any[] */): any {

        let str = value.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        // console.log('diacritic: ', str)
        return str
    }
}
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'dateFormatPipe',
})
export class DateFormatPipe implements PipeTransform {
    transform(value: string) {
        const datePipe = new DatePipe('en-US');
        value = datePipe.transform(value, 'yyyy-MM-dd');
        return value;
    }
}

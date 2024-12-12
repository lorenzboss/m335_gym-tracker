import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
  standalone: true,
})
export class FormatDatePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(value: Date | string | null | undefined): string {
    if (!value) return ''; // Leerer String bei undefined, null oder falsy-Werten
    return this.datePipe.transform(value, 'dd. MMM yyyy, HH:mm') || '';
  }
}

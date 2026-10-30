import { Pipe, type PipeTransform } from '@angular/core';
import { formatCurrency, formatDate, formatDateTime } from '../../core/format';

@Pipe({ name: 'brl' })
export class BrlPipe implements PipeTransform {
  transform(value: string | number, compact = false) {
    return formatCurrency(value, { compact });
  }
}

@Pipe({ name: 'shortDate' })
export class ShortDatePipe implements PipeTransform {
  transform(value: string | Date) {
    return formatDate(value);
  }
}

@Pipe({ name: 'dateTime' })
export class DateTimePipe implements PipeTransform {
  transform(value: string | Date) {
    return formatDateTime(value);
  }
}

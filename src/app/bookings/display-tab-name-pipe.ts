import { Pipe, PipeTransform } from '@angular/core';
import { TAB_NAMES, TabType } from './bookings.data';

@Pipe({
  name: 'displayTabName',
})
export class DisplayTabNamePipe implements PipeTransform {
  transform(value: TabType): string {
    const tabNames = TAB_NAMES;
    return tabNames[value];
  }
}

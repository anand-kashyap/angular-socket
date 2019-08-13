import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'recentDate'
})
export class RecentDatePipe implements PipeTransform {

  transform(value: any): any {
    const msgDate = new Date(value).getTime();
    const currentDate = new Date().getTime();
    const bal = (currentDate - msgDate) / (1000 * 60 * 60 * 24); // get diff in days
    if (bal < 1) {
      return 'Today';
    } else if (bal < 2) {
      return 'Yesterday';
    } else {
      return value;
    }
  }

}

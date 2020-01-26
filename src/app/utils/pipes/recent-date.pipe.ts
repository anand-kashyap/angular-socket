import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';
@Pipe({
  name: 'recentDate'
})
export class RecentDatePipe implements PipeTransform {
  timeOnly(date) {
    console.log('date is', date);

    return formatDate(new Date(date), 'shortTime', 'en');
  }
  transform(value: any, recentChats = false): any {
    const msgDate = new Date(value).getTime();
    const currentDate = new Date().getTime();
    const bal = (currentDate - msgDate) / (1000 * 60 * 60 * 24); // get diff in days
    if (bal < 1) {
      if (recentChats) {
        return this.timeOnly(value);
      }
      return 'Today';
    } else if (bal < 2) {
      return 'Yesterday';
    } else {
      return value;
    }
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [RecentDatePipe],
  imports: [CommonModule],
  exports: [RecentDatePipe]
})
export class RecentDateModule {}

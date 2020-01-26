import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';
@Pipe({
  name: 'recentDate'
})
export class RecentDatePipe implements PipeTransform {
  transform(value: any, recentChats = false): any {
    const msgDate = new Date(value).getTime();
    const currentDate = new Date().getTime();
    const bal = (currentDate - msgDate) / (1000 * 60 * 60 * 24); // get diff in days
    if (bal < 1) {
      if (recentChats) {
        return formatDate(new Date(value), 'shortTime', 'en');
      }
      return 'Today';
    } else if (bal < 2) {
      return 'Yesterday';
    } else {
      if (recentChats) {
        return formatDate(new Date(value), 'd/M/yy', 'en');
      }
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

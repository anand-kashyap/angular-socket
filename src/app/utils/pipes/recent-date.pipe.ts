import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';
@Pipe({
  name: 'recentDate'
})
export class RecentDatePipe implements PipeTransform {
  forRecentScreen(value) {
    const date = new Date(value);
    const diff = new Date().getDate() - date.getDate();
    if (diff === 0) {
      return formatDate(date, 'shortTime', 'en');
    } else if (diff === 1) {
      return 'Yesterday';
    } else {
      return formatDate(date, 'd/M/yy', 'en');
    }
  }

  transform(value: any, recentChats = false): any {
    if (recentChats) {
      return this.forRecentScreen(value);
    }
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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [RecentDatePipe],
  imports: [CommonModule],
  exports: [RecentDatePipe]
})
export class RecentDateModule {}

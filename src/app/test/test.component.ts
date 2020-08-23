import { Component, OnInit } from '@angular/core';
import { ApiService } from '@app/api.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  roomId: string;

  constructor(private api: ApiService) {}

  ngOnInit() {
    console.log('works');
  }

  delRoom() {
    console.log('roomId is: ', this.roomId);
    this.api.delRoom(this.roomId).subscribe(console.log, console.error);
  }
}

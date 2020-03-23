import { Component, OnInit } from '@angular/core';
import { slideInOutAnimation } from '@app/animations/slideInOut';
import { ApiService } from '@app/api.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  animations: [slideInOutAnimation]
})
export class TestComponent implements OnInit {
  messages = [
    {
      datechange: 'Mar 17, 2020'
    },
    {
      _id: '5e70ff2bccc6ac01144b2296',
      msg: 'one more',
      username: 'anand_ak',
      updatedAt: '2020-03-17T16:47:39.339Z',
      createdAt: '2020-03-17T16:47:39.339Z'
    },
    {
      datechange: 'Mar 19, 2020'
    },
    {
      _id: '5e73730a3ee39200040e5aa6',
      msg: 'xsxsxsxsxsx',
      username: 'anand_ak',
      updatedAt: '2020-03-19T13:26:34.601Z',
      createdAt: '2020-03-19T13:26:34.601Z'
    },
    {
      datechange: 'Mar 21, 2020'
    },
    {
      _id: '5e760127d3d3680cd81597f1',
      msg: 'cghf',
      username: 'anand_ak',
      updatedAt: '2020-03-21T11:57:27.123Z',
      createdAt: '2020-03-21T11:57:27.123Z'
    },
    {
      _id: '5e760606ac1faf0f3b5f09b9',
      msg: 'sxsxsx',
      username: 'anand_ak',
      updatedAt: '2020-03-21T12:18:14.151Z',
      createdAt: '2020-03-21T12:18:14.151Z'
    },
    {
      datechange: 'Mar 22, 2020'
    },
    {
      _id: '5e770f2ea0afe705a15edcd7',
      msg: 'xsxsx',
      username: 'anand_ak',
      updatedAt: '2020-03-22T07:09:34.806Z',
      createdAt: '2020-03-22T07:09:34.806Z'
    },
    {
      _id: '5e770f3ba0afe705a15edcd8',
      msg: '123s',
      username: 'anand_ak',
      updatedAt: '2020-03-22T07:09:47.664Z',
      createdAt: '2020-03-22T07:09:47.664Z'
    },
    {
      _id: '5e770fbaf9e1c605d2a7d736',
      msg: '12sw',
      username: 'anand_ak',
      updatedAt: '2020-03-22T07:11:54.311Z',
      createdAt: '2020-03-22T07:11:54.311Z'
    },
    {
      _id: '5e7711489e1c9605e8f3d0ed',
      msg: 'asxwe',
      username: 'temer',
      updatedAt: '2020-03-22T07:18:32.000Z',
      createdAt: '2020-03-22T07:18:32.000Z'
    },
    {
      _id: '5e7711669e1c9605e8f3d0ef',
      msg: '123',
      username: 'anand_ak',
      updatedAt: '2020-03-22T07:19:02.290Z',
      createdAt: '2020-03-22T07:19:02.290Z'
    },
    {
      _id: '5e774511d77b4c0dc496547e',
      msg: 'jnjn',
      username: 'temer',
      updatedAt: '2020-03-22T10:59:29.049Z',
      createdAt: '2020-03-22T10:59:29.049Z'
    }
  ];
  user = { username: 'anand_ak' };
  open = false;
  isInProgress = false;
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    console.log('initsss');
  }

  longClicked(eve) {
    console.log('Long clicked btn: ', eve);
  }

  tap(eve) {
    console.log('tapped: ', eve);
  }

  onPull(val) {
    console.log('pulled', val);

    this.isInProgress = true;
  }
}

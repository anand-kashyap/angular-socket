import { Component, OnInit } from '@angular/core';
import { slideInOutAnimation } from '@app/animations/slideInOut';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiService } from '@app/api.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  animations: [slideInOutAnimation]
})
export class TestComponent implements OnInit {
  open = false;
  file: FormData;
  progress = 0;
  constructor(private apiService: ApiService) {}

  ngOnInit() {}

  uploadFile(ev) {
    let file = ev.target.files;
    if (file.length > 0) {
      file = file[0];
      console.log(file);
      this.file = new FormData();
      this.file.append('file', file, file.name);
    }
  }

  send() {
    // console.log(this.file);

    // return;
    this.apiService.uploadFile(this.file).subscribe(
      (res: HttpEvent<any>) => {
        if (res.type === HttpEventType.UploadProgress) {
          this.progress = Math.round((res.loaded / res.total) * 100);
          console.log(`Uploaded! ${this.progress}%`);
        }
        if (res.type === HttpEventType.Response) {
          console.log(res);
        }
      },
      err => console.error(err)
    );
  }
  longClicked(eve) {
    console.log('Long clicked btn: ', eve);
  }

  tap(eve) {
    console.log('tapped: ', eve);
  }
}

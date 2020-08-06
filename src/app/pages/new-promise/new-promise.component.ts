import { Component, OnInit } from '@angular/core';
import { PromiseService } from './new-promise.service';
import { TestPromise } from '../write-promise/write-promise';

const img = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596635167240&di=e65469847096deabd08f017485e0d2a2&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201510%2F06%2F20151006202045_VR3Au.jpeg';

@Component({
  selector: 'app-new-promise',
  templateUrl: './new-promise.component.html',
  styleUrls: ['./new-promise.component.css']
})
export class NewPromiseComponent implements OnInit {
  public imgUrl: string;

  constructor(
    private promiseService: PromiseService,
  ) { }

  ngOnInit() {
  }

  public loadimage(url?: string): void {
    const imgUrl = url || img;
    const imgPromise = this.createNewPromise(imgUrl);
    imgPromise.then(() => {
      alert('图片加载成功');
      this.imgUrl = imgUrl;
    }).catch(() => {
      alert('图片加载失败');
      this.imgUrl = imgUrl;
    })
    // .finally(() => {
    //   alert('任何结果都弹弹弹');
    // });
  }

  public promiseAll(): void {
    const imgPromise1 = this.createNewPromise(this.imgUrl);
    const imgPromise2 = this.createNewPromise(this.imgUrl);
    Promise.all([imgPromise1, imgPromise2])
      .then(() => {
        alert('all图片加载成功');
      })
      .catch(() => {
        alert('all图片加载失败');
      });
  }

  private createNewPromise(url): Promise<any> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload  = resolve; // 加载图片成功
      image.onerror = reject; // 加载图片失败
      image.src = url;
    })
    .then(() => { // 形成一个新的promise 传递数据
      alert(1);
      return 1;
    })
    .then((num) => {
      alert(num + 1);
      return num + 1;
    })
    .then((num) => {
      alert(num + 1);
      return num + 1;
    })
    // .catch(() => {
    //   alert('Promise加载失败');
    // });
  }

  private promiseResolveAndReject(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.promiseService.getUser()
      .subscribe((data) => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }
}

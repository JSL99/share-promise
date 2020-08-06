export class TestPromise {
  public status: string; // 默认状态为pending
  public resolveData: any; // 存放着此promise成功的结果
  public rejectData: any; // 存放着此promise失败的结果
  public onResolvedCallbacks: any[];  // 存放着所有成功的回调函数
  public onRejectedCallbacks: any[];   // 存放着所有的失败的回调函数

  constructor(task) {
    this.status = 'pending';
    this.resolveData = null;
    this.rejectData = null;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];

    // 立即执行传入的任务
    try {
        task(this.resolve.bind(this), this.reject.bind(this));
    } catch (e) {
        this.reject(e);
    }
  }

  // 调用resolve方法可以把promise状态变成成功态, promise成功，执行onFulfilledList回调
  public resolve(value) {
      if (value instanceof TestPromise) {
          return value.then(this.resolve, this.reject);
      }
      // setTimeout(() => { // 异步执行所有的回调函数
          // 如果当前状态是初始态（pending），则转成成功态
          // 此处这个写判断的原因是因为resolved和rejected两个状态只能由pending转化而来，两者不能相互转化
          console.log(this, value);
          if (this.status === 'pending') {
              this.resolveData = value;
              this.status = 'resolved';
              console.log(this.onResolvedCallbacks);
              for (let i = 0; i < this.onResolvedCallbacks.length; i++) {
                this.onResolvedCallbacks[i](value);
              }
          }
      // });
  }

  //  promise失败，执行onRejectedList回调
  public reject(value) {
    if (this.status === 'pending') {
        this.rejectData = value;
        this.status = 'rejected';
        this.onRejectedCallbacks.forEach(item => item(value));
    }
  }


  // promise解析, 根据then 返回数据类型不同封装不同的promise，以便实现then的链式调用及Promise的thenable特性
  public resolvePromise(promise, x, resolve, reject) {
    let then;
    let thenCalledOrThrow = false;

    if (promise === x) {
      return reject(new TypeError('Chaining cycle detected for promise!'));
    }

    // then return 的数据是一个promise
    if (x instanceof TestPromise) {
      if (x.status === 'pending') { // because x could resolved by a Promise Object
        x.then(function(v) {
          this.resolvePromise(promise, v, resolve, reject);
        }, reject);
      } else { // but if it is resolved, it will never resolved by a Promise Object but a static value;
        x.then(resolve, reject);
      }
      return;
    }

    // rthen eturn的是一个对象,若对象具有then方法，则可使用此方法作为新的then
    // Promise的thenable特性基于此

    if ((x !== null) && ((typeof x === 'object') || (typeof x === 'function'))) {
      try {
        then = x.then; // because x.then could be a getter
        if (typeof then === 'function') {
          then.call(x, function rs(y) {
            if (thenCalledOrThrow) {
              return;
            }
            thenCalledOrThrow = true;
            return this.resolvePromise(promise, y, resolve, reject);
          }, function rj(r) {
            if (thenCalledOrThrow) {
              return;
            }
            thenCalledOrThrow = true;
            return reject(r);
          });
        } else {
          resolve(x);
        }
      } catch (e) {
        if (thenCalledOrThrow) {
          return;
        }
        thenCalledOrThrow = true;
        return reject(e);
      }
    } else { // then return 的是基本数据或undefined
      resolve(x);
    }
  }

  public then (onFulfilled?, onRejected?) {
    // 当调用时没有写函数给它一个默认函数值
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : value => {
        throw value;
    };
    let promise; // 传入then的参数是函数的话，则直接已目前promise的数据为参数执行该函数，并
    if (this.status === 'resolved') {
        promise = new TestPromise((resolve, reject) => {
            // setTimeout(() => {
                try {
                    const x = onFulfilled(this.resolveData);
                    this.resolvePromise(promise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            // });
        });
    }
    if (this.status === 'rejected') {
        promise = new TestPromise((resolve, reject) => {
            // setTimeout(() => {
                try {
                    const x = onRejected(this.rejectData);
                    this.resolvePromise(promise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            // });
        });
    }
    if (this.status === 'pending') {
        promise = new TestPromise((resolve, reject) => {
            this.onResolvedCallbacks.push(value => {
                try {
                    const x = onFulfilled(value);
                    this.resolvePromise(promise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
            this.onRejectedCallbacks.push(value => {
                try {
                    const x = onRejected(value);
                    this.resolvePromise(promise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
    return promise;
  }

  public catch(onRejected?) {
    let promise;
    console.log('catch');
    // 不是函数直接返回
    onRejected = typeof onRejected === 'function' ? onRejected : value => {
      throw value;
    };

    if (this.status === 'rejected') {
      promise = new TestPromise((resolve, reject) => {
          // setTimeout(() => {
              try {
                  const x = onRejected(this.rejectData);
                  this.resolvePromise(promise, x, resolve, reject);
              } catch (e) {
                  reject(e);
              }
          // });
      });

      if (this.rejectData !== null) {
        onRejected(this.rejectData);
      }
    }

    if (this.status === 'pending') {
        promise = new TestPromise((resolve, reject) => {
            this.onRejectedCallbacks.push(value => {
                try {
                    const x = onRejected(value);
                    this.resolvePromise(promise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        });

        this.onRejectedCallbacks.push(() => {
          // 没有错误信息则不执行catch中的函数
          if (this.rejectData !== null) {
            onRejected(this.rejectData);
          }
        });
    }
    return promise;
  }
}

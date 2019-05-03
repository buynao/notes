var PENDING = 'pending'; // 初始状态
var FULFILLED = 'fulfilled'; // 成功状态
var REJECT = 'rejected'; // 失败状态


function MyPromise (fn) {
    var self = this;
    self.status = PENDING;

    self.nextVal; // 决议值
    self.reason; // 错误原因
    self.onResolved = []; // 通过回调队列
    self.onRejected = []; // 错误回调队列

    function resolve (val) {
        self.nextVal = val;
        setTimeout(() => {
            if (self.status === PENDING) {
                self.status = FULFILLED;
                self.onResolved.forEach((cb) => cb(val));
            }
        }, 0);
    }

    function reject (e) {
        setTimeout(() => {
            if (self.status === PENDING) {
                self.status = REJECT;
                self.reason = e;
                self.onRejected.forEach((cb) => cb(e));
            }
        }, 0)
    }

    // 同步执行当前函数
    try {
        fn(resolve, reject);
    } catch (error) {
        reject(error)
    }
}

MyPromise.prototype.then = function (onfulfilled, onrejected) {
    var self = this;
    
    onfulfilled = typeof onfulfilled === 'function' ? onfulfilled : (val) => val;
    onrejected = typeof onrejected === 'function' ? onrejected : (e) => {
        console.error(e);
    };

    // 返回一个新的Promise2对象
    var promise2 = new MyPromise((resolve, reject) => {
        if (self.status === FULFILLED) {
            setTimeout(() => {
                try {
                    // 执行then的第一个方法
                    var x = onfulfilled(self.nextVal);
                    // 判断该方法返回值是不是promise
                    if (x instanceof MyPromise) {
                        x.then(resolve);
                    } else {
                        // 普通值的情况，完成链式调用：promise2.then((x)) 可以直接得到
                        reject(x);
                    }
                } catch(e) {
                    reject(e);
                }
            }, 0);
        }
        
        if (self.status === REJECT) {
            setTimeout(() => {
                try {
                    // 执行then的第一个方法
                    var x = onrejected(self.reason);
                    // 判断该方法返回值是不是promise
                    if (x instanceof MyPromise) {
                        x.then(resolve);
                    } else {
                        // 普通值的情况，完成链式调用：promise2.then((x)) 可以直接得到
                        reject(x);
                    }
                } catch(e) {
                    reject(e);
                }
            }, 0);
        }
    
        if (self.status === PENDING) {
            self.onResolved.push((val) => {
                try {
                    let x = onfulfilled(val);
                    if (x instanceof MyPromise) {
                        x.then(resolve);
                    } else {
                        resolve(x);
                    }
                } catch(e) {
                    reject(e);
                }
            });
            self.onRejected.push((val) => {
                try {
                    let x = onrejected(val);
                    if (x instanceof MyPromise) {
                        x.then(resolve);
                    } else {
                        reject(x);
                    }
                } catch (error) {
                    reject(error);
                }
            });
        }
    });

    return promise2;
}

MyPromise.prototype.catch = function (fn) {
    this.then(null, fn);
}

MyPromise.all = function(list) {
    var count = 0;
    var res = [];
    return new MyPromise((resolve, reject) => {
        list.forEach((p) => {
            p.then((val) => {
                count++;
                res.push(val);
                if (count === list.length) {
                    resolve(res);
                }
            }).catch((e) => {
                reject(e);
            });
        });
    });
}

MyPromise.race = function(list) {
    return new MyPromise((resolve) => {
        list.forEach((p) => {
            p.then((val) => {
                resolve(val);
            });
        });
    })
}

MyPromise.resolve = function(val) {
    return new Promise((resolve) => resolve(val));
}

// 测试用
// var MyPromise = Promise;

new MyPromise((res) => {
    console.log('myPromise');
    res(1);
}).then((val) => {
    console.log(val);
    return 2;
}).then((val) => {
    console.log(val);
    return new MyPromise((resolve, rejected) => {
        resolve('then promise');
    });
}).then((val) => {
    console.log(`return then Promise:${val}`);
});

MyPromise.all([new MyPromise((r) => r(1)), new MyPromise((r) => r(2))])
.then((val) => {
    console.log(`MyPromise.all:${val}`);
});

MyPromise.race([new MyPromise((r) => r(3)), new MyPromise((r) => r(4))])
.then((val) => {
    console.log(`MyPromise.race:${val}`);
});

MyPromise.resolve(3).then((val) => {
    console.log(`MyPromise.resolve(3):${val}`);
});
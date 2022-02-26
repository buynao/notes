```js
/** 
 * 要求设计 LazyMan 类，实现以下功能
 * LazyMan('Tony');
 * // Hi I am Tony

 * LazyMan('Tony').sleep(10).eat('lunch');
 * // Hi I am Tony
 * // 等待了10秒...
 * // I am eating lunch

 * LazyMan('Tony').eat('lunch').sleep(10).eat('dinner');
 * // Hi I am Tony
 * // I am eating lunch
 * // 等待了10秒...
 * // I am eating diner

 * LazyMan('Tony').eat('lunch').eat('dinner').sleepFirst(5).sleep(10).eat('junk food');
 * // Hi I am Tony
 * // 等待了5秒...
 * // I am eating lunch
 * // I am eating dinner
 * // 等待了10秒...
 * // I am eating junk food
*/

var LazyMan = function(name) {
    return new _LazyMan(name);
}

var _LazyMan = function(name) {
    this.name = name;
    this.queue = [];
    console.log(`hi, im a ${this.name}`);
    setTimeout(() => { // 等待任务队列加载完成
        this.next(); // 开始第一个任务
    });
}

_LazyMan.prototype = {
    eat: function (food) {
        this.queue.push(() => { // 依次插入
            console.log(`eat ${food}`)   
            this.next(); // 依次调用下一个
        });
        return this;
    },
    sleepFirst: function (s) {
        this.queue.unshift(() => { // 优先级最高，插入最早的
            setTimeout(() => {
                console.log(`等待了${s}秒`);
                this.next(); // 依次调用
            }, s * 1000);
        });
        return this;
    },
    sleep: function(s) {
        this.queue.push(() => { // 依次插入
            setTimeout(() => {
                console.log(`等待了${s}秒`);
                this.next(); // 依次调用
            }, s * 1000);
        });
        return this;
    },
    next: function () {
        // 调度器
        var fn = this.queue.shift(); // 任务队列，先进先出
        fn && fn();
    }
}

LazyMan('Tony');
// Hi I am Tony

LazyMan('Tony').sleep(10).eat('lunch');
// Hi I am Tony
// 等待了10秒...
// I am eating lunch

// LazyMan('Tony3').eat('lunch').sleep(10).eat('dinner');
// Hi I am Tony
// I am eating lunch
// 等待了10秒...
// I am eating diner

// LazyMan('Tony4').eat('lunch').eat('dinner').sleepFirst(5).sleep(10).eat('junk food');
```
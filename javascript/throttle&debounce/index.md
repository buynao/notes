```js
/** 
 * 节流函数
 * 一定时间内只触发一次
*/

var throttle = function(fn, delay) {
    var that = this;
    var timer = null;
    return function () {
        if (!timer) {
            fn.apply(that, arguments);
            timer = setTimeout(() => {
                timer = null;
            }, delay || 3000);
        }
    }
}

var debounce = function(fn, delay) {
    var that = this;
    var timer = null;
    return function() {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn.apply(that, arguments);
            timer = null;
        }, delay);
    }
}


var throttleCount = 0;
var debounceCount = 0;
var normalCount = 0;


// 截流测试
document.querySelector('#throttle').addEventListener('click', throttle((e) => {
    console.log(e);
    document.querySelector('#throttleCount').innerHTML = throttleCount++;
}, 1000));

document.querySelector('#debounce').addEventListener('click', debounce((e) => {
    console.log(e);
    document.querySelector('#debounceCount').innerHTML = debounceCount++;
}, 1000));

document.querySelector('#normal').addEventListener('click', (e) => {
    console.log(e);
    document.querySelector('#normalCount').innerHTML = normalCount++;
});
```

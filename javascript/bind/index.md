```js
var fun = Function.prototype;

fun._bind = function (context) {
    var args1 = Array.prototype.slice.call(arguments, 1);
    var context = context || window;
    var func = this;
    if (typeof func !== 'function') {
        throw new Error('Bind must be called on a function');
    }
    var fn = function() {
        var args2 = Array.prototype.slice.call(arguments);
        var args = args1.concat(args2);
        var res;
        if (this instanceof func) {
            res = new func(...args);
        } else {
            context.fn = func;
            var fnStr = 'context.fn(';
            for (var i = 0; i < args.length; i++) {
                fnStr += i == args.length - 1 ? 'args[i]' : 'args[i],';
            }
            fnStr += ')'; // 得到"context.fn(arg1,arg2,arg3...)"这个字符串在，最后用eval执行
            res = eval(fnStr); // 还是eval强大
            delete context.fn;
        }
        return res;
    }

    fn.prototype = Object.create(this.prototype);

    return fn;
}

fun._apply = function(context, args) {
    var func = this;
    var context = context || window;
    if (typeof func !== 'function') {
        throw new Error('apply must be called on a function');
    }
    context.fn = func;
    var res = context.fn(...args);
    delete context.fn;
    return res;
}

fun._call = function(context) {
    var func = this;
    var context = context || window;
    var args = Array.prototype.slice.call(arguments, 1);
    if (typeof func !== 'function') {
        throw new Error('call must be called on a function');
    }
    context.fn = func;
    var res = context.fn(...args);
    delete context.fn;
    return res;
}

var obj = {
    a: '1'
};
var a = 'winodw';

function test() {
    console.log(arguments)
    console.log(this.a);
}

test(); // window

var tt = test._bind(obj, 'b');

tt(); // 1

var tobj = new tt('a');

console.log(tobj); // {}

test._apply({
    a: 'apply'
}, [1, 2, 3]); // apply


test._call({
    a: 'call'
}); // call
```
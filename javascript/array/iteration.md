## 数组的迭代方法汇总

一些常用的遍历数组的一些原生方法：

**for, while, for...in, for...of, forEach, map, filter, some, every, reduce...**

---

> **1. for**
```
/* for */

const arr = ['a', 'b', 'c'];

for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
}

// 输出'a','b','c'
```

**兼容性**


chrome | edge | firefox | IE | 
---|---| ---| --- |--- |
yes | yes | yes | yes |


---


> **2. while**
```
/* while */

let arr = ['a', 'b', 'c'];

let i = 0;

while (i < arr.length) {
	console.log(arr[i]);
    ++i;
}
// 输出'a','b','c'
```

**兼容性**


chrome | edge | firefox | IE | 
---|---| ---| --- |--- |
yes | yes | yes | yes |

---


> **3. for..in**
```
/** for...in 
*   不推荐用for..in遍历数组
*   此方法会把数组外的属性也输出
*   for...in 语句以原始插入顺序迭代对象的可枚举属性。
*   原型上的扩展方法也会遍历出
*   可枚举属性：即通过直接的赋值和属性初始化的属性
*   通过Object.defineProperty等定义的属性，则默认为非枚举属性，除非enumerable设置为true
*/


let arr = ['a', 'b', 'c'];
arr.ss = 'arr.ss';
for (const key in arr) {
    console.log(key);
}
// 输出0,1,2,ss
```

**兼容性**


chrome | edge | firefox | IE | 
---|---| ---| --- |--- |
yes | yes | yes | yes |

---


> **4. for..of**
```
/** for...of
* for...of 语句遍历可迭代对象定义要迭代的数据。
* 该循环迭代并记录iterable作为可迭代对象定义的迭代值，这些是数组元素 'a', 'b', 'c'，而不是任何对象的属性。
*/


let arr = ['a', 'b', 'c'];
arr.ss = 'arr.ss';
for (const value of arr) {
    console.log(value);
}
// 输出'a','b','c'
```

**兼容性**


chrome | edge | firefox | IE | 
---|---| ---| --- |--- |
yes | yes | yes | no |

---


> **5. forEach**
```
/** forEach
* forEach() 方法对数组的每个元素执行一次提供的函数。
* 返回值：undefined
*/


let arr = ['a', 'b', 'c'];
arr.ss = 'arr.ss';
arr.forEach(function(element) {
    console.log(element);
});
// 输出'a','b','c'
```

**兼容性**


chrome | edge | firefox | IE | 
---|---| ---| --- |--- |
yes | yes | yes | ie9+ |

---

> **6. map**
```
/** map
* map() 方法对数组的每个元素执行一次提供的函数，此函数应有返回值，否则返回undefined。
* 返回值：一个新数组，每个元素都是回调函数的返回结果。
* map 不修改调用它的原数组本身（当然可以在 callback 执行时改变原数组）。
* 实用场景：简化原数组或复杂原数组
*/


let numbers = [1, 5, 10, 15];
let doubles = numbers.map(function (x) {
    return x ** 2;
});

// doubles is now [1, 25, 100, 225]
// numbers is still [1, 5, 10, 15]

```

**兼容性**


chrome | edge | firefox | IE | 
---|---| ---| --- |--- |
yes | yes | yes | ie9+ |

---

> **7. filter**
```
/** filter
* filter() 用法与map()相似,新数组元素是通过函数检查条件的元素，函数须返回布尔值。
* 返回值：一个新数组，每个元素都是回调函数的筛选结果。
* 
*/


var arr = [1, 2, 4, 5, 6]
arr.filter((val) => val > 3);
// 输出结果4,5,6
```

**兼容性**


chrome | edge | firefox | IE | 
---|---| ---| --- |--- |
yes | yes | yes | ie9+ |

---

> **8. some**
```
/** some 测试数组方法
* some() 对数组中的每个元素都执行一次指定的函数（callback
* 直到此函数返回 true，如果发现这个元素some 将返回 true
* 如果回调函数对每个元素执行后都返回 false ，some 将返回 false。
* 它只对数组中的非空元素执行指定的函数，没有赋值或者已经删除的元素将被忽略。
* 返回值：布尔值。
* 
*/


const isBiggerThan10 = (element, index, array) => {
  return element > 10;
}

[2, 5, 8, 1, 4].some(isBiggerThan10);  
// false

[12, 5, 8, 1, 4].some(isBiggerThan10); 
// true

```

> **9. every**
```
/** every 测试数组方法
* every() 对数组中的每个元素都执行一次指定的函数（callback
* 如果回调函数对每个元素执行后都返回 true ，every 将返回 true，否则返回false。
* 它只对数组中的非空元素执行指定的函数，没有赋值或者已经删除的元素将被忽略。
* 返回值：布尔值。
* 
*/


function isBigEnough(element, index, array) {
  return (element >= 10);
}
[12, 5, 8, 130, 44].every(isBigEnough);
// false
[12, 54, 18, 130, 44].every(isBigEnough);
// true

```

**兼容性**


chrome | edge | firefox | IE | 
---|---| ---| --- |--- |
yes | yes | yes | ie9+ |

---


> **10. reduce**
```
/** reduce
* arr.reduce(callback[, initialValue]), 初始值：initialValue
* reduce() 对数组中的所有元素调用指定的回调函数。该回调函数的返回值为累积结果，并且此返回值在下一次调用该回调函数时作为参数提供。
*/


var arr = [1, 2, 3, 4, 5];
var sum = arr.reduce(function(prev, cur) {
    return prev + cur;
}, 0);
console.log(arr, sum);
// 输出 [1, 2, 3, 4, 5]， 15

// 计算字符串出现次数
var arrString = 'abcdaabc';
arrString.split('').reduce(function(res, cur) {
    res[cur] ? res[cur] ++ : res[cur] = 1
    return res;
}, {})
// 输出 {a: 3, b: 2, c: 2, d: 1}

[1, 2].reduce(function(res, cur) { 
    res.push(cur + 1); 
    return res; 
}, [])
// 输出[2, 3]
```

**兼容性**


chrome | edge | firefox | IE | 
---|---| ---| --- |--- |
yes | yes | yes | ie9+ |

---

### 总结

> forEach 方法是将数组中的每一个值取出做一些程序员想让他们做的事情

> map 方法 是将数组中的每一个值放入一个方法中做一些程序员想让他们做的事情后返回一个新的数组

> reduce 方法 将数组中的每一个值与前面的被返回相加的总和(初试值为数组的第一个值或者initialValue)

> some 和 every 为测试数组方法

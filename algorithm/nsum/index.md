```js
/** 
 * 无序数组中，找到n个数和为target
*/

var arr = [2, 3, 1, 4, 7, 6]
var target = 9;
var n = 3;

// 暴力法
var nsum1 = function(arr, n, target) {
    console.time('force')
    var arrs = [];
    var signle = [];
    var result = [];
    // 拆成数组为n
    var merge = function(arr, index) {
        // 满足条件
        if (signle.length === n) {
            arrs.push(signle.slice());
            return;
        }
        for (var i = index; i < arr.length; i++) {
            signle.push(arr[i]);
            merge(arr, i + 1);
            signle.pop();
        }
    }
    // 分拆数组
    merge(arr, 0);
    var sum = function(arr) {
        return arr.reduce((prev, curr) => {
            return prev + curr;
        }, 0);
    }
    for (var i = 0; i < arrs.length; i++) {
        if (sum(arrs[i]) === target) {
            result.push(arrs[i]);
        }
    }
    console.timeEnd('force');
    console.log(result);
    return result.length;
}

// 回溯法
var nsum2 = function(arr, n, target) {
    console.time('dfs')
	const buffer = [];
	const result = [];
    if (n > arr.length) {
        return [];
    }
    const backTrace = (index, target) => {
        // 满足条件
        if(target == 0 && buffer.length === n) {
            // console.log(`满足条件:${JSON.stringify(buffer)}`)
            return result.push(buffer.slice());
        }

        // 递归终止条件
        if(target < 0 || buffer.length > n || index >= arr.length) {
            // console.log(`条件中止:${JSON.stringify(buffer)}, target:${target},index:${index}`)
            return;
        };

        // 循环递归数组进行查找
        for (var i = index; i < arr.length; i++) {
            // 回溯法
            // 1. 将当前元素添加至缓冲数组
            buffer.push(arr[i]);
            // 2. 跳过当前元素继续寻找下一元素，目标值须减去当前值
            backTrace(i + 1, target - arr[i]);
            // 3. 回溯
            buffer.pop();
        }
    }

    backTrace(0, target);

    console.timeEnd('dfs')
    return result.length;
};

// 动态规划
var nsum3 = function(arr, n, target) {
    var result = [];

    // 递推公式：
    // result[i][j] = s[i - 1][j] => i = 多少个，j = 当前的target值
    for (var i = 0; i < target; i++) {
        memo[0][i] = target - arr[0];
    }
    // 转移方程：
    // r[i][j] = r[i - 1][j] || r[i][target - j];

    // 暂时想不出
}

console.log(`暴力法:${nsum1(arr, n, target)}`)
console.log(`回溯法:${nsum2(arr, n, target)}`)
// console.log(`动态规划:${nsum3(arr, n, target)}`)
```

```js
/**
 * 问题描述：有n 个物品，它们有各自的重量和价值，现有给定容量的背包，如何让背包里装入的物品具有最大的价值总和？
 * 01背包网站测试：http://karaffeltut.com/NEWKaraffeltutCom/Knapsack/knapsack.html
 */

var w = [2, 3, 4, 5]; // 每件背包重量
var v = [3, 4, 5, 6]; // 每件背包价值
var n = w.length; // 背包数量

var c = 18; // 背包总重量

// 生成二维树组

var buildTwoArray = function (n, c) {
    var array = [];
    for (var i = 0; i < n; i++) {
        array[i] = [];
        for (var j = 0; j < c; j++) {
            array[i].push(0);
        }
    }
    return array;
}

var memo = buildTwoArray(n, c); // 记忆化缓存
var memoDP = buildTwoArray(n, c); // 记忆化缓存

/**
 * 1. 暴力解法
 * 时间复杂度O（(2^n)*n）
 * 自顶向下
 */
var findMax = function () {
    console.log(bestValue(w.length - 1, c));
    console.log(memo);
}
/**
 * [0, index]的物品,填充c的最大价值
 */
var bestValue = function(index, c) {
    // 递归终止条件
    // index < 0 当前么有物品可以选择了
    // c <= 0 当前背包没有容量可以放物品了
    if (index < 0 || c <= 0) {
        return 0;
    }
    // 记忆化缓存当前结果
    if (memo[index][c]) {
        return memo[index];
    }
    // 不选择当前物品
    let res = bestValue(index - 1, c);
    // 当前背包容量装得下，当前物品，并选择当前物品
    if (c >= w[index]) {
        // v[index] 当前物品价值 + 下一个物品的价值
        res = Math.max(v[index] + bestValue(index - 1 , c - w[index]), res);
    }
    memo[index][c] = res;
    return res;
}
findMax();

/**
 * 2. 动态规划解法
 * f(n, c) => 函数定义：n个物品放进容量c的背包，价值最大
 * DP递推公式：
 * f(i, c) = f(i - 1, c) => 不放当前物品
 *         = v[i] + f(i - 1, c - w[i]) => 放置当前物品
 *         = Math.max(f(i - 1, c), v[i] + f(i - 1, c - w[i]))  => 选择最大的价值
 *  如果有条件如下：
 *                c = 5
 *     0   1   2
 *  w  1   2   3
 *  v  6   10  12
 * 
 *  结果则为：
 *      0   1   2   3   4   5
 * 
 *  0   0   6   6   6   6   6  <= 只有一个物品的情况，其价值最大为：
 * 
 *  1   0   6   10  16  16  16
 * 
 *  2   0   6   10  16  18  20
 */
var findMaxDP = function () {
    // 0. 建模：使用二维数组memoDP保持每个容量下的背包问题最优解

    // 1. 处理基础问题
    // memoDP[0]的情况，即只考虑只有一个物品的情况，其价值最大为：
    for (var i = 0; i <= c; i++) {
        memoDP[0][i] = ( i >= w[0] ? v[0] : 0 );
    }
    console.log(memoDP);

    // 2. 自底向上，开始递推公式的转变
    for (var i = 1; i < n; i++) { // 第一个物品的情况，已经算好
        for (var k = 0; k <= c; k++) { // 背包容量
            // 01 => 即两种情况，选择当前背包和不选择当前背包。
            // 根据情况，可作以下条件判断：
            memoDP[i][k] = memoDP[i - 1][k]; // 不选当前物品的情况
            if (k >= w[i]) { // 可以放下当前物品时，即取两种选择的最大值
                memoDP[i][k] = Math.max(memoDP[i][k], v[i] + memoDP[i - 1][k - w[i]])
            }
        }
    }
    // 3. 结果至此都存在二维数组里了
    console.log(memoDP[n - 1][c])
    return memoDP[n - 1][c];
}

findMaxDP();

```

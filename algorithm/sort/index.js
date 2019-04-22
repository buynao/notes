
/**
 * 交换方法
 * @param {*} arr 
 */
var swap = function (arr, i, j) {
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}
// 无序数组
var arr = [2, 1, 4, 6, 8, 5];

/**
 * 1. 冒泡排序 
 */
var bubbleSort = function (arr) {
    for (var i = 0; i < arr.length; i++) {
        for (var j = 1; j < arr.length; j++) {
            if (arr[j] < arr[j - 1]) { // arr[j - 1 ] : 2  arr[j] : 1 => swap => 1 2
                swap(arr, j, j - 1);
            }
        }
    }
    console.log(`冒泡排序：${arr}`);
}

bubbleSort(arr.slice())

/**
 * 2. 选择排序
 * 找到最小的元素，让他和第一个数组进行交互，依次类推，与第二个，第三个交换
 */
var selectionSort = function (arr) {
    for (var i = 0; i < arr.length; i++) {
        var min = arr[i];
        for (var j = i + 1; j < arr.length; j++) {
            if (arr[j] < min) {
                var temp = min;
                min = arr[j];
                arr[j] = temp;
            }
        }
        arr[i] = min;
    }
    console.log(`选择排序：${arr}`);
}

selectionSort(arr.slice())

/**
 * 3. 插入排序
 * 将一个元素插入到其它已经有序的牌中的适当位置，
 * 因此其他所有元素在插入之前都向右移动一位，为新元素腾出空间。
 */
var insertSort = function (arr) {
    // 默认前第i个已经排序                    // arr =  2  1  x
    for (var i = 1; i < arr.length; i++) {
        var key = arr[i];                   // key = 1
        // 取第i个之后的，与i之前的进行排序   // arr[j] = 2
        for (var j = i - 1; j >= 0; j--) {
            // 比排好的最后一个数字要大
            if (arr[j] > key) {      //  2 > 1
                arr[j + 1] = arr[j]; // 大的数字往后推 => 1 < 2 最初效果 = arr[i] = arr[j]
                arr[j] = key;
            } else { 
                // 已经与已排序的前i个的最末位要小，无须进行后续比较
                break;
            }
        }
    }
    console.log(`插入排序：${arr}`);
}

insertSort(arr.slice());

/**
 * 4. 归并排序
 * 分治法
 * 将大数组拆成排好序的小数组(数组只有一个数的时候，即是已经排好序的数组)
 * 在将排好序的数组进行合并
 */
var mergeSort = function (arr) {
    // 递归的终止条件
    if (arr.length <= 1) {
        return arr;
    }
    var m = ~~(arr.length / 2);
    var l = arr.slice(0, m);
    var r = arr.slice(m);
    return merge(mergeSort(l), mergeSort(r))
}

var merge = function(l, r) {
    var res = [];
    while(l.length && r.length) {
        if (l[0] <= r[0]) {
            res.push(l.shift())
        } else {
            res.push(r.shift())
        }
    }
    while(l.length) {
        res.push(l.shift())
    }
    while(r.length) {
        res.push(r.shift())
    }
    return res;
}

console.log(`归并排序：${mergeSort(arr.slice())}`)
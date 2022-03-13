## 二分查找

给定一个 n 个元素有序的（升序）整型数组 nums 和一个目标值 target  ，写一个函数搜索 nums 中的 target，如果目标值存在返回下标，否则返回 -1。

示例：

输入: nums = [-1,0,3,5,9,12], target = 9

输出: 4

解释: 9 出现在 nums 中并且下标为 4

### 难点

- 定义区间范围
  - 左闭右闭[left, right] `while(left <= right)`
  - 左闭右开[left, right) `while(left < right)`
- 左右边界值
  - 左闭右闭[left, right] `left = 0, right = len - 1`
  - 左闭右开[left, right) `left = 0, right = len`
- 中间值
  - 防止边界溢出，向下取整 `Math.floor(left + (right - left) / 2)`

### 左闭右闭写法

```js
function binarySearch(arrary, target) {
  
  let l = 0;
  let r = arrary.length - 1;

  while(l <= r) {
      let mid = Math.floor(l + (r - l) / 2);
      if (arrary[mid] === target) {
          return mid;
      }
      // 去左闭区间继续寻找
      if (arrary[mid] > target) {
          r = mid - 1;
      } else {
          // 去右区间继续寻找
          l = mid + 1;
      }
  }
  return -1;
}

```

### 左闭右开写法

```js
function binarySearch(arrary, target) {
    let l = 0;
    let r = arrary.length;

    while (l < r) {
        let mid = Math.floor(l + (r - l) / 2);
        if (arrary[mid] === target) {
            return mid;
        }

        if (arrary[mid] > target) {
            r = mid;
        } else {
            l = mid + 1;
        }

    }
    return -1;
}
```

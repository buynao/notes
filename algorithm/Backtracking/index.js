/*
 * @lc app=leetcode.cn id=78 lang=javascript
 *
 * [78] 子集
 */
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
let res;
var subsets = function(nums) {

    if (!nums) return [];

    res = [];
    

    dfs([], nums, 0);

    console.log(res);

    return res;
};

function dfs(temp, nums, start) {

    res.push(temp.slice(0));

    for (let i = start; i < nums.length; i++) {
        temp.push(nums[i]);
        dfs(temp, nums, i + 1);
        temp.pop();
    }
}

subsets([1,2,3])
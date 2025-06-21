// 两数求和 const nums = [2, 7, 11, 15], target = 9
// 输出 [0, 1]

// const twoSum = (nums, target) => {
//   const map = new Map()
//   for (let i = 0; i < nums.length; i++) {
//     const complement = target - nums[i]
//     if (map.has(complement)) {
//       return [map.get(complement), i]
//     }
//     map.set(nums[i], i)
//   }
// }

// function twoSum(nums: number[], target: number): number[] {
//     const diff = {}
//     for(let i=0;i<nums.length;i++){
//        if(diff[target - nums[i]] !== undefined ){
//         return [diff[target - nums[i]],i];
//        }
//        diff[nums[i]] = i;
//     }
// };

// console.log(twoSum([2, 7, 11, 15], 9))

// 合并两个有序数组
// function merge(nums1,m,nums2, n) {
//     let i = m - 1,j = n - 1,k = m + n -1
//     while (i >= 0 && j >= 0){
//       if(nums1[i] >= nums2[j]){
//         nums1[k] = nums1[i]
//         i--;
//         k--
//       }else{
//           nums1[k] = nums2[j]
//           j--;
//           k--
//       }
//     }
//     while(j >= 0){
//       nums1[k] = nums2[j]
//       j--
//       k--
//     }
//   };

// function merge(nums1, m, nums2, n) {
//   nums1.splice(m, n, ...nums2)
//   nums1.sort((a, b) => a - b)
//   console.log(nums1, 'nums1')
// }

// merge([1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3)

// 三数求和问题

function threeSum(nums) {
  let res = []
  nums = nums.sort((a, b) => a - b)
  const len = nums.length
  // 注意这里改为 len-2，因为我们需要留出两个位置给 j 和 k
  for (let i = 0; i < len - 2; i++) {
    // 跳过重复的 i
    if (i > 0 && nums[i] === nums[i - 1]) {
      continue
    }

    let j = i + 1
    let k = len - 1 // 修改：k 应该指向数组最后一个元素

    while (j < k) {
      const sum = nums[i] + nums[j] + nums[k]

      if (sum < 0) {
        j++
        while (j < k && nums[j] === nums[j - 1]) {
          j++
        }
      } else if (sum > 0) {
        k--
        while (j < k && nums[k] === nums[k + 1]) {
          k--
        }
      } else {
        res.push([nums[i], nums[j], nums[k]])
        console.log('找到一组解:', [nums[i], nums[j], nums[k]])
        j++
        k--
        // 跳过重复的 j
        while (j < k && nums[j] === nums[j - 1]) {
          j++
        }
        // 跳过重复的 k
        while (j < k && nums[k] === nums[k + 1]) {
          k--
        }
      }
    }
  }
  return res
}

// 测试用例
const test1 = [-1, 0, 1, 2, -1, -4]
console.log('输入数组:', test1)
console.log('结果:', threeSum(test1))

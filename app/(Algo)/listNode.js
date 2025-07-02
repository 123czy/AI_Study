// // 定义链表节点类
// class ListNode {
//   constructor(val, next) {
//     this.val = val === undefined ? 0 : val
//     this.next = next === undefined ? null : next
//   }
// }

// /**
//  * @param {ListNode} l1
//  * @param {ListNode} l2
//  * @return {ListNode}
//  */
// const mergeTwoLists = function (l1, l2) {
//   // 定义头结点，确保链表可以被访问到
//   let head = new ListNode()
//   // cur 这里就是咱们那根"针"
//   let cur = head
//   // "针"开始在 l1 和 l2 间穿梭了
//   while (l1 && l2) {
//     // 如果 l1 的结点值较小
//     if (l1.val <= l2.val) {
//       // 先串起 l1 的结点
//       cur.next = l1
//       // l1 指针向前一步
//       l1 = l1.next
//     } else {
//       // l2 较小时，串起 l2 结点
//       cur.next = l2
//       // l2 向前一步
//       l2 = l2.next
//     }

//     // "针"在串起一个结点后，也会往前一步
//     cur = cur.next
//   }

//   // 处理链表不等长的情况
//   cur.next = l1 !== null ? l1 : l2
//   // 返回起始结点
//   return head.next
// }

// // 创建测试用例
// const l1 = new ListNode(1, new ListNode(2, new ListNode(4)))
// const l2 = new ListNode(1, new ListNode(3, new ListNode(4)))

// // 测试合并功能
// const result = mergeTwoLists(l1, l2)
// console.log('合并后的链表：', result)

// // 辅助函数：将链表转换为数组以便于查看结果
// function listToArray(head) {
//   const result = []
//   let current = head
//   while (current) {
//     result.push(current.val)
//     current = current.next
//   }
//   return result
// }

// // 打印结果数组
// console.log('合并后的数组形式：', listToArray(result))

// // 使用函数创建链表
// function ListNode(val) {
//   this.val = val
//   this.next = null
// }

// // 创建两个有序链表
// let node = new ListNode(1)
// node.next = new ListNode(2)
// node.next.next = new ListNode(3)

// let node2 = new ListNode(4)
// node2.next = new ListNode(5)
// node2.next.next = new ListNode(6)

// // 打印链表函数
// function printList(head) {
//   let current = head
//   const values = []
//   while (current) {
//     values.push(current.val)
//     current = current.next
//   }
//   console.log(values.join(' -> '))
// }

// // 打印初始链表
// console.log('第一个链表:')
// printList(node)
// console.log('第二个链表:')
// printList(node2)

// // 遍历并比较两个链表
// let current1 = node
// let current2 = node2

// console.log('\n比较过程:')
// while (current1 && current2) {
//   console.log(`比较: ${current1.val} vs ${current2.val}`)
//   if (current1.val < current2.val) {
//     current1 = current1.next
//   } else {
//     current2 = current2.next
//   }
// }

// // 打印剩余节点
// if (current1) {
//   console.log('\n第一个链表剩余节点:')
//   printList(current1)
// }

// if (current2) {
//   console.log('\n第二个链表剩余节点:')
//   printList(current2)
// }

// 删除重复链表
// function deleteDuplicates(head: ListNode | null): ListNode | null {
//     let cur = head;
//     while(cur !== null && cur.next !== null){
//         if(cur.val === cur.next.val){
//             cur.next = cur.next.next
//         }else{
//             cur = cur.next
//         }
//     }
//     return head
// };

// 反转链表

/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

// function reverseList(head: ListNode | null): ListNode | null {
//     let cur = head
//     let pre = null

//     while(cur !== null){
//         let next = cur.next;
//         cur.next = pre;

//         pre = cur;
//         // cur往前走一步
//         cur = next;
//     }
//     返回头节点
//     return pre;
// };

// 反转部分链表

function reverseBetween(head, left, right) {
  // 如果链表为空或者left等于right，无需反转
  if (!head || left === right) {
    return head
  }

  // 创建一个dummy节点，处理left=1的情况
  const dummy = new ListNode(0)
  dummy.next = head
  let pre = dummy

  // 找到要反转部分的前一个节点
  for (let i = 0; i < left - 1; i++) {
    pre = pre.next
  }

  // start是反转部分的起点
  let start = pre.next
  // then是start后面的节点
  let then = start.next

  // 反转left到right之间的节点
  for (let i = 0; i < right - left; i++) {
    start.next = then.next
    then.next = pre.next
    pre.next = then
    then = start.next
  }

  return dummy.next
}

class ListNode {
  constructor(val, next) {
    this.val = val === undefined ? 0 : val
    this.next = next === undefined ? null : next
  }
}

// 测试用例
const head = new ListNode(
  1,
  new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5))))
)

const result = reverseBetween(head, 2, 4)

// 辅助函数：打印链表
function printList(node) {
  const values = []
  while (node) {
    values.push(node.val)
    node = node.next
  }
  console.log(values.join(' -> '))
}

console.log('反转后的链表：')
printList(result)

const leftToRight = {
  '(': ')',
  '[': ']',
  '{': '}',
}

const isValid = (s) => {
  const stack = []
  for (let i = 0; i < s.length; i++) {
    if (leftToRight[s[i]]) {
      stack.push(s[i])
    } else {
      if (stack.length === 0) return false
      const last = stack.pop()
      if (leftToRight[last] !== s[i]) return false
    }
  }
  return stack.length === 0
}

// 使用map的解法 效率更好
// function isValid(s: string): boolean {
//     if (s.length === 0) return true;
//     if (s.length%2 ===1) {
//         return false;
//     }
//     const tempMap = new Map<string, string>();
//     tempMap.set(')','(');
//     tempMap.set(']','[');
//     tempMap.set('}','{');

//     const tempList: string[] = [];
//     for (let t of s) {
//         if (tempMap.has(t)) {
//             if (tempList.length > 0) {
//                 if (tempList[tempList.length - 1] === tempMap.get(t)) {
//                     tempList.pop();
//                 } else {
//                     return false;
//                 }
//             } else {
//                 return false;
//             }
//         } else {
//             tempList.push(t);
//         }
//     }
//     return tempList.length === 0;
// };

// console.log(isValid('()'))
// console.log(isValid('()[]{}'))
// console.log(isValid('(]'))

// 使用stack实现一个队列
class MyQueue {
  stack
  stack2
  constructor() {
    this.stack = []
    this.stack2 = []
  }

  push(x) {
    // 先将 stack2 中的所有元素移回 stack
    while (this.stack2.length > 0) {
      this.stack.push(this.stack2.pop())
    }
    // 添加新元素
    this.stack.push(x)
    // 将所有元素按顺序移到 stack2
    while (this.stack.length > 0) {
      this.stack2.push(this.stack.pop())
    }
  }

  pop() {
    return this.stack2.pop()
  }

  peek() {
    return this.stack2[this.stack2.length - 1]
  }

  empty() {
    return this.stack2.length === 0
  }
}

const myQueue = new MyQueue()
myQueue.push(1)
myQueue.push(2)
console.log(myQueue.peek())
console.log(myQueue.pop())
console.log(myQueue.empty())

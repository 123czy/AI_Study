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

console.log(isValid('()'))
console.log(isValid('()[]{}'))
console.log(isValid('(]'))

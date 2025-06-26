// 反转字符串

// const str = "hello"

// const reverseString = (str) => {
//     return str.split('').reverse().join('')
// }

// console.log(reverseString(str))

// 删掉一个字符判断字符串是否是回文

// function validPalindrome(s) {
//     let i = 0;
//     let j = s.length - 1;
//     while(i<j&&s[i]===s[j]){
//         i++;
//         j--;
//     }
//     if(isValid(i+1,j)){
//         return true;
//     }
//     if(isValid(i,j-1)){
//         return true;
//     }
//     function isValid(h,e){
//       while(h < e){
//         if(s[h]!==s[e]){
//             return false;
//         }
//         h++;
//         e--;
//       }
//       return true;
//     }
//     return false
// };

// const str = 'abca'

// 211. 添加与搜索单词

// class WordDictionary {
//     private words: { [key: number]: string[] };

//     constructor() {
//         this.words = {};
//     }

//     addWord(word: string): void {
//         if(this.words[word.length]){
//            this.words[word.length].push(word)
//         }else{
//             this.words[word.length] = [word]
//         }
//     }

//     search(word: string): boolean {
//         if(!this.words[word.length]) return false
//         if(word.includes('.')){
//             const reg = new RegExp(word)
//             // 只要数组中有一个匹配正则表达式的字符串，就返回true
//            return this.words[word.length].some((item) => {
//            return reg.test(item)
//            })
//         }else{
//             return this.words[word.length].includes(word)
//         }
//     }
// }

/**
 * WordDictionary构造函数
 * 初始化一个Map来存储不同长度的单词数组
 */
// function WordDictionary() {
//   this.words = new Map()
// }

// /**
//  * 添加单词到字典中
//  * @param {string} word - 要添加的单词
//  */
// WordDictionary.prototype.addWord = function (word) {
//   if (this.words.has(word.length)) {
//     // 修复：使用Map的get方法获取数组，然后push
//     this.words.get(word.length).push(word)
//   } else {
//     this.words.set(word.length, [word])
//   }
// }

// /**
//  * 搜索单词，支持通配符'.'
//  * @param {string} word - 要搜索的单词，'.'可以匹配任意字符
//  * @returns {boolean} 是否找到匹配的单词
//  */
// WordDictionary.prototype.search = function (word) {
//   const len = word.length
//   if (!this.words.has(len)) return false

//   const wordsArray = this.words.get(len)

//   // 修复：检查word是否包含通配符'.'
//   if (word.includes('.')) {
//     // 将'.'替换为正则表达式中的任意字符匹配符
//     const pattern = word.replace(/\./g, '.')
//     const reg = new RegExp(`^${pattern}$`)
//     return wordsArray.some((item) => {
//       return reg.test(item)
//     })
//   } else {
//     // 修复：直接在数组中查找
//     return wordsArray.includes(word)
//   }
// }

// 测试代码
// const wordDictionary = new WordDictionary();
// wordDictionary.addWord("bad");
// wordDictionary.addWord("dad");
// wordDictionary.addWord("mad");

// console.log(wordDictionary.search("pad")); // false
// console.log(wordDictionary.search("bad")); // true
// console.log(wordDictionary.search(".ad")); // true (匹配 "bad", "dad", "mad")
// console.log(wordDictionary.search("b..")); // true (匹配 "bad")

import barInstance from './bar.mjs'

console.log(barInstance.getValue()) // 获取初始值
barInstance.setValue(34) // 修改值
console.log(barInstance.getValue()) // 获取修改后的值

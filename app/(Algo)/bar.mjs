class Bar {
  constructor(initialValue = 23) {
    this._value = initialValue
  }

  getValue() {
    return this._value
  }

  setValue(newValue) {
    this._value = newValue
  }
}

// 创建单例实例
const barInstance = new Bar()
export default barInstance

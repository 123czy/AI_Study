class PriceCalculator {
  constructor() {
    this.processors = {
      pre: (price) => (price * 110) / 100,
      post: (price) => (price * 120) / 100,
      tax: (price) => (price * 130) / 100,
      sale: (price) => (price * 140) / 100,
    }
  }

  getPrice(tag, price) {
    if (!this.processors[tag]) {
      throw new Error(`Unknown price processor: ${tag}`)
    }
    return this.processors[tag](price)
  }

  addProcessor(tag, processor) {
    this.processors[tag] = processor
  }
}

// 使用示例
const calculator = new PriceCalculator()
console.log(calculator.getPrice('pre', 100))
console.log(calculator.getPrice('post', 100))
console.log(calculator.getPrice('tax', 100))
console.log(calculator.getPrice('sale', 100))

class Parent {
  name = ''
  static home = 'beijing'
  constructor(name) {
    this.name = name
  }

  say() {
    console.log(`I am ${this.name}.`)
  }

  static sayHello() {
    console.log(`Hello, I am ${this.home}.`)
  }
}

class Child extends Parent {
  age = 5
  static type = 'kid'
  constructor(name) {
    super(name)
  }

  say() {
    super.say()
    console.log(`And I am ${this.age} years old.`)
  }

  jump() {
    Parent.sayHello()
    console.log(`I like jumping.`)
  }
}

const child = new Child('John')
child.say()
child.jump()

const parent = new Parent('parent')
parent.say()

for (let i in child) {
  console.log('child', i)
}

for (let i in parent) {
  console.log('parent', i)
}

// 如何使用function实现class功能
// new 的作用
// 实例中this/super实现复用
// 对象中 static/public/#/protected

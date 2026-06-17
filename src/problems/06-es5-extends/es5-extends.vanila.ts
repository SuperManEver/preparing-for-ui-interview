// bun test src/problems/06-es5-extends/test/es5-extends.test.ts

/**
 * Simulates ES6 class inheritance using ES5 patterns.
 * Creates a new constructor that inherits from both SuperType and SubType.
 */
export const myExtends = (SuperType: Function, SubType: Function) => {
  /**
   * The new constructor function that will be returned.
   * When called with `new`, it creates an instance with both parent behaviors.
   */
  function MyType(this: any, ...args: any[]) {
    // Create a new object with SubType.prototype as its prototype
    // This sets up: instance.__proto__ === SubType.prototype
    const obj = Object.create(SubType.prototype)

    // Call SuperType constructor with the new object as `this`
    // This adds SuperType's instance properties (e.g., this.name = name)
    SuperType.apply(obj, args)

    // Call SubType constructor with the new object as `this`
    // This adds SubType's instance properties (e.g., this.subProp = 'sub')
    SubType.apply(obj, args)

    // Return the fully initialized object
    return obj
  }

  // Set up prototype inheritance:
  // SubType.prototype.__proto__ = SuperType.prototype
  // This allows instances to access methods from SuperType.prototype
  // through the prototype chain: instance -> SubType.prototype -> SuperType.prototype
  Object.setPrototypeOf(SubType.prototype, SuperType.prototype)

  // Set up static/constructor inheritance:
  // MyType.__proto__ = SuperType
  // This allows MyType to inherit static methods from SuperType
  Object.setPrototypeOf(MyType, SuperType)

  return MyType
}

// --- Examples ---
// Uncomment to test your implementation:

// function Animal(this: any, name: string) { this.name = name }
// Animal.print = () => { console.log('Animal') }
// Animal.prototype.greet = function () { return `Hello, ${this.name}` }
//
// function Dog(this: any) { this.breed = 'Labrador' }
// Dog.prototype.bark = function () { return `${this.name} says Woof!` }
//

// console.log(dog instanceof Animal) // Expected: true
// (DogExtended as any).print() // Expected: "Animal"

function Animal(this: any, name: string) {
  this.name = name
}

Animal.prototype.speak = function () {
  return `${this.name} makes a sound`
}

function Dog(this: any) {
  this.breed = 'Labrador'
}

Dog.prototype.bark = function () {
  return 'Woof!'
}

Dog.prototype.greet = function () {
  return `Hello, ${this.name}`
}

const DogExtended = myExtends(Animal, Dog)
const dog = new (DogExtended as any)('Rex')
console.log(dog.name) // Expected: "Rex"
console.log(dog.breed) // Expected: "Labrador"
console.log(dog.greet()) // Expected: "Hello, Rex"
console.log(dog.bark()) // Expected: "Rex says Woof!"
console.log(dog instanceof Animal) // Expected: true

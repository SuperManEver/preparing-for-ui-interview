// bun test src/problems/14-promise/test/promise.test.ts

type PromiseStatus = 'pending' | 'fulfilled' | 'rejected'

const PENDING: PromiseStatus = 'pending'
const FULFILLED: PromiseStatus = 'fulfilled'
const REJECTED: PromiseStatus = 'rejected'

type Executor<T> = (
  resolve: (value: T | PromiseLike<T>) => void,
  reject: (reason?: any) => void,
) => void

type OnFulfilled<T, R> = ((value: T) => R | PromiseLike<R>) | undefined | null
type OnRejected<R> = ((reason: any) => R | PromiseLike<R>) | undefined | null

interface Handler<T> {
  onFulfilled: (value: T) => any
  onRejected: (reason: any) => any
  resolve: (value: any) => void
  reject: (reason: any) => void
}

// Step 1: Define types and constants
//  - Executor
//  - OnFulfilled<T,R>
//  - OnRejected<R>
//  - Handler
//  - Update MyPromise<T> with types above
// Step 2: Define class fields
//  - handlers, status, value, isResolved
// Step 3: Implement settle, resolve, reject
// Step 4: constructor + Executor
// - Run tests for resolving / rejecting
// Step 5: Implement then<R> and catch
// Step 6: Implement handler execution
// - Run tests for then / catch and chaining
// Step 7: static resolve, static reject
// - Run tests for statics
export class MyPromise<T = any> {
  #handlers: Handler<T>[] = []
  status: PromiseStatus = PENDING
  value: T | any
  #isResolved: boolean = false

  #resolve = (v: T | PromiseLike<T>): void => void this.#settle(v, FULFILLED)
  #reject = (e: any): void => void this.#settle(e, REJECTED)

  #settle = (v: T | any, status: PromiseStatus = FULFILLED): void => {
    console.log('#settle')

    if (this.#isResolved) {
      return
    }

    this.#isResolved = true

    console.log('settle: continue to be resolved')

    const update = (v: T | any): void => {
      console.log('#settle -> status: ', status)

      this.value = v
      this.status = status
      this.#execute()

      console.log('MyPromise: ', this, v, status)
    }

    if (v instanceof MyPromise) {
      v.then(update)
    } else {
      update(v)
    }
  }

  #execute = (): void => {
    console.log('#execute')
  }

  constructor(executor: Executor<T>) {
    console.log('constructor!')

    this.status = PENDING
    this.#isResolved = false
    try {
      executor(this.#resolve, this.#reject)
    } catch (e) {
      this.#reject(e)
    }
  }

  then<R = T>(
    onFulfilled?: OnFulfilled<T, R>,
    onRejected?: OnRejected<R>,
  ): MyPromise<R> {
    throw new Error('Not implemented')
  }

  catch() {
    throw new Error('Not implemented')
  }

  static resolve() {
    throw new Error('Not implemented')
  }

  static reject() {
    throw new Error('Not implemented')
  }
}

// --- Examples ---
// Uncomment to test your implementation:

// --- Step 4: constructor + Executor ---
// const p1 = new MyPromise((resolve: any) => resolve(42))
// console.log(p1) // Expected: MyPromise { status: 'fulfilled', value: 42 }
//
const p2 = new MyPromise((_: any, reject: any) => reject('error'))
console.log(p2) // Expected: MyPromise { status: 'rejected', value: 'error' }
//
// const p3 = new MyPromise(() => { throw new Error('oops') })
// console.log(p3) // Expected: MyPromise { status: 'rejected', value: Error: oops }
//
// const p4 = new MyPromise((resolve: any) => { resolve(1); resolve(2) })
// console.log(p4) // Expected: MyPromise { status: 'fulfilled', value: 1 } (settled once)

// --- Step 6: then / catch and chaining ---
// const p5 = new MyPromise((resolve: any) => resolve(42))
// p5.then((v: any) => console.log(v))  // Expected: 42
//
// const p6 = new MyPromise((resolve: any) => resolve(1))
//   .then((v: any) => v + 1)
//   .then((v: any) => console.log(v))   // Expected: 2
//
// const p7 = new MyPromise((_: any, reject: any) => reject('error'))
// p7.catch((e: any) => console.log(e))  // Expected: "error"
//
// new MyPromise((_: any, reject: any) => reject('error'))
//   .catch(() => 'recovered')
//   .then((v: any) => console.log(v))   // Expected: "recovered"
//
// new MyPromise((resolve: any) => resolve(1))
//   .then(() => { throw new Error('handler error') })
//   .catch((e: any) => console.log(e.message))  // Expected: "handler error"

// --- Step 7: static resolve, static reject ---
// MyPromise.resolve(99).then((v: any) => console.log(v))   // Expected: 99
// MyPromise.reject('no').catch((e: any) => console.log(e))  // Expected: "no"

// bun test src/problems/02-debounce/test/debounce.test.ts

// export function debounce(fn: any, delay: number) {
//   let timer: any = null

//   return (arg: any) => {
//     if (timer) {
//       clearTimeout(timer)

//       timer = setTimeout(() => fn(arg), delay)

//       return
//     }

//     timer = setTimeout(() => fn(arg), delay)
//   }
// }

export function debounce<F extends (...args: any[]) => void>(
  callback: F,
  delay: number,
): (...args: Parameters<F>) => void {
  let timerID: ReturnType<typeof setTimeout> | null = null

  return function debounced(this: unknown, ...args: Parameters<F>) {
    if (timerID) {
      clearTimeout(timerID)
    }

    timerID = setTimeout(() => {
      callback.apply(this, args)
    }, delay)
  }
}

// --- Examples ---
// Uncomment to test your implementation:

const log = debounce((msg: string) => console.log(msg), 300)
log('a') // cancelled by next call
log('b') // cancelled by next call
log('c') // only this one fires after 300ms → "c"

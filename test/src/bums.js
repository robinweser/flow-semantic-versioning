/* @flow */
export default function bums(num: number, foo): Object {
  return {
    color: 'red',
    bar(a: string, b: number): boolean {
      return b > 0
    },
    baz(): Object {
      return {
        size: 1,
        bar: ['1', '2', '4'],
        balo(c: string): number {
          return 5
        }
      }
    },
    foo: true
  }
}

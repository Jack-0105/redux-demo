type Func<T> = (...args: any[]) => T;
export default function compose<T>(...funcs: Func<T>[]): Func<T> {
  if (funcs.length === 0) {
    return (arg: T) => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args: any) => a(b(...args)))
}

type Constructor<T> = new (...args: any[]) => T

type Nullable<T> = T | undefined

type RecursiveMap = Map<string, RecursiveMap | string | bigint | number | boolean>
type RecursiveMapValue = RecursiveMap | string | bigint | number | boolean

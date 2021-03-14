type Constructor<T> = new (...args: any[]) => T

type Nullable<T> = T | undefined

type RecursiveMap = Map<string, RecursiveMapValue>
type RecursiveMapValue = RecursiveMap | Uint8Array | string | bigint | number | boolean

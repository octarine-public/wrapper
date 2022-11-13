type Constructor<T> = new (...args: any[]) => T

type Nullable<T> = T | undefined

type RecursiveMap = Map<string, RecursiveMapValue>
type RecursiveMapValue = RecursiveMap | RecursiveMapValue[] | Uint8Array | string | bigint | number | boolean

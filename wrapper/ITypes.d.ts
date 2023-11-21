type Constructor<T> = new (...args: any[]) => T

type Nullable<T> = T | undefined

type RecursiveMap = Map<string, RecursiveMapValue>
type RecursiveMapValue =
	| RecursiveMap
	| RecursiveMapValue[]
	| Uint8Array
	| string
	| bigint
	| number
	| boolean

// TODO: maybe after some time when it will be add support chuncks
// declare interface Array<T> {
// 	orderBy(cb: (obj: T) => number | boolean): T[]
// 	qorderBy(cb: (obj: T) => number | boolean): T[]
// 	/**
// 	 * @description Removes the first occurrence of a specified element from the array.
// 	 *  Returns true if the element was successfully removed,
// 	 * false if the element was not found in the array.
// 	 * @param {T} value - The element to remove from the array.
// 	 * @param {boolean} useDelete - Optional. If set to `true`, the element will be removed using the `delete` operator instead of the `splice` method. Default is false.
// 	 * @return {boolean}
// 	 */
// 	remove(value: T, useDelete?: boolean): boolean
// 	/**
// 	 * @description Removes elements from the array that satisfy the provided callback function.
// 	 * Returns true if the element was successfully removed,
// 	 * false if the element was not found in the array.
// 	 * @param {function} cb - The callback function used to test each element. It should return `true` if the element should be removed, otherwise `false`.
// 	 * @param {boolean} useDelete - Optional. If set to `true`, the element will be removed using the `delete` operator instead of the `splice` method. Default is false.
// 	 * @return {boolean}
// 	 */
// 	removeCallback(
// 		cb: (value: T, index: number, obj: T[]) => boolean,
// 		useDelete?: boolean
// 	): boolean
// }

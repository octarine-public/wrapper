type Nullable<T> = T | undefined
type Constructor<T> = new (...args: any[]) => T
type RecursiveMap = Map<string, RecursiveMapValue>
type RecursiveMapValue =
	| RecursiveMap
	| RecursiveMapValue[]
	| Uint8Array
	| string
	| bigint
	| number
	| boolean

// github.com/octarine-public/wrapper/prototypes

declare interface BigInt {
	hasBit(bit: bigint): boolean
	hasMask(mask: bigint): boolean
	toMask: number[]
	toInt16: bigint
}

// eslint-disable-next-line id-denylist
declare interface Number {
	hasBit(bit: number): boolean
	hasMask(mask: number): boolean
	/** popcnt */
	bitCount(): number
	// default by 3
	toNumberFixed(fractionDigits?: number): number
	toMask: number[]
	toInt16: number
}

declare interface Array<T> {
	/**
	 * @requires
	 * `import "github.com/octarine-public/wrapper/global"` or
	 * `import { ... } from "github.com/octarine-public/wrapper/index"`
	 * @description This method mutates the array and returns a reference to the same array.
	 */
	orderBy(
		callback: (obj: T) => number | boolean,
		thenBy?: (obj: T) => number | boolean
	): T[]
	/**
	 * @requires
	 * `import "github.com/octarine-public/wrapper/global"` or
	 * `import { ... } from "github.com/octarine-public/wrapper/index"`
	 * @description This method returns a copy of an array.
	 */
	toOrderBy(
		callback: (obj: T) => number | boolean,
		thenBy?: (obj: T) => number | boolean
	): T[]
	/**
	 * @requires
	 * `import "github.com/octarine-public/wrapper/global"` or
	 * `import { ... } from "github.com/octarine-public/wrapper/index"`
	 * @description This method mutates the array and returns a reference to the same array.
	 */
	orderByDescending(
		callback: (obj: T) => number | boolean,
		thenBy?: (obj: T) => number | boolean
	): T[]
	/**
	 * @requires
	 * `import "github.com/octarine-public/wrapper/global"` or
	 * `import { ... } from "github.com/octarine-public/wrapper/index"`
	 * @description This method returns a copy of an array.
	 */
	toOrderByDescending(
		callback: (obj: T) => number | boolean,
		thenBy?: (obj: T) => number | boolean
	): T[]
	/**
	 * @requires
	 * `import "github.com/octarine-public/wrapper/global"` or
	 * `import { ... } from "github.com/octarine-public/wrapper/index"`
	 * @description This method mutates the array and returns a reference to the same array. Similar to ar.orderBy(cb)[0]
	 */
	orderByFirst(callback: (obj: T) => number): Nullable<T>
	/**
	 * @requires
	 * `import "github.com/octarine-public/wrapper/global"` or
	 * `import { ... } from "github.com/octarine-public/wrapper/index"`
	 * @description Removes the first occurrence of a specified element from the array.
	 *  Returns true if the element was successfully removed,
	 * false if the element was not found in the array.
	 */
	remove(value: T, useDelete?: boolean): boolean
	/**
	 * @requires
	 * `import "github.com/octarine-public/wrapper/global"` or
	 * `import { ... } from "github.com/octarine-public/wrapper/index"`
	 * @description Removes elements from the array that satisfy the provided callback function.
	 * Returns true if the element was successfully removed,
	 * false if the element was not found in the array.
	 */
	removeCallback(
		callback: (value: T, index: number, obj: T[]) => boolean,
		useDelete?: boolean
	): boolean
	/**
	 * @requires
	 * `import "github.com/octarine-public/wrapper/global"` or
	 * `import { ... } from "github.com/octarine-public/wrapper/index"`
	 * @description Returns the number of elements in the array.
	 */
	count(element: T): number
	/**
	 * @requires
	 * `import "github.com/octarine-public/wrapper/global"` or
	 * `import { ... } from "github.com/octarine-public/wrapper/index"`
	 * @description Compares two arrays
	 * @param {T[]} array - The array to compare.
	 */
	compare(array: T[]): boolean
	/**
	 * @requires
	 * `import "github.com/octarine-public/wrapper/global"` or
	 * `import { ... } from "github.com/octarine-public/wrapper/index"`
	 * @description Compares two arrays
	 * @param {T[]} array - The array to compare.
	 * @param {boolean} unique - Used Set([1, 1, 2]) remove duplicates
	 */
	compare(array: T[], unique: boolean): boolean
	/**
	 * @requires
	 * `import "github.com/octarine-public/wrapper/global"` or
	 * `import { ... } from "github.com/octarine-public/wrapper/index"`
	 * @description Checks if two arrays have any common elements
	 */
	contains(array: T[]): boolean
	/**
	 * @requires
	 * `import "github.com/octarine-public/wrapper/global"` or
	 * `import { ... } from "github.com/octarine-public/wrapper/index"`
	 * @description Filters the array to exclude elements that are present in the input array.
	 * @param {T[]} array - The array to exclude elements from.
	 * @return {T[]} The filtered array.
	 */
	except(array: T[]): T[]
	/**
	 * @requires
	 * `import "github.com/octarine-public/wrapper/global"` or
	 * `import { ... } from "github.com/octarine-public/wrapper/index"`
	 * @description returns the elements that are present in both arrays
	 */
	intersect(array: T[]): T[]
	hasIntersect(array: T[]): boolean
	/**
	 * @requires
	 * `import "github.com/octarine-public/wrapper/global"` or
	 * `import { ... } from "github.com/octarine-public/wrapper/index"`
	 * @description Removes all elements from the array.
	 */
	clear(): void
}

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
	/**
	 * @requires
	 * `import "github.com/octarine-public/wrapper/global"` or
	 * `import { ... } from "github.com/octarine-public/wrapper/index"`
	 */
	hasBit(bit: bigint): boolean
	/**
	 * @requires
	 * `import "github.com/octarine-public/wrapper/global"` or
	 * `import { ... } from "github.com/octarine-public/wrapper/index"`
	 */
	hasMask(mask: bigint): boolean
	/**
	 * @requires
	 * `import "github.com/octarine-public/wrapper/global"` or
	 * `import { ... } from "github.com/octarine-public/wrapper/index"`
	 */
	toMask: number[]
	/**
	 * @requires
	 * `import "github.com/octarine-public/wrapper/global"` or
	 * `import { ... } from "github.com/octarine-public/wrapper/index"`
	 */
	toInt16: bigint
}

// eslint-disable-next-line id-denylist
declare interface Number {
	/**
	 * @requires
	 * `import "github.com/octarine-public/wrapper/global"` or
	 * `import { ... } from "github.com/octarine-public/wrapper/index"`
	 */
	hasBit(bit: number): boolean
	/**
	 * @requires
	 * `import "github.com/octarine-public/wrapper/global"` or
	 * `import { ... } from "github.com/octarine-public/wrapper/index"`
	 */
	hasMask(mask: number): boolean
	/**
	 * @requires
	 * `import "github.com/octarine-public/wrapper/global"` or
	 * `import { ... } from "github.com/octarine-public/wrapper/index"`
	 */
	/** popcnt */
	bitCount(): number
	/**
	 * @requires
	 * `import "github.com/octarine-public/wrapper/global"` or
	 * `import { ... } from "github.com/octarine-public/wrapper/index"`
	 * @param {number} [fractionDigits=3]
	 *
	 * @returns {number}
	 */
	toNumberFixed(fractionDigits?: number): number
	/**
	 * @requires
	 * `import "github.com/octarine-public/wrapper/global"` or
	 * `import { ... } from "github.com/octarine-public/wrapper/index"`
	 */
	toMask: number[]
	/**
	 * @requires
	 * `import "github.com/octarine-public/wrapper/global"` or
	 * `import { ... } from "github.com/octarine-public/wrapper/index"`
	 */
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

declare interface Math {
	/**
	 * @requires
	 * `import "github.com/octarine-public/wrapper/global"` or
	 * `import { ... } from "github.com/octarine-public/wrapper/index"`
	 * @description Converts degrees to radians.
	 *
	 * @param radian - The angle in radians.
	 *
	 * @return {number}
	 */
	radianToDegrees(radian: number): number
	/**
	 * @requires
	 * `import "github.com/octarine-public/wrapper/global"` or
	 * `import { ... } from "github.com/octarine-public/wrapper/index"`
	 * @description Converts radians to degrees.
	 *
	 * @param degrees - The angle in degrees.
	 *
	 * @return {number}
	 */
	degreesToRadian(degrees: number): number
	/**
	 * @requires
	 * `import "github.com/octarine-public/wrapper/global"` or
	 * `import { ... } from "github.com/octarine-public/wrapper/index"`
	 * @description Linearly interpolates between two numbers.
	 *
	 * @param start - The starting number.
	 * @param end - The ending number.
	 * @param amount - The amount to interpolate between the start and end numbers.
	 *                 Should be a value between 0 and 1.
	 *
	 * @return {number}
	 */
	lerp(start: number, end: number, amount: number): number
	/**
	 * @requires
	 * `import "github.com/octarine-public/wrapper/global"` or
	 * `import { ... } from "github.com/octarine-public/wrapper/index"`
	 * @description SmoothStep function returns a smooth interpolation value between 0 and 1 based on the input amount.
	 * If the amount is less than or equal to 0, it returns 0.
	 * If the amount is greater than or equal to 1, it returns 1.
	 * For any other value of amount, it performs a smooth interpolation calculation and returns the result.
	 * @param amount - The input amount to interpolate.
	 *
	 * @return {number}
	 */
	smoothStep(amount: number): number
	/**
	 * @requires
	 * `import "github.com/octarine-public/wrapper/global"` or
	 * `import { ... } from "github.com/octarine-public/wrapper/index"`
	 * @description Clamps a value between a minimum and maximum value.
	 *
	 * @param {number} value - the value to clamp
	 * @param {number} min - the minimum value
	 * @param {number} max - the maximum value
	 *
	 * @return {number} the clamped value
	 */
	clamp(value: number, min: number, max: number): number
	/**
	 * @requires
	 * `import "github.com/octarine-public/wrapper/global"` or
	 * `import { ... } from "github.com/octarine-public/wrapper/index"`
	 * @description Returns a random number between min and max
	 *
	 * @param min - the minimum value
	 * @param max - the maximum value
	 * @return {number}
	 */
	randomRange(min: number, max: number): number
}

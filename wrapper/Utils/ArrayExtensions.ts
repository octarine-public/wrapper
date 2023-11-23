import { qsort } from "./Utils"

/**
 * @returns equal arrays?
 */
export function CompareArrays<T>(a: T[], b: T[]): boolean {
	if (a.length !== b.length) {
		return false
	}

	return !a.some(val1 => b.some(val2 => val1 !== val2))
}

/**
 * @deprecated - use your own arr.intersect(arr2)
 * @returns intersect values in Arrays
 */
export function IntersectArrays<T>(a: T[], b: T[]): T[] {
	return a.filter(val1 => b.some(val2 => val1 === val2))
}

/**
 * @deprecated - use your own arr.hasIntersect(arr2)
 */
export function HasIntersectArrays<T>(a: T[], b: T[]): boolean {
	return a.some(val1 => b.some(val2 => val1 === val2))
}

export function CountInArray<T>(array: T[], el: T): number {
	return array.reduce((prev, val) => {
		if (val === el) {
			prev++
		}
		return prev
	}, 0)
}

/**
 * @param deleteEl uses operator 'delete' instead of 'splice'
 * @deprecated - use your own arr.remove(el, deleteEl)
 */
export function arrayRemove<T>(ar: T[], el: T, deleteEl: boolean = false): boolean {
	const id = ar.indexOf(el)
	if (id === -1) {
		return false
	}
	if (deleteEl) {
		delete ar[id]
	} else {
		ar.splice(id, 1)
	}
	return true
}

/**
 * @param deleteEl uses operator 'delete' instead of 'splice'
 * @deprecated - use your own arr.removeCallback(callback, deleteEl)
 */
export function arrayRemoveCallback<T>(
	ar: T[],
	cb: (value: T, index: number, obj: T[]) => boolean,
	deleteEl = false
): boolean {
	const id = ar.findIndex(cb)
	if (id === -1) {
		return false
	}

	if (deleteEl) {
		delete ar[id]
	} else {
		ar.splice(id, 1)
	}

	return true
}

/**
 * Similar to orderBy(ar, cb)[0]
 * @deprecated - use your own arr.orderByFirst(callback)
 */
export function orderByFirst<T>(ar: T[], cb: (obj: T) => number): Nullable<T> {
	let lowestScore = Infinity,
		lowestScored: Nullable<T>
	for (const el of ar) {
		const score = cb(el)
		if (score < lowestScore) {
			lowestScore = score
			lowestScored = el
		}
	}
	return lowestScored
}

/**
 * @deprecated - use your own arr.orderBy(callback)
 */
export function orderBy<T>(ar: T[], cb: (obj: T) => number | boolean): T[] {
	return ar.sort((a, b) => (cb(a) as number) - (cb(b) as number))
}

/**
 * @deprecated - this slow use ar.orderBy(callback)
 */
export function qorderBy<T>(ar: T[], cb: (obj: T) => number | boolean): T[] {
	return qsort(ar, (a, b) => (cb(a) as number) - (cb(b) as number))
}

/**
 * @deprecated - use your own arr.orderByDescending(callback)
 */
export function orderByRevert<T>(ar: T[], cb: (obj: T) => number | boolean): T[] {
	return ar.sort((a, b) => (cb(b) as number) - (cb(a) as number))
}

/**
 * @deprecated - this slow use ar.orderByDescending(callback)
 */
export function qorderByRevert<T>(ar: T[], cb: (obj: T) => number | boolean): T[] {
	return qsort(ar, (a, b) => (cb(b) as number) - (cb(a) as number))
}

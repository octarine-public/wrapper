/**
 * @returns equal arrays?
 */
export function CompareArrays<T>(a: T[], b: T[]): boolean {
	if (a.length !== b.length)
		return false

	return !a.some(val1 => b.some(val2 => val1 !== val2))
}

/**
 * @returns intersect values in Arrays
 */
export function IntersectArrays<T>(a: T[], b: T[]): T[] {

	let newArr: T[] = []

	a.forEach(val1 => b.forEach(val2 => val1 === val2 && newArr.push(val1)))

	return newArr
}

export function HasIntersectArrays<T>(a: T[], b: T[]): boolean {
	return a.some(val1 => b.some(val2 => val1 === val2))
}

export function CountInArray<T>(array: T[], el: T): number {
	let count = 0
	array.forEach(val => val === el && count++)
	return count
}

export function Swap<T>(array: T[], indexA: number, indexB: number): T[] {
	const bEl = array[indexA]
	array[indexA] = array[indexB]
	array[indexB] = bEl
	return array
}

/**
 *
 * @param deleteEl uses operator 'delete' instead of 'splice'
 */
export function arrayRemove<T>(ar: T[], el: T, deleteEl: boolean = false): boolean {
	const id = ar.indexOf(el)
	if (id !== -1)
		deleteEl ? delete ar[id] : ar.splice(id, 1)
	return id !== -1
}

/**
 *
 * @param deleteEl uses operator 'delete' instead of 'splice'
 */
export function arrayRemoveCallBack<T>(ar: T[], cb: (value: T, index: number, obj: T[]) => boolean, deleteEl: boolean = false): boolean {
	const id = ar.findIndex(cb)
	if (id !== -1)
		deleteEl ? delete ar[id] : ar.splice(id, 1)

	return id !== -1
}

export function orderBy<T>(ar: T[], cb: (obj: T) => number | boolean): T[] {
	return ar.sort((a, b) => (cb(a) as number) - (cb(b) as number))
}
export function Sorter<T>(array: T[], index: string, invert: boolean): T[] {
	return array.sort(function (a, b) {
		return invert
			? a[index] < b[index]
				? 1 : a[index] > b[index]
					? -1 : 0
			: a[index] > b[index]
				? 1 : a[index] < b[index]
					? -1 : 0;
	});
}

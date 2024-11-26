Array.prototype.orderBy = function <T>(
	callback: (obj: T) => number | boolean,
	thenBy?: (obj: T) => number | boolean
): T[] {
	if (this.length <= 1) {
		return this
	}
	return this.sort((a: T, b: T) => {
		const resultA = callback(a)
		const resultB = callback(b)
		if (resultA !== resultB) {
			return resultA > resultB ? 1 : -1
		}
		if (thenBy !== undefined) {
			const thenByResultA = thenBy(a)
			const thenByResultB = thenBy(b)
			return thenByResultA > thenByResultB
				? 1
				: thenByResultA < thenByResultB
					? -1
					: 0
		}
		return 0
	})
}

Array.prototype.toOrderBy = function <T>(
	callback: (obj: T) => number | boolean,
	thenBy?: (obj: T) => number | boolean
): T[] {
	if (this.length <= 1) {
		return this
	}
	return this.toSorted((a: T, b: T) => {
		const resultA = callback(a)
		const resultB = callback(b)
		if (resultA !== resultB) {
			return resultA > resultB ? 1 : -1
		}
		if (thenBy !== undefined) {
			const thenByResultA = thenBy(a)
			const thenByResultB = thenBy(b)
			return thenByResultA > thenByResultB
				? 1
				: thenByResultA < thenByResultB
					? -1
					: 0
		}
		return 0
	})
}

Array.prototype.orderByDescending = function <T>(
	callback: (obj: T, thenBy?: T) => number | boolean,
	thenBy?: (obj: T) => number | boolean
): T[] {
	if (this.length <= 1) {
		return this
	}
	return this.sort((a, b) => {
		const resultA = callback(a)
		const resultB = callback(b)
		if (resultA !== resultB) {
			return resultA > resultB ? -1 : 1
		}
		if (thenBy !== undefined) {
			const thenByResultA = thenBy(a)
			const thenByResultB = thenBy(b)
			return thenByResultA > thenByResultB
				? 1
				: thenByResultA < thenByResultB
					? -1
					: 0
		}
		return 0
	})
}

Array.prototype.toOrderByDescending = function <T>(
	callback: (obj: T, thenBy?: T) => number | boolean,
	thenBy?: (obj: T) => number | boolean
): T[] {
	if (this.length <= 1) {
		return this
	}
	return this.toSorted((a, b) => {
		const resultA = callback(a)
		const resultB = callback(b)
		if (resultA !== resultB) {
			return resultA > resultB ? -1 : 1
		}
		if (thenBy !== undefined) {
			const thenByResultA = thenBy(a)
			const thenByResultB = thenBy(b)
			return thenByResultA > thenByResultB
				? 1
				: thenByResultA < thenByResultB
					? -1
					: 0
		}
		return 0
	})
}

Array.prototype.orderByFirst = function <T>(callback: (obj: T) => number): Nullable<T> {
	if (this.length === 0) {
		return undefined
	}
	let lowestScore = Infinity
	let lowestScored: Nullable<T>
	for (let index = 0; index < this.length; index++) {
		const element = this[index]
		const score = callback(element)
		if (score < lowestScore) {
			lowestScore = score
			lowestScored = element
		}
	}
	return lowestScored
}

Array.prototype.compare = function <T>(array: T[], unique = false): boolean {
	if (this.length !== array.length) {
		return false
	}
	if (unique) {
		const set1 = new Set(this)
		const set2 = new Set(array)
		if (set1.size !== set2.size) {
			return false
		}
		for (const elem of set1) {
			if (!set2.has(elem)) {
				return false
			}
		}
		return true
	}

	const map1 = new Map<T, number>(),
		map2 = new Map<T, number>()
	for (let i = 0; i < this.length; i++) {
		const elem = this[i]
		map1.set(elem, (map1.get(elem) ?? 0) + 1)
	}
	for (let i = 0; i < array.length; i++) {
		const elem = array[i]
		map2.set(elem, (map2.get(elem) ?? 0) + 1)
	}
	if (map1.size !== map2.size) {
		return false
	}
	for (const [key, value] of map1) {
		if (map2.get(key) !== value) {
			return false
		}
	}
	return true
}

Array.prototype.intersect = function <T>(array: T[]): T[] {
	const arraySet = new Set<T>(array)
	return this.reduce<T[]>((result, element) => {
		if (arraySet.has(element)) {
			result.push(element)
		}
		return result
	}, [])
}

Array.prototype.except = function <T>(array: T[]): T[] {
	const arraySet = new Set<T>(array)
	return this.reduce<T[]>((result, element) => {
		if (!arraySet.has(element)) {
			result.push(element)
		}
		return result
	}, [])
}

// todo: need test & fix performance
// recommend use arr.contains(array)
Array.prototype.hasIntersect = function <T>(array: T[]): boolean {
	if (array.length === 0) {
		return false
	}
	return this.some(a => array.some(b => a === b))
}

Array.prototype.contains = function <T>(array: T[]): boolean {
	if (array.length === 0) {
		return false
	}
	return this.find(a => array.includes(a)) !== undefined
}

Array.prototype.count = function <T>(element: T): number {
	if (this.length === 0) {
		return 0
	}
	return this.reduce((prev, val) => {
		if (val === element) {
			prev++
		}
		return prev
	}, 0)
}

Array.prototype.remove = function <T>(value: T, useDelete?: boolean): boolean {
	if (this.length === 0) {
		return false
	}
	const index = this.indexOf(value)
	if (index === -1) {
		return false
	}
	if (useDelete) {
		delete this[index]
	} else {
		this.splice(index, 1)
	}
	return true
}

Array.prototype.removeCallback = function <T>(
	callback: (value: T, index: number, obj: T[]) => boolean,
	useDelete?: boolean
): boolean {
	if (this.length === 0) {
		return false
	}
	const index = this.findIndex(callback)
	if (index === -1) {
		return false
	}
	if (useDelete) {
		delete this[index]
	} else {
		this.splice(index, 1)
	}
	return true
}

Array.prototype.clear = function (): void {
	if (this.length !== 0) {
		// length = 0 (GC = immediately)
		// this.arr = [] (GC = deferred)
		// this.splice(0, this.length) (GC = deferred?)
		this.length = 0
	}
}

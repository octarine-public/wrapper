Array.prototype.orderBy = function <T>(
	callback: (obj: T) => number | boolean,
	thenBy?: (obj: T) => number | boolean
): T[] {
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

Array.prototype.orderByDescending = function <T>(
	callback: (obj: T, thenBy?: T) => number | boolean,
	thenBy?: (obj: T) => number | boolean
): T[] {
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

Array.prototype.compare = function <T>(array: T[]): boolean {
	if (this.length !== array.length) {
		return false
	}
	return this.every((a, i) => a === array[i])
}

Array.prototype.intersect = function <T>(array: T[]): T[] {
	if (array.length === 0) {
		return this
	}
	return this.filter(a => array.includes(a))
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
	return this.reduce((prev, val) => {
		if (val === element) {
			prev++
		}
		return prev
	}, 0)
}

Array.prototype.remove = function <T>(value: T, useDelete?: boolean): boolean {
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
	this.splice(0)
}

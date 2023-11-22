Array.prototype.clear = function (): void {
	this.splice(0)
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
	cb: (value: T, index: number, obj: T[]) => boolean,
	useDelete?: boolean
): boolean {
	const index = this.findIndex(cb)
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

Array.prototype.orderBy = function <T>(cb: (obj: T) => number | boolean): T[] {
	return this.sort((a, b) => {
		const cbA = cb(a)
		const cbB = cb(b)
		return typeof cbA === "number" && typeof cbB === "number"
			? cbB - cbA
			: cbA
			? -1
			: 1
	})
}

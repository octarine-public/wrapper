// TODO: maybe after some time when it will be add support chuncks
// Array.prototype.remove = function <T>(value: T, useDelete?: boolean): boolean {
// 	const id = this.indexOf(value)
// 	if (id === -1) {
// 		return false
// 	}
// 	if (useDelete) {
// 		delete this[id]
// 	} else {
// 		this.splice(id, 1)
// 	}
// 	return true
// }

// Array.prototype.removeCallback = function <T>(
// 	cb: (value: T, index: number, obj: T[]) => boolean,
// 	useDelete?: boolean
// ): boolean {
// 	const id = this.findIndex(cb)
// 	if (id === -1) {
// 		return false
// 	}
// 	if (useDelete) {
// 		delete this[id]
// 	} else {
// 		this.splice(id, 1)
// 	}
// 	return true
// }

// Array.prototype.orderBy = function <T>(cb: (obj: T) => number | boolean): T[] {
// 	return this.sort((a, b) => {
// 		const cbA = cb(a)
// 		const cbB = cb(b)
// 		switch (true) {
// 			case typeof cbA === "number" && typeof cbB === "number":
// 				return cbB - cbA
// 			default:
// 				return cbA ? -1 : 1
// 		}
// 	})
// }

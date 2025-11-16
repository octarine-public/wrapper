BigInt.prototype.hasBit = function (bit: bigint): boolean {
	return (((this as bigint) >> bit) & 1n) === 1n
}

BigInt.prototype.hasMask = function (mask: bigint): boolean {
	return ((this as bigint) & mask) === mask
}

Object.defineProperty(BigInt.prototype, "toInt16", {
	get() {
		let num = this as bigint
		if (num.hasBit(15n)) {
			num &= ~(1n << 15n)
			num = (0xffffn >> 1n) - num + 1n
			num *= -1n
		}
		return num
	}
})

Object.defineProperty(BigInt.prototype, "toMask", {
	get() {
		let i = 0
		let v = this as bigint
		const res: number[] = []
		while (v !== 0n) {
			if (v & 1n) {
				res.push(i)
			}
			v >>= 1n
			i++
		}
		return res
	}
})

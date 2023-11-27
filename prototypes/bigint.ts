const masksBigInt: bigint[] = []
for (let i = 0; i < 64; i++) {
	masksBigInt.push(1n << BigInt(i))
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
		const res: number[] = []
		const num = this as bigint
		for (let i = 0; i < 64; i++) {
			if ((num & masksBigInt[i]) !== 0n) {
				res.push(i)
			}
		}
	}
})

BigInt.prototype.hasBit = function (bit: bigint): boolean {
	return (((this as bigint) >> bit) & 1n) === 1n
}

BigInt.prototype.hasMask = function (mask: bigint): boolean {
	return ((this as bigint) & mask) === mask
}

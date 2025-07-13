const masksBigInt: bigint[] = []
for (let i = 0; i < 64; i++) {
	masksBigInt.push(1n << BigInt(i))
}

BigInt.prototype.hasBit = function (bit: bigint): boolean {
	return ((this.valueOf() >> bit) & 1n) === 1n
}

BigInt.prototype.hasMask = function (mask: bigint): boolean {
	return (this.valueOf() & mask) === mask
}

Object.defineProperty(BigInt.prototype, "toInt16", {
	get() {
		let num = this.valueOf()
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
		for (let i = 0; i < 64; i++) {
			if ((this.valueOf() & masksBigInt[i]) !== 0n) {
				res.push(i)
			}
		}
		return res
	}
})

Number.prototype.hasBit = function (bit: number): boolean {
	const v = (this as number) | 0 // force 32-bit integer
	return ((v >> bit) & 1) === 1
}

Number.prototype.hasMask = function (mask: number): boolean {
	const v = (this as number) | 0 // force 32-bit integer
	return (v & mask) === mask
}

Number.prototype.bitCount = function (): number {
	let n = this.valueOf()
	n = n - ((n >> 1) & 0x55555555)
	n = (n & 0x33333333) + ((n >> 2) & 0x33333333)
	return (((n + (n >> 4)) & 0xf0f0f0f) * 0x1010101) >> 24
}

Object.defineProperty(Number.prototype, "toInt16", {
	get() {
		let num = this as number
		if (num.hasBit(15)) {
			num &= ~(1 << 15)
			num = (0xffff >> 1) - num + 1
			num *= -1
		}
		return num
	}
})

Object.defineProperty(Number.prototype, "toMask", {
	get() {
		let v = this | 0 // force 32-bit integer
		let i = 0
		const res: number[] = []
		while (v !== 0) {
			if (v & 1) {
				res.push(i)
			}
			v >>>= 1
			i++
		}
		return res
	}
})

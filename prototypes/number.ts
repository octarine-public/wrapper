const masksNumber: number[] = []
for (let i = 0; i < 32; i++) {
	masksNumber.push(1 << i)
}

Number.prototype.hasBit = function (bit: number): boolean {
	return ((this.valueOf() >> bit) & 1) === 1
}

Number.prototype.hasMask = function (mask: number): boolean {
	return (this.valueOf() & mask) === mask
}

Number.prototype.bitCount = function (): number {
	let n = this.valueOf()
	n = n - ((n >> 1) & 0x55555555)
	n = (n & 0x33333333) + ((n >> 2) & 0x33333333)
	return (((n + (n >> 4)) & 0xf0f0f0f) * 0x1010101) >> 24
}

Object.defineProperty(Number.prototype, "toInt16", {
	get() {
		let num = this.valueOf()
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
		const res: number[] = []
		for (let i = 0; i < 32; i++) {
			if ((this.valueOf() & masksNumber[i]) !== 0) {
				res.push(i)
			}
		}
		return res
	}
})

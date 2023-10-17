const masksBigInt: bigint[] = [],
	masksNumber: number[] = []

for (let i = 0; i < 64; i++) {
	masksBigInt.push(1n << BigInt(i))
}

for (let i = 0; i < 32; i++) {
	masksNumber.push(1 << i)
}

export function MaskToArrayBigInt(num: bigint): number[] {
	const res: number[] = []
	for (let i = 0; i < 64; i++) {
		if ((num & masksBigInt[i]) !== 0n) {
			res.push(i)
		}
	}
	return res
}
export function MaskToArrayNumber(num: number): number[] {
	const res: number[] = []
	for (let i = 0; i < 32; i++) {
		if ((num & masksNumber[i]) !== 0) {
			res.push(i)
		}
	}
	return res
}
export function HasBit(num: number, bit: number): boolean {
	return ((num >> bit) & 1) === 1
}
export function HasBitBigInt(num: bigint, bit: bigint): boolean {
	return ((num >> bit) & 1n) === 1n
}
export function HasMask(num: number, mask: number): boolean {
	return (num & mask) === mask
}
export function HasMaskBigInt(num: bigint, mask: bigint): boolean {
	return (num & mask) === mask
}

export function FixInt16(num: number) {
	if (HasBit(num, 15)) {
		num &= ~(1 << 15)
		num = (0xffff >> 1) - num + 1
		num *= -1
	}
	return num
}
export function FixInt16BigInt(num: bigint) {
	if (HasBitBigInt(num, 15n)) {
		num &= ~(1n << 15n)
		num = (0xffffn >> 1n) - num + 1n
		num *= -1n
	}
	return num
}

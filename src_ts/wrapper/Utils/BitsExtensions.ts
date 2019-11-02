let masksBigInt: Array<bigint> = new Array(64),
	masksNumber: number[] = new Array(64)

for (let i = 64; i--;)
	masksBigInt[i] = 1n << BigInt(i)

for (let i = 64; i--;)
	masksNumber[i] = 1 << i

export function MaskToArrayBigInt(num: bigint): number[] {
	return masksBigInt.map(mask => Number(num & mask)).filter(masked => masked !== 0)
}
export function MaskToArrayNumber(num: number): number[] {
	return masksNumber.map(mask => num & mask).filter(masked => masked !== 0)
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
		num &= ~(1 << 15);
		num = (0xFFFF >> 1) - num + 1;
		num *= -1;
	}
	return num;
}
export function FixInt16BigInt(num: bigint) {
	if (HasBitBigInt(num, 15n)) {
		num &= ~(1n << 15n);
		num = (0xFFFFn >> 1n) - num + 1n;
		num *= -1n;
	}
	return num;
}
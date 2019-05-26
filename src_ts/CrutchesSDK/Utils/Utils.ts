let masksBigInt: bigint[] = new Array(64),
	masksNumber: number[] = new Array(64)

for (let i = 64; i--;)
	masksBigInt[i] = 1n << BigInt(i);
	
for (let i = 64; i--;)
	masksNumber[i] = 1 << i;

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


export function IntersectArrays<T>(a: T[], b: T[]) {
	return a.some(val1 => b.some(val2 => val1 === val2));
}

export function arrayRemove<T>(ar: T[], el: T): boolean {
	const id = ar.indexOf(el);
	if (id !== -1)
		ar.splice(id, 1);
		
	return id !== -1
}

export function arrayRemoveCallBack<T>(ar: T[], cb: (value: T, index: number, obj: T[]) => boolean): boolean {
	const id = ar.findIndex(cb);
	if (id !== -1) {
		//console.log(ar.length)
		ar.splice(id, 1);
		//console.log(ar.length)
	}
	return id !== -1
}

export function orderBy<T>(ar: T[], cb: (obj: T) => number | boolean): T[] {
	return ar.sort((a, b) => (cb(a) as number) - (cb(b) as number))
}
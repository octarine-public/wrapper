import BinaryStream from "./BinaryStream"

export function Utf8ArrayToStr(array: Uint8Array): string {
	let start = 0
	if (
		array.byteLength >= 3
		&& array[0] === 0xEF
		&& array[1] === 0xBB
		&& array[2] === 0xBF
	)
		start = 3
	const stream = new BinaryStream(new DataView(
		array.buffer,
		array.byteOffset,
		array.byteLength,
	), start)
	return stream.ReadUtf8String(stream.Remaining)
}
export function Utf16ArrayToStr(array: Uint16Array): string {
	let s = ""
	for (const c of array)
		s += String.fromCharCode(c)
	return s
}

export function Uint8ArrayToHex(array: Uint8Array): string {
	return array.reduce((memo, i) => memo + ("0" + i.toString(16)).slice(-2), "")
}

export function StringToUTF8Cb(str: string, writeByte: (b: number) => void): void {
	for (let i = 0; i < str.length; i++) {
		let charcode = str.charCodeAt(i)
		if (charcode < 0x80)
			writeByte(charcode)
		else if (charcode < 0x800) {
			writeByte(0xc0 | (charcode >> 6))
			writeByte(0x80 | (charcode & 0x3f))
		} else if (charcode < 0xd800 || charcode >= 0xe000) {
			writeByte(0xe0 | (charcode >> 12))
			writeByte(0x80 | ((charcode >> 6) & 0x3f))
			writeByte(0x80 | (charcode & 0x3f))
		} else { // surrogate pair
			i++
			// UTF-16 encodes 0x10000-0x10FFFF by
			// subtracting 0x10000 and splitting the
			// 20 bits of 0x0-0xFFFFF into two halves
			charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff))
			writeByte(0xf0 | (charcode >> 18))
			writeByte(0x80 | ((charcode >> 12) & 0x3f))
			writeByte(0x80 | ((charcode >> 6) & 0x3f))
			writeByte(0x80 | (charcode & 0x3f))
		}
	}
}

export function StringToUTF8(str: string): Uint8Array {
	const ar: number[] = []
	StringToUTF8Cb(str, b => ar.push(b))
	return new Uint8Array(ar)
}

export function StringToUTF16(str: string): Uint8Array {
	const buf = new Uint16Array(str.length)
	for (let i = str.length; i--;)
		buf[i] = str.charCodeAt(i)
	return new Uint8Array(buf.buffer)
}

export function ArrayBuffersEqual(ab1: ArrayBuffer, ab2: ArrayBuffer): boolean {
	if (ab1.byteLength !== ab2.byteLength)
		return false
	let ar1: BigUint64Array | Uint32Array | Uint16Array | Uint8Array,
		ar2: BigUint64Array | Uint32Array | Uint16Array | Uint8Array
	if ((ab1.byteLength % 8) === 0) {
		ar1 = new BigUint64Array(ab1)
		ar2 = new BigUint64Array(ab2)
	} else if ((ab1.byteLength % 4) === 0) {
		ar1 = new Uint32Array(ab1)
		ar2 = new Uint32Array(ab2)
	} else if ((ab1.byteLength % 2) === 0) {
		ar1 = new Uint16Array(ab1)
		ar2 = new Uint16Array(ab2)
	} else {
		ar1 = new Uint8Array(ab1)
		ar2 = new Uint8Array(ab2)
	}
	for (let i = 0; i < ar1.length; i++)
		if (ar1[i] !== ar2[i])
			return false
	return true
}

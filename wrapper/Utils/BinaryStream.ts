export default class BinaryStream {
	constructor(public readonly view: DataView, public pos = 0) { }
	public get Remaining(): number {
		return Math.max(this.view.byteLength - this.pos, 0)
	}

	public RelativeSeek(s: number): BinaryStream {
		this.pos += s
		return this
	}
	public ReadUint8(): number {
		return this.view.getUint8(this.pos++)
	}
	public ReadInt8(): number {
		return this.view.getInt8(this.pos++)
	}
	public ReadVarUintAsNumber(): number {
		let val = 0,
			shift = 0,
			b: number
		do {
			b = this.ReadUint8()
			val |= (b & 0x7F) << shift
			shift += 7
		} while ((b & 0x80) !== 0)
		return val
	}
	public ReadVarUint(): bigint {
		let val = 0n,
			shift = 0n,
			b: number
		do {
			b = this.ReadUint8()
			val |= BigInt(b & 0x7F) << shift
			shift += 7n
		} while ((b & 0x80) !== 0)
		return val
	}
	public ReadUint16(littleEndian = true): number {
		const res = this.view.getUint16(this.pos, littleEndian)
		this.pos += 2
		return res
	}
	public ReadInt16(littleEndian = true): number {
		const res = this.view.getInt16(this.pos, littleEndian)
		this.pos += 2
		return res
	}
	public ReadUint32(littleEndian = true): number {
		const res = this.view.getUint32(this.pos, littleEndian)
		this.pos += 4
		return res
	}
	public ReadInt32(littleEndian = true): number {
		const res = this.view.getInt32(this.pos, littleEndian)
		this.pos += 4
		return res
	}
	public ReadUint64(littleEndian = true): bigint {
		const res = this.view.getBigUint64(this.pos, littleEndian)
		this.pos += 8
		return res
	}
	public ReadInt64(littleEndian = true): bigint {
		const res = this.view.getBigInt64(this.pos, littleEndian)
		this.pos += 8
		return res
	}
	public ReadFloat32(littleEndian = true): number {
		const res = this.view.getFloat32(this.pos, littleEndian)
		this.pos += 4
		return res
	}
	public ReadFloat64(littleEndian = true): number {
		const res = this.view.getFloat64(this.pos, littleEndian)
		this.pos += 8
		return res
	}
	public ReadBoolean(): boolean {
		return this.ReadUint8() !== 0
	}
	// returns reference to original buffer instead of creating new one
	public ReadSlice(size: number): Uint8Array {
		const slice = new Uint8Array(this.view.buffer, this.view.byteOffset + this.pos, size)
		this.RelativeSeek(size)
		return slice
	}
	public ReadUtf8String(size: number): string {
		// inlined Utf8ArrayToStr that works with streaming
		let out = ""

		while (size--) {
			const c = this.ReadUint8()
			switch (c >> 4) {
				case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
					// 0xxxxxxx
					out += String.fromCharCode(c)
					break
				case 12: case 13: {
					// 110x xxxx   10xx xxxx
					const char2 = size > 0 ? this.ReadUint8() : 0
					size = Math.max(size - 1, 0)
					out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F))
					break
				}
				case 14: {
					// 1110 xxxx  10xx xxxx  10xx xxxx
					const char2 = size > 0 ? this.ReadUint8() : 0
					size = Math.max(size - 1, 0)
					const char3 = size > 0 ? this.ReadUint8() : 0
					size = Math.max(size - 1, 0)
					out += String.fromCharCode(((c & 0x0F) << 12) |
						((char2 & 0x3F) << 6) |
						((char3 & 0x3F) << 0))
					break
				}
			}
		}

		return out
	}
	public ReadNullTerminatedString(): string {
		let str = ""
		while (true) {
			if (this.Empty())
				return str
			const b = this.ReadUint8()
			if (b === 0)
				return str
			str += String.fromCharCode(b)
		}
	}
	// https://github.com/SteamDatabase/ValveResourceFormat/blob/cceba491d7bb60890a53236a90970b24d0a4aba9/ValveResourceFormat/Utils/StreamHelpers.cs#L43
	public ReadOffsetString(): string {
		const offset = this.ReadUint32()
		if (offset === 0)
			return ""
		const saved_pos = this.pos
		this.pos += offset - 4 // offset from offset
		const ret = this.ReadNullTerminatedString()
		this.pos = saved_pos
		return ret
	}
	// returns reference to original buffer instead of creating new one
	public ReadVarSlice(): Uint8Array {
		return this.ReadSlice(this.ReadVarUintAsNumber())
	}
	public ReadVarString(): string {
		return this.ReadUtf8String(this.ReadVarUintAsNumber())
	}
	public Empty(): boolean {
		return this.pos >= this.view.byteLength
	}
}

import { Utf8ArrayToStr } from "./Utils"

export default class BinaryStream {
	constructor(public readonly view: DataView, public pos = 0) { }
	public get Remaining(): number {
		return Math.max(this.view.byteLength - this.pos, 0)
	}

	public RelativeSeek(s: number): BinaryStream {
		this.pos += s
		return this
	}
	public Next(): number {
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
			b = this.Next()
			val |= (b & 0x7F) << shift
			shift += 7
		} while ((b & 0x80) !== 0)
		return val
	}
	public ReadVarUint(): bigint {
		let val = 0n,
			shift = 0n,
			b: bigint
		do {
			b = BigInt(this.Next())
			val |= (b & 0x7Fn) << shift
			shift += 7n
		} while ((b & 0x80n) !== 0n)
		return val
	}
	public ReadNumber(n: number): number {
		let val = 0
		for (let i = 0; i < n; i++)
			val |= this.Next() << (i * 8)
		return val
	}
	public ReadBigInt(n: number): bigint {
		const limit = BigInt(n) * 8n
		let val = 0n,
			shift = 0n,
			b: bigint
		do {
			b = BigInt(this.Next())
			val |= b << shift
			shift += 8n
		} while (shift !== limit)
		return val
	}
	public ReadUint16(littleEndian = true): number {
		let res = this.view.getUint16(this.pos, littleEndian)
		this.pos += 2
		return res
	}
	public ReadInt16(littleEndian = true): number {
		let res = this.view.getInt16(this.pos, littleEndian)
		this.pos += 2
		return res
	}
	public ReadUint32(littleEndian = true): number {
		let res = this.view.getUint32(this.pos, littleEndian)
		this.pos += 4
		return res
	}
	public ReadInt32(littleEndian = true): number {
		let res = this.view.getInt32(this.pos, littleEndian)
		this.pos += 4
		return res
	}
	public ReadUint64(littleEndian = true): bigint {
		let res = this.view.getBigUint64(this.pos, littleEndian)
		this.pos += 8
		return res
	}
	public ReadInt64(littleEndian = true): bigint {
		let res = this.view.getBigInt64(this.pos, littleEndian)
		this.pos += 8
		return res
	}
	public ReadFloat32(littleEndian = true): number {
		let res = this.view.getFloat32(this.pos, littleEndian)
		this.pos += 4
		return res
	}
	public ReadFloat64(littleEndian = true): number {
		let res = this.view.getFloat64(this.pos, littleEndian)
		this.pos += 8
		return res
	}
	public ReadBoolean(): boolean {
		return this.Next() !== 0
	}
	public ReadSlice(size: number): ArrayBuffer {
		let slice = this.view.buffer.slice(this.pos, this.pos + size)
		this.RelativeSeek(size)
		return slice
	}
	public ReadString(size: number): string {
		return Utf8ArrayToStr(new Uint8Array(size))
	}
	public ReadNullTerminatedString(): string {
		let str = ""
		while (true) {
			if (this.Empty())
				return str
			let b = this.Next()
			if (b === 0)
				return str
			str += String.fromCharCode(b)
		}
	}
	// https://github.com/SteamDatabase/ValveResourceFormat/blob/cceba491d7bb60890a53236a90970b24d0a4aba9/ValveResourceFormat/Utils/StreamHelpers.cs#L43
	public ReadOffsetString(): string {
		let offset = this.ReadUint32()
		if (offset == 0)
			return ""
		let saved_pos = this.pos
		this.pos += offset - 4 // offset from offset
		let ret = this.ReadNullTerminatedString()
		this.pos = saved_pos
		return ret
	}
	public ReadVarSlice(): ArrayBuffer {
		return this.ReadSlice(this.ReadVarUintAsNumber())
	}
	public ReadVarString(): string {
		return Utf8ArrayToStr(new Uint8Array(this.ReadVarSlice()))
	}
	public Empty(): boolean {
		return this.pos >= this.view.byteLength
	}
}

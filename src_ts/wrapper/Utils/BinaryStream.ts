import { Utf8ArrayToStr } from "./Utils"

export default class BinaryStream {
	constructor(public readonly view: DataView, public pos = 0) { }

	public RelativeSeek(s: number): BinaryStream {
		this.pos += s
		return this
	}
	public Next(): number {
		return this.view.getUint8(this.pos++)
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
		const limit = n * 8
		let val = 0,
			shift = 0,
			b: number
		do {
			b = this.Next()
			val |= b << shift
			shift += 8
		} while (shift !== limit)
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
	public ReadInt32(littleEndian = true): number {
		let res = this.view.getInt32(this.pos, littleEndian)
		this.pos += 4
		return res
	}
	public ReadFloat32(littleEndian = true): number {
		let res = this.view.getFloat32(this.pos, littleEndian)
		this.pos += 4
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
	public ReadVarSlice(): ArrayBuffer {
		return this.ReadSlice(Number(this.ReadVarUint()))
	}
	public ReadVarString(): string {
		return Utf8ArrayToStr(new Uint8Array(this.ReadVarSlice()))
	}
	public Empty(): boolean {
		return this.pos >= this.view.byteLength
	}
}

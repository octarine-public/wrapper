import { Utf8ArrayToStr } from "./Utils"

export default class BinaryStream {
	constructor(public readonly view: DataView, public pos = 0) { }

	public RelativeSeek(s: number): BinaryStream {
		this.pos += s
		return this
	}
	public get Remaining(): number {
		return Math.max(this.view.byteLength - this.pos, 0)
	}
	public Next(): number {
		return this.view.getUint8(this.pos++)
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
		return this.ReadSlice(this.ReadVarUintAsNumber())
	}
	public ReadVarString(): string {
		return Utf8ArrayToStr(new Uint8Array(this.ReadVarSlice()))
	}
	public Empty(): boolean {
		return this.pos >= this.view.byteLength
	}
}

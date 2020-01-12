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
			if (b > 0xFFn)
				throw "Invalid string at charCodeAt"
			val |= (b & 0x7Fn) << shift
			shift += 7n
		} while ((b & 0x80n) !== 0n)
		return val
	}
	public ReadNumber(n: number): bigint {
		const limit = BigInt(n) * 8n
		let val = 0n,
			shift = 0n,
			b: bigint
		do {
			b = BigInt(this.Next())
			if (b > 0xFFn)
				throw "Invalid string at charCodeAt"
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
	public Empty(): boolean {
		return this.pos >= this.view.byteLength
	}
}

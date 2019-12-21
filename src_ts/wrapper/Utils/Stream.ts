export default class Stream {
	constructor(public readonly buf: string, public pos = 0) { }

	public RelativeSeek(s: number): Stream {
		this.pos += s
		return this
	}
	public SeekLine(): Stream {
		let found = this.buf.indexOf("\n", this.pos)
		if (found === -1)
			found = this.buf.length - 1
		this.pos = found + 1
		return this
	}
	public Next(): string {
		return this.buf.charAt(this.pos++)
	}
	public ReadString(size: number): string {
		let str = this.buf.substring(this.pos, this.pos + size)
		this.RelativeSeek(size)
		return str
	}
	public ReadVarUint(): bigint {
		let val = 0n,
			shift = 0n,
			b: bigint
		do {
			b = BigInt(this.Next().charCodeAt(0))
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
			b = BigInt(this.Next().charCodeAt(0))
			if (b > 0xFFn)
				throw "Invalid string at charCodeAt"
			val |= b << shift
			shift += 8n
		} while (shift !== limit)
		return val
	}
	public Empty(): boolean {
		return this.pos >= this.buf.length
	}
}

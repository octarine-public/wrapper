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
	public ReadChar(): string {
		return this.buf.charAt(this.pos++)
	}
	public ReadString(size: number): string {
		const str = this.buf.substring(this.pos, this.pos + size)
		this.RelativeSeek(size)
		return str
	}
	public Empty(): boolean {
		return this.pos >= this.buf.length
	}
}

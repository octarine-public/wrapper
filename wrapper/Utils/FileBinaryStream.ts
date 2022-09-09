export default class FileBinaryStream implements ReadableBinaryStream {
	private readonly is_utf16: boolean
	private readonly is_utf16_be: boolean
	private readonly cache: Uint8Array
	private readonly cacheView: DataView
	private cachePos: number
	constructor(
		private readonly fileStream: FileStream,
		public pos = 0,
		detect_encoding = false,
		private readonly size = fileStream.byteLength,
		private readonly offset = 0,
	) {
		// make cache sized minimum of 64KB and nearest ceiled power of 2 to size
		// that way we won't allocate 64KB cache for files <=32KB
		this.cache = new Uint8Array(Math.min(64 * 1024, 2 ** Math.ceil(Math.log2(this.size))))
		this.cacheView = new DataView(this.cache.buffer)
		this.cachePos = -this.cache.byteLength
		this.is_utf16 = false
		this.is_utf16_be = false
		if (!detect_encoding)
			return
		if (this.Remaining >= 2) {
			const ch1 = this.ReadUint8(),
				ch2 = this.ReadUint8()
			if (ch1 === 0xFF && ch2 === 0xFE) {
				this.is_utf16 = true
				return
			}
			if (ch1 === 0xFE && ch2 === 0xFF) {
				this.is_utf16 = true
				this.is_utf16_be = true
				return
			}
			this.RelativeSeek(-2)
		}
		if (this.Remaining >= 3) {
			const ch1 = this.ReadUint8(),
				ch2 = this.ReadUint8(),
				ch3 = this.ReadUint8()
			if (ch1 === 0xEF && ch2 === 0xBB && ch3 === 0xBF) {
				this.is_utf16 = false
				return
			}
			this.RelativeSeek(-3)
		}
	}
	public get Remaining(): number {
		return Math.max(this.size - this.pos, 0)
	}
	public get Size(): number {
		return this.size
	}
	public get Offset(): number {
		return this.offset
	}

	public RelativeSeek(s: number): void {
		this.pos += s
	}
	public ReadUint8(): number {
		this.PopulateCache(1)
		return this.cacheView.getUint8(this.pos++ - this.cachePos)
	}
	public ReadInt8(): number {
		this.PopulateCache(1)
		return this.cacheView.getInt8(this.pos++ - this.cachePos)
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
		this.PopulateCache(2)
		const res = this.cacheView.getUint16(this.pos - this.cachePos, littleEndian)
		this.pos += 2
		return res
	}
	public ReadInt16(littleEndian = true): number {
		this.PopulateCache(2)
		const res = this.cacheView.getInt16(this.pos - this.cachePos, littleEndian)
		this.pos += 2
		return res
	}
	public ReadUint32(littleEndian = true): number {
		this.PopulateCache(4)
		const res = this.cacheView.getUint32(this.pos - this.cachePos, littleEndian)
		this.pos += 4
		return res
	}
	public ReadInt32(littleEndian = true): number {
		this.PopulateCache(4)
		const res = this.cacheView.getInt32(this.pos - this.cachePos, littleEndian)
		this.pos += 4
		return res
	}
	public ReadUint64(littleEndian = true): bigint {
		this.PopulateCache(8)
		const res = this.cacheView.getBigUint64(this.pos - this.cachePos, littleEndian)
		this.pos += 8
		return res
	}
	public ReadInt64(littleEndian = true): bigint {
		this.PopulateCache(8)
		const res = this.cacheView.getBigInt64(this.pos - this.cachePos, littleEndian)
		this.pos += 8
		return res
	}
	public ReadFloat32(littleEndian = true): number {
		this.PopulateCache(4)
		const res = this.cacheView.getFloat32(this.pos - this.cachePos, littleEndian)
		this.pos += 4
		return res
	}
	public ReadFloat64(littleEndian = true): number {
		this.PopulateCache(8)
		const res = this.cacheView.getFloat64(this.pos - this.cachePos, littleEndian)
		this.pos += 8
		return res
	}
	public ReadBoolean(): boolean {
		return this.ReadUint8() !== 0
	}
	public ReadSliceTo(out: Uint8Array): void {
		if (this.Remaining < out.byteLength)
			throw `Failed reading slice of size ${out.byteLength}`
		// if cache fully contains required bytes - grab them from there, otherwise bypass cache
		if (
			this.pos >= this.cachePos
			&& this.cachePos + this.cache.byteLength >= this.pos + out.byteLength
		)
			out.set(this.cache.subarray(
				this.pos - this.cachePos,
				this.pos - this.cachePos + out.byteLength,
			))
		else if (this.fileStream.read(this.offset + this.pos, out) < out.byteLength)
			throw `Failed reading slice of size ${out.byteLength} (native)`
		this.pos += out.byteLength
	}
	public ReadSlice(size: number): Uint8Array {
		const res = new Uint8Array(size)
		this.ReadSliceTo(res)
		return res
	}
	public ReadUtf8Char(size = this.Remaining): string {
		const nPart = this.ReadUint8()
		size--
		return String.fromCharCode(
			nPart > 251 && nPart < 254 && size >= 5 ? /* six bytes */
				/* (nPart - 252 << 30) may be not so safe in ECMAScript! So...: */
				(nPart - 252) * 1073741824 + (this.ReadUint8() - 128 << 24) + (this.ReadUint8() - 128 << 18) + (this.ReadUint8() - 128 << 12) + (this.ReadUint8() - 128 << 6) + this.ReadUint8() - 128
				: nPart > 247 && nPart < 252 && size >= 4 ? /* five bytes */
					(nPart - 248 << 24) + (this.ReadUint8() - 128 << 18) + (this.ReadUint8() - 128 << 12) + (this.ReadUint8() - 128 << 6) + this.ReadUint8() - 128
					: nPart > 239 && nPart < 248 && size >= 3 ? /* four bytes */
						(nPart - 240 << 18) + (this.ReadUint8() - 128 << 12) + (this.ReadUint8() - 128 << 6) + this.ReadUint8() - 128
						: nPart > 223 && nPart < 240 && size >= 2 ? /* three bytes */
							(nPart - 224 << 12) + (this.ReadUint8() - 128 << 6) + this.ReadUint8() - 128
							: nPart > 191 && nPart < 224 && size >= 1 ? /* two bytes */
								(nPart - 192 << 6) + this.ReadUint8() - 128
								: /* nPart < 127 ? */ /* one byte */
								nPart,
		)
	}
	public ReadUtf16Char(): string {
		return String.fromCharCode(this.ReadUint16(!this.is_utf16_be))
	}
	public ReadChar(): string {
		return this.is_utf16
			? this.ReadUtf16Char()
			: this.ReadUtf8Char()
	}
	public SeekLine(): void {
		while (!this.Empty())
			if (this.ReadChar() === "\n")
				break
	}
	public ReadUtf8String(size: number): string {
		let out = ""
		while (size > 0) {
			const start = this.pos
			out += this.ReadUtf8Char(size)
			size -= this.pos - start
		}
		return out
	}
	public ReadUtf16String(size: number): string {
		if ((size % 2) !== 0)
			throw "Invalid size for ReadUtf16String"
		let out = ""
		while (size > 0) {
			out += String.fromCharCode(this.ReadUint16())
			size -= 2
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
	public ReadNullTerminatedUtf8String(): string {
		const orig_pos = this.pos
		let size = 0
		while (this.ReadUint8() !== 0)
			size++
		this.pos = orig_pos

		const str = this.ReadUtf8String(size)
		this.pos++ // skip remaining null byte
		return str
	}
	public ReadNullTerminatedUtf16String(): string {
		let str = ""
		while (true) {
			if (this.Empty())
				return str
			const b = this.ReadUint16()
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
		const ret = this.ReadNullTerminatedUtf8String()
		this.pos = saved_pos
		return ret
	}
	public ReadVarString(): string {
		return this.ReadUtf8String(this.ReadVarUintAsNumber())
	}
	public Empty(): boolean {
		return this.pos >= this.size
	}
	public CreateNestedStream(size: number, detectEncoding = false): FileBinaryStream {
		const res = new FileBinaryStream(
			this.fileStream,
			0,
			detectEncoding,
			Math.min(this.Remaining, size),
			this.offset + this.pos,
		)
		this.pos += size
		return res
	}

	private PopulateCache(bytes: number): void {
		const remaining = this.Remaining
		if (remaining < bytes || bytes > this.cache.byteLength)
			throw `Failed populating cache with ${bytes} bytes`
		if (this.pos >= this.cachePos && this.cachePos + this.cache.byteLength >= this.pos + bytes)
			return
		this.cachePos = this.pos
		const read = this.fileStream.read(this.offset + this.pos, this.cache)
		if (read < Math.min(remaining, this.cache.byteLength))
			throw `Failed populating cache while reading ${bytes} bytes`
	}
}

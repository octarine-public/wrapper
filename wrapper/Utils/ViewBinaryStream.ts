import { Color } from "../Base/Color"

export class ViewBinaryStream implements ReadableBinaryStream {
	private readonly is_utf16: boolean
	private readonly is_utf16_be: boolean
	constructor(
		private readonly view: DataView,
		public pos = 0,
		detect_encoding = false,
	) {
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
		return Math.max(this.view.byteLength - this.pos, 0)
	}
	public get Size(): number {
		return this.view.byteLength
	}
	public get Offset(): number {
		return this.view.byteOffset
	}

	public RelativeSeek(s: number): void {
		this.pos += s
	}
	public ReadUint8(): number {
		return this.view.getUint8(this.pos++)
	}
	public WriteUint8(val: number): void {
		this.view.setUint8(this.pos++, val)
	}
	public WriteColor(val: Color): void {
		this.WriteUint8(Math.max(Math.min(val.r, 255), 0))
		this.WriteUint8(Math.max(Math.min(val.g, 255), 0))
		this.WriteUint8(Math.max(Math.min(val.b, 255), 0))
		this.WriteUint8(Math.max(Math.min(val.a, 255), 0))
	}
	public ReadInt8(): number {
		return this.view.getInt8(this.pos++)
	}
	public WriteInt8(val: number): void {
		this.view.setInt8(this.pos++, val)
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
	public WriteVarUintAsNumber(val: number): void {
		while (val >= 0x80) {
			this.WriteUint8((val | 0x80) & 0xFF)
			val >>= 7
		}
		this.WriteUint8(val)
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
	public WriteVarUint(val: bigint): void {
		while (val >= 0x80n) {
			this.WriteUint8(Number((val | 0x80n) & 0xFFn))
			val >>= 7n
		}
		this.WriteUint8(Number(val))
	}
	public ReadUint16(littleEndian = true): number {
		const res = this.view.getUint16(this.pos, littleEndian)
		this.pos += 2
		return res
	}
	public WriteUint16(val: number, littleEndian = true): void {
		this.view.setUint16(this.pos, val, littleEndian)
		this.pos += 2
	}
	public ReadInt16(littleEndian = true): number {
		const res = this.view.getInt16(this.pos, littleEndian)
		this.pos += 2
		return res
	}
	public WriteInt16(val: number, littleEndian = true): void {
		this.view.setInt16(this.pos, val, littleEndian)
		this.pos += 2
	}
	public ReadUint32(littleEndian = true): number {
		const res = this.view.getUint32(this.pos, littleEndian)
		this.pos += 4
		return res
	}
	public WriteUint32(val: number, littleEndian = true): void {
		this.view.setUint32(this.pos, val, littleEndian)
		this.pos += 4
	}
	public ReadInt32(littleEndian = true): number {
		const res = this.view.getInt32(this.pos, littleEndian)
		this.pos += 4
		return res
	}
	public WriteInt32(val: number, littleEndian = true): void {
		this.view.setInt32(this.pos, val, littleEndian)
		this.pos += 4
	}
	public ReadUint64(littleEndian = true): bigint {
		const res = this.view.getBigUint64(this.pos, littleEndian)
		this.pos += 8
		return res
	}
	public WriteUint64(val: bigint, littleEndian = true): void {
		this.view.setBigUint64(this.pos, val, littleEndian)
		this.pos += 8
	}
	public ReadInt64(littleEndian = true): bigint {
		const res = this.view.getBigInt64(this.pos, littleEndian)
		this.pos += 8
		return res
	}
	public WriteInt64(val: bigint, littleEndian = true): void {
		this.view.setBigInt64(this.pos, val, littleEndian)
		this.pos += 8
	}
	public ReadFloat32(littleEndian = true): number {
		const res = this.view.getFloat32(this.pos, littleEndian)
		this.pos += 4
		return res
	}
	public WriteFloat32(val: number, littleEndian = true): void {
		this.view.setFloat32(this.pos, val, littleEndian)
		this.pos += 4
	}
	public ReadFloat64(littleEndian = true): number {
		const res = this.view.getFloat64(this.pos, littleEndian)
		this.pos += 8
		return res
	}
	public WriteFloat64(val: number, littleEndian = true): void {
		this.view.setFloat64(this.pos, val, littleEndian)
		this.pos += 4
	}
	public ReadBoolean(): boolean {
		return this.ReadUint8() !== 0
	}
	public WriteBoolean(val: boolean): void {
		this.WriteUint8(val ? 1 : 0)
	}
	public ReadSliceTo(output: Uint8Array): void {
		output.set(new Uint8Array(this.view.buffer, this.view.byteOffset + this.pos, output.byteLength))
		this.RelativeSeek(output.byteLength)
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
		return this.pos >= this.view.byteLength
	}
	public CreateNestedStream(size: number, detectEncoding = false): ViewBinaryStream {
		const res = new ViewBinaryStream(new DataView(
			this.view.buffer,
			this.view.byteOffset + this.pos,
			size,
		), 0, detectEncoding)
		this.pos += size
		return res
	}
}

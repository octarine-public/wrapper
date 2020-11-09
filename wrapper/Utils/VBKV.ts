import BinaryStream from "./BinaryStream"
import * as WASM from "../Native/WASM"
import Color from "../Base/Color"
import { StringToUTF8 } from "./ArrayBufferUtils"

const enum VBKVTypes {
	TYPE_NONE = 0,
	TYPE_STRING,
	TYPE_INT,
	TYPE_FLOAT,
	TYPE_PTR,
	TYPE_WSTRING,
	TYPE_COLOR,
	TYPE_UINT64,
	TYPE_END = 0x0B,
}

export type BinaryKV = Map<string, BinaryKV> | Color | string | bigint | number

function parseBinaryKV(stream: BinaryStream, level = 0): Map<string, BinaryKV> {
	if (level++ > 20)
		throw "Too many nested objects in VBKV. Aborting to avoid stack overflow."
	const map = new Map<string, BinaryKV>()
	while (true) {
		const type: VBKVTypes = stream.ReadUint8()
		if (type == VBKVTypes.TYPE_END)
			break
		const name = stream.ReadNullTerminatedUtf8String()
		switch (type) {
			case VBKVTypes.TYPE_NONE:
				map.set(name, parseBinaryKV(stream, level))
				break
			case VBKVTypes.TYPE_STRING:
				map.set(name, stream.ReadNullTerminatedUtf8String())
				break
			case VBKVTypes.TYPE_INT:
				map.set(name, stream.ReadInt32())
				break
			case VBKVTypes.TYPE_FLOAT:
				map.set(name, stream.ReadFloat32())
				break
			case VBKVTypes.TYPE_PTR:
				map.set(name, stream.ReadUint32())
				break
			case VBKVTypes.TYPE_WSTRING:
				map.set(name, stream.ReadNullTerminatedUtf16String())
				break
			case VBKVTypes.TYPE_COLOR: {
				const a = stream.ReadUint8(),
					r = stream.ReadUint8(),
					g = stream.ReadUint8(),
					b = stream.ReadUint8()
				map.set(name, new Color(r, g, b, a))
				break
			}
			case VBKVTypes.TYPE_UINT64:
				map.set(name, stream.ReadUint64())
				break
			default:
				throw `Unknown VBKV type: ${type}`
		}
	}
	return map
}

export function parseVBKV(buf: Uint8Array): Map<string, BinaryKV> {
	const stream = new BinaryStream(new DataView(buf.buffer, buf.byteOffset, buf.byteLength))
	{
		const magic = stream.ReadUint32(false)
		if (magic !== 0x56424b56) // VBKV
			throw `Invalid VBKV magic: 0x${magic.toString(16)}`
	}
	{
		const crc32 = stream.ReadUint32()
		const computed_crc32 = WASM.CRC32(new Uint8Array(stream.view.buffer, stream.view.byteOffset + stream.pos, stream.Remaining))
		if (crc32 !== computed_crc32)
			throw `CRC32 of VBKV doesn't match actual one (0x${crc32.toString(16)} !== 0x${computed_crc32.toString(16)})`
	}

	const parsed = parseBinaryKV(stream)
	if (parsed.size !== 1)
		throw "Unexpected multiple members of root object in VBKV, fix me."

	if (!parsed.has(""))
		throw "Unexpected member of root object in VBKV - have different than empty name"

	const res = parsed.get("")
	if (!(res instanceof Map))
		throw "Unexpected member of root object in VBKV - not Map"
	return res
}

const serializer = new (class VBKVSerializer {
	private buf = new Uint8Array()
	private size = 0

	private AllocateSpace(bytes: number): DataView {
		const current_len = this.size
		if (current_len + bytes > this.buf.byteLength) {
			const grow_factor = 2
			const buf = new Uint8Array(Math.max(this.buf.byteLength * grow_factor, current_len + bytes))
			buf.set(this.buf, 0)
			this.buf = buf
		}
		this.size += bytes
		return new DataView(this.buf.buffer, current_len)
	}
	private WriteNullTerminatedString(str: string): void {
		const buf = StringToUTF8(str)
		const view = this.AllocateSpace(buf.length + 1) // null terminated string
		new Uint8Array(view.buffer, view.byteOffset, buf.length).set(buf)
		view.setUint8(buf.length, 0)
	}
	private SerializeBinaryKV(name: string, kv: BinaryKV, level = 0): void {
		if (level++ > 20)
			throw "Too many nested objects in VBKV. Aborting to avoid stack overflow."
		const type = this.AllocateSpace(1)
		this.WriteNullTerminatedString(name)
		if (typeof kv === "string") {
			type.setUint8(0, VBKVTypes.TYPE_STRING)
			this.WriteNullTerminatedString(name)
		} else if (typeof kv === "number") {
			const view = this.AllocateSpace(4)
			if (kv === kv >> 0) {
				type.setUint8(0, VBKVTypes.TYPE_INT)
				view.setInt32(0, kv, true)
			} else {
				type.setUint8(0, VBKVTypes.TYPE_FLOAT)
				view.setFloat32(0, kv, true)
			}
		} else if (typeof kv === "bigint") {
			type.setUint8(0, VBKVTypes.TYPE_UINT64)
			const view = this.AllocateSpace(8)
			view.setBigUint64(0, kv, true)
		} else if (kv instanceof Color) {
			type.setUint8(0, VBKVTypes.TYPE_COLOR)
			const view = this.AllocateSpace(4)
			view.setUint8(0, kv.a)
			view.setUint8(1, kv.r)
			view.setUint8(2, kv.g)
			view.setUint8(3, kv.b)
		} else if (kv instanceof Map) {
			type.setUint8(0, VBKVTypes.TYPE_NONE)
			kv.forEach((v, k) => this.SerializeBinaryKV(k, v, level))
			const tail = this.AllocateSpace(1)
			tail.setUint8(0, VBKVTypes.TYPE_END)
		}
	}
	public SerializeVBKV(map: Map<string, BinaryKV>): Uint8Array {
		this.size = 0
		{
			const header = this.AllocateSpace(4 + 4)
			header.setUint32(0, 0x56424b56, false) // VBKV
			header.setUint32(4, 0, true) // CRC32
		}
		this.SerializeBinaryKV("", map)
		{
			const tail = this.AllocateSpace(1)
			tail.setUint8(0, VBKVTypes.TYPE_END)
		}
		{
			const computed_crc32 = WASM.CRC32(new Uint8Array(this.buf.buffer, 4 + 4, this.size - 4 - 4))
			new DataView(this.buf.buffer, 0, 4 + 4).setUint32(4, computed_crc32, true) // CRC32
		}
		return this.buf.subarray(0, this.size)
	}
})()

/**
 * returns the same underlying buffer every time for efficiency,
 * if you need to store multiple copies of VBKV - call .slice() on returned value
 */
export function serializeVBKV(map: Map<string, BinaryKV>): Uint8Array {
	return serializer.SerializeVBKV(map)
}

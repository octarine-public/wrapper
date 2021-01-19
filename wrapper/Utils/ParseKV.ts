import { DecompressLZ4 } from "../Native/WASM"
import { ArrayBuffersEqual, Utf8ArrayToStr } from "./ArrayBufferUtils"
import BinaryStream from "./BinaryStream"
import { ParseResourceLayout } from "./ParseResource"
import Stream from "./Stream"

const STRING = '"'
const NODE_OPEN = "{"
const NODE_CLOSE = "}"
const BR_OPEN = "["
const BR_CLOSE = "]"
const COMMENT = "/"
const CR = "\r"
const LF = "\n"
const SPACE = " "
const TAB = "\t"
const WHITESPACE = [SPACE, "\t", "\r", "\n", "="]

function _symtostr(stream: Stream, token: string): string {
	if (stream.buf.indexOf(token, stream.pos) === -1)
		return ""
	const start_pos = stream.pos
	let str = "",
		escape_next_char = false
	while (!stream.Empty()) {
		const ch = stream.ReadChar()
		if (escape_next_char) {
			escape_next_char = false
			try {
				str += JSON.parse(`"\\${ch}"`)
			} catch {
				str += ch
			}
			continue
		}
		if (ch === "\\") {
			escape_next_char = true
			continue
		}
		if (ch === token)
			return str
		str += ch
	}
	stream.pos = start_pos
	return ""
}

function _unquotedtostr(stream: Stream): string {
	let str = ""
	while (!stream.Empty()) {
		const ch = stream.ReadChar()
		if (WHITESPACE.includes(ch))
			break
		str += ch
	}
	return str
}

function _parse(stream: Stream, map = new Map<string, any>()): RecursiveMap {
	let laststr = "",
		lasttok = "",
		lastbrk = "",
		next_is_value = false

	while (!stream.Empty()) {
		let c = stream.ReadChar()

		if (c === NODE_OPEN) {
			next_is_value = false  // Make sure the next string is interpreted as a key.
			if (!map.has(laststr))
				map.set(laststr, new Map())
			let x = map.get(laststr)
			if (!(x instanceof Map))
				map.set(laststr, x = new Map())
			_parse(stream, map.get(laststr))
		} else if (c === NODE_CLOSE) {
			return map
		} else if (c === BR_OPEN)
			lastbrk = _symtostr(stream, BR_CLOSE)
		else if (c === COMMENT) {
			if (stream.ReadChar() === COMMENT)
				stream.SeekLine()
			else
				stream.RelativeSeek(-1) // cancel read
		} else if (c === CR) {
			stream.SeekLine()
			c = LF
		} else if (c === LF) {
			// just skip it
		} else if (c !== SPACE && c !== TAB && c !== "=") {
			let str: string
			if (c !== STRING) {
				stream.RelativeSeek(-1)
				str = _unquotedtostr(stream)
			} else
				str = _symtostr(stream, STRING)

			if (lasttok === STRING && next_is_value) {
				if (map.has(laststr) && lastbrk !== "")
					lastbrk = ""  // Ignore this sentry if it's the second bracketed expression
				else
					map.set(laststr, str)
			}
			c = STRING  // Force c == str so lasttok will be set properly.
			laststr = str
			next_is_value = !next_is_value
		} else
			c = lasttok

		lasttok = c
	}

	return map
}

// Different type of value blocks for KeyValues (All in use for KV3)
enum KVType {
	STRING_MULTI = 0, // STRING_MULTI doesn't have an ID
	NULL = 1,
	BOOLEAN = 2,
	INT64 = 3,
	UINT64 = 4,
	DOUBLE = 5,
	STRING = 6,
	BINARY_BLOB = 7,
	ARRAY = 8,
	OBJECT = 9,
	ARRAY_TYPED = 10,
	INT32 = 11,
	UINT32 = 12,
	BOOLEAN_TRUE = 13,
	BOOLEAN_FALSE = 14,
	INT64_ZERO = 15,
	INT64_ONE = 16,
	DOUBLE_ZERO = 17,
	DOUBLE_ONE = 18,
}

enum KVFlag {
	None,
	Resource,
	DeferredResource,
}

class KVParser {
	private static readonly KV3_ENCODING_BINARY_BLOCK_COMPRESSED = new Uint8Array([0x46, 0x1A, 0x79, 0x95, 0xBC, 0x95, 0x6C, 0x4F, 0xA7, 0x0B, 0x05, 0xBC, 0xA1, 0xB7, 0xDF, 0xD2]).buffer
	private static readonly KV3_ENCODING_BINARY_UNCOMPRESSED = new Uint8Array([0x00, 0x05, 0x86, 0x1B, 0xD8, 0xF7, 0xC1, 0x40, 0xAD, 0x82, 0x75, 0xA4, 0x82, 0x67, 0xE7, 0x14]).buffer
	private static readonly KV3_ENCODING_BINARY_BLOCK_LZ4 = new Uint8Array([0x8A, 0x34, 0x47, 0x68, 0xA1, 0x63, 0x5C, 0x4F, 0xA1, 0x97, 0x53, 0x80, 0x6F, 0xD9, 0xB1, 0x19]).buffer
	/*private static BlockDecompress(buf: ArrayBuffer): ArrayBuffer {
		const  stream = new BinaryStream(new DataView(buf))
		let flags = new Uint8Array(stream.ReadSlice(4))
		if (HasBit(flags[3], 7))
			return stream.ReadSlice(buf.byteLength - 4)
		let out = new Uint8Array((flags[2] << 16) + (flags[1] << 8) + flags[0]),
			out_pos = 0
		while (!stream.Empty() && out_pos < out.byteLength)
			try {
				let block_mask = stream.ReadUint16()
				for (let i = 0; i < 16; i++)
					if (HasBit(block_mask, i)) {
						let encoded_offset_and_size = stream.ReadUint16()
						let offset = ((encoded_offset_and_size & 0xFFF0) >> 4) + 1,
							size = (encoded_offset_and_size & 0x000F) + 3

						let lookup_size = Math.min(offset, size) // If the offset is larger or equal to the size, use the size instead.
						let data = out.slice(out_pos - offset, lookup_size)
						while (size > 0) {
							let write_buf = lookup_size < size ? data : data.slice(0, size)
							out.set(write_buf, out_pos)
							out_pos += write_buf.byteLength
							size -= lookup_size
						}
					} else
						out[out_pos++] = stream.Next()
			} catch { }
		return out.buffer
	}*/
	// private static readonly KV3_FORMAT_GENERIC = new Uint8Array([0x7C, 0x16, 0x12, 0x74, 0xE9, 0x06, 0x98, 0x46, 0xAF, 0xF2, 0xE6, 0x3E, 0xB5, 0x90, 0x37, 0xE7]).buffer

	private types: number[] = []
	private current_type_index = 0
	private strings: string[] = []
	private offset_64bit = -1
	private count_64bit = 0
	private binary_bytes_offset = -1
	public ParseKV2(buf: Uint8Array): RecursiveMap {
		this.binary_bytes_offset = 0
		let stream = new BinaryStream(new DataView(buf.buffer, buf.byteOffset + 4, buf.byteLength - 4))
		stream.RelativeSeek(16) // format
		const compression_method = stream.ReadUint32(),
			data_offset = stream.ReadUint32(),
			count_32bit = stream.ReadUint32()
		this.count_64bit = stream.ReadUint32()
		let kv3_buf: Uint8Array
		switch (compression_method) {
			case 0:
				kv3_buf = stream.ReadSlice(stream.ReadUint32())
				break
			case 1:
				kv3_buf = DecompressLZ4(stream.ReadSlice(stream.Remaining))
				break
			default:
				throw `Unknown KV2 compression method: ${compression_method}`
		}
		stream = new BinaryStream(new DataView(kv3_buf.buffer, kv3_buf.byteOffset, kv3_buf.byteLength))
		stream.pos = Math.ceil(data_offset / 4) * 4
		const string_count = stream.ReadUint32()
		const kv_data_offset = stream.pos
		// Subtract one integer since we already read it (string_count)
		stream.pos = Math.ceil((stream.pos + (count_32bit - 1) * 4) / 8) * 8
		this.offset_64bit = stream.pos
		stream.pos += this.count_64bit * 8

		this.strings = new Array<string>(string_count)
		for (let i = 0; i < string_count; i++)
			this.strings[i] = stream.ReadNullTerminatedUtf8String()

		// bytes after the string table is kv types, minus 4 static bytes at the end
		this.types = new Array<number>(stream.Remaining - 4)
		for (let i = 0; i < this.types.length; i++)
			this.types[i] = stream.ReadUint8()

		stream.pos = kv_data_offset
		return this.ParseBinaryKV(stream, true)
	}
	public ParseKV3(buf: Uint8Array): RecursiveMap {
		let stream = new BinaryStream(new DataView(buf.buffer, buf.byteOffset + 4, buf.byteLength - 4))
		// ReadSlice returns view to original buffer, but we need our own copy here, so we do .slice().buffer
		const encoding = stream.ReadSlice(16).slice().buffer
		stream.RelativeSeek(16) // format
		if (ArrayBuffersEqual(encoding, KVParser.KV3_ENCODING_BINARY_BLOCK_COMPRESSED)) {
			console.log("BlockDecompress not supported now.")
			return new Map()
			// stream = new BinaryStream(new DataView(KVParser.BlockDecompress(stream.ReadSlice(stream.Remaining))))
		} else if (ArrayBuffersEqual(encoding, KVParser.KV3_ENCODING_BINARY_BLOCK_LZ4))
			stream = new BinaryStream(new DataView(DecompressLZ4(stream.ReadSlice(stream.Remaining)).buffer))
		else if (ArrayBuffersEqual(encoding, KVParser.KV3_ENCODING_BINARY_UNCOMPRESSED)) {
			const slice = stream.ReadSlice(stream.Remaining)
			stream = new BinaryStream(new DataView(slice.buffer, slice.byteOffset, slice.byteLength))
		} else
			throw `Unrecognised KV3 Encoding: ${encoding.toString()}`

		this.strings = new Array<string>(stream.ReadUint32())
		for (let i = 0; i < this.strings.length; i++)
			this.strings[i] = stream.ReadNullTerminatedUtf8String()

		return this.ParseBinaryKV(stream, true)
	}

	private ReadType(stream: BinaryStream): [KVType, KVFlag] {
		let databyte = this.types.length !== 0
			? this.types[this.current_type_index++]
			: stream.ReadUint8()

		let flagInfo = KVFlag.None
		if ((databyte & 0x80) === 0x80) {
			databyte &= 0x7F // Remove the flag bit

			flagInfo = this.types.length !== 0
				? this.types[this.current_type_index++]
				: stream.ReadUint8()
		}

		return [databyte, flagInfo]
	}
	private ReadBinaryValue(stream: BinaryStream, parent: RecursiveMap, name: string, datatype: KVType, flagInfo: KVFlag): void {
		let current_pos = stream.pos
		switch (datatype) {
			case KVType.NULL:
				parent.set(name, "")
				break
			case KVType.BOOLEAN:
				if (this.binary_bytes_offset > -1)
					stream.pos = this.binary_bytes_offset++
				parent.set(name, stream.ReadBoolean() ? "1" : "0")
				if (this.binary_bytes_offset > -1)
					stream.pos = current_pos
				break
			case KVType.BOOLEAN_TRUE:
				parent.set(name, true)
				break
			case KVType.BOOLEAN_FALSE:
				parent.set(name, false)
				break
			case KVType.INT64_ONE:
				parent.set(name, 1n)
				break
			case KVType.INT64_ZERO:
				parent.set(name, 0n)
				break
			case KVType.DOUBLE_ONE:
				parent.set(name, 1)
				break
			case KVType.DOUBLE_ZERO:
				parent.set(name, 0)
				break
			case KVType.INT64:
				if (this.offset_64bit > -1)
					stream.pos = this.offset_64bit
				parent.set(name, stream.ReadInt64())
				if (this.offset_64bit > -1) {
					this.offset_64bit += 8
					stream.pos = current_pos
				}
				break
			case KVType.UINT64:
				if (this.offset_64bit > -1)
					stream.pos = this.offset_64bit
				parent.set(name, stream.ReadUint64())
				if (this.offset_64bit > -1) {
					this.offset_64bit += 8
					stream.pos = current_pos
				}
				break
			case KVType.INT32:
				parent.set(name, stream.ReadInt32())
				break
			case KVType.UINT32:
				parent.set(name, stream.ReadUint32())
				break
			case KVType.DOUBLE:
				if (this.offset_64bit > -1)
					stream.pos = this.offset_64bit
				parent.set(name, stream.ReadFloat64())
				if (this.offset_64bit > -1) {
					this.offset_64bit += 8
					stream.pos = current_pos
				}
				break
			case KVType.STRING: {
				const id = stream.ReadInt32()
				parent.set(name, id !== -1 ? this.strings[id] : "")
				break
			}
			case KVType.BINARY_BLOB: {
				const length = stream.ReadInt32()
				current_pos += 4
				if (this.binary_bytes_offset > -1)
					stream.pos = this.binary_bytes_offset++
				parent.set(name, Utf8ArrayToStr(new Uint8Array(stream.ReadSlice(length))))
				if (this.binary_bytes_offset > -1) {
					this.binary_bytes_offset += length
					stream.pos = current_pos
				}
				break
			}
			case KVType.ARRAY: {
				const length = stream.ReadUint32()
				const child: RecursiveMap = new Map()
				for (let i = 0; i < length; i++)
					this.ParseBinaryKV(stream, true, child)
				parent.set(name, child)
				break
			}
			case KVType.ARRAY_TYPED: {
				const length = stream.ReadUint32()
				const [subType, subFlagInfo] = this.ReadType(stream)
				const child: RecursiveMap = new Map()
				for (let i = 0; i < length; i++)
					this.ReadBinaryValue(stream, child, i.toString(), subType, subFlagInfo)
				parent.set(name, child)
				break
			}
			case KVType.OBJECT: {
				const length = stream.ReadUint32()
				const child: RecursiveMap = new Map()
				for (let i = 0; i < length; i++)
					this.ParseBinaryKV(stream, false, child)
				parent.set(name, child)
				break
			}
		}
	}
	private ParseBinaryKV(stream: BinaryStream, in_array = false, parent?: RecursiveMap): RecursiveMap {
		if (parent === undefined) {
			parent = new Map()
			this.ReadBinaryValue(stream, parent, "", ...this.ReadType(stream))
			return (parent.get("") as RecursiveMap) ?? new Map()
		}

		let name: string
		if (!in_array) {
			const string_id = stream.ReadInt32()
			name = string_id !== -1 ? this.strings[string_id] : ""
		} else
			name = parent.size.toString()

		this.ReadBinaryValue(stream, parent, name, ...this.ReadType(stream))
		return parent
	}
}

enum DataType {
	Struct = 1,
	Enum = 2, // TODO: not verified with resourceinfo
	ExternalReference = 3,
	String4 = 4, // TODO: not verified with resourceinfo
	SByte = 10,
	Byte = 11,
	Int16 = 12,
	UInt16 = 13,
	Int32 = 14,
	UInt32 = 15,
	Int64 = 16, // TODO: not verified with resourceinfo
	UInt64 = 17,
	Float = 18,
	Matrix2x4 = 21, // TODO: FourVectors2D
	Vector = 22,
	Vector4D = 23,
	Quaternion = 25,
	Fltx4 = 27,
	Color = 28, // TODO: not verified with resourceinfo
	Boolean = 30,
	String = 31,
	Matrix3x4 = 33,
	Matrix3x4a = 36,
	CTransform = 40,
	Vector4D_44 = 44,
}

class ResourceDiskStruct_Field {
	public FieldName = ""
	public Count = 0
	public OnDiskOffset = 0
	public Indirections: number[] = []
	public TypeData = 0
	public Type: DataType = 0
}

class ResourceDiskStruct {
	public IntrospectionVersion = 0
	public ID = 0
	public Name = ""
	public DiskCRC = 0
	public UserVersion = 0
	public DiskSize = 0
	public Alignment = 0
	public BaseStructID = 0
	public StructFlags = 0
	public FieldIntrospection: ResourceDiskStruct_Field[] = []
}

class ResourceDiskEnum {
	public IntrospectionVersion = 0
	public ID = 0
	public Name = ""
	public DiskCRC = 0
	public UserVersion = 0
	public EnumValueIntrospection = new Map<string, number>()
}

class ResourceIntrospectionManifest {
	public IntrospectionVersion = 0
	public ReferencedStructs: ResourceDiskStruct[] = []
	public ReferencedEnums: ResourceDiskEnum[] = []

	public Parse(stream: BinaryStream): ResourceIntrospectionManifest {
		this.IntrospectionVersion = stream.ReadUint32()

		this.ParseStructs(stream)
		stream.pos = 12 // skip 3 ints
		this.ParseEnums(stream)
		return this
	}
	private ParseStructs(stream: BinaryStream): void {
		const entries_offset = stream.ReadUint32(),
			entries_count = stream.ReadUint32()
		if (entries_count === 0)
			return

		stream.pos += entries_offset - 8 // offset from entries_offset
		for (let i = 0; i < entries_count; i++) {
			const disc_struct = new ResourceDiskStruct()
			disc_struct.IntrospectionVersion = stream.ReadUint32()
			disc_struct.ID = stream.ReadUint32()
			disc_struct.Name = stream.ReadOffsetString()
			disc_struct.DiskCRC = stream.ReadUint32()
			disc_struct.UserVersion = stream.ReadInt32()
			disc_struct.DiskSize = stream.ReadUint16()
			disc_struct.Alignment = stream.ReadUint16()
			disc_struct.BaseStructID = stream.ReadUint32()

			const fields_offset = stream.ReadUint32(),
				fields_size = stream.ReadUint32()
			const prev = stream.pos
			stream.pos += fields_offset - 8 // offset from fields_offset
			for (let j = 0; j < fields_size; j++) {
				const field = new ResourceDiskStruct_Field()
				field.FieldName = stream.ReadOffsetString()
				field.Count = stream.ReadUint16()
				field.OnDiskOffset = stream.ReadInt16()

				const indirection_offset = stream.ReadUint32(),
					indirection_size = stream.ReadUint32()
				const prev2 = stream.pos
				stream.pos += indirection_offset - 8 // offset from indirection_offset
				for (let k = 0; k < indirection_size; k++)
					field.Indirections.push(stream.ReadUint8())
				stream.pos = prev2

				field.TypeData = stream.ReadUint32()
				field.Type = stream.ReadInt16()
				stream.RelativeSeek(2) // TODO: ????

				disc_struct.FieldIntrospection.push(field)
			}
			stream.pos = prev
			disc_struct.StructFlags = stream.ReadUint8()
			stream.RelativeSeek(3) // TODO: ????
			this.ReferencedStructs.push(disc_struct)
		}
	}
	private ParseEnums(stream: BinaryStream): void {
		const entries_offset = stream.ReadUint32(),
			entries_count = stream.ReadUint32()
		if (entries_count === 0)
			return

		stream.pos += entries_offset - 8 // offset from entries_offset
		for (let i = 0; i < entries_count; i++) {
			const disc_enum = new ResourceDiskEnum()
			disc_enum.IntrospectionVersion = stream.ReadUint32()
			disc_enum.ID = stream.ReadUint32()
			disc_enum.Name = stream.ReadOffsetString()
			disc_enum.DiskCRC = stream.ReadUint32()
			disc_enum.UserVersion = stream.ReadInt32()

			const fields_offset = stream.ReadUint32(),
				fields_size = stream.ReadUint32()
			const prev = stream.pos
			stream.pos += fields_offset - 8 // offset from fields_offset
			for (let j = 0; j < fields_size; j++)
				disc_enum.EnumValueIntrospection.set(stream.ReadOffsetString(), stream.ReadInt32())
			stream.pos = prev
			this.ReferencedEnums.push(disc_enum)
		}
	}
}

class C_NTRO {
	constructor(private resourceIntrospectionManifest: ResourceIntrospectionManifest) { }
	public Parse(stream: BinaryStream): Nullable<RecursiveMap> {
		if (this.resourceIntrospectionManifest.ReferencedStructs.length === 0)
			return undefined
		return this.ReadStructure(stream, this.resourceIntrospectionManifest.ReferencedStructs[0])
	}
	private ReadStructure(stream: BinaryStream, struct: ResourceDiskStruct, startingOffset = 0, map: RecursiveMap = new Map()): RecursiveMap {
		struct.FieldIntrospection.forEach(field => {
			stream.pos = startingOffset + field.OnDiskOffset
			this.ReadFieldIntrospection(stream, map, field)
		})

		// Some structs are padded, so all the field sizes do not add up to the size on disk
		stream.pos = startingOffset + struct.DiskSize

		if (struct.BaseStructID !== 0) {
			const prev = stream.pos
			this.ReadStructure(stream, this.resourceIntrospectionManifest.ReferencedStructs.find(struct_ => struct.BaseStructID === struct_.ID)!, startingOffset, map)
			stream.pos = prev
		}

		return map
	}
	private ReadFieldIntrospection(stream: BinaryStream, parent: RecursiveMap, field: ResourceDiskStruct_Field): void {
		let count = Math.max(field.Count, 1)

		let prev = 0
		if (field.Indirections.length !== 0) {
			if (field.Indirections.length !== 1) // TODO
				throw "More than one indirection, not yet handled"
			if (field.Count > 0) // TODO
				throw "Indirection.Count > 0 && field.Count > 0"

			const indirection = field.Indirections[0], // TODO: depth needs fixing?
				offset = stream.ReadUint32()
			switch (indirection) {
				case 0x03: // pointer
					if (offset === 0) {
						parent.set(field.FieldName, "")
						return
					}
					prev = stream.pos
					stream.pos += offset - 4
					break
				case 0x04:
					count = stream.ReadUint32()
					prev = stream.pos
					if (count > 0)
						stream.pos += offset - 8
					break
				default:
					throw `Unknown indirection ${indirection}`
			}
		}

		if (field.Count > 0 || field.Indirections.length !== 0) {
			const ar: RecursiveMap = new Map()
			for (let i = 0; i < count; i++)
				this.ReadField(stream, ar, field, true)
			parent.set(field.FieldName, ar)
		} else
			for (let i = 0; i < count; i++)
				this.ReadField(stream, parent, field)

		if (prev !== 0)
			stream.pos = prev
	}
	private ReadFloatArray(stream: BinaryStream, len: number): RecursiveMap {
		const map: RecursiveMap = new Map()
		for (let i = 0; i < len; i++)
			map.set(i.toString(), stream.ReadFloat32())
		return map
	}
	private ReadField(stream: BinaryStream, parent: RecursiveMap, field: ResourceDiskStruct_Field, is_array = false): void {
		const name = is_array ? parent.size.toString() : field.FieldName
		switch (field.Type) {
			case DataType.Struct:
				parent.set(name, this.ReadStructure(stream, this.resourceIntrospectionManifest.ReferencedStructs.find(x => field.TypeData === x.ID)!, stream.pos))
				break
			case DataType.Enum:
				// TODO: Lookup in ReferencedEnums
				parent.set(name, stream.ReadUint32())
				break
			case DataType.SByte:
				parent.set(name, stream.ReadInt8())
				break
			case DataType.Byte:
				parent.set(name, stream.ReadUint8())
				break
			case DataType.Boolean:
				parent.set(name, stream.ReadBoolean())
				break
			case DataType.Int16:
				parent.set(name, stream.ReadInt16())
				break
			case DataType.UInt16:
				parent.set(name, stream.ReadUint16())
				break
			case DataType.Int32:
				parent.set(name, stream.ReadInt32())
				break
			case DataType.UInt32:
				parent.set(name, stream.ReadUint32())
				break
			case DataType.Float:
				parent.set(name, stream.ReadFloat32())
				break
			case DataType.Int64:
				parent.set(name, stream.ReadInt64())
				break
			case DataType.UInt64:
				parent.set(name, stream.ReadUint64())
				break
			case DataType.ExternalReference:
				// TODO: https://github.com/SteamDatabase/ValveResourceFormat/blob/8de399ac9b1201b06d596adce7ee9f39432a8b72/ValveResourceFormat/Resource/ResourceTypes/NTRO.cs#L193
				stream.RelativeSeek(8)
				parent.set(name, "")
				break
			case DataType.Vector:
				parent.set(name, this.ReadFloatArray(stream, 3))
				break
			case DataType.Quaternion:
			case DataType.Color:
			case DataType.Fltx4:
			case DataType.Vector4D:
			case DataType.Vector4D_44:
				parent.set(name, this.ReadFloatArray(stream, 4))
				break
			case DataType.String4:
			case DataType.String:
				parent.set(name, stream.ReadOffsetString())
				break
			case DataType.CTransform:
			case DataType.Matrix2x4:
				parent.set(name, this.ReadFloatArray(stream, 8))
				break
			case DataType.Matrix3x4:
			case DataType.Matrix3x4a:
				parent.set(name, this.ReadFloatArray(stream, 12))
				break
			default:
				throw `Unknown data type at field ${field.FieldName}: ${field.Type}`
		}
	}
}

function FixupSoundEventScript(map: RecursiveMap): RecursiveMap {
	const fixed_map: RecursiveMap = new Map(),
		m_SoundEvents = map.get("m_SoundEvents")
	if (!(m_SoundEvents instanceof Map))
		return fixed_map
	m_SoundEvents.forEach(entry => {
		if (!(entry instanceof Map))
			return
		const name = entry.get("m_SoundName"),
			value = entry.get("m_OperatorsKV")
		if (typeof name === "string" && typeof value === "string")
			fixed_map.set(name, value.replace(/\r\n/g, "\n")) // TODO: parse KV3 text inside too
	})
	return fixed_map
}

function TryParseNTROResource(buf: Uint8Array, DATA: Uint8Array, NTRO: Uint8Array): Nullable<RecursiveMap> {
	const manifest = new ResourceIntrospectionManifest().Parse(
		new BinaryStream(new DataView(buf.buffer, buf.byteOffset + NTRO.byteOffset, NTRO.byteLength)),
	)
	const map = new C_NTRO(manifest).Parse(
		new BinaryStream(new DataView(buf.buffer, buf.byteOffset + DATA.byteOffset, DATA.byteLength)),
	)
	if (map === undefined)
		return undefined
	if (manifest.ReferencedStructs.length > 0)
		switch (manifest.ReferencedStructs[0].Name) {
			case "VSoundEventScript_t":
				return FixupSoundEventScript(map)
			case "CWorldVisibility": // TODO
			default:
				break
		}
	return map
}

export function parseKV(buf: Uint8Array, block: string | number = "DATA"): RecursiveMap {
	const layout = ParseResourceLayout(buf)
	if (layout !== undefined) {
		const DATA = typeof block === "string" ? layout[0].get(block) : layout[1][block]
		if (DATA !== undefined && DATA.byteLength >= 4)
			switch (new Uint32Array(buf.buffer, buf.byteOffset + DATA.byteOffset, 4)[0]) {
				case 0x03564B56: // VKV\x03
					return new KVParser().ParseKV3(DATA)
				case 0x4B563301: // KV3\x01
					return new KVParser().ParseKV2(DATA)
			}
		const NTRO = layout[0].get("NTRO")
		if (DATA !== undefined && NTRO !== undefined) {
			const res = TryParseNTROResource(buf, DATA, NTRO)
			if (res !== undefined)
				return res
		}
		if (DATA !== undefined)
			return _parse(new Stream(Utf8ArrayToStr(DATA)))
	}
	return _parse(new Stream(Utf8ArrayToStr(buf)))
}

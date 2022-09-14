import { DecompressLZ4, DecompressLZ4Chained, DecompressZstd } from "../Native/WASM"
import { ArrayBuffersEqual } from "../Utils/ArrayBufferUtils"
import { HasBit } from "../Utils/BitsExtensions"
import { FileBinaryStream } from "../Utils/FileBinaryStream"
import { ParseExternalReferences } from "../Utils/Utils"
import { ViewBinaryStream } from "../Utils/ViewBinaryStream"
import { ParseNTRO } from "./ParseNTRO"
import { ParseResourceLayout } from "./ParseResource"
import { parseTextKV } from "./ParseTextKV"

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

class KVParser {
	private static readonly KV3_ENCODING_BINARY_BLOCK_COMPRESSED = new Uint8Array([0x46, 0x1A, 0x79, 0x95, 0xBC, 0x95, 0x6C, 0x4F, 0xA7, 0x0B, 0x05, 0xBC, 0xA1, 0xB7, 0xDF, 0xD2]).buffer
	private static readonly KV3_ENCODING_BINARY_UNCOMPRESSED = new Uint8Array([0x00, 0x05, 0x86, 0x1B, 0xD8, 0xF7, 0xC1, 0x40, 0xAD, 0x82, 0x75, 0xA4, 0x82, 0x67, 0xE7, 0x14]).buffer
	private static readonly KV3_ENCODING_BINARY_BLOCK_LZ4 = new Uint8Array([0x8A, 0x34, 0x47, 0x68, 0xA1, 0x63, 0x5C, 0x4F, 0xA1, 0x97, 0x53, 0x80, 0x6F, 0xD9, 0xB1, 0x19]).buffer
	private static BlockDecompress(stream: ReadableBinaryStream): ReadableBinaryStream {
		const flags = stream.ReadSlice(4)
		if (HasBit(flags[3], 7))
			return stream.CreateNestedStream(stream.Remaining)
		const out = new Uint8Array((flags[2] << 16) + (flags[1] << 8) + flags[0])
		let out_pos = 0
		while (!stream.Empty() && out_pos < out.byteLength) {
			const block_mask = stream.ReadUint16()
			for (let i = 0; i < 16; i++) {
				if (HasBit(block_mask, i)) {
					const offset_size = stream.ReadUint16()
					const offset = ((offset_size & 0xFFF0) >> 4) + 1
					let size = (offset_size & 0x000F) + 3

					// If the offset is larger or equal to the size, use the size instead.
					const lookup_size = Math.min(offset, size)
					const data = out.subarray(out_pos - offset, out_pos - offset + lookup_size)
					while (size > 0) {
						const write_buf = lookup_size <= size
							? data
							: data.subarray(0, size)
						out.set(write_buf, out_pos)
						out_pos += write_buf.byteLength
						size -= lookup_size
					}
				} else
					out[out_pos++] = stream.ReadUint8()
				if (out_pos >= out.byteLength)
					break
			}
		}
		return new ViewBinaryStream(new DataView(out.buffer))
	}
	// private static readonly KV3_FORMAT_GENERIC = new Uint8Array([0x7C, 0x16, 0x12, 0x74, 0xE9, 0x06, 0x98, 0x46, 0xAF, 0xF2, 0xE6, 0x3E, 0xB5, 0x90, 0x37, 0xE7]).buffer

	private readonly types: number[] = []
	private current_type_index = 0
	private readonly strings: string[] = []
	private readonly uncompressed_blocks_lengths: number[] = []
	private uncompressed_blocks_stream: Nullable<ReadableBinaryStream>
	private current_compressed_block = 0
	private offset_64bit = -1
	private binary_bytes_offset = -1
	public ReadVersion2(stream: ReadableBinaryStream): RecursiveMap {
		this.binary_bytes_offset = 0
		stream.RelativeSeek(16) // format
		const compression_method = stream.ReadUint32(),
			data_offset = stream.ReadUint32(),
			count_32bit = stream.ReadUint32(),
			count_64bit = stream.ReadUint32()
		switch (compression_method) {
			case 0:
				stream = stream.CreateNestedStream(stream.ReadUint32())
				break
			case 1: {
				const dst_len = stream.ReadUint32()
				stream = new ViewBinaryStream(new DataView(DecompressLZ4(stream, stream.Remaining, dst_len).buffer))
				break
			}
			default:
				throw `Unknown KV2 compression method: ${compression_method}`
		}
		stream.pos = Math.ceil(data_offset / 4) * 4
		const string_count = stream.ReadUint32()
		const kv_data_offset = stream.pos
		// Subtract one integer since we already read it (string_count)
		stream.pos = Math.ceil((stream.pos + (count_32bit - 1) * 4) / 8) * 8
		this.offset_64bit = stream.pos
		stream.pos += count_64bit * 8

		for (let i = 0; i < string_count; i++)
			this.strings.push(stream.ReadNullTerminatedUtf8String())

		// bytes after the string table is kv types, minus 4 static bytes at the end
		for (let i = 0, end = stream.Remaining - 4; i < end; i++)
			this.types.push(stream.ReadUint8())

		stream.pos = kv_data_offset
		return this.ParseBinaryKV3(stream)
	}
	public ReadVersion3(stream: ReadableBinaryStream): RecursiveMap {
		this.binary_bytes_offset = 0
		stream.RelativeSeek(16) // format
		const compression_method = stream.ReadUint32(),
			compression_dictionary_id = stream.ReadUint16(),
			compression_frame_size = stream.ReadUint16(),
			data_offset = stream.ReadUint32(),
			count_32bit = stream.ReadUint32(),
			count_64bit = stream.ReadUint32()
		const string_and_types_buffer_size = stream.ReadUint32()
		stream.RelativeSeek(4)
		const uncompressed_size = stream.ReadUint32(),
			compressed_size = stream.ReadUint32(),
			block_count = stream.ReadUint32()
		stream.RelativeSeek(4) // block_total_size
		const orig_stream = stream
		switch (compression_method) {
			case 0:
				if (compression_dictionary_id !== 0)
					throw "Unexpected compression_dictionary_id for compression_method 0"
				if (compression_frame_size !== 0)
					throw "Unexpected compression_frame_size for compression_method 0"
				stream = stream.CreateNestedStream(compressed_size)
				break
			case 1:
				if (compression_dictionary_id !== 0)
					throw "Unexpected compression_dictionary_id for compression_method 1"
				if (compression_frame_size !== 16 * 1024)
					throw "Unexpected compression_frame_size for compression_method 1"
				stream = new ViewBinaryStream(new DataView(DecompressLZ4(stream, compressed_size, uncompressed_size).buffer))
				break
			case 2:
				if (compression_dictionary_id !== 0)
					throw "Unexpected compression_dictionary_id for compression_method 2"
				if (compression_frame_size !== 0)
					throw "Unexpected compression_frame_size for compression_method 2"
				stream = new ViewBinaryStream(new DataView(DecompressZstd(stream, compressed_size).buffer))
				break
			default:
				throw `Unknown KV3 compression method: ${compression_method}`
		}
		stream.pos = Math.ceil(data_offset / 4) * 4
		const string_count = stream.ReadUint32()
		const kv_data_offset = stream.pos
		// Subtract one integer since we already read it (string_count)
		stream.pos = Math.ceil((stream.pos + (count_32bit - 1) * 4) / 8) * 8
		this.offset_64bit = stream.pos
		stream.pos += count_64bit * 8

		const string_array_pos = stream.pos
		for (let i = 0; i < string_count; i++)
			this.strings.push(stream.ReadNullTerminatedUtf8String())

		// 0xFFEEDD00 trailer + size of lz4 compressed block sizes (short) + size of lz4 decompressed block sizes (int)
		for (let i = 0, end = string_and_types_buffer_size - (stream.pos - string_array_pos); i < end; i++)
			this.types.push(stream.ReadUint8())

		for (let i = 0; i < block_count; i++)
			this.uncompressed_blocks_lengths.push(stream.ReadUint32())

		if (stream.ReadUint32() !== 0xFFEEDD00)
			throw `Invalid trailer`

		switch (compression_method) {
			case 0: {
				const remaining = orig_stream.Remaining
				const needed = this.uncompressed_blocks_lengths.reduce((prev, cur) => prev + cur, 0)
				if (remaining < needed)
					throw "Failed uncompressed reading: remaining < needed"
				this.uncompressed_blocks_stream = orig_stream.CreateNestedStream(needed)
				break
			}
			case 1: {
				const compressed_block_lengths: number[] = []
				for (let i = 0; i < block_count; i++)
					compressed_block_lengths.push(stream.ReadUint16())
				const uncompressed_blocks = DecompressLZ4Chained(
					orig_stream,
					orig_stream.Remaining,
					compressed_block_lengths,
					this.uncompressed_blocks_lengths,
				)
				this.uncompressed_blocks_stream = new ViewBinaryStream(new DataView(
					uncompressed_blocks.buffer,
					uncompressed_blocks.byteOffset,
					uncompressed_blocks.byteLength,
				))
				break
			}
			case 2:
				this.uncompressed_blocks_stream = stream.CreateNestedStream(stream.Remaining)
				break
			default:
				throw `Unknown KV3 compression method: ${compression_method}`
		}

		stream.pos = kv_data_offset
		return this.ParseBinaryKV3(stream)
	}
	public ParseVKV3(stream: ReadableBinaryStream): RecursiveMap {
		const encoding = stream.ReadSlice(16).buffer
		stream.RelativeSeek(16) // format
		if (ArrayBuffersEqual(encoding, KVParser.KV3_ENCODING_BINARY_BLOCK_COMPRESSED))
			stream = KVParser.BlockDecompress(stream)
		else if (ArrayBuffersEqual(encoding, KVParser.KV3_ENCODING_BINARY_BLOCK_LZ4)) {
			const dst_len = stream.ReadUint32()
			stream = new ViewBinaryStream(new DataView(DecompressLZ4(stream, stream.Remaining, dst_len).buffer))
		} else if (ArrayBuffersEqual(encoding, KVParser.KV3_ENCODING_BINARY_UNCOMPRESSED))
			stream = stream.CreateNestedStream(stream.Remaining)
		else
			throw `Unrecognised KV3 Encoding: ${new Uint8Array(encoding).toString().toString()}`

		for (let i = 0, end = stream.ReadUint32(); i < end; i++)
			this.strings.push(stream.ReadNullTerminatedUtf8String())

		return this.ParseBinaryKV3(stream)
	}

	private ReadType(stream: ReadableBinaryStream): KVType {
		let databyte = this.types.length !== 0
			? this.types[this.current_type_index++]
			: stream.ReadUint8()

		if ((databyte & 0x80) === 0x80) {
			databyte &= 0x7F // Remove the flag bit
			if (this.types.length !== 0)
				this.current_type_index++
			else
				stream.ReadUint8()
		}

		return databyte
	}
	private ReadBinaryValue(stream: ReadableBinaryStream, datatype = this.ReadType(stream)): RecursiveMapValue {
		let current_pos = stream.pos
		switch (datatype) {
			case KVType.NULL:
				return ""
			case KVType.BOOLEAN: {
				if (this.binary_bytes_offset > -1)
					stream.pos = this.binary_bytes_offset++
				const val = stream.ReadBoolean()
				if (this.binary_bytes_offset > -1)
					stream.pos = current_pos
				return val
			}
			case KVType.BOOLEAN_TRUE:
				return true
			case KVType.BOOLEAN_FALSE:
				return false
			case KVType.INT64_ONE:
				return 1n
			case KVType.INT64_ZERO:
				return 0n
			case KVType.DOUBLE_ONE:
				return 1
			case KVType.DOUBLE_ZERO:
				return 0
			case KVType.INT64: {
				if (this.offset_64bit > -1)
					stream.pos = this.offset_64bit
				const val = stream.ReadInt64()
				if (this.offset_64bit > -1) {
					this.offset_64bit += 8
					stream.pos = current_pos
				}
				return val
			}
			case KVType.UINT64: {
				if (this.offset_64bit > -1)
					stream.pos = this.offset_64bit
				const val = stream.ReadUint64()
				if (this.offset_64bit > -1) {
					this.offset_64bit += 8
					stream.pos = current_pos
				}
				return val
			}
			case KVType.INT32:
				return stream.ReadInt32()
			case KVType.UINT32:
				return stream.ReadUint32()
			case KVType.DOUBLE: {
				if (this.offset_64bit > -1)
					stream.pos = this.offset_64bit
				const val = stream.ReadFloat64()
				if (this.offset_64bit > -1) {
					this.offset_64bit += 8
					stream.pos = current_pos
				}
				return val
			}
			case KVType.STRING: {
				const id = stream.ReadInt32()
				return id !== -1
					? this.strings[id]
					: ""
			}
			case KVType.BINARY_BLOB: {
				if (this.uncompressed_blocks_stream !== undefined)
					return this.uncompressed_blocks_stream.CreateNestedStream(
						this.uncompressed_blocks_lengths[this.current_compressed_block++],
					)

				const length = stream.ReadInt32()
				current_pos += 4
				if (this.binary_bytes_offset > -1) {
					stream.pos = this.binary_bytes_offset
					this.binary_bytes_offset += length
				}
				const val = stream.CreateNestedStream(length)
				if (this.binary_bytes_offset > -1)
					stream.pos = current_pos
				return val
			}
			case KVType.ARRAY: {
				const length = stream.ReadUint32()
				const ar: RecursiveMapValue[] = []
				for (let i = 0; i < length; i++)
					ar.push(this.ReadBinaryValue(stream))
				return ar
			}
			case KVType.ARRAY_TYPED: {
				const length = stream.ReadUint32()
				const subType = this.ReadType(stream)
				const ar: RecursiveMapValue[] = []
				for (let i = 0; i < length; i++)
					ar.push(this.ReadBinaryValue(stream, subType))
				return ar
			}
			case KVType.OBJECT: {
				const length = stream.ReadUint32()
				const child: RecursiveMap = new Map()
				for (let i = 0; i < length; i++)
					this.ParseBinaryKV3(stream, child)
				return child
			}
			default:
				throw `Unknown KVType: ${datatype}`
		}
	}
	private ParseBinaryKV3(stream: ReadableBinaryStream, parent?: RecursiveMap): RecursiveMap {
		if (parent === undefined) {
			const val = this.ReadBinaryValue(stream)
			if (val instanceof Map)
				return val
			return new Map()
		}

		parent.set(
			this.ReadBinaryValue(stream, KVType.STRING) as string,
			this.ReadBinaryValue(stream),
		)
		return parent
	}
}

export function parseKVBlock(stream: Nullable<ReadableBinaryStream>): Nullable<RecursiveMap> {
	if (stream !== undefined && stream.Size >= 4)
		switch (stream.ReadUint32()) {
			case 0x03564B56: // VKV\x03
				return new KVParser().ParseVKV3(stream)
			case 0x4B563302: // KV3\x02
				return new KVParser().ReadVersion3(stream)
			case 0x4B563301: // KV3\x01
				return new KVParser().ReadVersion2(stream)
			default:
				break
		}
	return undefined
}

export function parseKV(buf: ReadableBinaryStream, block: string | number = "DATA"): RecursiveMap {
	const layout = ParseResourceLayout(buf),
		starting_pos = buf.pos
	if (layout !== undefined) {
		const DATA = typeof block === "string" ? layout[0].get(block) : layout[1][block]
		const parsed_DATA = parseKVBlock(DATA)
		if (parsed_DATA !== undefined)
			return parsed_DATA
		buf.pos = starting_pos

		const NTRO = layout[0].get("NTRO")
		if (DATA !== undefined && NTRO !== undefined) {
			const res = ParseNTRO(
				DATA,
				NTRO,
				ParseExternalReferences(buf),
			)
			if (res !== undefined)
				return res
		}
		buf.pos = starting_pos

		if (DATA !== undefined)
			return parseTextKV(DATA.CreateNestedStream(DATA.Remaining, true))
		buf.pos = starting_pos
	}
	return parseTextKV(buf.CreateNestedStream(buf.Remaining, true))
}

export function parseKVFile(path: string): RecursiveMap {
	const buf = fopen(path)
	if (buf === undefined)
		return new Map()
	try {
		return parseKV(new FileBinaryStream(buf))
	} finally {
		buf.close()
	}
}

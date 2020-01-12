import BinaryStream from "./BinaryStream"
import { Utf8ArrayToStr } from "../Utils/Utils"

export enum ProtoType {
	// 0 is reserved for errors.
	// Order is weird for historical reasons.
	TYPE_DOUBLE = 1,
	TYPE_FLOAT = 2,
	// Not ZigZag encoded.  Negative numbers take 10 bytes.  Use TYPE_SINT64 if
	// negative values are likely.
	TYPE_INT64 = 3,
	TYPE_UINT64 = 4,
	// Not ZigZag encoded.  Negative numbers take 10 bytes.  Use TYPE_SINT32 if
	// negative values are likely.
	TYPE_INT32 = 5,
	TYPE_FIXED64 = 6,
	TYPE_FIXED32 = 7,
	TYPE_BOOL = 8,
	TYPE_STRING = 9,
	// Tag-delimited aggregate.
	// Group type is deprecated and not supported in proto3. However, Proto3
	// implementations should still be able to parse the group wire format and
	// treat group fields as unknown fields.
	TYPE_GROUP = 10,
	TYPE_MESSAGE = 11,  // Length-delimited aggregate.

	// New in version 2.
	TYPE_BYTES = 12,
	TYPE_UINT32 = 13,
	TYPE_ENUM = 14,
	TYPE_SFIXED32 = 15,
	TYPE_SFIXED64 = 16,
	TYPE_SINT32 = 17,  // Uses ZigZag encoding.
	TYPE_SINT64 = 18,  // Uses ZigZag encoding.
}

export type RecursiveProtobuf = Map<string, RecursiveProtobuf | string | number | bigint | boolean>
export type ProtoFieldDescription = [/* name */ string, /* type */ ProtoType, /* proto description */ ProtoDescription?]
export type ProtoDescription = Map<number, ProtoFieldDescription>

let ProtoCache = new Map<string, [ProtoType, /* message */ProtoDescription | /* enum */Map<string, number>]>()
export { ProtoCache }

let convert_buf = new ArrayBuffer(8)
let convert_uint32 = new Uint32Array(convert_buf),
	convert_int64 = new BigInt64Array(convert_buf),
	convert_uint64 = new BigUint64Array(convert_buf),
	convert_float32 = new Float32Array(convert_buf),
	convert_float64 = new Float64Array(convert_buf)
export function ParseProtobuf(proto_buf: ArrayBuffer, proto_desc: ProtoDescription): RecursiveProtobuf {
	let map: RecursiveProtobuf = new Map()
	let stream = new BinaryStream(new DataView(proto_buf))
	while (!stream.Empty()) {
		let tag = stream.ReadVarUint()
		let field_num = Number(tag >> 3n)
		let wire_type = Number(tag & 0x7n) // least 3 bits
		let value: ArrayBuffer | bigint
		switch (wire_type) {
			case 0: // Varint: int32, int64, uint32, uint64, sint32, sint64, bool, enum
				value = stream.ReadVarUint()
				break
			case 1: // 64-bit: fixed64, sfixed64, double
				value = stream.ReadNumber(8)
				break
			case 2: // Length-delimited: string, bytes, embedded messages, packed repeated fields
				value = stream.ReadSlice(Number(stream.ReadVarUint()))
				break
			case 3: // start group
			case 4: // end group
				throw "Groups are deprecated"
			case 5: // 32-bit: fixed32, sfixed32, float32
				value = stream.ReadNumber(4)
				break
			default:
				throw `Unknown wire type ${wire_type}`
		}
		let field_data = proto_desc.get(field_num)
		if (field_data === undefined)
			continue
		let [field_name, field_type] = field_data
		switch (field_type) {
			case ProtoType.TYPE_BOOL:
				if (value instanceof ArrayBuffer)
					throw "Invalid proto [1]"
				map.set(field_name, value !== 0n)
				break
			case ProtoType.TYPE_ENUM:
			case ProtoType.TYPE_INT32: case ProtoType.TYPE_INT64:
			case ProtoType.TYPE_SFIXED64: case ProtoType.TYPE_SFIXED32: {
				if (value instanceof ArrayBuffer)
					throw "Invalid proto [2]"
				convert_uint64[0] = value
				map.set(field_name, Number(convert_int64[0]))
				break
			}
			case ProtoType.TYPE_SINT32:
				if (value instanceof ArrayBuffer || value > 0xFFFFFFFFn)
					throw "Invalid proto [3]"
				map.set(field_name, Number((value >> 1n) ^ -(value & 1n)))
				break
			case ProtoType.TYPE_SINT64:
				if (value instanceof ArrayBuffer)
					throw "Invalid proto [4]"
				map.set(field_name, (value >> 1n) ^ -(value & 1n))
				break
			case ProtoType.TYPE_FIXED32: case ProtoType.TYPE_UINT32:
				if (value instanceof ArrayBuffer || value > 0xFFFFFFFFn)
					throw "Invalid proto [5]"
				map.set(field_name, Number(value))
				break
			case ProtoType.TYPE_FIXED64: case ProtoType.TYPE_UINT64:
				if (value instanceof ArrayBuffer)
					throw "Invalid proto [6]"
				map.set(field_name, value)
				break
			case ProtoType.TYPE_FLOAT:
				if (value instanceof ArrayBuffer || value > 0xFFFFFFFFn)
					throw "Invalid proto [7]"
				convert_uint32[0] = Number(value)
				map.set(field_name, convert_float32[0])
				break
			case ProtoType.TYPE_DOUBLE:
				if (value instanceof ArrayBuffer)
					throw "Invalid proto [8]"
				convert_int64[0] = value
				map.set(field_name, convert_float64[0])
				break
			case ProtoType.TYPE_MESSAGE: {
				if (!(value instanceof ArrayBuffer))
					throw "Invalid proto [9]"
				let proto_desc2 = field_data[2]
				if (proto_desc2 === undefined)
					throw "Invalid proto description (no proto specified for ProtoType.PROTO)"
				map.set(field_name, ParseProtobuf(value, proto_desc2))
				break
			}
			case ProtoType.TYPE_STRING: case ProtoType.TYPE_BYTES:
				if (!(value instanceof ArrayBuffer))
					throw "Invalid proto [10]"
				map.set(field_name, Utf8ArrayToStr(new Uint8Array(value)))
				break
		}
	}
	return map
}
export function ParseProtobufNamed(proto_buf: ArrayBuffer, name: string): RecursiveProtobuf {
	let ProtoCache_entry = ProtoCache.get(name)
	if (ProtoCache_entry === undefined)
		throw `Unknown type name ${name}`
	if (ProtoCache_entry[0] === ProtoType.TYPE_ENUM)
		throw `Enum type name ${name} passed to ParseProtobuf`
	return ParseProtobuf(proto_buf, ProtoCache_entry[1] as ProtoDescription)
}

export function ParseProtobufDescLine(str: string): [/* field number */ number, ProtoFieldDescription] {
	let exec = /^\s*\w+\s+([^\s]+)\s+([^\s]+)\s*=\s*(\d+)/.exec(str)
	if (exec === null)
		throw "Invalid protobuf description line: " + str
	let type_str = exec[1]
	let type: ProtoType
	switch (type_str) {
		case "uint32":
			type = ProtoType.TYPE_UINT32
			break
		case "fixed32":
			type = ProtoType.TYPE_FIXED32
			break
		case "fixed64":
			type = ProtoType.TYPE_FIXED64
			break
		case "uint64":
			type = ProtoType.TYPE_UINT64
			break
		case "sfixed32":
			type = ProtoType.TYPE_SFIXED32
			break
		case "int32":
			type = ProtoType.TYPE_INT32
			break
		case "sint32":
			type = ProtoType.TYPE_SINT32
			break
		case "sfixed64":
			type = ProtoType.TYPE_SFIXED64
			break
		case "int64":
			type = ProtoType.TYPE_INT64
			break
		case "sint64":
			type = ProtoType.TYPE_SINT64
			break
		case "bool":
			type = ProtoType.TYPE_BOOL
			break
		case "string":
			type = ProtoType.TYPE_STRING
			break
		case "bytes":
			type = ProtoType.TYPE_BYTES
			break
		case "float":
			type = ProtoType.TYPE_FLOAT
			break
		case "double":
			type = ProtoType.TYPE_DOUBLE
			break
		default: {
			if (type_str.startsWith("."))
				type_str = type_str.substring(1)
			let message_type = ProtoCache.get(type_str)
			if (message_type === undefined)
				throw `Invalid protobuf description type: ${type_str}`
			if (message_type[0] === ProtoType.TYPE_MESSAGE)
				return [parseInt(exec[3]), [exec[2], ProtoType.TYPE_MESSAGE, message_type[1] as ProtoDescription]]
			else if (message_type[0] === ProtoType.TYPE_ENUM)
				return [parseInt(exec[3]), [exec[2], message_type[0]]]
			else
				throw `Unknown ProtoType for ProtoCache entry ${type_str}`
		}
	}
	return [parseInt(exec[3]), [exec[2], type]]
}

export function ParseProtobufDesc(str: string): void {
	let current_name: string[] = [],
		current_map: Nullable<ProtoDescription | Map<string, number>>,
		current_is_enum = false
	// loop-optimizer: FORWARD
	str.replace(/\r/g, "").split("\n").forEach((line, i) => {
		line = line.trim()

		if (line.startsWith("optional ") || line.startsWith("required ")) {
			if (current_map === undefined)
				throw `Unexpected field declaration at line ${i}`
			if (current_is_enum)
				throw `Unexpected field declaration at line ${i} (declaration inside enum ${current_name.join(".")})`
			let [field_number, field_desc] = ParseProtobufDescLine(line)
			let fixed_map = current_map as ProtoDescription
			fixed_map.set(field_number, field_desc)
		} else if (line.startsWith("message ")) {
			if (current_map !== undefined && current_is_enum)
				throw `Unexpected message declaration at line ${i} (declaration inside enum)`

			let match = /^message ([^\s]+) {$/.exec(line)
			if (match === null)
				throw `Invalid message declaration at line ${i}`

			current_name.push(match[1])
			current_is_enum = false
			current_map = new Map()
			ProtoCache.set(current_name.join("."), [ProtoType.TYPE_MESSAGE, current_map])
		} else if (line.startsWith("enum ")) {
			if (current_map !== undefined && current_is_enum)
				throw `Unexpected message declaration at line ${i} (declaration inside enum)`

			let match = /^enum ([^\s]+) {$/.exec(line)
			if (match === null)
				throw `Invalid enum declaration at line ${i}`

			current_name.push(match[1])
			current_is_enum = true
			current_map = new Map()
			ProtoCache.set(current_name.join("."), [ProtoType.TYPE_ENUM, current_map])
		} else if (line === "}") {
			if (current_name.length === 0)
				throw `Unexpected closing brace at line ${i}`
			current_name.splice(current_name.length - 1) // removes last element in array
			if (current_name.length !== 0) {
				let found = ProtoCache.get(current_name.join("."))
				if (found !== undefined) {
					current_is_enum = found[0] === ProtoType.TYPE_ENUM
					current_map = found[1]
				} else
					current_map = undefined
			} else
				current_map = undefined
		} else if (line.startsWith("option ") || line.startsWith("syntax "))
			return
		else if (current_map !== undefined && current_is_enum) {
			let match = /^([^\s]+)\s*=\s*([^\s]+)/.exec(line)
			if (match === null)
				return
			let fixed_map = current_map as Map<string, number>
			fixed_map.set(match[1], parseInt(match[2]))
		}
	})
}

// "used frequently"
ParseProtobufDesc(`
message CMsgVector {
	optional float x = 1;
	optional float y = 2;
	optional float z = 3;
}

message CMsgVector2D {
	optional float x = 1;
	optional float y = 2;
}

message CMsgQAngle {
	optional float x = 1;
	optional float y = 2;
	optional float z = 3;
}
`)

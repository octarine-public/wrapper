import BinaryStream from "./BinaryStream"
import { Utf8ArrayToStr } from "./ArrayBufferUtils"
import Vector3 from "../Base/Vector3"
import Vector2 from "../Base/Vector2"
import Color from "../Base/Color"

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

export type ProtobufFieldType = string | number | bigint | boolean | RecursiveProtobuf | Uint8Array
export type RecursiveProtobuf = Map<string, ProtobufFieldType[] | ProtobufFieldType>
export enum ProtoFieldType {
	OPTIONAL,
	REPEATED,
	PACKED,
	REQUIRED,
}
export type ProtoFieldDescription = {
	name: string,
	type: ProtoType,
	proto_type: ProtoFieldType,
	proto_desc?: ProtoDescription,
	default_value?: boolean | number | bigint,
}
export type ProtoDescription = Map<number, ProtoFieldDescription>

let ProtoCache = new Map<string, [ProtoType, /* message */ProtoDescription | /* enum */Map<string, number>]>()
export { ProtoCache }

function FillMessageDefaults(msg: RecursiveProtobuf, desc: ProtoDescription): RecursiveProtobuf {
	desc.forEach(field => {
		if (msg.has(field.name))
			return
		if (field.proto_type === ProtoFieldType.REPEATED || field.proto_type === ProtoFieldType.PACKED)
			msg.set(field.name, [])
		else if (field.type === ProtoType.TYPE_MESSAGE)
			msg.set(field.name, FillMessageDefaults(new Map(), field.proto_desc!))
		else if (field.default_value !== undefined)
			msg.set(field.name, field.default_value)
	})
	return msg
}

let convert_buf = new ArrayBuffer(8)
let convert_uint32 = new Uint32Array(convert_buf),
	convert_int32 = new Int32Array(convert_buf),
	convert_int64 = new BigInt64Array(convert_buf),
	convert_uint64 = new BigUint64Array(convert_buf),
	convert_float32 = new Float32Array(convert_buf),
	convert_float64 = new Float64Array(convert_buf)
function ParseField(field: ProtoFieldDescription, value: ArrayBuffer | bigint): ProtobufFieldType {
	switch (field.type) {
		case ProtoType.TYPE_BOOL:
			if (value instanceof ArrayBuffer)
				throw "Invalid proto [1]"
			return value !== 0n
		case ProtoType.TYPE_ENUM:
		case ProtoType.TYPE_INT32:
		case ProtoType.TYPE_SFIXED32:
			if (value instanceof ArrayBuffer)
				throw "Invalid proto [2]"
			convert_uint64[0] = value
			return convert_int32[0]
		case ProtoType.TYPE_INT64:
		case ProtoType.TYPE_SFIXED64:
			if (value instanceof ArrayBuffer)
				throw "Invalid proto [2]"
			convert_uint64[0] = value
			return convert_int64[0]
		case ProtoType.TYPE_SINT32:
			if (value instanceof ArrayBuffer || value > 0xFFFFFFFFn)
				throw "Invalid proto [3]"
			return Number((value >> 1n) ^ -(value & 1n))
		case ProtoType.TYPE_SINT64:
			if (value instanceof ArrayBuffer)
				throw "Invalid proto [4]"
			return (value >> 1n) ^ -(value & 1n)
		case ProtoType.TYPE_FIXED32: case ProtoType.TYPE_UINT32:
			if (value instanceof ArrayBuffer || value > 0xFFFFFFFFn)
				throw "Invalid proto [5]"
			convert_uint64[0] = value
			return convert_uint32[0]
		case ProtoType.TYPE_FIXED64: case ProtoType.TYPE_UINT64:
			if (value instanceof ArrayBuffer)
				throw "Invalid proto [6]"
			return value
		case ProtoType.TYPE_FLOAT:
			if (value instanceof ArrayBuffer || value > 0xFFFFFFFFn)
				throw "Invalid proto [7]"
			convert_uint64[0] = value
			return convert_float32[0]
		case ProtoType.TYPE_DOUBLE:
			if (value instanceof ArrayBuffer)
				throw "Invalid proto [8]"
			convert_int64[0] = value
			return convert_float64[0]
		case ProtoType.TYPE_MESSAGE:
			if (!(value instanceof ArrayBuffer))
				throw "Invalid proto [9]"
			return ParseProtobuf(new Uint8Array(value), field.proto_desc!)
		case ProtoType.TYPE_STRING:
			if (!(value instanceof ArrayBuffer))
				throw "Invalid proto [10]"
			return Utf8ArrayToStr(new Uint8Array(value))
		case ProtoType.TYPE_BYTES:
			if (!(value instanceof ArrayBuffer))
				throw "Invalid proto [10]"
			return new Uint8Array(value)
		case ProtoType.TYPE_GROUP: // group
			throw "Groups are deprecated"
	}
}

function ParsePacked(buf: ArrayBuffer, field: ProtoFieldDescription): ProtobufFieldType[] {
	let array: ProtobufFieldType[] = [],
		stream = new BinaryStream(new DataView(buf))
	let value2: ArrayBuffer | bigint
	while (!stream.Empty()) {
		switch (field.type) {
			case ProtoType.TYPE_INT32: // Varint: int32, int64, uint32, uint64, sint32, sint64, bool, enum
			case ProtoType.TYPE_INT64:
			case ProtoType.TYPE_SINT32:
			case ProtoType.TYPE_SINT64:
			case ProtoType.TYPE_UINT32:
			case ProtoType.TYPE_UINT64:
			case ProtoType.TYPE_BOOL:
			case ProtoType.TYPE_ENUM:
				value2 = stream.ReadVarUint()
				break
			case ProtoType.TYPE_FIXED64: // 64-bit: fixed64, sfixed64, double
			case ProtoType.TYPE_SFIXED64:
			case ProtoType.TYPE_DOUBLE:
				value2 = stream.ReadUint64()
				break
			case ProtoType.TYPE_STRING: // Length-delimited: string, bytes, embedded messages
			case ProtoType.TYPE_BYTES:
			case ProtoType.TYPE_MESSAGE:
				// we do .slice().buffer to prevent referencing big buffer, and create out own copy of needed region
				value2 = stream.ReadVarSlice().slice().buffer
				break
			case ProtoType.TYPE_GROUP: // group
				throw "Groups are deprecated"
			case ProtoType.TYPE_FIXED32: // 32-bit: fixed32, sfixed32, float32
			case ProtoType.TYPE_SFIXED32:
			case ProtoType.TYPE_FLOAT:
				value2 = BigInt(stream.ReadUint32())
				break
		}
		array.push(ParseField(field, value2))
	}
	return array
}

function DecodeField(map: RecursiveProtobuf, field: ProtoFieldDescription, value: ArrayBuffer | bigint): void {
	switch (field.proto_type) {
		case ProtoFieldType.OPTIONAL:
		case ProtoFieldType.REQUIRED:
			map.set(field.name, ParseField(field, value))
			break
		case ProtoFieldType.REPEATED: {
			if (!map.has(field.name))
				map.set(field.name, [])
			let array = map.get(field.name) as ProtobufFieldType[]
			array.push(ParseField(field, value))
			break
		}
		case ProtoFieldType.PACKED:
			if (!(value instanceof ArrayBuffer))
				throw `Invalid proto [packed] at field name ${field.name}`
			map.set(field.name, ParsePacked(value, field))
			break
	}
}

export function ParseProtobuf(proto_buf: Uint8Array, proto_desc: ProtoDescription): RecursiveProtobuf {
	let map: RecursiveProtobuf = new Map()
	const stream = new BinaryStream(new DataView(proto_buf.buffer, proto_buf.byteOffset, proto_buf.byteLength))
	while (!stream.Empty()) {
		let tag = stream.ReadVarUintAsNumber()
		let field_num = tag >> 3
		let wire_type = tag & ((1 << 3) - 1)
		let value: ArrayBuffer | bigint
		switch (wire_type) {
			case 0: // Varint: int32, int64, uint32, uint64, sint32, sint64, bool, enum
				value = stream.ReadVarUint()
				break
			case 1: // 64-bit: fixed64, sfixed64, double
				value = stream.ReadUint64()
				break
			case 2: // Length-delimited: string, bytes, embedded messages, packed repeated fields
				// we do .slice().buffer to prevent referencing big ServerMessageBuffer, and create out own copy of needed region
				value = stream.ReadVarSlice().slice().buffer
				break
			case 3: // start group
			case 4: // end group
				throw "Groups are deprecated"
			case 5: // 32-bit: fixed32, sfixed32, float32
				value = BigInt(stream.ReadUint32())
				break
			default:
				throw `Unknown wire type ${wire_type}`
		}
		let field_desc = proto_desc.get(field_num)
		if (field_desc === undefined)
			continue
		DecodeField(map, field_desc, value)
	}
	return FillMessageDefaults(map, proto_desc)
}
export function ParseProtobufNamed(proto_buf: Uint8Array, name: string): RecursiveProtobuf {
	let ProtoCache_entry = ProtoCache.get(name)
	if (ProtoCache_entry === undefined)
		throw `Unknown type name ${name}`
	if (ProtoCache_entry[0] === ProtoType.TYPE_ENUM)
		throw `Enum type name ${name} passed to ParseProtobuf`
	return ParseProtobuf(proto_buf, ProtoCache_entry[1] as ProtoDescription)
}

export function ParseProtobufDescLine(str: string): [/* field number */ number, ProtoFieldDescription] {
	let exec = /^\s*(\w+)\s+([^\s]+)\s+([^\s]+)\s*=\s*(\d+)/.exec(str)
	if (exec === null)
		throw "Invalid protobuf description line: " + str

	let proto_type = ProtoFieldType.OPTIONAL
	switch (exec[1].toLowerCase()) {
		case "optional":
			proto_type = ProtoFieldType.OPTIONAL
			break
		case "required":
			proto_type = ProtoFieldType.REQUIRED
			break
		case "repeated":
			proto_type = ProtoFieldType.REPEATED
			break
	}
	let others = str.substring(exec[0].length)
	let type_str = exec[2]
	let type: ProtoType
	let enum_mapping: Nullable<Map<string, number>>
	let proto_desc: Nullable<ProtoDescription>
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
			if (message_type[0] === ProtoType.TYPE_MESSAGE) {
				type = ProtoType.TYPE_MESSAGE
				proto_desc = message_type[1] as ProtoDescription
			} else if (message_type[0] === ProtoType.TYPE_ENUM) {
				type = ProtoType.TYPE_ENUM
				enum_mapping = message_type[1] as Map<string, number>
			} else
				throw `Unknown ProtoType for ProtoCache entry ${type_str}`
		}
	}
	let default_value: Nullable<bigint | number | boolean>
	if (proto_type === ProtoFieldType.REPEATED) {
		let packed = /\s*\[packed\s*=\s*([^\s]+)\]/.exec(others)
		if (packed !== null && packed[1] !== "false")
			proto_type = ProtoFieldType.PACKED
	} else {
		let default_ = /\s*\[default\s*=\s*([^\s]+)\]/.exec(others)
		if (default_ !== null) {
			switch (type) {
				case ProtoType.TYPE_INT32:
				case ProtoType.TYPE_UINT32:
				case ProtoType.TYPE_FIXED32:
				case ProtoType.TYPE_SFIXED32:
				case ProtoType.TYPE_SINT32:
					default_value = parseInt(default_[1])
					break
				case ProtoType.TYPE_INT64:
				case ProtoType.TYPE_UINT64:
				case ProtoType.TYPE_FIXED64:
				case ProtoType.TYPE_SFIXED64:
				case ProtoType.TYPE_SINT64:
					default_value = BigInt(default_[1])
					break
				case ProtoType.TYPE_FLOAT:
				case ProtoType.TYPE_DOUBLE:
					default_value = parseFloat(default_[1])
					break
				case ProtoType.TYPE_BOOL:
					default_value = default_[1] !== "false"
					break
				case ProtoType.TYPE_ENUM:
					default_value = enum_mapping?.get(default_[1])
					break
			}
		}
	}
	return [parseInt(exec[4]), {
		name: exec[3],
		type,
		default_value,
		proto_type,
		proto_desc
	}]
}

export function ParseProtobufDesc(str: string): void {
	let current_name: string[] = [],
		current_map: Nullable<ProtoDescription | Map<string, number>>,
		current_is_enum = false
	str.replace(/\r/g, "").split("\n").forEach((line, i) => {
		line = line.trim()

		if (/^(optional|required|repeated)\s+/.test(line)) {
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
				throw `Unexpected enum declaration at line ${i} (declaration inside enum)`

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

// common stuff
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

export function CMsgVectorToVector3(vec: Nullable<RecursiveProtobuf>): Vector3 {
	if (vec === undefined)
		return new Vector3()
	return new Vector3((vec.get("x") as number) ?? 0, (vec.get("y") as number) ?? 0, (vec.get("z") as number) ?? 0)
}

export function CMsgVector2DToVector2(vec: Nullable<RecursiveProtobuf>): Vector2 {
	if (vec === undefined)
		return new Vector2()
	return new Vector2((vec.get("x") as number) ?? 0, (vec.get("y") as number) ?? 0)
}

export function NumberToColor(num: Nullable<number>): Color {
	if (num === undefined)
		return new Color()
	return new Color((num >> 24) & 0xFF, (num >> 16) & 0xFF, (num >> 8) & 0xFF, num & 0xFF)
}

export function ServerHandleToIndex(handle: Nullable<number>): number {
	if (handle === undefined)
		return -1
	handle &= 0x3FFF
	if (handle === 0x3FFF || handle === 0)
		return -1
	return handle
}

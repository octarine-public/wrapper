import { Color } from "../Base/Color"
import { Vector2 } from "../Base/Vector2"
import { Vector3 } from "../Base/Vector3"
import { ViewBinaryStream } from "./ViewBinaryStream"

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
	TYPE_MESSAGE = 11, // Length-delimited aggregate.

	// New in version 2.
	TYPE_BYTES = 12,
	TYPE_UINT32 = 13,
	TYPE_ENUM = 14,
	TYPE_SFIXED32 = 15,
	TYPE_SFIXED64 = 16,
	TYPE_SINT32 = 17, // Uses ZigZag encoding.
	TYPE_SINT64 = 18, // Uses ZigZag encoding.
}

export type ProtobufFieldType =
	| string
	| number
	| bigint
	| boolean
	| RecursiveProtobuf
	| Uint8Array
export type RecursiveProtobuf = Map<
	string,
	ProtobufFieldType[] | ProtobufFieldType
>
export enum ProtoFieldType {
	OPTIONAL,
	REPEATED,
	PACKED,
	REQUIRED,
}
export type ProtoFieldDescription = {
	name: string
	type: ProtoType
	protoType: ProtoFieldType
	protoDesc?: ProtoDescription
	defaultValue?: boolean | number | bigint
}
export type ProtoDescription = Map<number, ProtoFieldDescription>

const ProtoCache = new Map<
	string,
	[ProtoType, /* message */ ProtoDescription | /* enum */ Map<string, number>]
>()
export { ProtoCache }

function FillMessageDefaults(
	msg: RecursiveProtobuf,
	desc: ProtoDescription
): RecursiveProtobuf {
	desc.forEach(field => {
		if (msg.has(field.name)) return
		if (
			field.protoType === ProtoFieldType.REPEATED ||
			field.protoType === ProtoFieldType.PACKED
		)
			msg.set(field.name, [])
		else if (field.defaultValue !== undefined)
			msg.set(field.name, field.defaultValue)
	})
	return msg
}

const convertBuf = new ArrayBuffer(8)
const convertUint32 = new Uint32Array(convertBuf),
	convertInt32 = new Int32Array(convertBuf),
	convertInt64 = new BigInt64Array(convertBuf),
	convertUint64 = new BigUint64Array(convertBuf),
	convertFloat32 = new Float32Array(convertBuf),
	convertFloat64 = new Float64Array(convertBuf)
function ParseField(
	field: ProtoFieldDescription,
	value: Uint8Array | bigint
): ProtobufFieldType {
	switch (field.type) {
		case ProtoType.TYPE_BOOL:
			if (value instanceof Uint8Array) throw "Invalid proto [1]"
			return value !== 0n
		case ProtoType.TYPE_ENUM:
		case ProtoType.TYPE_INT32:
		case ProtoType.TYPE_SFIXED32:
			if (value instanceof Uint8Array) throw "Invalid proto [2]"
			convertUint64[0] = value
			return convertInt32[0]
		case ProtoType.TYPE_INT64:
		case ProtoType.TYPE_SFIXED64:
			if (value instanceof Uint8Array) throw "Invalid proto [2]"
			convertUint64[0] = value
			return convertInt64[0]
		case ProtoType.TYPE_SINT32:
			if (value instanceof Uint8Array || value > 0xffffffffn)
				throw "Invalid proto [3]"
			return Number((value >> 1n) ^ -(value & 1n))
		case ProtoType.TYPE_SINT64:
			if (value instanceof Uint8Array) throw "Invalid proto [4]"
			return (value >> 1n) ^ -(value & 1n)
		case ProtoType.TYPE_FIXED32:
		case ProtoType.TYPE_UINT32:
			if (value instanceof Uint8Array || value > 0xffffffffn)
				throw "Invalid proto [5]"
			convertUint64[0] = value
			return convertUint32[0]
		case ProtoType.TYPE_FIXED64:
		case ProtoType.TYPE_UINT64:
			if (value instanceof Uint8Array) throw "Invalid proto [6]"
			return value
		case ProtoType.TYPE_FLOAT:
			if (value instanceof Uint8Array || value > 0xffffffffn)
				throw "Invalid proto [7]"
			convertUint64[0] = value
			return convertFloat32[0]
		case ProtoType.TYPE_DOUBLE:
			if (value instanceof Uint8Array) throw "Invalid proto [8]"
			convertInt64[0] = value
			return convertFloat64[0]
		case ProtoType.TYPE_MESSAGE:
			if (!(value instanceof Uint8Array)) throw "Invalid proto [9]"
			return ParseProtobuf(value, field.protoDesc!)
		case ProtoType.TYPE_STRING:
			if (!(value instanceof Uint8Array)) throw "Invalid proto [10]"
			return new ViewBinaryStream(
				new DataView(value.buffer, value.byteOffset, value.byteLength)
			).ReadUtf8String(value.byteLength)
		case ProtoType.TYPE_BYTES:
			if (!(value instanceof Uint8Array)) throw "Invalid proto [11]"
			return value
		case ProtoType.TYPE_GROUP: // group
			throw "Groups are deprecated"
	}
}

function ParsePacked(
	data: Uint8Array,
	field: ProtoFieldDescription
): ProtobufFieldType[] {
	const stream = new ViewBinaryStream(
		new DataView(data.buffer, data.byteOffset, data.byteLength)
	)
	const array: ProtobufFieldType[] = []
	let value2: Uint8Array | bigint
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
				value2 = stream.ReadSliceNoCopy(stream.ReadVarUintAsNumber())
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

function DecodeField(
	map: RecursiveProtobuf,
	field: ProtoFieldDescription,
	value: Uint8Array | bigint
): void {
	switch (field.protoType) {
		case ProtoFieldType.OPTIONAL:
		case ProtoFieldType.REQUIRED:
			map.set(field.name, ParseField(field, value))
			break
		case ProtoFieldType.REPEATED: {
			try {
				if (!map.has(field.name)) map.set(field.name, [])
				const array = map.get(field.name) as ProtobufFieldType[]
				array.push(ParseField(field, value))
			} catch (e) {
				if (value instanceof Uint8Array)
					map.set(field.name, ParsePacked(value, field))
				else throw e
			}
			break
		}
		case ProtoFieldType.PACKED:
			if (!(value instanceof Uint8Array))
				throw `Invalid proto [packed] at field name ${field.name}`
			map.set(field.name, ParsePacked(value, field))
			break
	}
}

export function ParseProtobuf(
	data: Uint8Array,
	protoDesc: ProtoDescription
): RecursiveProtobuf {
	const stream = new ViewBinaryStream(
		new DataView(data.buffer, data.byteOffset, data.byteLength)
	)
	const map: RecursiveProtobuf = new Map()
	while (!stream.Empty()) {
		const tag = stream.ReadVarUintAsNumber()
		const fieldNum = tag >> 3,
			wireType = tag & ((1 << 3) - 1)
		let value: Uint8Array | bigint
		switch (wireType) {
			case 0: // Varint: int32, int64, uint32, uint64, sint32, sint64, bool, enum
				value = stream.ReadVarUint()
				break
			case 1: // 64-bit: fixed64, sfixed64, double
				value = stream.ReadUint64()
				break
			case 2: // Length-delimited: string, bytes, embedded messages, packed repeated fields
				value = stream.ReadSliceNoCopy(stream.ReadVarUintAsNumber())
				break
			case 3: // start group
			case 4: // end group
				throw "Groups are deprecated"
			case 5: // 32-bit: fixed32, sfixed32, float32
				value = BigInt(stream.ReadUint32())
				break
			default:
				throw `Unknown wire type ${wireType}`
		}
		const fieldDesc = protoDesc.get(fieldNum)
		if (fieldDesc === undefined) continue
		DecodeField(map, fieldDesc, value)
	}
	return FillMessageDefaults(map, protoDesc)
}
export function ParseProtobufNamed(
	data: Uint8Array,
	name: string
): RecursiveProtobuf {
	const protoCacheEntry = ProtoCache.get(name)
	if (protoCacheEntry === undefined) throw `Unknown type name ${name}`
	if (protoCacheEntry[0] === ProtoType.TYPE_ENUM)
		throw `Enum type name ${name} passed to ParseProtobuf`
	return ParseProtobuf(data, protoCacheEntry[1] as ProtoDescription)
}

export function ParseProtobufDescLine(
	str: string
): [/* field number */ number, ProtoFieldDescription] {
	const exec = /^\s*(\w+)\s+([^\s]+)\s+([^\s]+)\s*=\s*(\d+)/.exec(str)
	if (exec === null) throw "Invalid protobuf description line: " + str

	let protoType = ProtoFieldType.OPTIONAL
	switch (exec[1].toLowerCase()) {
		case "optional":
			protoType = ProtoFieldType.OPTIONAL
			break
		case "required":
			protoType = ProtoFieldType.REQUIRED
			break
		case "repeated":
			protoType = ProtoFieldType.REPEATED
			break
	}
	const others = str.substring(exec[0].length)
	let typeStr = exec[2],
		type: ProtoType,
		enumMapping: Nullable<Map<string, number>>,
		protoDesc: Nullable<ProtoDescription>
	switch (typeStr) {
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
			if (typeStr.startsWith(".")) typeStr = typeStr.substring(1)
			const messageType = ProtoCache.get(typeStr)
			if (messageType === undefined)
				throw `Invalid protobuf description type: ${typeStr}`
			if (messageType[0] === ProtoType.TYPE_MESSAGE) {
				type = ProtoType.TYPE_MESSAGE
				protoDesc = messageType[1] as ProtoDescription
			} else if (messageType[0] === ProtoType.TYPE_ENUM) {
				type = ProtoType.TYPE_ENUM
				enumMapping = messageType[1] as Map<string, number>
			} else throw `Unknown ProtoType for ProtoCache entry ${typeStr}`
		}
	}
	let defaultValue: Nullable<bigint | number | boolean>
	if (protoType === ProtoFieldType.REPEATED) {
		const packed = /\s*\[packed\s*=\s*([^\s]+)\]/.exec(others)
		if (packed !== null && packed[1] !== "false")
			protoType = ProtoFieldType.PACKED
	} else {
		const defaultRegex = /\s*\[default\s*=\s*([^\s]+)\]/.exec(others)
		if (defaultRegex !== null) {
			switch (type) {
				case ProtoType.TYPE_INT32:
				case ProtoType.TYPE_UINT32:
				case ProtoType.TYPE_FIXED32:
				case ProtoType.TYPE_SFIXED32:
				case ProtoType.TYPE_SINT32:
					defaultValue = parseInt(defaultRegex[1])
					break
				case ProtoType.TYPE_INT64:
				case ProtoType.TYPE_UINT64:
				case ProtoType.TYPE_FIXED64:
				case ProtoType.TYPE_SFIXED64:
				case ProtoType.TYPE_SINT64:
					defaultValue = BigInt(defaultRegex[1])
					break
				case ProtoType.TYPE_FLOAT:
				case ProtoType.TYPE_DOUBLE:
					defaultValue = parseFloat(defaultRegex[1])
					break
				case ProtoType.TYPE_BOOL:
					defaultValue = defaultRegex[1] !== "false"
					break
				case ProtoType.TYPE_ENUM:
					defaultValue = enumMapping?.get(defaultRegex[1])
					break
			}
		}
	}
	return [
		parseInt(exec[4]),
		{
			name: exec[3],
			type,
			defaultValue,
			protoType,
			protoDesc,
		},
	]
}

export function ParseProtobufDesc(str: string): void {
	const currentName: string[] = []
	let currentMap: Nullable<ProtoDescription | Map<string, number>>,
		currentIsEnum = false
	str
		.replace(/\r/g, "")
		.split("\n")
		.forEach((line, i) => {
			line = line.trim()

			if (/^(optional|required|repeated)\s+/.test(line)) {
				if (currentMap === undefined)
					throw `Unexpected field declaration at line ${i}`
				if (currentIsEnum)
					throw `Unexpected field declaration at line ${i} (declaration inside enum ${currentName.join(
						"."
					)})`
				const [fieldNumber, fieldDesc] = ParseProtobufDescLine(line),
					fixedMap = currentMap as ProtoDescription
				fixedMap.set(fieldNumber, fieldDesc)
			} else if (line.startsWith("message ")) {
				if (currentMap !== undefined && currentIsEnum)
					throw `Unexpected message declaration at line ${i} (declaration inside enum)`

				const match = /^message ([^\s]+) {$/.exec(line)
				if (match === null) throw `Invalid message declaration at line ${i}`

				currentName.push(match[1])
				currentIsEnum = false
				currentMap = new Map()
				ProtoCache.set(currentName.join("."), [
					ProtoType.TYPE_MESSAGE,
					currentMap,
				])
			} else if (line.startsWith("enum ")) {
				if (currentMap !== undefined && currentIsEnum)
					throw `Unexpected enum declaration at line ${i} (declaration inside enum)`

				const match = /^enum ([^\s]+) {$/.exec(line)
				if (match === null) throw `Invalid enum declaration at line ${i}`

				currentName.push(match[1])
				currentIsEnum = true
				currentMap = new Map()
				ProtoCache.set(currentName.join("."), [ProtoType.TYPE_ENUM, currentMap])
			} else if (line === "}") {
				if (currentName.length === 0)
					throw `Unexpected closing brace at line ${i}`
				currentName.splice(currentName.length - 1) // removes last element in array
				if (currentName.length !== 0) {
					const found = ProtoCache.get(currentName.join("."))
					if (found !== undefined) {
						currentIsEnum = found[0] === ProtoType.TYPE_ENUM
						currentMap = found[1]
					} else currentMap = undefined
				} else currentMap = undefined
			} else if (
				currentMap !== undefined &&
				currentIsEnum &&
				!line.startsWith("option ") &&
				!line.startsWith("syntax ")
			) {
				const match = /^([^\s]+)\s*=\s*([^\s]+)/.exec(line)
				if (match === null) return
				const fixedMap = currentMap as Map<string, number>
				fixedMap.set(match[1], parseInt(match[2]))
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
	if (vec === undefined) return new Vector3()
	return new Vector3(
		(vec.get("x") as number) ?? 0,
		(vec.get("y") as number) ?? 0,
		(vec.get("z") as number) ?? 0
	)
}

export function CMsgVector2DToVector2(
	vec: Nullable<RecursiveProtobuf>
): Vector2 {
	if (vec === undefined) return new Vector2()
	return new Vector2(
		(vec.get("x") as number) ?? 0,
		(vec.get("y") as number) ?? 0
	)
}

export function NumberToColor(num: Nullable<number>): Color {
	if (num === undefined) return new Color()
	return new Color(
		(num >> 24) & 0xff,
		(num >> 16) & 0xff,
		(num >> 8) & 0xff,
		num & 0xff
	)
}

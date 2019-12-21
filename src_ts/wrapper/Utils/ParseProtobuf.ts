import Stream from "./Stream"

export enum ProtoType {
	BOOL,
	SIGNED32,
	ENUM = SIGNED32,
	UNSIGNED32,
	SIGNED64,
	UNSIGNED64,
	FLOAT32,
	FLOAT64,
	STRING,
	PROTO,
}

export type RecursiveProtobuf = Map<string, RecursiveProtobuf | string | number | bigint | boolean>
export type ProtoDescription = Map<number, [/* name */ string, /* type */ ProtoType, /* proto description */ ProtoDescription?]>
let convert_buf = new ArrayBuffer(8)
let convert_uint32 = new Uint32Array(convert_buf)
let convert_int64 = new BigInt64Array(convert_buf)
let convert_uint64 = new BigUint64Array(convert_buf)
let convert_float32 = new Float32Array(convert_buf)
let convert_float64 = new Float64Array(convert_buf)
export function ParseProtobuf(proto_str: string, proto_desc: ProtoDescription): RecursiveProtobuf {
	let map: RecursiveProtobuf = new Map()
	let stream = new Stream(proto_str)
	while (!stream.Empty()) {
		let tag = stream.ReadVarUint()
		let field_num = Number(tag >> 3n)
		let wire_type = Number(tag & 0x7n) // least 3 bits
		let value: string | bigint
		switch (wire_type) {
			case 0: // Varint: int32, int64, uint32, uint64, sint32, sint64, bool, enum
				value = stream.ReadVarUint()
				break
			case 1: // 64-bit: fixed64, sfixed64, double
				value = stream.ReadNumber(8)
				break
			case 2: // Length-delimited: string, bytes, embedded messages, packed repeated fields
				value = stream.ReadString(Number(stream.ReadVarUint()))
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
			case ProtoType.BOOL:
				if (typeof value === "string")
					throw "Invalid proto [1]"
				map.set(field_name, value !== 0n)
				break
			case ProtoType.SIGNED32: case ProtoType.SIGNED64: {
				if (typeof value === "string")
					throw "Invalid proto [2]"
				convert_uint64[0] = value
				map.set(field_name, Number(convert_int64[0]))
				break
			}
			case ProtoType.UNSIGNED32:
				if (typeof value === "string" || value > 0xFFFFFFFFn)
					throw "Invalid proto [4]"
				map.set(field_name, Number(value))
				break
			case ProtoType.UNSIGNED64:
				if (typeof value === "string")
					throw "Invalid proto [5]"
				map.set(field_name, value)
				break
			case ProtoType.FLOAT32:
				if (typeof value === "string" || value > 0xFFFFFFFFn)
					throw "Invalid proto [6]"
				convert_uint32[0] = Number(value)
				map.set(field_name, convert_float32[0])
				break
			case ProtoType.FLOAT64:
				if (typeof value === "string")
					throw "Invalid proto [7]"
				convert_int64[0] = value
				map.set(field_name, convert_float64[0])
				break
			case ProtoType.PROTO: {
				if (typeof value !== "string")
					throw "Invalid proto [8]"
				let proto_desc2 = field_data[2]
				if (proto_desc2 === undefined)
					throw "Invalid proto description (no proto specified for ProtoType.PROTO)"
				map.set(field_name, ParseProtobuf(value, proto_desc2))
				break
			}
			case ProtoType.STRING:
				if (typeof value !== "string")
					throw "Invalid proto [9]"
				map.set(field_name, value)
				break
		}
	}
	return map
}

export function ParseProtobufDescLine(str: string): [/* field number */ number, [/* name */ string, /* type */ ProtoType]] {
	let exec = /^\s*\w+ (\w+) (\w+) = (\d+)/.exec(str)
	if (exec === null)
		throw "Invalid protobuf description line: " + str
	let type_str = exec[1]
	let type: ProtoType
	switch (type_str) {
		case "fixed32": case "uint32":
			type = ProtoType.UNSIGNED32
			break
		case "fixed64": case "uint64":
			type = ProtoType.UNSIGNED64
			break
		case "sfixed32": case "int32": case "sint32":
			type = ProtoType.SIGNED32
			break
		case "sfixed64": case "int64": case "sint64":
			type = ProtoType.SIGNED64
			break
		case "bool":
			type = ProtoType.BOOL
			break
		case "bytes": case "string":
			type = ProtoType.STRING
			break
		case "float":
			type = ProtoType.FLOAT32
			break
		case "double":
			type = ProtoType.FLOAT64
			break
		default:
			throw "Invalid protobuf description type: " + type_str
	}
	return [parseInt(exec[3]), [exec[2], type]]
}

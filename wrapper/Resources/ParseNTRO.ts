import { StringToUTF8 } from "../Utils/ArrayBufferUtils"
import { ViewBinaryStream } from "../Utils/ViewBinaryStream"
import { parseTextKV } from "./ParseTextKV"

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

	public Parse(stream: ReadableBinaryStream): ResourceIntrospectionManifest {
		this.IntrospectionVersion = stream.ReadUint32()

		const structs_offset = stream.pos + stream.ReadUint32(),
			structs_count = stream.ReadUint32(),
			enums_offset = stream.pos + stream.ReadUint32(),
			enums_count = stream.ReadUint32()

		stream.pos = structs_offset
		for (let i = 0; i < structs_count; i++) {
			const disk_struct = new ResourceDiskStruct()
			disk_struct.IntrospectionVersion = stream.ReadUint32()
			disk_struct.ID = stream.ReadUint32()
			disk_struct.Name = stream.ReadOffsetString()
			disk_struct.DiskCRC = stream.ReadUint32()
			disk_struct.UserVersion = stream.ReadInt32()
			disk_struct.DiskSize = stream.ReadUint16()
			disk_struct.Alignment = stream.ReadUint16()
			disk_struct.BaseStructID = stream.ReadUint32()

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
				stream.RelativeSeek(2) // unknown

				disk_struct.FieldIntrospection.push(field)
			}
			stream.pos = prev
			disk_struct.StructFlags = stream.ReadUint8()
			stream.RelativeSeek(3) // unknown
			this.ReferencedStructs.push(disk_struct)
		}

		stream.pos = enums_offset
		for (let i = 0; i < enums_count; i++) {
			const disk_enum = new ResourceDiskEnum()
			disk_enum.IntrospectionVersion = stream.ReadUint32()
			disk_enum.ID = stream.ReadUint32()
			disk_enum.Name = stream.ReadOffsetString()
			disk_enum.DiskCRC = stream.ReadUint32()
			disk_enum.UserVersion = stream.ReadInt32()

			const fields_offset = stream.ReadUint32(),
				fields_size = stream.ReadUint32()
			const prev = stream.pos
			stream.pos += fields_offset - 8 // offset from fields_offset
			for (let j = 0; j < fields_size; j++)
				disk_enum.EnumValueIntrospection.set(stream.ReadOffsetString(), stream.ReadInt32())
			stream.pos = prev
			this.ReferencedEnums.push(disk_enum)
		}

		return this
	}
}

function ReadFloatArray(stream: ReadableBinaryStream, len: number): number[] {
	const res: number[] = []
	for (let i = 0; i < len; i++)
		res.push(stream.ReadFloat32())
	return res
}
function ReadField(
	resourceIntrospectionManifest: ResourceIntrospectionManifest,
	stream: ReadableBinaryStream,
	field: ResourceDiskStruct_Field,
	external_refs: Map<bigint, string>,
): RecursiveMapValue {
	switch (field.Type) {
		case DataType.Struct:
			return ReadStructureNTRO(
				resourceIntrospectionManifest,
				stream,
				resourceIntrospectionManifest.ReferencedStructs.find(x => field.TypeData === x.ID)!,
				external_refs,
				stream.pos,
			)
		case DataType.Enum:
			// TODO: Lookup in ReferencedEnums
			return stream.ReadUint32()
		case DataType.SByte:
			return stream.ReadInt8()
		case DataType.Byte:
			return stream.ReadUint8()
		case DataType.Boolean:
			return stream.ReadBoolean()
		case DataType.Int16:
			return stream.ReadInt16()
		case DataType.UInt16:
			return stream.ReadUint16()
		case DataType.Int32:
			return stream.ReadInt32()
		case DataType.UInt32:
			return stream.ReadUint32()
		case DataType.Float:
			return stream.ReadFloat32()
		case DataType.Int64:
			return stream.ReadInt64()
		case DataType.UInt64:
			return stream.ReadUint64()
		case DataType.ExternalReference:
			return external_refs.get(stream.ReadUint64()) ?? ""
		case DataType.Vector:
			return ReadFloatArray(stream, 3)
		case DataType.Quaternion:
		case DataType.Color:
		case DataType.Fltx4:
		case DataType.Vector4D:
		case DataType.Vector4D_44:
			return ReadFloatArray(stream, 4)
		case DataType.String4:
		case DataType.String:
			return stream.ReadOffsetString()
		case DataType.CTransform:
		case DataType.Matrix2x4:
			return ReadFloatArray(stream, 8)
		case DataType.Matrix3x4:
		case DataType.Matrix3x4a:
			return ReadFloatArray(stream, 12)
		default:
			throw `Unknown data type at field ${field.FieldName}: ${field.Type}`
	}
}

function ReadFieldIntrospection(
	resourceIntrospectionManifest: ResourceIntrospectionManifest,
	stream: ReadableBinaryStream,
	parent: RecursiveMap,
	field: ResourceDiskStruct_Field,
	external_refs: Map<bigint, string>,
): void {
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
		const ar: RecursiveMapValue[] = []
		for (let i = 0; i < count; i++)
			ar[i] = ReadField(resourceIntrospectionManifest, stream, field, external_refs)
		parent.set(field.FieldName, ar)
	} else
		for (let i = 0; i < count; i++)
			parent.set(field.FieldName, ReadField(resourceIntrospectionManifest, stream, field, external_refs))

	if (prev !== 0)
		stream.pos = prev
}

function ReadStructureNTRO(
	resourceIntrospectionManifest: ResourceIntrospectionManifest,
	stream: ReadableBinaryStream,
	struct: ResourceDiskStruct,
	external_refs: Map<bigint, string>,
	startingOffset = 0,
	map: RecursiveMap = new Map(),
): RecursiveMap {
	struct.FieldIntrospection.forEach(field => {
		stream.pos = startingOffset + field.OnDiskOffset
		ReadFieldIntrospection(resourceIntrospectionManifest, stream, map, field, external_refs)
	})

	// Some structs are padded, so all the field sizes do not add up to the size on disk
	stream.pos = startingOffset + struct.DiskSize

	if (struct.BaseStructID !== 0) {
		const prev = stream.pos
		ReadStructureNTRO(
			resourceIntrospectionManifest,
			stream,
			resourceIntrospectionManifest.ReferencedStructs.find(struct_ => struct.BaseStructID === struct_.ID)!,
			external_refs,
			startingOffset,
			map,
		)
		stream.pos = prev
	}

	return map
}
function FixupSoundEventScript(map: RecursiveMap): RecursiveMap {
	const fixed_map: RecursiveMap = new Map(),
		m_SoundEvents = map.get("m_SoundEvents")
	if (!(m_SoundEvents instanceof Map) && !Array.isArray(m_SoundEvents))
		return fixed_map
	m_SoundEvents.forEach(entry => {
		if (!(entry instanceof Map))
			return
		const name = entry.get("m_SoundName"),
			value = entry.get("m_OperatorsKV")
		if (typeof name === "string" && typeof value === "string")
			fixed_map.set(name, parseTextKV(new ViewBinaryStream(
				new DataView(StringToUTF8(value.replace(/\r\n/g, "\n")).buffer),
				0,
				true,
			)))
	})
	return fixed_map
}

export function ParseNTRO(
	DATA: ReadableBinaryStream,
	NTRO: ReadableBinaryStream,
	external_refs: Map<bigint, string>,
): Nullable<RecursiveMap> {
	const manifest = new ResourceIntrospectionManifest().Parse(NTRO)
	if (manifest.ReferencedStructs.length === 0)
		return undefined
	const map = ReadStructureNTRO(
		manifest,
		DATA,
		manifest.ReferencedStructs[0],
		external_refs,
	)
	switch (manifest.ReferencedStructs[0].Name) {
		case "VSoundEventScript_t":
			return FixupSoundEventScript(map)
		case "CWorldVisibility": // TODO
		default:
			return map
	}
}

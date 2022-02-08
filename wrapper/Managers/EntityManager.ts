import Vector2 from "../Base/Vector2"
import Vector3 from "../Base/Vector3"
import Vector4 from "../Base/Vector4"
import { EPropertyType, PropertyType } from "../Enums/PropertyType"
import Entity from "../Objects/Base/Entity"
import GetConstructorByName, { ClassToEntities, FieldHandler, FieldHandlers, SDKClasses } from "../Objects/NativeToSDK"
import * as ArrayExtensions from "../Utils/ArrayExtensions"
import BinaryStream from "../Utils/BinaryStream"
import GameState from "../Utils/GameState"
import { ParseProtobufDesc, ParseProtobufNamed } from "../Utils/Protobuf"
import { MapToObject } from "../Utils/Utils"
import Events from "./Events"
import EventsSDK from "./EventsSDK"
import * as StringTables from "./StringTables"

const AllEntities: Entity[] = []
const AllEntitiesAsMap = new Map<number, Entity>()

// that's MUCH more efficient than Map<number, boolean>
class bitset {
	private ar: Uint32Array
	constructor(size: number) { this.ar = new Uint32Array(Math.ceil(size / 4 / 8)).fill(0) }

	public reset() { this.ar = this.ar.fill(0) }

	public get(pos: number): boolean {
		// uint32 = 4 bytes, 1 byte = 8 bits
		return (this.ar[(pos / (4 * 8)) | 0] & (1 << (pos % (4 * 8)))) !== 0
	}
	public set(pos: number, new_val: boolean): void {
		const ar_pos = (pos / (4 * 8)) | 0
		const mask = 1 << (pos % (4 * 8))
		if (!new_val)
			this.ar[ar_pos] &= ~mask
		else
			this.ar[ar_pos] |= mask
	}
	public set_buf(buf: ArrayBuffer): void {
		new Uint8Array(this.ar.buffer).set(new Uint8Array(buf))
	}
}

export type EntityPropertyType = EntityPropertiesNode | EntityPropertyType[] | string | Vector4 | Vector3 | Vector2 | bigint | number | boolean
const TreeActiveMask = new bitset(0x4000)
class CEntityManager {
	public readonly INDEX_BITS = 14
	public readonly INDEX_MASK = (1 << this.INDEX_BITS) - 1
	public readonly SERIAL_BITS = 17
	public readonly SERIAL_MASK = (1 << this.SERIAL_BITS) - 1
	public get AllEntities(): Entity[] {
		return AllEntities
	}
	public EntityByIndex(handle: Nullable<number>): Nullable<Entity> {
		if (handle === 0 || handle === undefined)
			return undefined
		const index = handle & this.INDEX_MASK,
			serial = (handle >> this.INDEX_BITS) & this.SERIAL_MASK
		const ent = AllEntitiesAsMap.get(index)
		return ent?.SerialMatches(serial)
			? ent
			: undefined
	}

	public GetEntitiesByClass<T>(class_: Constructor<T>): T[] {
		const ar = ClassToEntities.get(class_)
		if (ar === undefined)
			throw "Invalid entity class"
		return ar as []
	}
	public IsTreeActive(binary_id: number): boolean {
		return TreeActiveMask.get(binary_id)
	}
	public SetWorldTreeState(WorldTreeState: bigint[]): void {
		TreeActiveMask.set_buf(new BigUint64Array(WorldTreeState).buffer)
	}
}

const EntityManager = new CEntityManager()
export default EntityManager

function ClassFromNative(
	id: number,
	serial: number,
	constructor_name: string,
	ent_name: Nullable<string>,
): Entity {
	let constructor = GetConstructorByName(constructor_name, ent_name)
	if (constructor === undefined) {
		console.error(`Can't find constructor for entity class ${constructor_name}, Entity#Name === ${ent_name}`)
		constructor = Entity
	}

	return new constructor(id, serial, ent_name)
}

export function CreateEntityInternal(ent: Entity): void {
	AllEntitiesAsMap.set(ent.Index, ent)
	AllEntities.push(ent)
	for (const [class_, class_entities] of SDKClasses)
		if (ent instanceof class_)
			class_entities.push(ent)
}

async function CreateEntity(
	id: number,
	serial: number,
	class_name: string,
	entity_name: Nullable<string>,
): Promise<Entity> {
	const entity = ClassFromNative(id, serial, class_name, entity_name)
	entity.FieldHandlers_ = cached_field_handlers.get(entity.constructor as Constructor<Entity>)
	await entity.AsyncCreate()
	entity.ClassName = class_name
	CreateEntityInternal(entity)
	return entity
}

export async function DeleteEntity(id: number): Promise<void> {
	const entity = AllEntitiesAsMap.get(id)
	if (entity === undefined)
		return

	entity.IsValid = false
	entity.BecameDormantTime = GameState.RawGameTime
	ArrayExtensions.arrayRemove(AllEntities, entity)

	await EventsSDK.emit("EntityDestroyed", false, entity)
	entity.IsVisible = false
	AllEntitiesAsMap.delete(id)
	for (const [class_, class_entities] of SDKClasses)
		if (entity instanceof class_)
			ArrayExtensions.arrayRemove(class_entities, entity)
}

const enum EntityPVS {
	LEAVE,
	DELETE,
	CREATE,
	UPDATE,
}

const convert_buf = new ArrayBuffer(8)
const convert_uint8 = new Uint8Array(convert_buf),
	convert_int8 = new Int8Array(convert_buf),
	convert_uint16 = new Uint16Array(convert_buf),
	convert_int16 = new Int16Array(convert_buf),
	convert_uint32 = new Uint32Array(convert_buf),
	convert_int32 = new Int32Array(convert_buf),
	convert_int64 = new BigInt64Array(convert_buf),
	convert_uint64 = new BigUint64Array(convert_buf)
function ParseProperty(stream: BinaryStream): PropertyType {
	const var_type: EPropertyType = stream.ReadUint8()
	switch (var_type) {
		case EPropertyType.INT8:
			convert_uint64[0] = stream.ReadUint64()
			return convert_int8[0]
		case EPropertyType.INT16:
			convert_uint64[0] = stream.ReadUint64()
			return convert_int16[0]
		case EPropertyType.INT32:
			convert_uint64[0] = stream.ReadUint64()
			return convert_int32[0]
		case EPropertyType.INT64:
			convert_uint64[0] = stream.ReadUint64()
			return convert_int64[0]
		case EPropertyType.UINT8:
			convert_uint64[0] = stream.ReadUint64()
			return convert_uint8[0]
		case EPropertyType.UINT16:
			convert_uint64[0] = stream.ReadUint64()
			return convert_uint16[0]
		case EPropertyType.UINT32:
			convert_uint64[0] = stream.ReadUint64()
			return convert_uint32[0]
		case EPropertyType.UINT64:
			return stream.ReadUint64()
		case EPropertyType.BOOL:
			return stream.ReadBoolean()
		case EPropertyType.FLOAT:
			return stream.ReadFloat32()
		case EPropertyType.VECTOR2:
			return new Vector2(stream.ReadFloat32(), stream.ReadFloat32())
		case EPropertyType.VECTOR3:
			return new Vector3(stream.ReadFloat32(), stream.ReadFloat32(), stream.ReadFloat32())
		case EPropertyType.QUATERNION:
			return new Vector4(stream.ReadFloat32(), stream.ReadFloat32(), stream.ReadFloat32(), stream.ReadFloat32())
		case EPropertyType.STRING:
			return stream.ReadUtf8String(stream.ReadVarUintAsNumber())
		default:
			throw `Unknown PropertyType: ${var_type}`
	}
}

const DEBUG_PARSING = false
function DumpStreamPosition(
	ent_class: string,
	stream: BinaryStream,
	path_size_walked: number,
): string {
	stream.RelativeSeek((path_size_walked + 1) * -2) // uint16 = 2 bytes
	let ret = ent_class
	for (let i = 0; i < path_size_walked + 1; i++) {
		let id = stream.ReadUint16()
		const must_be_array = id & 1
		id >>= 1
		if (!must_be_array)
			ret += `.${entities_symbols[id]}`
		else
			ret += `[${id}]`
	}
	return ret
}

let entities_symbols: string[] = []
type StringEntityPropertyType = Map<string, StringEntityPropertyType> | StringEntityPropertyType[] | string | Vector4 | Vector3 | Vector2 | bigint | number | boolean
function ConvertToStringedMap(prop: EntityPropertyType): StringEntityPropertyType {
	if (Array.isArray(prop))
		return prop.map(el => ConvertToStringedMap(el))
	if (prop instanceof EntityPropertiesNode) {
		const stringed_map = new Map<string, StringEntityPropertyType>()
		prop.map.forEach((v, k) => stringed_map.set(entities_symbols[k], ConvertToStringedMap(v)))
		return stringed_map
	}
	return prop
}
export class EntityPropertiesNode {
	private static entities_symbols_cached = new Map<string, number>()
	public map = new Map<number, EntityPropertyType>()
	public get(name: string): Nullable<EntityPropertyType> {
		let cached_id = EntityPropertiesNode.entities_symbols_cached.get(name)
		if (cached_id === undefined) {
			cached_id = entities_symbols.indexOf(name)
			EntityPropertiesNode.entities_symbols_cached.set(name, cached_id)
		}
		if (cached_id === -1)
			return undefined
		return this.map.get(cached_id)
	}
	public set(id: number, prop: EntityPropertyType): void {
		this.map.set(id, prop)
	}
	public has(id: number): boolean {
		return this.map.has(id)
	}
	// Use for debug purposes only.
	public ConvertToStringedMap(): Map<string, StringEntityPropertyType> {
		return ConvertToStringedMap(this) as Map<string, StringEntityPropertyType>
	}
}

const cached_field_handlers = new Map<Constructor<Entity>, Map<number, FieldHandler>>()
async function ParseEntityUpdate(
	stream: BinaryStream,
	ent_id: number,
	created_entities: Entity[],
	is_create = false,
): Promise<void> {
	const ent_serial = is_create ? stream.ReadUint32() : 0
	const m_nameStringableIndex = is_create ? stream.ReadInt32() : -1
	const ent_class = entities_symbols[stream.ReadUint16()]
	let ent_was_created = false
	let ent = AllEntitiesAsMap.get(ent_id)
	if (ent === undefined && is_create) {
		ent = await CreateEntity(
			ent_id,
			ent_serial,
			ent_class,
			StringTables.GetString("EntityNames", m_nameStringableIndex),
		)
		ent_was_created = true
	}
	if (ent !== undefined) {
		ent.IsVisible = true
		if (ent_was_created)
			ent.IsValid = false
	}
	const ent_handlers = ent?.FieldHandlers_,
		ent_node = ent?.Properties_ ?? new EntityPropertiesNode(),
		changed_paths: number[] = [],
		changed_paths_results: EntityPropertyType[] = []
	while (true) {
		const path_size = stream.ReadUint8()
		if (path_size === 0)
			break

		let prop_node: EntityPropertyType = ent_node
		for (let i = 0; i < path_size; i++) {
			let id = stream.ReadUint16()
			const must_be_array = id & 1
			id >>= 1
			if (DEBUG_PARSING) {
				if (must_be_array && !Array.isArray(prop_node))
					throw `Expected array at ${DumpStreamPosition(ent_class, stream, i)}`
				if (!must_be_array && (typeof prop_node !== "object" || prop_node.constructor !== EntityPropertiesNode))
					throw `Expected map at ${DumpStreamPosition(ent_class, stream, i)}`
			}

			if (must_be_array) {
				const ar = prop_node as EntityPropertyType[]
				if (i !== path_size - 1) {
					if (ar[id] === undefined) {
						const next_must_be_array = stream.ReadUint16() & 1
						stream.RelativeSeek(-2) // uint16 = 2 bytes
						ar[id] = next_must_be_array ? [] : new EntityPropertiesNode()
					}
					prop_node = ar[id]
				} else
					ar[id] = ParseProperty(stream)
			} else {
				const map = prop_node as EntityPropertiesNode
				let res: EntityPropertyType
				if (i !== path_size - 1) {
					if (!map.has(id)) {
						const next_must_be_array = stream.ReadUint16() & 1
						stream.RelativeSeek(-2) // uint16 = 2 bytes
						map.set(id, next_must_be_array ? [] : new EntityPropertiesNode())
					}
					prop_node = res = map.map.get(id)!
				} else {
					const prop = res = ParseProperty(stream)
					map.set(id, prop)
				}
				if (ent !== undefined && ent_handlers !== undefined) {
					const changed_path_id = changed_paths.indexOf(id)
					if (changed_path_id === -1) {
						if (ent_handlers.has(id)) {
							changed_paths.push(id)
							changed_paths_results.push(res)
						}
					} else
						changed_paths_results[changed_path_id] = res
				}
			}
		}
	}
	for (let i = 0, end = changed_paths.length; i < end; i++)
		await ent_handlers!.get(changed_paths[i])!(ent!, changed_paths_results[i])
	if (ent !== undefined && ent_was_created) {
		ent.IsValid = true
		await EventsSDK.emit("PreEntityCreated", false, ent)
		created_entities.push(ent)
	}
}

function FixType(symbols: string[], field: any): string {
	{
		const field_serializer_name_sym = field.field_serializer_name_sym
		if (field_serializer_name_sym !== undefined)
			return symbols[field_serializer_name_sym] + (field.field_serializer_version !== 0 ? field.field_serializer_version : "")
	}
	let type = symbols[field.var_type_sym]
	// types
	type = type.replace(/\<\s/g, "<")
	type = type.replace(/\s\>/g, ">")
	type = type.replace(/CNetworkedQuantizedFloat/g, "float")
	type = type.replace(/CUtlVector\<(.*)\>/g, "$1[]")
	type = type.replace(/CNetworkUtlVectorBase\<(.*)\>/g, "$1[]")
	type = type.replace(/CHandle\<(.*)\>/g, "CEntityIndex<$1>")
	type = type.replace(/CStrongHandle\<(.*)\>/g, "CStrongHandle<$1>")
	type = type.replace(/Vector2D/g, "Vector2")
	type = type.replace(/Vector4D|Quaternion/g, "Vector4")
	type = type.replace(/Vector$/g, "Vector3")
	type = type.replace(/Vector([^\d])/g, "Vector3$1")

	// fix arrays
	type = type.replace(/\[\d+\]/g, "[]")

	// primitives
	type = type.replace(/bool/g, "boolean")
	type = type.replace(/double/g, "number")
	type = type.replace(/uint64/g, "bigint")
	type = type.replace(/int64/g, "bigint")
	type = type.replace(/float(32|64)?/g, "number")
	type = type.replace(/u?int(\d+)/g, "number")
	type = type.replace(/CUtlStringToken/g, "CStringToken")
	type = type.replace(/CUtlString|CUtlSymbolLarge|char(\*|\[\])/g, "string")
	type = type.replace(/CStringToken/g, "CUtlStringToken")

	// omit pointers
	type = type.replace(/\*/g, "")

	return type
}

let LatestTickDelta = 0
export function SetLatestTickDelta(delta: number): void {
	LatestTickDelta = delta
}

ParseProtobufDesc(`
message ProtoFlattenedSerializerField_t {
	optional int32 var_type_sym = 1;
	optional int32 var_name_sym = 2;
	optional int32 bit_count = 3;
	optional float low_value = 4;
	optional float high_value = 5;
	optional int32 encode_flags = 6;
	optional int32 field_serializer_name_sym = 7;
	optional int32 field_serializer_version = 8;
	optional int32 send_node_sym = 9;
	optional int32 var_encoder_sym = 10;
}

message ProtoFlattenedSerializer_t {
	optional int32 serializer_name_sym = 1;
	optional int32 serializer_version = 2;
	repeated int32 fields_index = 3;
}

message CSVCMsg_FlattenedSerializer {
	repeated .ProtoFlattenedSerializer_t serializers = 1;
	repeated string symbols = 2;
	repeated .ProtoFlattenedSerializerField_t fields = 3;
}
`)
let latest_entity_packet_promise = Promise.resolve()
async function ParseEntityPacket(buf: Uint8Array): Promise<void> {
	await EventsSDK.emit("PreDataUpdate", false)
	LatestTickDelta = 0
	const stream = new BinaryStream(new DataView(buf.buffer, buf.byteOffset, buf.byteLength))
	const native_changes: number[][] = []
	while (!stream.Empty()) {
		const ent_id = stream.ReadUint16()
		if (ent_id === 0)
			break
		native_changes.push([
			ent_id,
			stream.ReadFloat32(), // m_fAttackRange
			stream.ReadFloat32(), // m_fAttackSpeed
			stream.ReadFloat32(), // m_fIncreasedAttackSpeed
			stream.ReadFloat32(), // m_fAttacksPerSecond
			stream.ReadFloat32(), // m_fIdealSpeed
			stream.ReadFloat32(), // m_flBaseAttackTime
			stream.ReadInt32(), // m_iHealthBarOffset
			stream.ReadUint32(), // m_iMoveCapabilities
			stream.ReadFloat32(), // m_flMagicalResistanceValueReal
			stream.ReadFloat32(), // m_flBonusPhysicalArmor
		])
	}
	const created_entities: Entity[] = []
	while (!stream.Empty()) {
		const ent_id = stream.ReadUint16()
		const pvs: EntityPVS = stream.ReadUint8()
		switch (pvs) {
			case EntityPVS.DELETE:
				await DeleteEntity(ent_id)
				break
			case EntityPVS.LEAVE: {
				const ent = EntityManager.EntityByIndex(ent_id)
				if (ent !== undefined) {
					ent.BecameDormantTime = GameState.RawGameTime
					ent.IsVisible = false
				}
				break
			}
			case EntityPVS.CREATE:
				await ParseEntityUpdate(stream, ent_id, created_entities, true)
				break
			case EntityPVS.UPDATE:
				await ParseEntityUpdate(stream, ent_id, created_entities)
				break
		}
	}
	for (const [
		ent_id,
		m_fAttackRange,
		m_fAttackSpeed,
		m_fIncreasedAttackSpeed,
		m_fAttacksPerSecond,
		m_fIdealSpeed,
		m_flBaseAttackTime,
		m_iHealthBarOffset,
		m_iMoveCapabilities,
		m_flMagicalResistanceValueReal,
		m_flBonusPhysicalArmor,
	] of native_changes) {
		const ent = EntityManager.EntityByIndex(ent_id)
		if (ent !== undefined)
			ent.ForwardNativeProperties(
				m_fAttackRange,
				m_fAttackSpeed,
				m_fIncreasedAttackSpeed,
				m_fAttacksPerSecond,
				m_fIdealSpeed,
				m_flBaseAttackTime,
				m_iHealthBarOffset,
				m_iMoveCapabilities,
				m_flMagicalResistanceValueReal,
				m_flBonusPhysicalArmor,
			)
	}
	await EventsSDK.emit("MidDataUpdate", false)
	for (const ent of created_entities)
		await EventsSDK.emit("EntityCreated", false, ent)
	await EventsSDK.emit("PostDataUpdate", false)
	if (LatestTickDelta !== 0)
		await EventsSDK.emit("Tick", false, LatestTickDelta)
}
async function ParseEntityPacketWrapper(buf: Uint8Array): Promise<void> {
	try {
		await latest_entity_packet_promise
	} catch (e) {
		console.error(e)
	}
	latest_entity_packet_promise = ParseEntityPacket(buf)
	try {
		await latest_entity_packet_promise
	} catch (e) {
		console.error(e)
	}
}
Events.on("ServerMessage", async (msg_id, buf_) => {
	const buf = new Uint8Array(buf_)
	switch (msg_id) {
		case 41: {
			const msg = ParseProtobufNamed(buf, "CSVCMsg_FlattenedSerializer")
			if ((globalThis as any).dump_d_ts) {
				const obj = MapToObject(msg)
				const list = Object.values(obj.serializers).map((ser: any) => [
					obj.symbols[ser.serializer_name_sym] + (ser.serializer_version !== 0 ? ser.serializer_version : ""),
					Object.values(ser.fields_index).map((field_id: any) => {
						const field = obj.fields[field_id]
						return [
							FixType(obj.symbols as string[], field),
							obj.symbols[field.var_name_sym],
						]
					}),
				])
				console.log("dump_CSVCMsg_FlattenedSerializer.d.ts", `\
import { Vector2, Vector3, QAngle, Vector4 } from "wrapper/Imports"

type Color = number // 0xAABBGGRR?
type HSequence = number
type item_definition_index_t = number
type itemid_t = number
type style_index_t = number

${list.map(([name, fields]) => `\
declare class ${name} {
	${(fields as [string, string][]).map(([type, f_name]) => `${f_name}: ${type}`).join("\n\t")}
}`).join("\n\n")}
`)
			}
			entities_symbols = msg.get("symbols") as string[]
			for (const [construct, map] of FieldHandlers) {
				const map2 = new Map<number, FieldHandler>()
				for (const [field_name, field_handler] of map) {
					const id = entities_symbols.indexOf(field_name)
					if (id === -1) {
						console.log(`[WARNING] Index of "${field_name}" not found in CSVCMsg_FlattenedSerializer.`)
						continue
					}
					map2.set(id, field_handler)
				}
				cached_field_handlers.set(construct, map2)
			}
			break
		}
		case 55: // we have custom parsing for CSVCMsg_PacketEntities
			await ParseEntityPacketWrapper(buf)
			break
	}
})

Events.on("NewConnection", async () => {
	for (const ent_id of AllEntitiesAsMap.keys())
		await DeleteEntity(ent_id)
	TreeActiveMask.reset()
})

import * as ArrayExtensions from "../Utils/ArrayExtensions"

import Events from "./Events"

import Entity from "../Objects/Base/Entity"

import GetConstructorByName, { GetSDKClasses, GetFieldHandlers, FieldHandler } from "../Objects/NativeToSDK"

import EventsSDK from "./EventsSDK"
import BinaryStream from "../Utils/BinaryStream"
import { ParseProtobufNamed } from "../Utils/Protobuf"
import Vector3 from "../Base/Vector3"
import Vector2 from "../Base/Vector2"
import { MapToObject, ParseMapName, StringToUTF16 } from "../Utils/Utils"
import * as StringTables from "./StringTables"
import Vector4 from "../Base/Vector4"
import { GameRules } from "../Objects/Base/GameRules"
import { ParseTRMP } from "../Utils/ParseTRMP"
import Tree from "../Objects/Base/Tree"
import { SignonState_t } from "../Enums/SignonState_t"

let AllEntities: Entity[] = []
let AllEntitiesAsMap = new Map<number, Entity>()
let ClassToEntities = new Map<Constructor<any>, Entity[]>()

// that's MUCH more efficient than Map<number, boolean>
class bitset {
	private ar: Uint32Array
	constructor(size: number) { this.ar = new Uint32Array(Math.ceil(size / 4 / 8)).fill(0) }

	public reset() { this.ar = this.ar.fill(0) }

	public get(pos: number): boolean {
		return (this.ar[(pos / (4 * 8)) | 0] & (1 << (pos % (4 * 8)))) !== 0
	}
	public set(pos: number, new_val: boolean): void {
		let ar_pos = (pos / (4 * 8)) | 0
		let mask = 1 << (pos % (4 * 8))
		if (!new_val)
			this.ar[ar_pos] &= ~mask
		else
			this.ar[ar_pos] |= mask
	}
	public set_buf(buf: ArrayBuffer): void {
		new Uint8Array(this.ar.buffer).set(new Uint8Array(buf))
	}
}

export type EntityPropertyType = Map<string, EntityPropertyType> | EntityPropertyType[] | string | Vector4 | Vector3 | Vector2 | bigint | number | boolean
let ent_props = new Map<number, EntityPropertyType>(),
	VisibilityMask = new bitset(0x3FFF),
	TreeActiveMask = new bitset(0x3FFF),
	cur_local_id = 0x4000
class CEntityManager {
	public get AllEntities(): Entity[] {
		return AllEntities
	}
	public EntityByIndex(handle: Nullable<number>, include_local = false): Nullable<Entity> {
		const mask = include_local ? 0x7FFF : 0x3FFF
		if (handle === undefined || handle === 0)
			return undefined
		let index = handle & mask
		if (index === mask || index === 0)
			return undefined
		return AllEntitiesAsMap.get(index)
	}

	public GetEntityByFilter(filter: (ent: Entity) => boolean): Nullable<Entity> {
		return AllEntities.find(filter)
	}

	public GetEntitiesByClass<T>(class_: Constructor<T>, flags: DOTA_UNIT_TARGET_TEAM = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH): T[] {
		if (class_ === undefined || !ClassToEntities.has(class_))
			return []
		switch (flags) {
			case DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY:
				return ClassToEntities.get(class_)!.filter(e => !e.IsEnemy()) as []
			case DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY:
				return ClassToEntities.get(class_)!.filter(e => e.IsEnemy()) as []
			case DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH:
				return ClassToEntities.get(class_) as []
			case DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_CUSTOM:
			case DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_NONE:
			default:
				return []
		}
	}
	/**
	 * @deprecated USE IT ONLY IF YOU REALLY NEED IT \
	 * GetEntitiesByClasses is 60 times slower than GetEntitiesByClass
	 */
	public GetEntitiesByClasses<T>(classes: Constructor<T>[], flags: DOTA_UNIT_TARGET_TEAM = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH): T[] {
		let ar: T[] = []
		classes.forEach(class_ => ar.push(...this.GetEntitiesByClass(class_, flags)))
		return [...new Set(ar)]
	}
	public IsEntityVisible(ent_id: number): boolean {
		return ((ent_id & 0x4000) !== 0) || VisibilityMask.get(ent_id)
	}
	public IsTreeActive(binary_id: number): boolean {
		return TreeActiveMask.get(binary_id)
	}
	public SetWorldTreeState(WorldTreeState: bigint[]): void {
		TreeActiveMask.set_buf(new BigUint64Array(WorldTreeState).buffer)
	}
	public GetEntityPropertyByPath(ent_id: number, path: (string | number)[]): Nullable<EntityPropertyType> {
		let node = ent_props.get(ent_id)
		if (node === undefined)
			return undefined

		if (
			path.some(a => {
				if (typeof a === "number") {
					if (!Array.isArray(node))
						return true
					node = node[a]
				} else {
					if (!(node instanceof Map))
						return true
					node = node.get(a)
				}
				return false
			})
		)
			return undefined
		return node
	}
	public GetEntityProperties(ent_id: number): Nullable<EntityPropertyType> {
		return ent_props.get(ent_id)
	}
}

const EntityManager = new CEntityManager()
export default EntityManager

function ClassFromNative(id: number, constructor_name: string, ent_name: Nullable<string>): Entity {
	let constructor = GetConstructorByName(constructor_name, ent_name)
	if (constructor === undefined)
		throw `Can't find constructor for entity class ${constructor_name}, Entity#Name === ${ent_name}`

	return new constructor(id, ent_name)
}

let cached_field_handlers = new Map<Constructor<Entity>, Map<number, FieldHandler>>(),
	cached_m_fGameTime: Nullable<[Constructor<Entity>, number, FieldHandler]>,
	delayed_tick_call: Nullable<[Entity, EntityPropertyType]>
export type NetworkFieldsChangedType = [number[], EntityPropertyType[]]
function ApplyChanges(ent: Entity, changes: NetworkFieldsChangedType) {
	const [changed_paths, changed_paths_values] = changes,
		ent_handlers = cached_field_handlers.get(ent.constructor as Constructor<Entity>)
	if (ent_handlers === undefined)
		return
	changed_paths.forEach((field_name, i) => {
		if (cached_m_fGameTime === undefined || field_name !== cached_m_fGameTime[1] || ent.constructor !== cached_m_fGameTime[0]) {
			let cb = ent_handlers?.get(field_name)
			if (cb !== undefined)
				cb(ent, changed_paths_values[i])
		} else
			delayed_tick_call = [ent, changed_paths_values[i]]
	})
}

function CreateEntity(id: number, class_name: string, entity_name: Nullable<string>): void {
	let entity = ClassFromNative(id, class_name, entity_name)
	entity.ClassName = class_name
	AllEntitiesAsMap.set(id, entity)
	AllEntities.push(entity)

	GetSDKClasses().forEach(([class_]) => {
		if (!(entity instanceof class_))
			return

		if (!ClassToEntities.has(class_))
			ClassToEntities.set(class_, [])
		ClassToEntities.get(class_)!.push(entity)
	})
	EventsSDK.emit("EntityCreated", false, entity)
}

function DeleteEntity(id: number) {
	const entity = AllEntitiesAsMap.get(id)
	if (entity === undefined)
		return

	entity.IsValid = false
	entity.BecameDormantTime = GameRules?.RawGameTime ?? 0
	ArrayExtensions.arrayRemove(AllEntities, entity)

	EventsSDK.emit("EntityDestroyed", false, entity)
	ent_props.delete(id)
	VisibilityMask.set(id, false)
	GetSDKClasses().forEach(([class_]) => {
		if (!(entity instanceof class_))
			return

		let classToEnt = ClassToEntities.get(class_)
		if (classToEnt === undefined)
			return

		ArrayExtensions.arrayRemove(classToEnt, entity)
	})
}

enum EntityPVS {
	LEAVE,
	DELETE,
	CREATE,
	UPDATE,
}
enum PropertyType {
	BOOL,
	INT8,
	INT16,
	INT32,
	INT64,
	UINT8,
	UINT16,
	UINT32,
	UINT64,
	FLOAT,
	STRING,
	VECTOR2,
	VECTOR3,
	QUATERNION
}

let convert_buf = new ArrayBuffer(8)
let convert_uint8 = new Uint8Array(convert_buf),
	convert_int8 = new Int8Array(convert_buf),
	convert_uint16 = new Uint16Array(convert_buf),
	convert_int16 = new Int16Array(convert_buf),
	convert_uint32 = new Uint32Array(convert_buf),
	convert_int32 = new Int32Array(convert_buf),
	convert_int64 = new BigInt64Array(convert_buf),
	convert_uint64 = new BigUint64Array(convert_buf)
function ParseProperty(stream: BinaryStream): string | bigint | number | boolean | Vector2 | Vector3 | Vector4 {
	let var_type: PropertyType = stream.ReadUint8()
	switch (var_type) {
		case PropertyType.INT8:
			convert_uint64[0] = stream.ReadVarUint()
			return convert_int8[0]
		case PropertyType.INT16:
			convert_uint64[0] = stream.ReadVarUint()
			return convert_int16[0]
		case PropertyType.INT32:
			convert_uint64[0] = stream.ReadVarUint()
			return convert_int32[0]
		case PropertyType.INT64:
			convert_uint64[0] = stream.ReadVarUint()
			return convert_int64[0]
		case PropertyType.UINT8:
			convert_uint64[0] = stream.ReadVarUint()
			return convert_uint8[0]
		case PropertyType.UINT16:
			convert_uint64[0] = stream.ReadVarUint()
			return convert_uint16[0]
		case PropertyType.UINT32:
			convert_uint64[0] = stream.ReadVarUint()
			return convert_uint32[0]
		case PropertyType.UINT64:
			return stream.ReadVarUint()
		case PropertyType.BOOL:
			return stream.ReadVarUintAsNumber() !== 0
		case PropertyType.FLOAT:
			return stream.ReadFloat32()
		case PropertyType.VECTOR2:
			return new Vector2(stream.ReadFloat32(), stream.ReadFloat32())
		case PropertyType.VECTOR3:
			return new Vector3(stream.ReadFloat32(), stream.ReadFloat32(), stream.ReadFloat32())
		case PropertyType.QUATERNION:
			return new Vector4(stream.ReadFloat32(), stream.ReadFloat32(), stream.ReadFloat32(), stream.ReadFloat32())
		case PropertyType.STRING:
			return stream.ReadUtf8String(stream.ReadVarUintAsNumber())
		default:
			throw `Unknown PropertyType: ${var_type}`
	}
}

let entities_symbols: string[] = []
function ParseEntityUpdate(stream: BinaryStream, ent_id: number): [number[], EntityPropertyType[], string] {
	let ent_class = entities_symbols[stream.ReadUint16()]
	VisibilityMask.set(ent_id, true)
	if (!ent_props.has(ent_id))
		ent_props.set(ent_id, new Map())
	let ent_node = ent_props.get(ent_id)!,
		changed_paths: number[] = [],
		chaged_paths_results: EntityPropertyType[] = []
	for (let path_size = 0; (path_size = stream.ReadUint8()) !== 0;) {
		let prop_node = ent_node
		for (let i = 0; i < path_size; i++) {
			let id = stream.ReadUint16()
			let must_be_array = id & 1
			id >>= 1
			if (must_be_array && !Array.isArray(prop_node))
				throw "Expected array"
			if (!must_be_array && !(prop_node instanceof Map))
				throw "Expected Map"

			if (must_be_array) {
				let ar = prop_node as EntityPropertyType[]
				if (i !== path_size - 1) {
					if (ar[id] === undefined) {
						let next_must_be_array = stream.ReadUint16() & 1
						stream.RelativeSeek(-2) // uint16 = 2 bytes
						ar[id] = next_must_be_array ? [] : new Map()
					}
					prop_node = ar[id]
				} else
					ar[id] = ParseProperty(stream)
			} else {
				let map = prop_node as Map<string, EntityPropertyType>
				let sym = entities_symbols[id]
				if (i !== path_size - 1) {
					if (!map.has(sym)) {
						let next_must_be_array = stream.ReadUint16() & 1
						stream.RelativeSeek(-2) // uint16 = 2 bytes
						map.set(sym, next_must_be_array ? [] : new Map())
					}
					prop_node = map.get(sym)!
					chaged_paths_results.push(prop_node)
				} else {
					let prop = ParseProperty(stream)
					map.set(sym, prop)
					chaged_paths_results.push(prop)
				}
				changed_paths.push(id)
			}
		}
	}
	return [changed_paths, chaged_paths_results, ent_class]
}

function FixType(symbols: string[], field: any): string {
	{
		let field_serializer_name_sym = field.field_serializer_name_sym
		if (field_serializer_name_sym !== undefined)
			return symbols[field_serializer_name_sym] + (field.field_serializer_version !== 0 ? field.field_serializer_version : "")
	}
	let type = symbols[field.var_type_sym]
	// types
	type = type.replace(/CNetworkedQuantizedFloat/g, "float")
	type = type.replace(/CUtlVector\< (.*) \>/g, "$1[]")
	type = type.replace(/CHandle\< (.*) \>/g, "CEntityIndex<$1>")
	type = type.replace(/CStrongHandle\< (.*) \>/g, "CStrongHandle<$1>")
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

function QueuedLeave(ent_id: number, queued_leave?: number[]): boolean {
	let ent = EntityManager.EntityByIndex(ent_id)
	if (ent !== undefined) {
		ent.BecameDormantTime = GameRules?.RawGameTime ?? 0
		if (ent.ClassName === "CDOTA_BaseNPC") // crutch for thinkers that'll otherwise leak
			return true
	} else
		queued_leave?.push(ent_id)
	return false
}

const dump_d_ts = false
Events.on("ServerMessage", (msg_id, buf) => {
	switch (msg_id) {
		case 41: {
			let msg = ParseProtobufNamed(buf, "CSVCMsg_FlattenedSerializer")
			if (dump_d_ts) {
				let obj = MapToObject(msg)
				let list = (Object.values(obj.serializers) as any[]).map(ser => [
					obj.symbols[ser.serializer_name_sym] + (ser.serializer_version !== 0 ? ser.serializer_version : ""),
					(Object.values(ser.fields_index) as any[]).map(field_id => {
						let field = obj.fields[field_id]
						return [
							FixType(obj.symbols as string[], field),
							obj.symbols[field.var_name_sym]
						]
					})
				])
				writeConfig("dump_CSVCMsg_FlattenedSerializer.d.ts", StringToUTF16(`\
import { Vector2, Vector3, QAngle, Vector4 } from "./src_ts/wrapper/Imports"

type Color = number // 0xAABBGGRR?
type HSequence = number
type item_definition_index_t = number
type itemid_t = number
type style_index_t = number

${list.map(([name, fields]) => `\
declare class ${name} {
	${(fields as [string, string][]).map(([type, f_name]) => `${f_name}: ${type}`).join("\n\t")}
}`).join("\n\n")}
`))
			}
			entities_symbols = [...(msg.get("symbols") as Map<number, string>).values()]
			for (let [construct, map] of GetFieldHandlers()) {
				let map2 = new Map<number, FieldHandler>()
				for (let [field_name, field_handler] of map) {
					let id = entities_symbols.indexOf(field_name)
					if (id === -1) {
						console.log(`[WARNING] Index of "${field_name}" not found in CSVCMsg_FlattenedSerializer.`)
						continue
					}
					if (field_name !== "m_fGameTime")
						map2.set(id, field_handler)
					else
						cached_m_fGameTime = [construct, id, field_handler]
				}
				cached_field_handlers.set(construct, map2)
			}
			break
		}
		case 55: { // we have custom parsing for CSVCMsg_PacketEntities
			let stream = new BinaryStream(new DataView(buf)),
				changes: [number, NetworkFieldsChangedType][] = []
			let queued_deletion: number[] = [],
				queued_creation: [number, string][] = [],
				queued_leave: number[] = []
			while (!stream.Empty()) {
				let ent_id = stream.ReadUint16()
				let pvs: EntityPVS = stream.ReadUint8()
				switch (pvs) {
					case EntityPVS.DELETE:
						VisibilityMask.set(ent_id, false)
						queued_deletion.push(ent_id)
						break
					case EntityPVS.LEAVE: {
						VisibilityMask.set(ent_id, false)
						if (QueuedLeave(ent_id, queued_leave))
							queued_deletion.push(ent_id)
						break
					}
					case EntityPVS.CREATE: {
						let [changed_paths, chaged_paths_results, ent_class] = ParseEntityUpdate(stream, ent_id)
						queued_creation.push([ent_id, ent_class])
						if (changed_paths.length !== 0)
							changes.push([ent_id, [changed_paths, chaged_paths_results]])
						break
					}
					case EntityPVS.UPDATE: {
						let [changed_paths, chaged_paths_results] = ParseEntityUpdate(stream, ent_id)
						if (changed_paths.length !== 0)
							changes.push([ent_id, [changed_paths, chaged_paths_results]])
						break
					}
				}
			}
			queued_deletion.forEach(ent_id => DeleteEntity(ent_id))
			queued_creation.forEach(([ent_id, class_name]) => {
				let stringtables_id = EntityManager.GetEntityPropertyByPath(ent_id, ["m_pEntity", "m_nameStringableIndex"]) as number
				CreateEntity(ent_id, class_name, StringTables.GetString("EntityNames", stringtables_id))
			})
			changes.forEach(([ent_id, changes_]) => {
				let ent = EntityManager.EntityByIndex(ent_id)
				if (ent === undefined)
					return
				ApplyChanges(ent, changes_)
			})
			queued_leave.forEach(ent_id => {
				if (QueuedLeave(ent_id))
					DeleteEntity(ent_id)
			})
			if (delayed_tick_call !== undefined) {
				cached_m_fGameTime![2](...delayed_tick_call)
				delayed_tick_call = undefined
			}
			break
		}
	}
})

Events.on("SignonStateChanged", new_state => {
	if (new_state !== SignonState_t.SIGNONSTATE_NONE)
		return
	AllEntitiesAsMap.forEach((ent, ent_id) => DeleteEntity(ent_id))
	cur_local_id = 0x4000
})

function LoadTreeMap(buf: ArrayBuffer) {
	while (cur_local_id > 0x4000)
		DeleteEntity(--cur_local_id)
	ParseTRMP(buf).forEach((pos, i) => {
		let id = cur_local_id++
		let entity = ClassFromNative(id, "C_DOTA_MapTree", "ent_dota_tree") as Tree
		entity.Name_ = "ent_dota_tree"
		entity.ClassName = "C_DOTA_MapTree"
		entity.FakeTreePos.CopyFrom(pos)
		entity.BinaryID = i
		AllEntitiesAsMap.set(id, entity)
		AllEntities.push(entity)

		GetSDKClasses().forEach(([class_]) => {
			if (!(entity instanceof class_))
				return

			if (!ClassToEntities.has(class_))
				ClassToEntities.set(class_, [])
			ClassToEntities.get(class_)!.push(entity)
		})

		EventsSDK.emit("EntityCreated", false, entity)
	})
}

let last_loaded_map_name = "<empty>"
try {
	let map_name = GetLevelNameShort()
	if (map_name === "start")
		map_name = "dota"
	let buf = readFile(`maps/${map_name}.trm`)
	if (buf !== undefined)
		LoadTreeMap(buf)
} catch (e) {
	console.log("Error in TreeMap static init: " + e)
}

Events.on("PostAddSearchPath", path => {
	let map_name = ParseMapName(path)
	if (map_name === undefined)
		return

	let buf = readFile(`maps/${map_name}.trm`)
	if (buf === undefined)
		return

	try {
		LoadTreeMap(buf)
	} catch (e) {
		console.log("Error in TreeMap dynamic init: " + e)
	}
})

Events.on("PostRemoveSearchPath", path => {
	let map_name = ParseMapName(path)
	if (map_name === undefined || last_loaded_map_name !== map_name)
		return

	last_loaded_map_name = "<empty>"
	while (cur_local_id > 0x4000)
		DeleteEntity(--cur_local_id)
})

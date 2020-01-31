import * as ArrayExtensions from "../Utils/ArrayExtensions"

import Events from "./Events"

import Entity from "../Objects/Base/Entity"

import NativeToSDK, { GetSDKClasses, GetFieldHandlers, FieldHandler } from "../Objects/NativeToSDK"

import EventsSDK from "./EventsSDK"
import BinaryStream from "../Utils/BinaryStream"
import { ParseProtobufNamed } from "../Utils/ParseProtobuf"
import Vector3 from "../Base/Vector3"
import Vector2 from "../Base/Vector2"
import { Utf8ArrayToStr } from "../Utils/Utils"
import * as StringTables from "./StringTables"
import QAngle from "../Base/QAngle"
import Vector4 from "../Base/Vector4"
import { GameRules } from "../Objects/Base/GameRules"

let AllEntities: Entity[] = []
let NativeEntities = new Map<number, C_BaseEntity>()
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
}

export type EntityPropertyType = Map<string, EntityPropertyType> | EntityPropertyType[] | string | Vector4 | Vector3 | Vector2 | bigint | number | boolean
let ent_props = new Map<number, EntityPropertyType>(),
	VisibilityMask = new bitset(0x3FFF)
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
	public IndexByNative(ent: C_BaseEntity): number {
		for (let [index, ent_] of NativeEntities.entries())
			if (ent === ent_)
				return index
		return -1
	}
	public NativeByIndex(handle: number, include_local = false): Nullable<C_BaseEntity> {
		const mask = include_local ? 0x7FFF : 0x3FFF
		if (handle === undefined || handle === 0)
			return undefined
		let index = handle & mask
		if (index === mask || index === 0)
			return undefined
		return NativeEntities.get(index)
	}
	public GetEntityByNative(ent: C_BaseEntity | number | undefined): Nullable<Entity> {
		if (ent === undefined)
			return undefined
		if (!(ent instanceof C_BaseEntity))
			return this.EntityByIndex(ent)
		return this.EntityByIndex(this.IndexByNative(ent))
	}

	public GetEntityByFilter(filter: (ent: Entity) => boolean): Nullable<Entity> {
		return AllEntities.find(filter)
	}

	public GetEntitiesByClass<T>(class_: Constructor<T>, flags: DOTA_UNIT_TARGET_TEAM = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH): T[] {
		if (class_ === undefined || !ClassToEntities.has(class_))
			return []
		switch (flags) {
			case DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY:
				// loop-optimizer: FORWARD
				return ClassToEntities.get(class_)!.filter(e => !e.IsEnemy()) as []
			case DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY:
				// loop-optimizer: FORWARD
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
		// loop-optimizer: FORWARD
		classes.forEach(class_ => ar.push(...this.GetEntitiesByClass(class_, flags)))
		return [...new Set(ar)]
	}
	public IsEntityVisible(ent_id: number): boolean {
		return VisibilityMask.get(ent_id)
	}
	public GetEntityPropertyByPath(ent_id: number, path: (string | number)[]): Nullable<EntityPropertyType> {
		let node = ent_props.get(ent_id)
		if (node === undefined)
			return undefined

		// loop-optimizer: FORWARD
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

Events.on("EntityCreated", (ent, id) => {
	NativeEntities.set(id, ent)
	if (AllEntitiesAsMap.has(id))
		AllEntitiesAsMap.get(id)!.NativeEntity = ent
	else if ((id & 0x4000) !== 0) {
		let ent_name = ent.m_pEntity?.m_name || ""
		let constructor = NativeToSDK(ent.constructor as Constructor<any>, ent_name!)
		if (constructor === undefined)
			throw `Can't find constructor for entity class ${ent.constructor.name}, Entity#Name === ${ent_name}`

		let wrapper_ent = new constructor(id, ent_name)
		wrapper_ent.NativeEntity = ent // just in case...
		wrapper_ent.ClassName = ent.constructor.name
		AllEntitiesAsMap.set(id, wrapper_ent)
		AllEntities.push(wrapper_ent)

		GetSDKClasses().forEach(class_ => {
			if (!(wrapper_ent instanceof class_))
				return

			if (!ClassToEntities.has(class_))
				ClassToEntities.set(class_, [])
			ClassToEntities.get(class_)!.push(wrapper_ent)
		})

		if (ent.m_VisualData) {
			let m_vecOrigin = Vector3.fromIOBuffer()!,
				m_angAbsRotation = QAngle.fromIOBuffer(true, 3)!
			m_vecOrigin.CopyTo(wrapper_ent.Position_)
			m_angAbsRotation.CopyTo(wrapper_ent.Angles_)
		}

		EventsSDK.emit("EntityCreated", false, wrapper_ent)
	}
})
Events.on("EntityDestroyed", (ent, id) => {
	NativeEntities.delete(id)
	if (AllEntitiesAsMap.has(id))
		AllEntitiesAsMap.get(id)!.NativeEntity = undefined
	else if ((id & 0x4000) !== 0)
		DeleteEntity(id)
})

function BruteforceConstructor(constructor_name: string): Nullable<Constructor<any>> {
	let global = globalThis as { [key: string]: any }
	let result = global[constructor_name]
	if (result !== undefined)
		return result.prototype.constructor

	if (constructor_name[0] === "C" && constructor_name[1] !== "_") {
		constructor_name = `C_${constructor_name.substring(1)}`
		result = global[constructor_name]
		if (result !== undefined)
			return result.prototype.constructor
	}
	if (constructor_name[0] === "C" && constructor_name[1] === "_") {
		constructor_name = `C${constructor_name.substring(2)}`
		result = global[constructor_name]
		if (result !== undefined)
			return result.prototype.constructor
	}

	return undefined
}

function ClassFromNative(id: number, constructor_name: string, ent_name: Nullable<string>): Entity {
	let native_constructor = BruteforceConstructor(constructor_name)
	if (native_constructor === undefined)
		throw `Can't find native constructor for entity class ${constructor_name}, Entity#Name === ${ent_name}`

	let constructor = NativeToSDK(native_constructor, ent_name!)
	if (constructor === undefined)
		throw `Can't find constructor for entity class ${native_constructor.name}, Entity#Name === ${ent_name}`

	return new constructor(id, ent_name)
}

/* ================ RUNTIME CACHE ================ */
let cached_field_handlers = new Map<Constructor<Entity>, Map<number, FieldHandler>>()
export type NetworkFieldsChangedType = [number[], EntityPropertyType[]]
function ApplyChanges(ent: Entity, changes: NetworkFieldsChangedType) {
	let [changed_paths, changed_paths_values] = changes
	// loop-optimizer: FORWARD
	changed_paths.forEach((field_name, i) => {
		let cb = cached_field_handlers.get(ent.constructor as Constructor<Entity>)?.get(field_name)
		if (cb !== undefined)
			cb(ent, changed_paths_values[i])
	})
}

function CreateEntity(id: number, class_name: string, entity_name: Nullable<string>): void {
	let entity = ClassFromNative(id, class_name, entity_name)
	entity.ClassName = class_name
	AllEntitiesAsMap.set(id, entity)
	AllEntities.push(entity)

	GetSDKClasses().forEach(class_ => {
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
	GetSDKClasses().forEach(class_ => {
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
	let var_type: PropertyType = stream.ReadNumber(1)
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
			return stream.ReadVarUint() !== 0n
		case PropertyType.FLOAT:
			return stream.ReadFloat32()
		case PropertyType.VECTOR2:
			return new Vector2(stream.ReadFloat32(), stream.ReadFloat32())
		case PropertyType.VECTOR3:
			return new Vector3(stream.ReadFloat32(), stream.ReadFloat32(), stream.ReadFloat32())
		case PropertyType.QUATERNION:
			return new Vector4(stream.ReadFloat32(), stream.ReadFloat32(), stream.ReadFloat32(), stream.ReadFloat32())
		case PropertyType.STRING:
			return Utf8ArrayToStr(new Uint8Array(stream.ReadSlice(Number(stream.ReadVarUint()))))
		default:
			throw `Unknown PropertyType: ${var_type}`
	}
}

let entities_symbols: string[] = []
Events.on("ServerMessage", (msg_id, buf) => {
	switch (msg_id) {
		case 41: {
			let msg = ParseProtobufNamed(buf, "CSVCMsg_FlattenedSerializer")
			entities_symbols = [...(msg.get("symbols") as Map<number, string>).values()]
			for (let [construct, map] of GetFieldHandlers()) {
				let map2 = new Map<number, FieldHandler>()
				for (let [field_name, field_handler] of map) {
					let id = entities_symbols.indexOf(field_name)
					if (id === -1)
						throw `Index of "${field_name}" not found in CSVCMsg_FlattenedSerializer.`
					map2.set(id, field_handler)
				}
				cached_field_handlers.set(construct, map2)
			}
			break
		}
		case 55: { // we have custom parsing for CSVCMsg_PacketEntities
			let stream = new BinaryStream(new DataView(buf)),
				changes: [number, NetworkFieldsChangedType][] = []
			let queued_deletion: number[] = [],
				queued_creation: [number, string][] = []
			while (!stream.Empty()) {
				let ent_id = stream.ReadNumber(2)
				let pvs: EntityPVS = stream.ReadNumber(1)
				if (pvs === EntityPVS.DELETE) {
					queued_deletion.push(ent_id)
					continue
				}
				if (pvs === EntityPVS.LEAVE) {
					let ent = EntityManager.EntityByIndex(ent_id)
					if (ent !== undefined)
						ent.BecameDormantTime = GameRules?.RawGameTime ?? 0
				}
				let ent_class = entities_symbols[stream.ReadNumber(2)]
				VisibilityMask.set(ent_id, pvs === EntityPVS.CREATE || pvs === EntityPVS.UPDATE)
				if (!ent_props.has(ent_id))
					ent_props.set(ent_id, new Map())
				let ent_node = ent_props.get(ent_id)!
				let changed_paths: number[] = [],
					chaged_paths_results: EntityPropertyType[] = []
				for (let path_size = 0; (path_size = stream.ReadNumber(1)) !== 0;) {
					let raw_path = new Uint16Array(stream.ReadSlice(2 * path_size)),
						prop_node = ent_node
					for (let i = 0; i < path_size; i++) {
						let id = raw_path[i]
						let must_be_array = id & 1
						id >>= 1
						if (!Array.isArray(prop_node) && must_be_array)
							throw "Expected array"
						if (!(prop_node instanceof Map) && !must_be_array)
							throw "Expected Map"

						if (must_be_array) {
							let ar = prop_node as EntityPropertyType[]
							if (i !== path_size - 1) {
								if (!ar[id])
									ar[id] = (raw_path[i + 1] & 1) ? [] : new Map()
								prop_node = ar[id]
							} else
								ar[id] = ParseProperty(stream)
						} else {
							let map = prop_node as Map<string, EntityPropertyType>
							let sym = entities_symbols[id]
							if (i !== path_size - 1) {
								if (!map.has(sym))
									map.set(sym, (raw_path[i + 1] & 1) ? [] : new Map())
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
				if (pvs === EntityPVS.CREATE)
					queued_creation.push([ent_id, ent_class])
				if (changed_paths.length !== 0)
					changes.push([ent_id, [changed_paths, chaged_paths_results]])
			}
			// loop-optimizer: FORWARD
			queued_deletion.forEach(ent_id => DeleteEntity(ent_id))
			// loop-optimizer: FORWARD
			queued_creation.forEach(([ent_id, class_name]) => {
				let stringtables_id = EntityManager.GetEntityPropertyByPath(ent_id, ["m_pEntity", "m_nameStringableIndex"]) as number
				CreateEntity(ent_id, class_name, StringTables.GetString("EntityNames", stringtables_id))
			})
			// loop-optimizer: FORWARD
			changes.forEach(([ent_id, changes_]) => {
				let ent = EntityManager.EntityByIndex(ent_id)
				if (ent === undefined)
					return
				ApplyChanges(ent, changes_)
			})
			break
		}
	}
})

Events.on("SignonStateChanged", new_state => {
	if (new_state !== SignonState_t.SIGNONSTATE_NONE)
		return
	ent_props.clear()
	VisibilityMask.reset()
	// loop-optimizer: KEEP
	AllEntitiesAsMap.forEach((ent, ent_id) => DeleteEntity(ent_id))
})

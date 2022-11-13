import { EntityPropertiesNode, EntityPropertyType } from "../Base/EntityProperties"
import { Vector2 } from "../Base/Vector2"
import { Vector3 } from "../Base/Vector3"
import { Vector4 } from "../Base/Vector4"
import { EPropertyType, PropertyType } from "../Enums/PropertyType"
import { Entity } from "../Objects/Base/Entity"
import { cached_field_handlers, ClassToEntitiesAr, entities_symbols, GetConstructorByName } from "../Objects/NativeToSDK"
import * as ArrayExtensions from "../Utils/ArrayExtensions"
import { GameState } from "../Utils/GameState"
import { ParseProtobufDesc } from "../Utils/Protobuf"
import { ViewBinaryStream } from "../Utils/ViewBinaryStream"
import { AllEntitiesAsMap, EntityManager, TreeActiveMask } from "./EntityManager"
import { Events } from "./Events"
import { EventsSDK } from "./EventsSDK"
import * as StringTables from "./StringTables"

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
	EntityManager.AllEntities.push(ent)
	for (const class_entities of ClassToEntitiesAr.get(ent.constructor as any)!)
		class_entities.push(ent)
}

function CreateEntity(
	id: number,
	serial: number,
	class_name: string,
	entity_name: Nullable<string>,
): Entity {
	const entity = ClassFromNative(id, serial, class_name, entity_name)
	entity.FieldHandlers_ = cached_field_handlers.get(entity.constructor as Constructor<Entity>)
	entity.ClassName = class_name
	CreateEntityInternal(entity)
	return entity
}

export function DeleteEntity(id: number): void {
	const entity = AllEntitiesAsMap.get(id)
	if (entity === undefined)
		return

	entity.IsValid = false
	entity.BecameDormantTime = GameState.RawGameTime
	ArrayExtensions.arrayRemove(EntityManager.AllEntities, entity)

	EventsSDK.emit("EntityDestroyed", false, entity)
	entity.IsVisible = false
	AllEntitiesAsMap.delete(id)
	for (const class_entities of ClassToEntitiesAr.get(entity.constructor as any)!)
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
function ParseProperty(stream: ReadableBinaryStream): PropertyType {
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
	stream: ReadableBinaryStream,
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

function ParseEntityUpdate(
	stream: ReadableBinaryStream,
	ent_id: number,
	created_entities: Entity[],
	is_create = false,
): void {
	const ent_serial = is_create ? stream.ReadUint32() : 0
	const m_nameStringableIndex = is_create ? stream.ReadInt32() : -1
	const ent_class = entities_symbols[stream.ReadUint16()]
	let ent_was_created = false
	let ent = AllEntitiesAsMap.get(ent_id)
	if (ent === undefined && is_create) {
		ent = CreateEntity(
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
		ent_handlers!.get(changed_paths[i])!(ent!, changed_paths_results[i])
	if (ent !== undefined && ent_was_created) {
		ent.IsValid = true
		EventsSDK.emit("PreEntityCreated", false, ent)
		created_entities.push(ent)
	}
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
const NO_ENTITY_NATIVE_PROPS_ = (globalThis as any).NO_ENTITY_NATIVE_PROPS ?? false
function ParseEntityPacket(stream: ReadableBinaryStream): void {
	EventsSDK.emit("PreDataUpdate", false)
	LatestTickDelta = 0
	const native_changes: number[][] = []
	if (!NO_ENTITY_NATIVE_PROPS_)
		while (!stream.Empty()) {
			const ent_id = stream.ReadUint16()
			if (ent_id === 0)
				break
			stream.RelativeSeek(7 * 4) // legacy
			native_changes.push([
				ent_id,
				stream.ReadUint32(), // m_iMoveCapabilities
			])
			stream.RelativeSeek(2 * 4) // legacy
		}
	const created_entities: Entity[] = []
	while (!stream.Empty()) {
		const ent_id = stream.ReadUint16()
		const pvs: EntityPVS = stream.ReadUint8()
		switch (pvs) {
			case EntityPVS.DELETE:
				DeleteEntity(ent_id)
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
				ParseEntityUpdate(stream, ent_id, created_entities, true)
				break
			case EntityPVS.UPDATE:
				ParseEntityUpdate(stream, ent_id, created_entities)
				break
		}
	}
	if (!NO_ENTITY_NATIVE_PROPS_)
		for (const [ent_id, m_iMoveCapabilities] of native_changes) {
			const ent = EntityManager.EntityByIndex(ent_id)
			if (ent !== undefined)
				ent.ForwardNativeProperties(m_iMoveCapabilities)
		}
	EventsSDK.emit("MidDataUpdate", false)
	for (const ent of created_entities)
		EventsSDK.emit("EntityCreated", false, ent)
	EventsSDK.emit("PostDataUpdate", false)
	if (LatestTickDelta !== 0)
		EventsSDK.emit("Tick", false, LatestTickDelta)
}

Events.on("ServerMessage", (msg_id, buf) => {
	switch (msg_id) {
		case 55: // we have custom parsing for CSVCMsg_PacketEntities
			ParseEntityPacket(new ViewBinaryStream(new DataView(buf)))
			break
	}
})

Events.on("NewConnection", () => {
	for (const ent_id of AllEntitiesAsMap.keys())
		DeleteEntity(ent_id)
	TreeActiveMask.reset()
})

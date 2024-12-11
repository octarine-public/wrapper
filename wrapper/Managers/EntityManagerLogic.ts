import { EntityPropertiesNode, EntityPropertyType } from "../Base/EntityProperties"
import { Vector2 } from "../Base/Vector2"
import { Vector3 } from "../Base/Vector3"
import { Vector4 } from "../Base/Vector4"
import { EPropertyType, PropertyType } from "../Enums/PropertyType"
import { Entity, latestTickDelta, SetLatestTickDelta } from "../Objects/Base/Entity"
import {
	CachedFieldHandlers,
	ClassToEntitiesAr,
	EntitiesSymbols,
	GetConstructorByName
} from "../Objects/NativeToSDK"
import { GameState } from "../Utils/GameState"
import { ViewBinaryStream } from "../Utils/ViewBinaryStream"
import { AllEntitiesAsMap, EntityManager } from "./EntityManager"
import { Events } from "./Events"
import { EventsSDK } from "./EventsSDK"
import { StringTables } from "./StringTables"

function ClassFromNative(
	id: number,
	serial: number,
	constructorName: string,
	entName: Nullable<string>
): Entity {
	let constructor = GetConstructorByName(constructorName, entName)
	if (constructor === undefined) {
		console.error(
			`Can't find constructor for entity class ${constructorName}, Entity#Name === ${entName}`
		)
		constructor = Entity
	}

	return new constructor(id, serial, entName)
}

export function CreateEntityInternal(entity: Entity): void {
	AllEntitiesAsMap.set(entity.Index, entity)
	EntityManager.AllEntities.push(entity)

	const entities = ClassToEntitiesAr.get(entity.constructor as Constructor<Entity>)!
	for (let index = 0; index < entities.length; index++) {
		const classEntities = entities[index]
		classEntities.push(entity)
	}
}

function CreateEntity(
	id: number,
	serial: number,
	className: string,
	entityName: Nullable<string>
): Entity {
	// TODO
	switch (className) {
		case "CDOTA_Lamp_Use":
			className = "CDOTA_Ability_Lamp_Use"
			break
		case "CODTA_Item_Gossamer_Cape":
			className = "CDOTA_Item_Gossamer_Cape"
			break
	}

	const entity = ClassFromNative(id, serial, className, entityName)
	entity.FieldHandlers_ = CachedFieldHandlers.get(
		entity.constructor as Constructor<Entity>
	)
	entity.ClassName = className
	CreateEntityInternal(entity)
	return entity
}

export function DeleteEntity(entID: number): void {
	const entity = AllEntitiesAsMap.get(entID)
	if (entity === undefined) {
		return
	}

	entity.IsValid = false
	entity.BecameDormantTime = GameState.RawGameTime
	EntityManager.AllEntities.remove(entity)

	EventsSDK.emit("EntityDestroyed", false, entity)
	entity.IsVisible = false
	AllEntitiesAsMap.delete(entID)

	const entities = ClassToEntitiesAr.get(entity.constructor as Constructor<Entity>)!
	for (let index = entities.length - 1; index > -1; index--) {
		const classEntities = entities[index]
		classEntities.remove(entity)
	}
}

const enum EntityPVS {
	LEAVE,
	DELETE,
	CREATE,
	UPDATE
}

const convertBuf = new ArrayBuffer(8)
const convertUint8 = new Uint8Array(convertBuf),
	convertInt8 = new Int8Array(convertBuf),
	convertUint16 = new Uint16Array(convertBuf),
	convertInt16 = new Int16Array(convertBuf),
	convertUint32 = new Uint32Array(convertBuf),
	convertInt32 = new Int32Array(convertBuf),
	convertInt64 = new BigInt64Array(convertBuf),
	convertUint64 = new BigUint64Array(convertBuf)
function ParseProperty(stream: ViewBinaryStream): PropertyType {
	const varType: EPropertyType = stream.ReadUint8()
	switch (varType) {
		case EPropertyType.INT8:
			convertUint64[0] = stream.ReadUint64()
			return convertInt8[0]
		case EPropertyType.INT16:
			convertUint64[0] = stream.ReadUint64()
			return convertInt16[0]
		case EPropertyType.INT32:
			convertUint64[0] = stream.ReadUint64()
			return convertInt32[0]
		case EPropertyType.INT64:
			convertUint64[0] = stream.ReadUint64()
			return convertInt64[0]
		case EPropertyType.UINT8:
			convertUint64[0] = stream.ReadUint64()
			return convertUint8[0]
		case EPropertyType.UINT16:
			convertUint64[0] = stream.ReadUint64()
			return convertUint16[0]
		case EPropertyType.UINT32:
			convertUint64[0] = stream.ReadUint64()
			return convertUint32[0]
		case EPropertyType.UINT64:
			return stream.ReadUint64()
		case EPropertyType.BOOL:
			return stream.ReadBoolean()
		case EPropertyType.FLOAT:
			return stream.ReadFloat32()
		case EPropertyType.VECTOR2:
			return new Vector2(stream.ReadFloat32(), stream.ReadFloat32())
		case EPropertyType.VECTOR3:
			return new Vector3(
				stream.ReadFloat32(),
				stream.ReadFloat32(),
				stream.ReadFloat32()
			)
		case EPropertyType.QUATERNION:
			return new Vector4(
				stream.ReadFloat32(),
				stream.ReadFloat32(),
				stream.ReadFloat32(),
				stream.ReadFloat32()
			)
		case EPropertyType.STRING:
			return stream.ReadUtf8String(stream.ReadVarUintAsNumber())
		default:
			throw `Unknown PropertyType: ${varType}`
	}
}

const debugParsing = false
function DumpStreamPosition(
	entClass: string,
	stream: ViewBinaryStream,
	pathSizeWalked: number
): string {
	stream.RelativeSeek((pathSizeWalked + 1) * -2) // uint16 = 2 bytes
	let ret = entClass
	for (let i = 0; i < pathSizeWalked + 1; i++) {
		let id = stream.ReadUint16()
		const mustBeArray = id & 1
		id >>= 1
		ret += !mustBeArray ? `.${EntitiesSymbols[id]}` : `[${id}]`
	}
	return ret
}

function ParseEntityUpdate(
	stream: ViewBinaryStream,
	entID: number,
	createdEntities: Entity[],
	isCreate: boolean
): void {
	const entSerial = isCreate ? stream.ReadUint32() : 0
	const nameStringableIndex = isCreate ? stream.ReadInt32() : -1
	const entClass = EntitiesSymbols[stream.ReadUint16()]
	let entWasCreated = false
	let ent = AllEntitiesAsMap.get(entID)
	if (ent === undefined && isCreate) {
		ent = CreateEntity(
			entID,
			entSerial,
			entClass,
			StringTables.GetString("EntityNames", nameStringableIndex)
		)
		entWasCreated = true
	}
	let entityDump = "Parsing entity "
	if (debugParsing) {
		entityDump += entID + " with class " + entClass + ":\n"
	}
	if (ent !== undefined && entWasCreated) {
		ent.IsValid = false
	}
	const entHandlers = ent?.FieldHandlers_,
		entNode = ent?.Properties_ ?? new EntityPropertiesNode(),
		changedPaths: number[] = [],
		changedPathsResults: EntityPropertyType[] = []
	while (true) {
		const pathSize = stream.ReadUint8()
		if (pathSize === 0) {
			break
		}
		if (debugParsing) {
			entityDump += "\t"
		}
		let propNode: EntityPropertyType = entNode
		for (let i = 0; i < pathSize; i++) {
			let id = stream.ReadUint16()
			const mustBeArray = id & 1
			id >>= 1
			if (debugParsing) {
				if (mustBeArray && !Array.isArray(propNode)) {
					throw `Expected array at ${DumpStreamPosition(entClass, stream, i)}`
				}
				if (
					!mustBeArray &&
					(typeof propNode !== "object" ||
						propNode.constructor !== EntityPropertiesNode)
				) {
					throw `Expected map at ${DumpStreamPosition(entClass, stream, i)}`
				}
			}

			if (mustBeArray) {
				if (debugParsing) {
					entityDump += "[" + id + "]"
				}
				const ar = propNode as EntityPropertyType[]
				if (i !== pathSize - 1) {
					if (ar[id] === undefined) {
						const nextMustBeArray = stream.ReadUint16() & 1
						stream.RelativeSeek(-2) // uint16 = 2 bytes
						ar[id] = nextMustBeArray ? [] : new EntityPropertiesNode()
					}
					propNode = ar[id]
				} else {
					ar[id] = ParseProperty(stream)
					if (debugParsing) {
						entityDump += ": " + ar[id]
					}
				}
			} else {
				if (debugParsing) {
					entityDump += "." + EntitiesSymbols[id]
				}
				const map = propNode as EntityPropertiesNode
				let res: EntityPropertyType
				if (i !== pathSize - 1) {
					if (!map.has(id)) {
						const nextMustBeArray = stream.ReadUint16() & 1
						stream.RelativeSeek(-2) // uint16 = 2 bytes
						map.set(id, nextMustBeArray ? [] : new EntityPropertiesNode())
					}
					propNode = res = map.map.get(id)!
				} else {
					const prop = (res = ParseProperty(stream))
					map.set(id, prop)
					if (debugParsing) {
						entityDump += ": " + prop
					}
				}
				if (ent !== undefined && entHandlers !== undefined) {
					const changedPathID = changedPaths.indexOf(id)
					if (changedPathID === -1) {
						if (entHandlers.has(id)) {
							changedPaths.push(id)
							changedPathsResults.push(res)
						}
					} else {
						changedPathsResults[changedPathID] = res
					}
				}
			}
		}
		if (debugParsing) {
			entityDump += "\n"
		}
	}
	if (debugParsing) {
		console.log(GameState.CurrentServerTick, entityDump)
	}
	for (let i = 0, end = changedPaths.length; i < end; i++) {
		try {
			entHandlers!.get(changedPaths[i])!(ent!, changedPathsResults[i])
		} catch (e) {
			console.error(
				"Entity field handler failed",
				EntitiesSymbols[changedPaths[i]],
				ent!.ClassName,
				ent!.constructor.name,
				entID,
				e
			)
		}
	}
	if (ent !== undefined && entWasCreated) {
		ent.IsValid = true
		EventsSDK.emit("PreEntityCreated", false, ent)
		createdEntities.push(ent)
	}
}

function ParseEntityPacket(stream: ViewBinaryStream): void {
	EventsSDK.emit("PreDataUpdate", false)
	const nativeChanges: [number, number][] = []
	while (!stream.Empty()) {
		const entID = stream.ReadUint16()
		if (entID === 0) {
			break
		}
		nativeChanges.push([
			entID,
			stream.ReadInt32() // m_iHealthBarOffset
		])
	}
	const createdEntities: Entity[] = [],
		leftVis: Entity[] = [],
		enteredVis: Entity[] = []
	while (!stream.Empty()) {
		const entID = stream.ReadUint16()
		const pvs: EntityPVS = stream.ReadUint8()
		switch (pvs) {
			case EntityPVS.DELETE:
				DeleteEntity(entID)
				break
			case EntityPVS.LEAVE: {
				const ent = EntityManager.EntityByIndex(entID)
				if (ent !== undefined) {
					if (!leftVis.includes(ent)) {
						leftVis.push(ent)
					}
					enteredVis.remove(ent)
				}
				break
			}
			case EntityPVS.CREATE:
			case EntityPVS.UPDATE: {
				ParseEntityUpdate(
					stream,
					entID,
					createdEntities,
					pvs === EntityPVS.CREATE
				)
				const ent = EntityManager.EntityByIndex(entID)
				if (ent !== undefined) {
					if (!enteredVis.includes(ent)) {
						enteredVis.push(ent)
					}
					leftVis.remove(ent)
				}
				break
			}
		}
	}
	for (let i = leftVis.length - 1; i > -1; i--) {
		const ent = leftVis[i]
		if (ent.IsVisible) {
			ent.BecameDormantTime = GameState.RawGameTime
			ent.IsVisible = false
			EventsSDK.emit("EntityVisibleChanged", false, ent)
		}
	}
	for (let i = enteredVis.length - 1; i > -1; i--) {
		const ent = enteredVis[i]
		if (!ent.IsVisible) {
			ent.IsVisible = true
			EventsSDK.emit("EntityVisibleChanged", false, ent)
		}
	}
	for (let i = nativeChanges.length - 1; i > -1; i--) {
		const [entID, healthBarOffset] = nativeChanges[i]
		const ent = EntityManager.EntityByIndex(entID)
		ent?.ForwardNativeProperties(healthBarOffset)
	}
	for (let i = 0, end = createdEntities.length; i < end; i++) {
		const ent = createdEntities[i]
		EventsSDK.emit("EntityCreated", false, ent)
	}
	EventsSDK.emit("PostDataUpdate", false, latestTickDelta)
	if (latestTickDelta !== 0) {
		GameState.LatestTickDelta = latestTickDelta
		EventsSDK.emit("Tick", false, latestTickDelta)
		SetLatestTickDelta(0)
	}
}

Events.on("ServerMessage", (msgID, buf) => {
	switch (msgID) {
		case 55: // we have custom parsing for CSVCMsg_PacketEntities
			ParseEntityPacket(new ViewBinaryStream(new DataView(buf)))
			break
	}
})

Events.on("NewConnection", () => {
	AllEntitiesAsMap.forEach((_, entID) => DeleteEntity(entID))
})

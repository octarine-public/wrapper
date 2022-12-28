import { Color } from "../Base/Color"
import { QAngle } from "../Base/QAngle"
import { Vector3 } from "../Base/Vector3"
import { StringToUTF8 } from "../Utils/ArrayBufferUtils"
import { HasBit } from "../Utils/BitsExtensions"
import { FileBinaryStream } from "../Utils/FileBinaryStream"
import { ViewBinaryStream } from "../Utils/ViewBinaryStream"
import { MapValueToNumber, MapValueToString } from "./ParseUtils"

const enum EntsTypes {
	FLOAT = 1,
	VECTOR3 = 3,
	NODE_ID = 5,
	BOOL = 6,
	COLOR = 9,
	UINT64 = 26,
	STRING = 30,
	FLAGS = 37,
	QANGLE = 39,
}

type EntityDataMapValue =
	| string
	| bigint
	| number
	| boolean
	| Vector3
	| QAngle
	| Color

class EntityDataMap {
	private data = new Map<number, EntityDataMapValue>()

	public get(key: string): Nullable<EntityDataMapValue> {
		return this.data.get(MurmurHash2(key, 0x31415926) >>> 0)
	}
	public set(key: number, value: EntityDataMapValue): void {
		this.data.set(key, value)
	}
}

function ReadTypedValue(stream: ReadableBinaryStream): EntityDataMapValue {
	const type: EntsTypes = stream.ReadUint32()
	switch (type) {
		case EntsTypes.FLOAT:
			return stream.ReadFloat32()
		case EntsTypes.VECTOR3:
			return new Vector3(
				stream.ReadFloat32(),
				stream.ReadFloat32(),
				stream.ReadFloat32()
			)
		case EntsTypes.NODE_ID:
			return stream.ReadUint32()
		case EntsTypes.BOOL:
			return stream.ReadBoolean()
		case EntsTypes.COLOR:
			return new Color(
				stream.ReadUint8(),
				stream.ReadUint8(),
				stream.ReadUint8(),
				stream.ReadUint8()
			)
		case EntsTypes.UINT64:
			return stream.ReadUint64()
		case EntsTypes.QANGLE:
			return new QAngle(
				stream.ReadFloat32(),
				stream.ReadFloat32(),
				stream.ReadFloat32()
			)
		case EntsTypes.STRING:
			return stream.ReadNullTerminatedUtf8String()
		case EntsTypes.FLAGS:
			return stream.ReadUint32()
		default:
			throw `Unknown EntsType: ${type}`
	}
}

function ParseEntityLumpInternal(stream: ReadableBinaryStream): void {
	const kv = stream.ParseKV()

	if (kv.has("m_childLumps")) {
		const childLumps = kv.get("m_childLumps")
		if (Array.isArray(childLumps)) {
			childLumps.forEach(childLump => {
				if (typeof childLump !== "string") return
				const childLumpBuf = fopen(`${childLump}_c`)
				if (childLumpBuf !== undefined)
					try {
						ParseEntityLumpInternal(new FileBinaryStream(childLumpBuf))
					} finally {
						childLumpBuf.close()
					}
			})
		}
	}
	if (kv.has("m_entityKeyValues")) {
		const entityKeyValues = kv.get("m_entityKeyValues")
		if (Array.isArray(entityKeyValues)) {
			entityKeyValues.forEach(entityKV => {
				if (!(entityKV instanceof Map)) return
				// TODO: m_connections?
				let kvData = entityKV.get("m_keyValuesData")
				if (kvData === undefined) return
				if (typeof kvData === "string") kvData = StringToUTF8(kvData)
				if (!(kvData instanceof Uint8Array)) return
				const kvDataStream = new ViewBinaryStream(
					new DataView(kvData.buffer, kvData.byteOffset, kvData.byteLength)
				)
				{
					const version = kvDataStream.ReadUint32()
					if (version !== 1) throw `Unknown entity data version: ${version}`
				}
				const hashedKeys = kvDataStream.ReadUint32(),
					stringKeys = kvDataStream.ReadUint32()
				const map = new EntityDataMap()
				for (let i = 0; i < hashedKeys; i++) {
					const hash = kvDataStream.ReadUint32(),
						value = ReadTypedValue(kvDataStream)
					map.set(hash, value)
				}
				for (let i = 0; i < stringKeys; i++) {
					const hash = kvDataStream.ReadUint32()
					kvDataStream.ReadNullTerminatedUtf8String() // key
					const value = ReadTypedValue(kvDataStream)
					map.set(hash, value)
				}
				if (
					map.get("classname") === "info_world_layer" &&
					HasBit(MapValueToNumber(map.get("spawnflags")), 0)
				)
					DefaultWorldLayers.push(MapValueToString(map.get("layername")))
				EntityDataLump.push(map)
			})
		}
	}
}

export let EntityDataLump: EntityDataMap[] = []
export let DefaultWorldLayers: string[] = ["world_layer_base"]

export function ParseEntityLump(stream: FileBinaryStream): void {
	try {
		ParseEntityLumpInternal(stream)
	} catch (e) {
		console.error("Error in EntityLump init", e)
	}
}

export function ResetEntityLump(): void {
	EntityDataLump = []
	DefaultWorldLayers = ["world_layer_base"]
}

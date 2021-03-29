import Color from "../Base/Color"
import QAngle from "../Base/QAngle"
import Vector3 from "../Base/Vector3"
import Manifest from "../Managers/Manifest"
import { StringToUTF8 } from "../Utils/ArrayBufferUtils"
import BinaryStream from "../Utils/BinaryStream"
import { HasBit } from "../Utils/BitsExtensions"
import { parseKV } from "./ParseKV"
import { GetMapNumberProperty, GetMapStringProperty } from "./ParseUtils"

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

type EntityDataMap = Map<string, EntityDataMapValue>
type EntityDataMapValue = string | bigint | number | boolean | Vector3 | QAngle | Color

function ReadTypedValue(stream: BinaryStream): EntityDataMapValue {
	const type: EntsTypes = stream.ReadUint32()
	switch (type) {
		case EntsTypes.FLOAT:
			return stream.ReadFloat32()
		case EntsTypes.VECTOR3:
			return new Vector3(stream.ReadFloat32(), stream.ReadFloat32(), stream.ReadFloat32())
		case EntsTypes.NODE_ID:
			return stream.ReadUint32()
		case EntsTypes.BOOL:
			return stream.ReadBoolean()
		case EntsTypes.COLOR:
			return new Color(stream.ReadUint8(), stream.ReadUint8(), stream.ReadUint8(), stream.ReadUint8())
		case EntsTypes.UINT64:
			return stream.ReadUint64()
		case EntsTypes.QANGLE:
			return new QAngle(stream.ReadFloat32(), stream.ReadFloat32(), stream.ReadFloat32())
		case EntsTypes.STRING:
			return stream.ReadNullTerminatedUtf8String()
		case EntsTypes.FLAGS:
			return stream.ReadUint32()
		default:
			throw `Unknown EntsType: ${type}`
	}
}

function ParseEntityLumpInternal(buf: Uint8Array): void {
	const kv = parseKV(buf)

	if (kv.has("m_childLumps")) {
		const m_childLumps = kv.get("m_childLumps")
		if (Array.isArray(m_childLumps)) {
			m_childLumps.forEach(childLump => {
				if (typeof childLump !== "string")
					return
				const childLumpBuf = fread(`${childLump}_c`)
				if (childLumpBuf !== undefined)
					ParseEntityLumpInternal(childLumpBuf)
			})
		}
	}
	if (kv.has("m_entityKeyValues")) {
		const m_entityKeyValues = kv.get("m_entityKeyValues")
		if (Array.isArray(m_entityKeyValues)) {
			m_entityKeyValues.forEach(entityKV => {
				if (!(entityKV instanceof Map))
					return
				// TODO: m_connections?
				let kvData = entityKV.get("m_keyValuesData")
				if (typeof kvData === "string")
					kvData = StringToUTF8(kvData)
				if (kvData instanceof Uint8Array) {
					const stream = new BinaryStream(new DataView(
						kvData.buffer,
						kvData.byteOffset,
						kvData.byteLength,
					))
					{
						const version = stream.ReadUint32()
						if (version !== 1)
							throw `Unknown entity data version: ${version}`
					}
					const hashed_keys = stream.ReadUint32(),
						string_keys = stream.ReadUint32()
					const map: EntityDataMap = new Map()
					for (let i = 0; i < hashed_keys; i++) {
						const hash = stream.ReadUint32(),
							value = ReadTypedValue(stream)
						let key = Manifest.LookupStringByToken(hash)
						if (key === undefined)
							key = hash.toString()
						map.set(key, value)
					}
					for (let i = 0; i < string_keys; i++) {
						stream.RelativeSeek(4) // hash
						const key = stream.ReadNullTerminatedUtf8String(),
							value = ReadTypedValue(stream)
						map.set(key, value)
					}
					if (
						map.get("classname") === "info_world_layer"
						&& HasBit(GetMapNumberProperty(map as RecursiveMap, "spawnflags"), 0)
					)
						DefaultWorldLayers.push(GetMapStringProperty(map as RecursiveMap, "layername"))
					EntityDataLump.push(map)
				}
			})
		}
	}
}

export let EntityDataLump: EntityDataMap[] = []
export let DefaultWorldLayers: string[] = ["world_layer_base"]

export function ParseEntityLump(buf: Uint8Array): void {
	try {
		ParseEntityLumpInternal(buf)
	} catch (e) {
		console.error("Error in EntityLump init", e)
	}
}

export function ResetEntityLump(): void {
	EntityDataLump = []
	DefaultWorldLayers = ["world_layer_base"]
}

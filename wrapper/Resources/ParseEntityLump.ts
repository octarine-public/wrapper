import Color from "../Base/Color"
import QAngle from "../Base/QAngle"
import Vector3 from "../Base/Vector3"
import Manifest from "../Managers/Manifest"
import { StringToUTF8 } from "../Utils/ArrayBufferUtils"
import { HasBit } from "../Utils/BitsExtensions"
import FileBinaryStream from "../Utils/FileBinaryStream"
import { isStream } from "../Utils/ReadableBinaryStreamUtils"
import ViewBinaryStream from "../Utils/ViewBinaryStream"
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

function ReadTypedValue(stream: ReadableBinaryStream): EntityDataMapValue {
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

function ParseEntityLumpInternal(stream: ReadableBinaryStream): void {
	const kv = parseKV(stream)

	if (kv.has("m_childLumps")) {
		const m_childLumps = kv.get("m_childLumps")
		if (Array.isArray(m_childLumps)) {
			m_childLumps.forEach(childLump => {
				if (typeof childLump !== "string")
					return
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
		const m_entityKeyValues = kv.get("m_entityKeyValues")
		if (Array.isArray(m_entityKeyValues)) {
			m_entityKeyValues.forEach(entityKV => {
				if (!(entityKV instanceof Map))
					return
				// TODO: m_connections?
				let kvData = entityKV.get("m_keyValuesData")
				if (kvData === undefined)
					return
				if (typeof kvData === "string")
					kvData = new ViewBinaryStream(new DataView(StringToUTF8(kvData).buffer))
				if (!isStream(kvData))
					return
				{
					const version = kvData.ReadUint32()
					if (version !== 1)
						throw `Unknown entity data version: ${version}`
				}
				const hashed_keys = kvData.ReadUint32(),
					string_keys = kvData.ReadUint32()
				const map: EntityDataMap = new Map()
				for (let i = 0; i < hashed_keys; i++) {
					const hash = kvData.ReadUint32(),
						value = ReadTypedValue(kvData)
					let key = Manifest.LookupStringByToken(hash)
					if (key === undefined)
						key = hash.toString()
					map.set(key, value)
				}
				for (let i = 0; i < string_keys; i++) {
					kvData.RelativeSeek(4) // hash
					const key = kvData.ReadNullTerminatedUtf8String(),
						value = ReadTypedValue(kvData)
					map.set(key, value)
				}
				if (
					map.get("classname") === "info_world_layer"
					&& HasBit(GetMapNumberProperty(map as RecursiveMap, "spawnflags"), 0)
				)
					DefaultWorldLayers.push(GetMapStringProperty(map as RecursiveMap, "layername"))
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

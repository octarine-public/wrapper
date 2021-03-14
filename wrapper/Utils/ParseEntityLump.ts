import Color from "../Base/Color"
import QAngle from "../Base/QAngle"
import Vector3 from "../Base/Vector3"
import Manifest from "../Managers/Manifest"
import { StringToUTF8 } from "./ArrayBufferUtils"
import BinaryStream from "./BinaryStream"
import { parseKV } from "./ParseKV"

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

function ParseEntityLumpInternal(buf: Uint8Array): EntityDataMap[] {
	const kv = parseKV(buf)
	if (kv === undefined)
		throw "Invalid ENTS file - no KV found"

	const ar: EntityDataMap[] = []
	if (kv.has("m_childLumps")) {
		const m_childLumps = kv.get("m_childLumps")
		if (m_childLumps instanceof Map) {
			m_childLumps.forEach(childLump => {
				if (typeof childLump === "string") {
					const childLumpBuf = fread(childLump) ?? fread(`${childLump}_c`)
					if (childLumpBuf !== undefined)
						ar.push(...ParseEntityLumpInternal(new Uint8Array(childLumpBuf)))
				}
			})
		}
	}
	if (kv.has("m_entityKeyValues")) {
		const m_entityKeyValues = kv.get("m_entityKeyValues")
		if (m_entityKeyValues instanceof Map) {
			m_entityKeyValues.forEach(entityKV => {
				if (!(entityKV instanceof Map))
					return
				// TODO: m_connections?
				const kvData = entityKV.get("m_keyValuesData")
				if (typeof kvData === "string" || kvData instanceof Uint8Array) {
					const kvDataBuf = typeof kvData === "string"
						? StringToUTF8(kvData)
						: kvData
					const stream = new BinaryStream(new DataView(
						kvDataBuf.buffer,
						kvDataBuf.byteOffset,
						kvDataBuf.byteLength,
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
					ar.push(map)
				}
			})
		}
	}

	return ar
}

export let EntityDataLump: EntityDataMap[] = []

export function ParseEntityLump(buf: ArrayBuffer): void {
	try {
		EntityDataLump = ParseEntityLumpInternal(new Uint8Array(buf))
	} catch (e) {
		console.error("Error in EntityLump init", e)
		EntityDataLump = []
	}
}

export function ResetEntityLump(): void {
	EntityDataLump = []
}

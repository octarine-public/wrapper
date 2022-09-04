import { parseKV } from "./ParseKV"

export enum MaterialFlags {
	None = 0,
	Walkable = 1 << 0,
	Nonsolid = 1 << 1,
	Water = 1 << 2,
}

export class CMaterial {
	public readonly TextureParams = new Map<string, string>()
	public readonly NumberAttributes = new Map<string, number>()
	public readonly StringAttributes = new Map<string, string>()
	public readonly Flags = MaterialFlags.None
	constructor(stream: ReadableBinaryStream) {
		const kv = parseKV(stream)
		if (kv === undefined)
			throw "Material is an invalid KV"
		const m_textureParams = kv.get("m_textureParams")
		if (m_textureParams instanceof Map || Array.isArray(m_textureParams))
			m_textureParams.forEach((param: RecursiveMapValue) => {
				if (!(param instanceof Map))
					return
				const name = param.get("m_name"),
					value = param.get("m_pValue")
				if (typeof name === "string" && typeof value === "string")
					this.TextureParams.set(name, value)
			})
		const m_intAttributes = kv.get("m_intAttributes")
		if (m_intAttributes instanceof Map || Array.isArray(m_intAttributes))
			m_intAttributes.forEach((param: RecursiveMapValue) => {
				if (!(param instanceof Map))
					return
				const name = param.get("m_name"),
					value = param.get("m_nValue")
				if (typeof name === "string" && typeof value === "number")
					this.NumberAttributes.set(name, value)
			})
		const m_floatAttributes = kv.get("m_floatAttributes")
		if (m_floatAttributes instanceof Map || Array.isArray(m_floatAttributes))
			m_floatAttributes.forEach((param: RecursiveMapValue) => {
				if (!(param instanceof Map))
					return
				const name = param.get("m_name"),
					value = param.get("m_flValue")
				if (typeof name === "string" && typeof value === "number")
					this.NumberAttributes.set(name, value)
			})
		const m_stringAttributes = kv.get("m_stringAttributes")
		if (m_stringAttributes instanceof Map || Array.isArray(m_stringAttributes))
			m_stringAttributes.forEach((param: RecursiveMapValue) => {
				if (!(param instanceof Map))
					return
				const name = param.get("m_name"),
					value = param.get("m_value")
				if (typeof name === "string" && typeof value === "string")
					this.StringAttributes.set(name, value)
			})
		if (this.NumberAttributes.has("dota.nav.walkable") && this.NumberAttributes.get("dota.nav.walkable") !== 0)
			this.Flags |= MaterialFlags.Walkable
		if (this.NumberAttributes.has("mapbuilder.nonsolid") && this.NumberAttributes.get("mapbuilder.nonsolid") !== 0)
			this.Flags |= MaterialFlags.Nonsolid
		if (this.NumberAttributes.has("mapbuilder.water") && this.NumberAttributes.get("mapbuilder.water") !== 0)
			this.Flags |= MaterialFlags.Water
	}
}

export function ParseMaterial(stream: ReadableBinaryStream): CMaterial {
	return new CMaterial(stream)
}

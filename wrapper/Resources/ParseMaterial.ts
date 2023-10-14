import { MaterialFlags } from "../Enums/MaterialFlags"

export class CMaterial {
	public readonly TextureParams = new Map<string, string>()
	public readonly NumberAttributes = new Map<string, number>()
	public readonly StringAttributes = new Map<string, string>()
	public readonly Flags = MaterialFlags.None
	constructor(stream: ReadableBinaryStream) {
		const kv = stream.ParseKV()
		if (kv.size === 0) {
			throw "Material is an invalid KV"
		}
		const textureParams = kv.get("m_textureParams")
		if (textureParams instanceof Map || Array.isArray(textureParams)) {
			textureParams.forEach((param: RecursiveMapValue) => {
				if (!(param instanceof Map)) {
					return
				}
				const name = param.get("m_name"),
					value = param.get("m_pValue")
				if (typeof name === "string" && typeof value === "string") {
					this.TextureParams.set(name, value)
				}
			})
		}
		const intAttributes = kv.get("m_intAttributes")
		if (intAttributes instanceof Map || Array.isArray(intAttributes)) {
			intAttributes.forEach((param: RecursiveMapValue) => {
				if (!(param instanceof Map)) {
					return
				}
				const name = param.get("m_name"),
					value = param.get("m_nValue")
				if (typeof name === "string" && typeof value === "number") {
					this.NumberAttributes.set(name, value)
				}
			})
		}
		const floatAttributes = kv.get("m_floatAttributes")
		if (floatAttributes instanceof Map || Array.isArray(floatAttributes)) {
			floatAttributes.forEach((param: RecursiveMapValue) => {
				if (!(param instanceof Map)) {
					return
				}
				const name = param.get("m_name"),
					value = param.get("m_flValue")
				if (typeof name === "string" && typeof value === "number") {
					this.NumberAttributes.set(name, value)
				}
			})
		}
		const stringAttributes = kv.get("m_stringAttributes")
		if (stringAttributes instanceof Map || Array.isArray(stringAttributes)) {
			stringAttributes.forEach((param: RecursiveMapValue) => {
				if (!(param instanceof Map)) {
					return
				}
				const name = param.get("m_name"),
					value = param.get("m_value")
				if (typeof name === "string" && typeof value === "string") {
					this.StringAttributes.set(name, value)
				}
			})
		}
		if (
			this.NumberAttributes.has("dota.nav.walkable") &&
			this.NumberAttributes.get("dota.nav.walkable") !== 0
		) {
			this.Flags |= MaterialFlags.Walkable
		}
		if (
			this.NumberAttributes.has("mapbuilder.nonsolid") &&
			this.NumberAttributes.get("mapbuilder.nonsolid") !== 0
		) {
			this.Flags |= MaterialFlags.Nonsolid
		}
		if (
			this.NumberAttributes.has("mapbuilder.water") &&
			this.NumberAttributes.get("mapbuilder.water") !== 0
		) {
			this.Flags |= MaterialFlags.Water
		}
	}
}

export function ParseMaterial(stream: ReadableBinaryStream): CMaterial {
	return new CMaterial(stream)
}

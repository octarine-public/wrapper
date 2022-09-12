import { entities_symbols } from "../Objects/NativeToSDK"
import Vector2 from "./Vector2"
import Vector3 from "./Vector3"
import Vector4 from "./Vector4"

export type EntityPropertyType = EntityPropertiesNode | EntityPropertyType[] | string | Vector4 | Vector3 | Vector2 | bigint | number | boolean

type StringEntityPropertyType = Map<string, StringEntityPropertyType> | StringEntityPropertyType[] | string | Vector4 | Vector3 | Vector2 | bigint | number | boolean
function ConvertToStringedMap(prop: EntityPropertyType): StringEntityPropertyType {
	if (Array.isArray(prop))
		return prop.map(el => ConvertToStringedMap(el))
	if (prop instanceof EntityPropertiesNode) {
		const stringed_map = new Map<string, StringEntityPropertyType>()
		prop.map.forEach((v, k) => stringed_map.set(entities_symbols[k], ConvertToStringedMap(v)))
		return stringed_map
	}
	return prop
}
export class EntityPropertiesNode {
	private static entities_symbols_cached = new Map<string, number>()
	public map = new Map<number, EntityPropertyType>()
	public get(name: string): Nullable<EntityPropertyType> {
		let cached_id = EntityPropertiesNode.entities_symbols_cached.get(name)
		if (cached_id === undefined) {
			cached_id = entities_symbols.indexOf(name)
			EntityPropertiesNode.entities_symbols_cached.set(name, cached_id)
		}
		if (cached_id === -1)
			return undefined
		return this.map.get(cached_id)
	}
	public set(id: number, prop: EntityPropertyType): void {
		this.map.set(id, prop)
	}
	public has(id: number): boolean {
		return this.map.has(id)
	}
	// Use for debug purposes only.
	public ConvertToStringedMap(): Map<string, StringEntityPropertyType> {
		return ConvertToStringedMap(this) as Map<string, StringEntityPropertyType>
	}
}

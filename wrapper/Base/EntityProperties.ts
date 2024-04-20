import { Events } from "../Managers/Events"
import { EntitiesSymbols } from "../Objects/NativeToSDK"
import { Vector2 } from "./Vector2"
import { Vector3 } from "./Vector3"
import { Vector4 } from "./Vector4"

export type EntityPropertyType =
	| EntityPropertiesNode
	| EntityPropertyType[]
	| string
	| Vector4
	| Vector3
	| Vector2
	| bigint
	| number
	| boolean

type StringEntityPropertyType =
	| Map<string, StringEntityPropertyType>
	| StringEntityPropertyType[]
	| string
	| Vector4
	| Vector3
	| Vector2
	| bigint
	| number
	| boolean
function ConvertToStringedMap(prop: EntityPropertyType): StringEntityPropertyType {
	if (Array.isArray(prop)) {
		return prop.map(el => ConvertToStringedMap(el))
	}
	if (prop instanceof EntityPropertiesNode) {
		const stringedMap = new Map<string, StringEntityPropertyType>()
		prop.map.forEach((v, k) =>
			stringedMap.set(EntitiesSymbols[k], ConvertToStringedMap(v))
		)
		return stringedMap
	}
	return prop
}
export class EntityPropertiesNode {
	private static entitiesSymbolsCached = new Map<string, number>()
	public map = new Map<number, EntityPropertyType>()
	public static ResetEntitySymbolCache(): void {
		EntityPropertiesNode.entitiesSymbolsCached.clear()
	}
	public get(name: string): Nullable<EntityPropertyType> {
		let cachedID = EntityPropertiesNode.entitiesSymbolsCached.get(name)
		if (cachedID === undefined) {
			cachedID = EntitiesSymbols.indexOf(name)
			EntityPropertiesNode.entitiesSymbolsCached.set(name, cachedID)
		}
		if (cachedID === -1) {
			return undefined
		}
		return this.map.get(cachedID)
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

Events.on("ServerMessage", (msgID, _buf) => {
	if (msgID === 41) {
		EntityPropertiesNode.ResetEntitySymbolCache()
	}
})

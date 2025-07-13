import { Entity } from "../Objects/Base/Entity"
import { ClassToEntities, GetConstructorByName } from "../Objects/NativeToSDK"

export const AllEntitiesAsMap = new Map<number, Entity>()

export const EntityManager = new (class CEntityManager {
	public readonly INDEX_BITS = 14
	public readonly INVALID_INDEX = -Infinity
	public readonly INVALID_HANDLE = 16777215
	public readonly INDEX_MASK = (1 << this.INDEX_BITS) - 1
	public readonly SERIAL_BITS = 17
	public readonly SERIAL_MASK = (1 << this.SERIAL_BITS) - 1
	public readonly AllEntities: Entity[] = []

	public EntityByIndex<T extends Entity>(handle: Nullable<number>): Nullable<T> {
		if (handle === undefined || handle === 0) {
			return undefined
		}
		if (handle === this.INVALID_HANDLE || handle === this.INVALID_INDEX) {
			return undefined
		}
		const index = handle & this.INDEX_MASK,
			serial = (handle >> this.INDEX_BITS) & this.SERIAL_MASK
		const ent = AllEntitiesAsMap.get(index) as T
		return ent?.SerialMatches(serial) ? ent : undefined
	}

	public GetEntitiesByClass<T>(class_: Constructor<T>): T[] {
		const ar = ClassToEntities.get(class_)
		if (ar === undefined) {
			throw "Invalid entity class"
		}
		return ar as []
	}
	public GetConstructorByName<T extends Entity>(name: string) {
		return GetConstructorByName(name) as Nullable<Constructor<T>>
	}
})()

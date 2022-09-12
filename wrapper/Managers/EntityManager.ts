import Entity from "../Objects/Base/Entity"
import { ClassToEntities } from "../Objects/NativeToSDK"

export const AllEntitiesAsMap = new Map<number, Entity>()

// that's MUCH more efficient than Map<number, boolean>
class bitset {
	private ar: Uint32Array
	constructor(size: number) { this.ar = new Uint32Array(Math.ceil(size / 4 / 8)).fill(0) }

	public reset() { this.ar = this.ar.fill(0) }

	public get(pos: number): boolean {
		// uint32 = 4 bytes, 1 byte = 8 bits
		return (this.ar[(pos / (4 * 8)) | 0] & (1 << (pos % (4 * 8)))) !== 0
	}
	public set(pos: number, new_val: boolean): void {
		const ar_pos = (pos / (4 * 8)) | 0
		const mask = 1 << (pos % (4 * 8))
		if (!new_val)
			this.ar[ar_pos] &= ~mask
		else
			this.ar[ar_pos] |= mask
	}
	public set_buf(buf: ArrayBuffer): void {
		new Uint8Array(this.ar.buffer).set(new Uint8Array(buf))
	}
}

export const TreeActiveMask = new bitset(0x4000)
class CEntityManager {
	public readonly INDEX_BITS = 14
	public readonly INDEX_MASK = (1 << this.INDEX_BITS) - 1
	public readonly SERIAL_BITS = 17
	public readonly SERIAL_MASK = (1 << this.SERIAL_BITS) - 1
	public readonly AllEntities: Entity[] = []

	public EntityByIndex(handle: Nullable<number>): Nullable<Entity> {
		if (handle === 0 || handle === undefined)
			return undefined
		const index = handle & this.INDEX_MASK,
			serial = (handle >> this.INDEX_BITS) & this.SERIAL_MASK
		const ent = AllEntitiesAsMap.get(index)
		return ent?.SerialMatches(serial)
			? ent
			: undefined
	}

	public GetEntitiesByClass<T>(class_: Constructor<T>): T[] {
		const ar = ClassToEntities.get(class_)
		if (ar === undefined)
			throw "Invalid entity class"
		return ar as []
	}
	public IsTreeActive(binary_id: number): boolean {
		return TreeActiveMask.get(binary_id)
	}
	public SetWorldTreeState(WorldTreeState: bigint[]): void {
		TreeActiveMask.set_buf(new BigUint64Array(WorldTreeState).buffer)
	}
}

const EntityManager = new CEntityManager()
export default EntityManager

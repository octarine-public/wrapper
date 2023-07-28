import { GetPositionHeight } from "../Native/WASM"
import { EntityPropertiesNode } from "./EntityProperties"
import { Vector2 } from "./Vector2"
import { Vector3 } from "./Vector3"

export class NeutralSpawnBox {
	constructor(public readonly properties: EntityPropertiesNode) {}

	public get MinBounds(): Vector3 {
		return this.properties.get("m_vMinBounds") as Vector3
	}
	public get MaxBounds(): Vector3 {
		return this.properties.get("m_vMaxBounds") as Vector3
	}
	public get Center(): Vector3 {
		const vec = this.MinBounds.Add(this.MaxBounds).DivideScalarForThis(2)
		vec.SetZ(GetPositionHeight(vec))
		return vec
	}
	public get SpawnBoxOrigin(): Vector3 {
		return this.properties.get("vSpawnBoxOrigin") as Vector3
	}
	public get CampName(): string {
		return this.properties.get("strCampName") as string
	}
	public Includes(vec: Vector3): boolean {
		const min = this.MinBounds
		const max = this.MaxBounds
		const minX = Math.min(min.x, max.x)
		const minY = Math.min(min.y, max.y)
		const minZ = Math.min(min.z, max.z)
		const maxX = Math.max(min.x, max.x)
		const maxY = Math.max(min.y, max.y)
		const maxZ = Math.max(min.z, max.z)
		return (
			vec.x >= minX &&
			vec.x <= maxX &&
			vec.y >= minY &&
			vec.y <= maxY &&
			vec.z >= minZ &&
			vec.z <= maxZ
		)
	}
	public Includes2D(vec: Vector2): boolean {
		const min = this.MinBounds
		const max = this.MaxBounds
		const minX = Math.min(min.x, max.x)
		const minY = Math.min(min.y, max.y)
		const maxX = Math.max(min.x, max.x)
		const maxY = Math.max(min.y, max.y)
		return vec.x >= minX && vec.x <= maxX && vec.y >= minY && vec.y <= maxY
	}

	public toJSON(): any {
		return {
			MinBounds: this.MinBounds,
			MaxBounds: this.MaxBounds,
			SpawnBoxOrigin: this.SpawnBoxOrigin,
			CampName: this.CampName
		}
	}
}

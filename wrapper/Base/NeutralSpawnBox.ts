import { GetPositionHeight } from "../Native/WASM"
import { EntityPropertiesNode } from "./EntityProperties"
import { Vector2 } from "./Vector2"
import { Vector3 } from "./Vector3"

export class NeutralSpawnBox {
	constructor(public readonly properties: EntityPropertiesNode) { }

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
		const min_x = Math.min(min.x, max.x)
		const min_y = Math.min(min.y, max.y)
		const min_z = Math.min(min.z, max.z)
		const max_x = Math.max(min.x, max.x)
		const max_y = Math.max(min.y, max.y)
		const max_z = Math.max(min.z, max.z)
		return (
			vec.x >= min_x && vec.x <= max_x
			&& vec.y >= min_y && vec.y <= max_y
			&& vec.z >= min_z && vec.z <= max_z
		)
	}
	public Includes2D(vec: Vector2): boolean {
		const min = this.MinBounds
		const max = this.MaxBounds
		const min_x = Math.min(min.x, max.x)
		const min_y = Math.min(min.y, max.y)
		const max_x = Math.max(min.x, max.x)
		const max_y = Math.max(min.y, max.y)
		return (
			vec.x >= min_x && vec.x <= max_x
			&& vec.y >= min_y && vec.y <= max_y
		)
	}

	public toJSON(): any {
		return {
			MinBounds: this.MinBounds,
			MaxBounds: this.MaxBounds,
			SpawnBoxOrigin: this.SpawnBoxOrigin,
			CampName: this.CampName,
		}
	}
}

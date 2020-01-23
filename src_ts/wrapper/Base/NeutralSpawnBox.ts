import { EntityPropertyType } from "../Managers/EntityManager"
import Vector3 from "./Vector3"

export default class NeutralSpawnBox {
	constructor(public readonly properties: Map<string, EntityPropertyType>) { }

	public get MinBounds(): Vector3 {
		return this.properties.get("m_vMinBounds") as Vector3
	}
	public get MaxBounds(): Vector3 {
		return this.properties.get("m_vMaxBounds") as Vector3
	}
	public get SpawnBoxOrigin(): Vector3 {
		return this.properties.get("vSpawnBoxOrigin") as Vector3
	}
	public get CampName(): string {
		return this.properties.get("strCampName") as string
	}
	public toJSON(): any {
		return {
			MinBounds: this.MinBounds.toArray(),
			MaxBounds: this.MaxBounds.toArray(),
			SpawnBoxOrigin: this.SpawnBoxOrigin.toArray(),
			CampName: this.CampName,
		}
	}
}

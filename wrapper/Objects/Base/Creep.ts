import { Vector2 } from "../../Base/Vector2"
import { WrapperClass } from "../../Decorators"
import { MapArea } from "../../Enums/MapArea"
import { GUIInfo } from "../../GUI/GUIInfo"
import { GetMapArea } from "../../Helpers/DotaMap"
import { EntityManager } from "../../Managers/EntityManager"
import { EventsSDK } from "../../Managers/EventsSDK"
import { Unit } from "./Unit"

@WrapperClass("CDOTA_BaseNPC_Creep")
export class Creep extends Unit {
	public Lane = MapArea.Unknown
	public PredictedIsWaitingToSpawn = true

	/** @ignore */
	constructor(
		public readonly Index: number,
		serial: number
	) {
		super(Index, serial)
		this.IsCreep = true
	}

	public get IsEidolon() {
		return this.Name.endsWith("_lesser_eidolon")
	}

	public get IsLaneCreep() {
		return (
			this.ClassName === "CDOTA_BaseNPC_Creep_Lane" ||
			this.ClassName === "CDOTA_BaseNPC_Creep_Siege"
		)
	}

	public get IsNeutral() {
		return super.IsNeutral || this.ClassName === "CDOTA_BaseNPC_Creep_Neutral"
	}

	public get IsSuperCreep() {
		return this.Name.endsWith("_upgraded")
	}

	public get IsMegaCreep() {
		return this.Name.endsWith("_upgraded_mega")
	}

	public get IsDeniable(): boolean {
		return this.HPPercent <= 50 || super.IsDeniable
	}
	public get RingRadius(): number {
		return 60
	}
	public get HealthBarSize() {
		return new Vector2(GUIInfo.ScaleHeight(80), GUIInfo.ScaleHeight(5))
	}
	public get HealthBarPositionCorrection() {
		return new Vector2(this.HealthBarSize.x / 2, GUIInfo.ScaleHeight(11))
	}
	public TryAssignLane(): void {
		if (this.IsNeutral || this.Owner !== undefined || this.Lane !== MapArea.Unknown) {
			return
		}
		const area = GetMapArea(this.Position, true)
		switch (area[0]) {
			case MapArea.Top:
			case MapArea.Bottom:
			case MapArea.Middle:
				this.Lane = area[0]
				break
			default:
				break
		}
	}
}

export const Creeps = EntityManager.GetEntitiesByClass(Creep)
EventsSDK.on("PreEntityCreated", ent => {
	if (ent instanceof Creep) {
		ent.TryAssignLane()
	}
})

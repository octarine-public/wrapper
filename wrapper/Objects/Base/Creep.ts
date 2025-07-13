import { Vector2 } from "../../Base/Vector2"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { MapArea } from "../../Enums/MapArea"
import { ScaleHeight } from "../../GUI/Helpers"
import { GetMapArea } from "../../Helpers/DotaMap"
import { EntityManager } from "../../Managers/EntityManager"
import { Unit } from "./Unit"

@WrapperClass("CDOTA_BaseNPC_Creep")
export class Creep extends Unit {
	public Lane = MapArea.Unknown
	public PredictedIsWaitingToSpawn = true
	@NetworkedBasicField("m_flHealthRegen")
	public readonly BaseHPRegen: number = 0

	constructor(
		public readonly Index: number,
		serial: number
	) {
		super(Index, serial)
		this.IsCreep = true
	}

	public get HPRegen(): number {
		return this.IsLaneCreep
			? this.ModifierManager.GetHealthRegen(this.BaseHPRegen)
			: super.HPRegen
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
		return super.IsDeniable || this.HPPercent <= 50
	}
	public get RingRadius(): number {
		return 60
	}
	public get HealthBarSize() {
		const size = new Vector2(ScaleHeight(80), ScaleHeight(5))
		switch (this.UnitType) {
			case 130:
				return size.SetX(ScaleHeight(100)).SetY(ScaleHeight(7))
			default:
				return size
		}
	}
	public get HealthBarPositionCorrection() {
		const size = new Vector2(this.HealthBarSize.x / 2, ScaleHeight(11))
		switch (this.UnitType) {
			case 130:
				return size.SetY(ScaleHeight(24))
			default:
				return size
		}
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

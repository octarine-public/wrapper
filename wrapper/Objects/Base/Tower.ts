import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { Team } from "../../Enums/Team"
import { EntityManager } from "../../Managers/EntityManager"
import { Building } from "./Building"
import { Unit } from "./Unit"

@WrapperClass("CDOTA_BaseNPC_Tower")
export class Tower extends Building {
	@NetworkedBasicField("m_hTowerAttackTarget")
	public TowerAttackTarget_ = 0

	public get TowerAttackTarget(): Nullable<Unit> {
		return EntityManager.EntityByIndex(this.TowerAttackTarget_) as Nullable<Unit>
	}
	public get IsDeniable(): boolean {
		return super.IsDeniable || this.HPPercent <= 10
	}
	public get Rotation(): number {
		let ang = super.Rotation
		if (this.Team === Team.Radiant)
			ang += 45 // probably hardcoded somewhere in dota
		if (ang >= 180)
			return ang - 360
		return ang
	}
	public get NetworkedRotation(): number {
		let ang = super.Rotation
		if (this.Team === Team.Radiant)
			ang += 45 // probably hardcoded somewhere in dota
		if (ang >= 180)
			return ang - 360
		return ang
	}
}

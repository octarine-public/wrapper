import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { EntityManager } from "../../Managers/EntityManager"
import { Building } from "./Building"
import { Unit } from "./Unit"

@WrapperClass("CDOTA_BaseNPC_Tower")
export class Tower extends Building {
	@NetworkedBasicField("m_hTowerAttackTarget")
	public TowerAttackTarget_ = 0

	public get TowerAttackTarget() {
		return EntityManager.EntityByIndex<Unit>(this.TowerAttackTarget_)
	}
	public get IsDeniable(): boolean {
		return super.IsDeniable || this.HPPercent <= 10
	}
}

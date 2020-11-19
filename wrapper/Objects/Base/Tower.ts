import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import EntityManager from "../../Managers/EntityManager"
import Building from "./Building"
import Unit from "./Unit"

@WrapperClass("C_DOTA_BaseNPC_Tower")
export default class Tower extends Building {
	@NetworkedBasicField("m_hTowerAttackTarget")
	public TowerAttackTarget_ = 0

	public get TowerAttackTarget(): Nullable<Unit> {
		return EntityManager.EntityByIndex(this.TowerAttackTarget_) as Nullable<Unit>
	}
	public get IsDeniable(): boolean {
		return super.IsDeniable || this.HPPercent <= 10
	}
}

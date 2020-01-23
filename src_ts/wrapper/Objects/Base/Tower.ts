import EntityManager from "../../Managers/EntityManager"
import Building from "./Building"
import Unit from "./Unit"

export default class Tower extends Building {
	public NativeEntity: Nullable<C_DOTA_BaseNPC_Tower>
	public TowerAttackTarget_ = 0

	public get TowerAttackTarget(): Nullable<Unit> {
		return EntityManager.EntityByIndex(this.TowerAttackTarget_) as Nullable<Unit>
	}
	public get IsDeniable(): boolean {
		return super.IsDeniable || this.HPPercent <= 10
	}
}

import { RegisterClass, RegisterFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_BaseNPC_Tower", Tower)
RegisterFieldHandler(Tower, "m_hTowerAttackTarget", (tower, new_value) => tower.TowerAttackTarget_ = new_value as number)

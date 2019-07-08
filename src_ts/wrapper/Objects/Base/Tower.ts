import EntityManager from "../../Managers/EntityManager"
import Building from "./Building"
import Unit from "./Unit"

export default class Tower extends Building {
	readonly m_pBaseEntity: C_DOTA_BaseNPC_Tower

	get IsTower(): boolean {
		return true
	}
	get TowerAttackTarget(): Unit {
		return EntityManager.GetEntityByNative(this.m_pBaseEntity.m_hTowerAttackTarget) as Unit
	}
}

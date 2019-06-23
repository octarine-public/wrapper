import Building from "./Building";
import Unit from "./Unit";
import EntityManager from "../../Managers/EntityManager";

export default class Tower extends Building {
	readonly m_pBaseEntity: C_DOTA_BaseNPC_Tower
	
	get TowerAttackTarget(): Unit {
		return EntityManager.GetEntityByNative(this.m_pBaseEntity.m_hTowerAttackTarget) as Unit;
	}
}
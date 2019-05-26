import Unit from "./Unit";

export default class Building extends Unit {

	m_pBaseEntity: C_DOTA_BaseNPC_Building
	
	get HeroStatueOwnerPlayerID(): number {
		return this.m_pBaseEntity.m_iHeroStatueOwnerPlayerID;
	}
	get HeroStatue(): boolean {
		return this.m_pBaseEntity.m_bHeroStatue;
	}
}
import Unit from "./Unit"

export default class Building extends Unit {
	public readonly m_pBaseEntity: C_DOTA_BaseNPC_Building

	get IsBuilding(): boolean {
		return true
	}
	get HeroStatueOwnerPlayerID(): number {
		return this.m_pBaseEntity.m_iHeroStatueOwnerPlayerID
	}
	get IsHeroStatue(): boolean {
		return this.m_pBaseEntity.m_bHeroStatue
	}
}

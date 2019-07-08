import Hero from "../Base/Hero"

export default class Meepo extends Hero {
	readonly m_pBaseEntity: C_DOTA_Unit_Hero_Meepo

	get WhichMeepo(): number {
		return this.m_pBaseEntity.m_nWhichMeepo
	}
	get IsIllusion(): boolean {
		return this.ReplicateFrom !== undefined && this.m_pBaseEntity.m_bIsIllusion
	}
	get IsClone(): boolean {
		return this.m_pBaseEntity.m_bIsIllusion
	}
}
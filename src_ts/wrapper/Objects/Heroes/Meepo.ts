import Hero from "../Base/Hero"

export default class Meepo extends Hero {
	public readonly m_pBaseEntity: C_DOTA_Unit_Hero_Meepo

	public get WhichMeepo(): number {
		return this.m_pBaseEntity.m_nWhichMeepo
	}
	public get IsIllusion(): boolean {
		return this.ReplicateFrom !== undefined && this.m_pBaseEntity.m_bIsIllusion
	}
	public get IsClone(): boolean {
		return this.m_pBaseEntity.m_bIsIllusion
	}
}

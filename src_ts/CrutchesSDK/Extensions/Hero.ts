import Unit from "./Unit"

export default class Hero extends Unit {
	m_pBaseEntity: C_DOTA_BaseNPC_Hero

	get AbilityPoint(): number {
		return this.m_pBaseEntity.m_iAbilityPoints
	}
	get Agility(): number {
		return this.m_pBaseEntity.m_flAgility
	}
	get CurrentXP(): number {
		return this.m_pBaseEntity.m_iCurrentXP
	}
	get HeroID(): number {
		return this.m_pBaseEntity.m_iHeroID
	}
	get Intelligence(): number {
		return this.m_pBaseEntity.m_flIntellect
	}
	get IsBuybackDisabled(): boolean {
		return this.m_pBaseEntity.m_bBuybackDisabled
	}
	get IsIllusion(): boolean {
		return this.m_pBaseEntity.m_bIsIllusion /*|| this.ReplicateFrom !== null*/
	}
	get IsReincarnating(): boolean {
		return this.m_pBaseEntity.m_bReincarnating
	}
	get LastHurtTime(): number {
		return this.m_pBaseEntity.m_flLastHurtTime
	}
	/**
	 * need getting from entitymanager
	 */
	/* get Player(): Player {
		return //this.m_pBaseEntity.m_iPlayerID;
	} */
	get PrimaryAtribute(): Attributes {
		return this.m_pBaseEntity.m_iPrimaryAttribute
	}
	get RecentDamage(): number {
		return this.m_pBaseEntity.m_iRecentDamage
	}
	/**
	 * need getting from entitymanager
	 */
	/* get ReplicateFrom(): Hero {
		return this.m_pBaseEntity.m_hReplicatingOtherHeroModel
	} */
	get RespawnTime(): number {
		return this.m_pBaseEntity.m_flRespawnTime
	}
	get RespawnTimePenalty(): number {
		return this.m_pBaseEntity.m_flRespawnTimePenalty
	}
	get SpawnedAt(): number {
		return this.m_pBaseEntity.m_flSpawnedAt
	}
	get Strength(): number {
		return this.m_pBaseEntity.m_flStrength
	}
	get TotalAgility(): number {
		return this.m_pBaseEntity.m_flAgilityTotal
	}
	get TotalIntelligence(): number {
		return this.m_pBaseEntity.m_flIntellectTotal
	}
	get TotalStrength(): number {
		return this.m_pBaseEntity.m_flStrengthTotal
	}
}

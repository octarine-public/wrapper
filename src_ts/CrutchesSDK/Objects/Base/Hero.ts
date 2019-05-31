import Unit from "./Unit"
import EntityManager from "../../Managers/EntityManager";
import Player from "./Player";

export default class Hero extends Unit {
	m_pBaseEntity: C_DOTA_BaseNPC_Hero

	/* ============ BASE  ============ */
	
	get AbilityPoint(): number {
		return this.m_pBaseEntity.m_iAbilityPoints
	}
	get Agility(): number {
		return this.m_pBaseEntity.m_flAgility
	}
	get CurrentXP(): number {
		return this.m_pBaseEntity.m_iCurrentXP
	}
	get HeroID(): HeroID_t {
		return this.m_pBaseEntity.m_iHeroID
	}
	get Intelligence(): number {
		return this.m_pBaseEntity.m_flIntellect
	}
	get IsBuybackDisabled(): boolean {
		return this.m_pBaseEntity.m_bBuybackDisabled
	}
	get IsIllusion(): boolean {
		return this.ReplicateFrom !== undefined;
	}
	get IsReincarnating(): boolean {
		return this.m_pBaseEntity.m_bReincarnating
	}
	get LastHurtTime(): number {
		return this.m_pBaseEntity.m_flLastHurtTime
	}
	get Player(): Player {
		return EntityManager.GetPlayerByID(this.PlayerID) as Player;
	}
	get PlayerID(): number {
		return this.m_pBaseEntity.m_iPlayerID;
	}
	get PrimaryAtribute(): Attributes {
		return this.m_pBaseEntity.m_iPrimaryAttribute
	}
	get RecentDamage(): number {
		return this.m_pBaseEntity.m_iRecentDamage
	}
	get ReplicateFrom(): Hero {
		return EntityManager.GetEntityByNative(this.m_pBaseEntity.m_hReplicatingOtherHeroModel) as Hero;
	}
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
	
	/* ============ EXTENSIONS ============ */
	
	/**
	 * https://dota2.gamepedia.com/Intelligence
	 */
	get SpellAmplification(): number {
		return super.SpellAmplification + (this.TotalIntelligence * 0.07 / 100)
	}
}
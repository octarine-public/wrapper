import { DamageAmplifyPerIntellectPrecent } from "../../Data/GameData"

import EntityManager from "../../Managers/EntityManager"
import Player from "./Player"
import Unit from "./Unit"
import Entity from "./Entity"

export default class Hero extends Unit {
	public readonly m_pBaseEntity!: C_DOTA_BaseNPC_Hero
	public ReplicatingOtherHeroModel_: Entity | CEntityIndex = this.m_pBaseEntity.m_hReplicatingOtherHeroModel

	get IsHero(): boolean {
		return true
	}

	/* ============ BASE  ============ */

	get AbilityPoint(): number {
		return this.m_pBaseEntity.m_iAbilityPoints
	}
	get CurrentXP(): number {
		return this.m_pBaseEntity.m_iCurrentXP
	}
	get HeroID(): number {
		return this.m_pBaseEntity.m_iHeroID
	}
	get IsBuybackDisabled(): boolean {
		return this.m_pBaseEntity.m_bBuybackDisabled
	}
	get ReplicatingOtherHeroModel(): Nullable<Entity> {
		if (this.ReplicatingOtherHeroModel_ instanceof Entity)
			return this.ReplicatingOtherHeroModel_

		this.ReplicatingOtherHeroModel_ = EntityManager.GetEntityByNative(this.ReplicatingOtherHeroModel_) ?? this.ReplicatingOtherHeroModel_

		if (this.ReplicatingOtherHeroModel_ instanceof Entity)
			return this.ReplicatingOtherHeroModel_

		return undefined
	}
	get IsIllusion(): boolean {
		if (this.ReplicatingOtherHeroModel_ === undefined)
			return false
		return (this.ReplicatingOtherHeroModel_ instanceof Entity) || (this.ReplicatingOtherHeroModel_ instanceof C_BaseEntity) || (this.ReplicatingOtherHeroModel_ > 0)
	}
	get IsReincarnating(): boolean {
		return this.m_pBaseEntity.m_bReincarnating
	}
	get LastHurtTime(): number {
		return this.m_pBaseEntity.m_flLastHurtTime
	}
	get PlayerID(): number {
		return this.m_pBaseEntity.m_iPlayerID
	}
	get Player(): Nullable<Player> {
		return EntityManager.GetPlayerByID(this.PlayerID)
	}
	get PrimaryAtribute(): Attributes {
		return this.m_pBaseEntity.m_iPrimaryAttribute
	}
	get RecentDamage(): number {
		return this.m_pBaseEntity.m_iRecentDamage
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
	get Agility(): number {
		return this.m_pBaseEntity.m_flAgility
	}
	get Intellect(): number {
		return this.m_pBaseEntity.m_flIntellect
	}
	get Strength(): number {
		return this.m_pBaseEntity.m_flStrength
	}
	get TotalAgility(): number {
		return this.m_pBaseEntity.m_flAgilityTotal
	}
	get TotalIntellect(): number {
		return this.m_pBaseEntity.m_flIntellectTotal
	}
	get TotalStrength(): number {
		return this.m_pBaseEntity.m_flStrengthTotal
	}

	/* ============ EXTENSIONS ============ */

	get SpellAmplification(): number {
		return super.SpellAmplification + (this.TotalIntellect * DamageAmplifyPerIntellectPrecent / 100)
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_BaseNPC_Hero", Hero)

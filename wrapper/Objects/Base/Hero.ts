import { DamageAmplifyPerIntellectPrecent } from "../../Data/GameData"

import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import EntityManager from "../../Managers/EntityManager"
import Entity from "./Entity"
import Unit from "./Unit"

@WrapperClass("CDOTA_BaseNPC_Hero")
export default class Hero extends Unit {
	@NetworkedBasicField("m_iAbilityPoints")
	public AbilityPoints = 0
	@NetworkedBasicField("m_iCurrentXP")
	public CurrentXP = 0
	@NetworkedBasicField("m_bReincarnating")
	public IsReincarnating = false
	@NetworkedBasicField("m_iPlayerID")
	public PlayerID = 0
	@NetworkedBasicField("m_iRecentDamage")
	public RecentDamage = 0
	@NetworkedBasicField("m_flRespawnTime")
	public RespawnTime = 0
	@NetworkedBasicField("m_flRespawnTimePenalty")
	public RespawnTimePenalty = 0
	@NetworkedBasicField("m_flSpawnedAt")
	public SpawnedAt = 0
	@NetworkedBasicField("m_flAgility")
	public Agility = 0
	@NetworkedBasicField("m_flIntellect")
	public Intellect = 0
	@NetworkedBasicField("m_flStrength")
	public Strength = 0
	@NetworkedBasicField("m_flAgilityTotal")
	public TotalAgility = 0
	@NetworkedBasicField("m_flIntellectTotal")
	public TotalIntellect = 0
	@NetworkedBasicField("m_flStrengthTotal")
	public TotalStrength = 0
	public m_hReplicatingOtherHeroModel = 0x3FFF

	public get IsHero(): boolean {
		return true
	}
	public get ReplicatingOtherHeroModel_(): Entity | number {
		const id = this.m_hReplicatingOtherHeroModel
		if (id === 0x3FFF)
			return 0
		return EntityManager.EntityByIndex(id) ?? id
	}
	public get HeroID(): number {
		return this.UnitData.HeroID
	}
	public get ReplicatingOtherHeroModel(): Nullable<Entity> {
		return EntityManager.EntityByIndex(this.m_hReplicatingOtherHeroModel)
	}
	public get IsIllusion(): boolean {
		const ReplicatingOtherHeroModel_ = this.ReplicatingOtherHeroModel_
		return (ReplicatingOtherHeroModel_ instanceof Entity) || (ReplicatingOtherHeroModel_ > 0)
	}
	public get SpellAmplification(): number {
		return super.SpellAmplification + (this.TotalIntellect * DamageAmplifyPerIntellectPrecent / 100)
	}
}

import { RegisterFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterFieldHandler(Hero, "m_hReplicatingOtherHeroModel", (ent, new_val) => {
	ent.m_hReplicatingOtherHeroModel = (new_val as number) & 0x3FFF
})

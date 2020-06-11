import { DamageAmplifyPerIntellectPrecent } from "../../Data/GameData"

import EntityManager from "../../Managers/EntityManager"
import Unit from "./Unit"
import Entity from "./Entity"
import { WrapperClass, NetworkedBasicField } from "../../Decorators"

@WrapperClass("C_DOTA_BaseNPC_Hero")
export default class Hero extends Unit {
	@NetworkedBasicField("m_iAbilityPoints")
	public AbilityPoints = 0
	@NetworkedBasicField("m_iCurrentXP")
	public CurrentXP = 0
	@NetworkedBasicField("m_bReincarnating")
	public IsReincarnating = false
	@NetworkedBasicField("m_iPlayerID")
	public PlayerID = 0
	@NetworkedBasicField("m_iPrimaryAttribute")
	public PrimaryAtribute = Attributes.DOTA_ATTRIBUTE_INVALID
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

	public get ReplicatingOtherHeroModel_(): Entity | number {
		let id = this.m_hReplicatingOtherHeroModel
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
		let ReplicatingOtherHeroModel_ = this.ReplicatingOtherHeroModel_
		return (ReplicatingOtherHeroModel_ instanceof Entity) || (ReplicatingOtherHeroModel_ > 0)
	}

	public get SpellAmplification(): number {
		return super.SpellAmplification + (this.TotalIntellect * DamageAmplifyPerIntellectPrecent / 100)
	}
}

import { RegisterFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterFieldHandler(Hero, "m_hReplicatingOtherHeroModel", (ent, new_val) => ent.m_hReplicatingOtherHeroModel = (new_val as number) & 0x3FFF)

import { DamageAmplifyPerIntellectPrecent } from "../../Data/GameData"

import EntityManager from "../../Managers/EntityManager"
import Unit from "./Unit"
import Entity from "./Entity"

export default class Hero extends Unit {
	public NativeEntity: Nullable<C_DOTA_BaseNPC_Hero>
	public AbilityPoints = 0
	public CurrentXP = 0
	public IsReincarnating = false
	public PlayerID = 0
	public PrimaryAtribute = Attributes.DOTA_ATTRIBUTE_INVALID
	public RecentDamage = 0
	public RespawnTime = 0
	public RespawnTimePenalty = 0
	public SpawnedAt = 0
	public Agility = 0
	public Intellect = 0
	public Strength = 0
	public TotalAgility = 0
	public TotalIntellect = 0
	public TotalStrength = 0
	public m_hReplicatingOtherHeroModel = 0x3FFF

	/* ============ BASE  ============ */
	public get ReplicatingOtherHeroModel_(): C_BaseEntity | number {
		let id = this.m_hReplicatingOtherHeroModel
		if (id === 0x3FFF)
			return 0
		return EntityManager.NativeByIndex(id) ?? id
	}
	public get HeroID(): number {
		return this.UnitData.HeroID
	}
	public get IsBuybackDisabled(): boolean {
		return this.NativeEntity?.m_bBuybackDisabled ?? false
	}
	public get ReplicatingOtherHeroModel(): Nullable<Entity> {
		return EntityManager.EntityByIndex(this.m_hReplicatingOtherHeroModel)
	}
	public get IsIllusion(): boolean {
		let ReplicatingOtherHeroModel_ = this.ReplicatingOtherHeroModel_
		return (ReplicatingOtherHeroModel_ instanceof C_BaseEntity) || (ReplicatingOtherHeroModel_ > 0)
	}
	public get LastHurtTime(): number {
		return this.NativeEntity?.m_flLastHurtTime ?? 0
	}

	/* ============ EXTENSIONS ============ */
	public get SpellAmplification(): number {
		return super.SpellAmplification + (this.TotalIntellect * DamageAmplifyPerIntellectPrecent / 100)
	}
}

import { RegisterClass, RegisterFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_BaseNPC_Hero", Hero)
RegisterFieldHandler(Hero, "m_iAbilityPoints", (ent, new_val) => ent.AbilityPoints = new_val as number)
RegisterFieldHandler(Hero, "m_iCurrentXP", (ent, new_val) => ent.CurrentXP = new_val as number)
RegisterFieldHandler(Hero, "m_bReincarnating", (ent, new_val) => ent.IsReincarnating = new_val as boolean)
RegisterFieldHandler(Hero, "m_iPlayerID", (ent, new_val) => ent.PlayerID = new_val as number)
RegisterFieldHandler(Hero, "m_iPrimaryAttribute", (ent, new_val) => ent.PrimaryAtribute = new_val as Attributes)
RegisterFieldHandler(Hero, "m_iRecentDamage", (ent, new_val) => ent.RecentDamage = new_val as number)
RegisterFieldHandler(Hero, "m_flRespawnTime", (ent, new_val) => ent.RespawnTime = new_val as number)
RegisterFieldHandler(Hero, "m_flRespawnTimePenalty", (ent, new_val) => ent.RespawnTimePenalty = new_val as number)
RegisterFieldHandler(Hero, "m_flSpawnedAt", (ent, new_val) => ent.SpawnedAt = new_val as number)
RegisterFieldHandler(Hero, "m_flAgility", (ent, new_val) => ent.Agility = new_val as number)
RegisterFieldHandler(Hero, "m_flIntellect", (ent, new_val) => ent.Intellect = new_val as number)
RegisterFieldHandler(Hero, "m_flStrength", (ent, new_val) => ent.Strength = new_val as number)
RegisterFieldHandler(Hero, "m_flAgilityTotal", (ent, new_val) => ent.TotalAgility = new_val as number)
RegisterFieldHandler(Hero, "m_flIntellectTotal", (ent, new_val) => ent.TotalIntellect = new_val as number)
RegisterFieldHandler(Hero, "m_flStrengthTotal", (ent, new_val) => ent.TotalStrength = new_val as number)
RegisterFieldHandler(Hero, "m_hReplicatingOtherHeroModel", (ent, new_val) => ent.m_hReplicatingOtherHeroModel = (new_val as number) & 0x3FFF)

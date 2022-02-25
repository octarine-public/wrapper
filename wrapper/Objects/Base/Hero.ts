import { DamageAmplifyPerIntellectPrecent } from "../../Data/GameData"

import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import EntityManager from "../../Managers/EntityManager"
import EventsSDK from "../../Managers/EventsSDK"
import FakeUnit, { GetPredictionTarget } from "./FakeUnit"
import Unit from "./Unit"

@WrapperClass("CDOTA_BaseNPC_Hero")
export default class Hero extends Unit {
	@NetworkedBasicField("m_iAbilityPoints")
	public AbilityPoints = 0
	@NetworkedBasicField("m_iCurrentXP")
	public CurrentXP = 0
	@NetworkedBasicField("m_bReincarnating")
	public IsReincarnating = false
	@NetworkedBasicField("m_nPlayerID")
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
	public ReplicatingOtherHeroModel: Nullable<Unit | FakeUnit>

	public get IsHero(): boolean {
		return true
	}
	public get HeroID(): number {
		return this.UnitData.HeroID
	}
	public get IsIllusion(): boolean {
		return this.ReplicatingOtherHeroModel !== undefined
	}
	public get SpellAmplification(): number {
		return super.SpellAmplification + (this.TotalIntellect * DamageAmplifyPerIntellectPrecent / 100)
	}
}
export const Heroes = EntityManager.GetEntitiesByClass(Hero)

import { RegisterFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterFieldHandler(Hero, "m_hReplicatingOtherHeroModel", async (ent, new_val) => {
	const id = new_val as number
	ent.ReplicatingOtherHeroModel = await GetPredictionTarget(id)
})

EventsSDK.on("PreEntityCreated", ent => {
	if (!(ent instanceof Unit))
		return
	for (const hero of Heroes)
		if (hero.ReplicatingOtherHeroModel?.EntityMatches(ent))
			hero.ReplicatingOtherHeroModel = ent
})

EventsSDK.on("EntityDestroyed", ent => {
	if (!(ent instanceof Unit))
		return
	for (const hero of Heroes)
		if (hero.ReplicatingOtherHeroModel === ent)
			hero.ReplicatingOtherHeroModel = undefined
})

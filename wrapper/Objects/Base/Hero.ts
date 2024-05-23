import { Vector2 } from "../../Base/Vector2"
import { DamageAmplifyPerIntellectPrecent } from "../../Data/GameData"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { GUIInfo } from "../../GUI/GUIInfo"
import { EntityManager } from "../../Managers/EntityManager"
import { EventsSDK } from "../../Managers/EventsSDK"
import { RegisterFieldHandler } from "../../Objects/NativeToSDK"
import { GameState } from "../../Utils/GameState"
import { LocalPlayer } from "./Entity"
import { FakeUnit, GetPredictionTarget } from "./FakeUnit"
import { Unit } from "./Unit"

@WrapperClass("CDOTA_BaseNPC_Hero")
export class Hero extends Unit {
	@NetworkedBasicField("m_iAbilityPoints")
	public AbilityPoints = 0
	@NetworkedBasicField("m_iCurrentXP")
	public CurrentXP = 0
	@NetworkedBasicField("m_bReincarnating")
	public IsReincarnating = false
	@NetworkedBasicField("m_iRecentDamage")
	public RecentDamage = 0
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
	public BaseTotalIntellect = 0
	@NetworkedBasicField("m_flStrengthTotal")
	public TotalStrength = 0

	public RespawnTime = 0
	public MaxRespawnDuration = 0
	public RespawnTimePenalty = 0
	public ReplicatingOtherHeroModel: Nullable<Unit | FakeUnit>

	constructor(
		public readonly Index: number,
		serial: number
	) {
		super(Index, serial)
		this.IsHero = true
	}
	public get BaseAttackSpeedData() {
		return this.UnitData.BaseAttackSpeed
	}
	public get BaseAttackRange(): number {
		return (
			this.ReplicatingOtherHeroModel?.BaseAttackRange ??
			this.CalcualteBaseAttackRange()
		)
	}
	public get IsRealHero(): boolean {
		return !this.IsClone && !this.IsIllusion && !this.IsStrongIllusion
	}
	public get HeroID(): number {
		return this.UnitData.HeroID
	}
	public get IsIllusion(): boolean {
		return this.ReplicatingOtherHeroModel !== undefined
	}
	public get IsMyHero(): boolean {
		return this === LocalPlayer?.Hero
	}
	public get HealthBarSize() {
		return new Vector2(
			GUIInfo.ScaleHeight(this.IsMyHero ? 107 : 99),
			GUIInfo.ScaleHeight(8)
		)
	}
	public get HealthBarPositionCorrection() {
		const position = new Vector2(this.HealthBarSize.x / 1.98, GUIInfo.ScaleHeight(36))
		switch (true) {
			case this.IsMyHero:
				return position.SetY(GUIInfo.ScaleHeight(37))
			case !this.IsEnemy():
				return position.SetY(GUIInfo.ScaleHeight(32))
			case this.HasBuffByName("modifier_morphling_replicate_illusion"):
				return position.SetY(GUIInfo.ScaleHeight(11))
			default:
				return position.SetY(GUIInfo.ScaleHeight(31))
		}
	}
	public get SpellAmplification(): number {
		return (
			super.SpellAmplification +
			(this.TotalIntellect * DamageAmplifyPerIntellectPrecent) / 100
		)
	}
}

export const Heroes = EntityManager.GetEntitiesByClass(Hero)

RegisterFieldHandler(Hero, "m_hReplicatingOtherHeroModel", (ent, newVal) => {
	const id = newVal as number
	ent.ReplicatingOtherHeroModel = GetPredictionTarget(id)
})

RegisterFieldHandler(Hero, "m_flRespawnTime", (ent, newVal) => {
	ent.RespawnTime = newVal as number
	ent.MaxRespawnDuration = Math.max(ent.RespawnTime - GameState.RawGameTime, 0)
})

RegisterFieldHandler(Hero, "m_flRespawnTimePenalty", (ent, newVal) => {
	ent.RespawnTimePenalty = newVal as number
})

EventsSDK.on("PreEntityCreated", ent => {
	if (!(ent instanceof Unit)) {
		return
	}
	for (let index = Heroes.length - 1; index > -1; index--) {
		const hero = Heroes[index]
		if (hero.ReplicatingOtherHeroModel?.EntityMatches(ent)) {
			hero.ReplicatingOtherHeroModel = ent
		}
	}
})

EventsSDK.on("EntityDestroyed", ent => {
	if (!(ent instanceof Unit)) {
		return
	}
	for (let index = Heroes.length - 1; index > -1; index--) {
		const hero = Heroes[index]
		if (hero.ReplicatingOtherHeroModel === ent) {
			hero.ReplicatingOtherHeroModel = undefined
		}
	}
})

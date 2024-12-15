import { Vector2 } from "../../Base/Vector2"
import { DamageAmplifyPerIntellectPrecent } from "../../Data/GameData"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { EPropertyType } from "../../Enums/PropertyType"
import { GUIInfo } from "../../GUI/GUIInfo"
import { EntityManager } from "../../Managers/EntityManager"
import { GameState } from "../../Utils/GameState"
import { LocalPlayer } from "./Entity"
import { Unit } from "./Unit"

@WrapperClass("CDOTA_BaseNPC_Hero")
export class Hero extends Unit {
	@NetworkedBasicField("m_iAbilityPoints")
	public readonly AbilityPoints: number = 0
	@NetworkedBasicField("m_iCurrentXP")
	public readonly CurrentXP: number = 0
	@NetworkedBasicField("m_bReincarnating")
	public readonly IsReincarnating: boolean = false
	@NetworkedBasicField("m_iRecentDamage")
	public readonly RecentDamage: number = 0
	@NetworkedBasicField("m_flSpawnedAt")
	public readonly SpawnedAt: number = 0
	@NetworkedBasicField("m_flAgility")
	public readonly Agility: number = 0
	@NetworkedBasicField("m_flIntellect")
	public readonly Intellect: number = 0
	@NetworkedBasicField("m_flStrength")
	public readonly Strength: number = 0
	@NetworkedBasicField("m_flAgilityTotal")
	public readonly TotalAgility: number = 0
	@NetworkedBasicField("m_flIntellectTotal")
	public readonly BaseTotalIntellect: number = 0
	@NetworkedBasicField("m_flStrengthTotal")
	public readonly TotalStrength: number = 0
	@NetworkedBasicField("m_iHeroFacetID", EPropertyType.UINT32)
	public readonly HeroFacetID: number = 0
	@NetworkedBasicField("m_flRespawnTimePenalty")
	public readonly RespawnTimePenalty: number = 0
	@NetworkedBasicField("m_flRespawnTime")
	public readonly RespawnTime: number = 0

	public FocusFireActive = false
	/** @internal (changed by CFocusFireChanged) */
	public FocusFireTargetIndex_: number = -1
	@NetworkedBasicField("m_hReplicatingOtherHeroModel")
	private readonly replicatingOtherHeroModel: number = EntityManager.INVALID_HANDLE

	constructor(
		public readonly Index: number,
		serial: number
	) {
		super(Index, serial)
		this.IsHero = true
	}
	public get BaseMoveSpeed(): number {
		// override this e.g. morphling
		return this.ReplicatingOtherHeroModel?.BaseMoveSpeed ?? super.BaseMoveSpeed
	}
	public get BaseAttackRange(): number {
		// override this e.g. morphling
		return this.ReplicatingOtherHeroModel?.BaseAttackRange ?? super.BaseAttackRange
	}
	public get FocusFireTarget() {
		return EntityManager.EntityByIndex<Unit>(this.FocusFireTargetIndex_)
	}
	public get ReplicatingOtherHeroModel() {
		return EntityManager.EntityByIndex<Unit>(this.replicatingOtherHeroModel)
	}
	public get IsRealHero(): boolean {
		return !this.IsClone && !this.IsIllusion && !this.IsStrongIllusion
	}
	public get HeroID(): number {
		return this.UnitData.HeroID
	}
	public get MagicalDamageResist(): number {
		return this.IsReflection ? this.BaseMagicalResist : super.MagicalDamageResist
	}
	public get IsIllusion(): boolean {
		return (
			this.replicatingOtherHeroModel !== -1 &&
			this.replicatingOtherHeroModel !== -2 &&
			this.replicatingOtherHeroModel !== EntityManager.INVALID_HANDLE
		)
	}
	public get IsMyHero(): boolean {
		return this === LocalPlayer?.Hero
	}
	public get MaxRespawnDuration() {
		return Math.max(this.RespawnTime - GameState.RawGameTime, 0)
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
	public get HeroFacet(): string {
		if (
			this.HeroFacetID <= 0 ||
			this.HeroFacetID - 1 >= this.UnitData.Facets.length
		) {
			return ""
		}
		return this.UnitData.Facets[this.HeroFacetID - 1].Name
	}
}

export const Heroes = EntityManager.GetEntitiesByClass(Hero)

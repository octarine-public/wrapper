import { Vector2 } from "../../Base/Vector2"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { EPropertyType } from "../../Enums/PropertyType"
import { ScaleHeight } from "../../GUI/Helpers"
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
	@NetworkedBasicField("m_iHeroFacetKey", EPropertyType.UINT32)
	public readonly HeroFacetKey: number = 0
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
	/** @deprecated use HeroFacetKey */
	public get HeroFacetID(): number {
		return this.HeroFacetKey
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
		return new Vector2(ScaleHeight(this.IsMyHero ? 107 : 99), ScaleHeight(8))
	}
	public get HealthBarPositionCorrection() {
		const position = new Vector2(this.HealthBarSize.x / 1.98, ScaleHeight(36))
		switch (true) {
			case this.IsMyHero:
				return position.SetY(ScaleHeight(37))
			case !this.IsEnemy():
				return position.SetY(ScaleHeight(32))
			case this.ModifierManager.IsMorphlingReplicateIllusion_:
				return position.SetY(ScaleHeight(11))
			default:
				return position.SetY(ScaleHeight(31))
		}
	}
	public get HeroFacet(): string {
		if (
			this.HeroFacetKey <= 0 ||
			this.HeroFacetKey - 1 >= this.UnitData.Facets.length
		) {
			return ""
		}
		return this.UnitData.Facets[this.HeroFacetKey - 1].Name
	}
}

export const Heroes = EntityManager.GetEntitiesByClass(Hero)

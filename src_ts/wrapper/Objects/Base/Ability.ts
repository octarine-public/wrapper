import Vector3 from "../../Base/Vector3"
import { HasMask, HasMaskBigInt } from "../../Utils/Utils"
import AbilityData from "../DataBook/AbilityData"
import Game from "../GameResources/GameRules"
import Entity from "./Entity"
import Unit from "./Unit"

export default class Ability extends Entity {
	public readonly m_pBaseEntity: C_DOTABaseAbility
	public AbilityData: AbilityData
	public Level = 0
	public Cooldown = 0
	public CooldownLength = 0
	public IsInAbilityPhase = false
	public CastStartTime = 0
	public ChannelStartTime = 0 
	public IsToggled = false

	/* ============ BASE  ============ */

	get Owner(): Unit {
		return super.Owner as Unit
	}
	get AbilityBehavior(): DOTA_ABILITY_BEHAVIOR[] {
		return this.AbilityData.AbilityBehavior
	}
	get AbilityDamage(): number {
		return this.m_pBaseEntity.m_iAbilityDamage
	}
	get AbilityType(): ABILITY_TYPES {
		return this.AbilityData.AbilityType
	}
	get AOERadius(): number {
		return this.m_pBaseEntity.m_fAOERadius
	}
	get CastPoint(): number {
		return this.m_pBaseEntity.m_fCastPoint
	}
	get ChannelTime(): number {
		return Math.max(Game.RawGameTime - this.ChannelStartTime, 0)
	}
	get DamageType(): DAMAGE_TYPES {
		return this.AbilityData.DamageType
	}
	get EnemyLevel(): number {
		return this.m_pBaseEntity.m_iEnemyLevel
	}
	get HasAltCastState(): boolean {
		return this.m_pBaseEntity.m_bAltCastState
	}
	get HasInIndefiniteCooldown(): boolean {
		return this.m_pBaseEntity.m_bInIndefiniteCooldown
	}
	get ID(): number {
		return this.AbilityData.ID
	}
	get IsActivated(): boolean {
		return this.m_pBaseEntity.m_bActivated
	}
	get IsAutoCastEnebled(): boolean {
		return this.m_pBaseEntity.m_bAutoCastState
	}
	get IsChanneling(): boolean {
		return this.ChannelStartTime > 0
	}
	get IsCooldownFrozen(): boolean {
		return this.m_pBaseEntity.m_bFrozenCooldown
	}
	get IsCooldownReady(): boolean {
		return this.Cooldown === 0
	}
	get IsReady(): boolean {
		const unit = this.Owner
		return this.IsCooldownReady && this.Level > 0 && (unit === undefined || (unit.Mana >= this.ManaCost && !unit.IsSilenced))
	}
	get IsGrantedByScepter(): boolean {
		return this.AbilityData.IsGrantedByScepter
	}
	get IsHidden(): boolean {
		return this.m_pBaseEntity.m_bHidden
	}
	get IsItem(): boolean {
		return this.AbilityData.IsItem
	}
	get IsReplicated(): boolean {
		return this.m_pBaseEntity.m_bReplicated
	}
	get IsStolen(): boolean {
		return this.m_pBaseEntity.m_bStolen
	}
	get LevelsBetweenUpgrades(): number {
		return this.AbilityData.LevelsBeetweenUpgrades
	}
	get ManaCost(): number {
		return this.m_pBaseEntity.m_iManaCost
	}
	get MaxLevel(): number {
		return this.AbilityData.MaxLevel
	}
	get OverrideCastPoint(): number {
		return this.m_pBaseEntity.m_flOverrideCastPoint
	}
	get RequiredLevel(): number {
		return this.AbilityData.RequiredLevel
	}
	get SharedCooldownName(): string {
		return this.AbilityData.SharedCooldownName
	}
	get AbilityImmunityType(): SPELL_IMMUNITY_TYPES {
		return this.AbilityData.AbilityImmunityType
	}
	get TargetFlags(): DOTA_UNIT_TARGET_FLAGS[] {
		return this.AbilityData.TargetFlags
	}
	get TargetTeam(): DOTA_UNIT_TARGET_TEAM[] {
		return this.AbilityData.TargetTeam
	}
	get TargetType(): DOTA_UNIT_TARGET_TYPE[] {
		return this.AbilityData.TargetType
	}
	get TextureName(): string {
		return this.AbilityData.TextureName
	}

	get IsPassive(): boolean {
		return this.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE)
	}

	/* ============ EXTENSIONS ============ */

	get CastRange(): number {
		let owner = this.Owner,
			castrange = this.m_pBaseEntity.m_fCastRange

		switch (this.Name) {
			case "item_tango":
			case "item_tango_single": {
				castrange = this.GetSpecialValue("cast_range_ward")
				break
			}
			case "skywrath_mage_concussive_shot": {
				let unique = owner.AbilitiesBook.GetAbilityByName("special_bonus_unique_skywrath_4")
				if (unique !== undefined && unique.Level > 0)
					return Number.MAX_SAFE_INTEGER

				break
			}
			case "gyrocopter_call_down": {
				let unique = owner.AbilitiesBook.GetAbilityByName("special_bonus_unique_gyrocopter_5")
				if (unique !== undefined && unique.Level > 0)
					return Number.MAX_SAFE_INTEGER

				break
			}
			case "lion_impale": {
				castrange -= owner.GetTalentValue("special_bonus_unique_lion_2")
				break
			}
			default:
				break
		}

		return castrange + (owner !== undefined ? owner.CastRangeBonus : 0)
	}

	public GetCastDelay(position: Vector3): number {
		return ((this.CastPoint + this.Owner.TurnTime(position)) + Game.GetAvgLatency())
	}

	public GetHitTime(position: Vector3, ActivationDelay?: number): number {
		if (this.Speed === Number.MAX_VALUE || this.Speed === 0) {
			return this.GetCastDelay(position) + (ActivationDelay * 1000)
		}

		var time = this.Owner.Distance2D(position) / this.Speed
		return this.GetCastDelay(position) + ((time + ActivationDelay) * 1000)
	}

	GetDamage(target: Unit): number {
		return target.CalculateDamage((this.AbilityDamage || this.GetSpecialValue("damage")) * 1, this.DamageType, this.Owner)
	}

	UseAbility(target?: Vector3 | Entity, checkToggled: boolean = false, queue?: boolean, showEffects?: boolean) {
		this.Owner.UseSmartAbility(this, target, checkToggled, queue, showEffects)
	}

	UpgradeAbility() {
		return this.Owner.TrainAbility(this)
	}

	PingAbility() {
		return this.Owner.PingAbility(this)
	}

	GetSpecialValue(special_name: string, level: number = this.Level - 1): number {
		if (level < 0)
			return 0
		let cache = this.AbilityData.SpecialValueCache[special_name]
		if (cache === undefined) {
			cache = this.AbilityData.SpecialValueCache[special_name] = []
			for (let i = 0; i <= this.MaxLevel; i++)
				cache[i] = this.m_pBaseEntity.GetSpecialValue(special_name, i)
		}
		return cache[level] || (cache[level] = this.m_pBaseEntity.GetSpecialValue(special_name, level))
	}
	IsManaEnough(bonusMana: number = 0): boolean {
		return (this.Owner.Mana + bonusMana) >= this.ManaCost
	}
	HasBehavior(flag: DOTA_ABILITY_BEHAVIOR): boolean {
		return HasMaskBigInt(this.AbilityData.m_pAbilityData.m_iAbilityBehavior, BigInt(flag))
	}
	HasTargetFlags(flag: DOTA_UNIT_TARGET_FLAGS): boolean {
		return HasMask(this.AbilityData.m_pAbilityData.m_iAbilityTargetFlags, flag)
	}
	HasTargetTeam(flag: DOTA_UNIT_TARGET_TEAM): boolean {
		return HasMask(this.AbilityData.m_pAbilityData.m_iAbilityTargetTeam, flag)
	}
	HasTargetType(flag: DOTA_UNIT_TARGET_TYPE): boolean {
		return HasMask(this.AbilityData.m_pAbilityData.m_iAbilityTargetType, flag)
	}
	CanBeCasted(bonusMana: number = 0): boolean {
		if (!this.IsReady || !this.IsValid) {
			return false
		}

		if (this.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_TOGGLE) && this.IsToggled) {
			return false
		}

		if ((Game.RawGameTime - this.LastCastAttempt) < 0.1) {
			return false
		}

		return this.Level > 0
			&& !this.Owner.IsSilenced
			&& this.IsManaEnough(bonusMana)
			&& this.IsCooldownReady
	}
}

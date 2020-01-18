import Vector3 from "../../Base/Vector3"
import { HasMask, MaskToArrayNumber } from "../../Utils/BitsExtensions"
import AbilityData from "../DataBook/AbilityData"
import Game from "../GameResources/GameRules"
import Entity from "./Entity"
import Unit from "./Unit"

export default class Ability extends Entity {
	public readonly m_pBaseEntity!: C_DOTABaseAbility

	public AbilityData: AbilityData
	public Level = this.m_pBaseEntity.m_iLevel
	public Cooldown = this.m_pBaseEntity.m_fCooldown
	public CooldownLength = this.m_pBaseEntity.m_flCooldownLength
	public IsInAbilityPhase = this.m_pBaseEntity.m_bInAbilityPhase
	public CastStartTime = this.m_pBaseEntity.m_flCastStartTime
	public ChannelStartTime = this.m_pBaseEntity.m_flChannelStartTime
	public LastCastClickTime = this.m_pBaseEntity.m_flLastCastClickTime;
	public IsToggled = this.m_pBaseEntity.m_bToggleState
	public IsHidden = this.m_pBaseEntity.m_bHidden

	constructor(m_pBaseEntity: C_DOTABaseAbility, name: string) {
		super(m_pBaseEntity)
		this.Name_ = name
		this.AbilityData = new AbilityData(this.Name)
	}

	/* ============ BASE  ============ */

	public get Owner(): Nullable<Unit> {
		return super.Owner as Nullable<Unit>
	}
	public get AbilityBehavior(): DOTA_ABILITY_BEHAVIOR[] {
		return MaskToArrayNumber(this.AbilityData.AbilityBehavior)
	}
	public get AbilityDamage(): number {
		return this.AbilityData.GetAbilityDamage(this.Level)
	}
	public get AbilityType(): ABILITY_TYPES {
		return this.AbilityData.AbilityType
	}
	public get EndRadius(): number {
		return this.GetSpecialValue("final_aoe")
	}
	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}
	public get ActivationDelay() {
		return this.GetSpecialValue("activation_delay")
	}
	public get CastPoint(): number {
		return this.AbilityData.GetCastPoint(this.Level)
	}
	public get ChannelTime(): number {
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
		return this.IsCooldownReady && this.Level !== 0 && (unit === undefined || (unit.Mana >= this.ManaCost && !unit.IsSilenced))
	}
	get IsGrantedByScepter(): boolean {
		return this.AbilityData.IsGrantedByScepter
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
		return this.AbilityData.LevelsBetweenUpgrades
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
		return MaskToArrayNumber(this.AbilityData.TargetFlags)
	}
	get TargetTeam(): DOTA_UNIT_TARGET_TEAM[] {
		return MaskToArrayNumber(this.AbilityData.TargetTeam)
	}
	get TargetType(): DOTA_UNIT_TARGET_TYPE[] {
		return MaskToArrayNumber(this.AbilityData.TargetType)
	}
	get TextureName(): string {
		return this.AbilityData.TextureName
	}

	get IsPassive(): boolean {
		return this.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE)
	}

	/* ============ EXTENSIONS ============ */

	/**
	 * In real time cooldown (in fog)
	 */
	get CooldownTimeRemaining(): number {
		if (this.Owner === undefined)
			return 0

		return Math.max(0, this.Cooldown - (Game.RawGameTime - this.Owner.LastVisibleTime))
	}

	public get BaseCastRange(): number {
		return this.AbilityData.GetCastRange(this.Level)
	}

	public get CastRange(): number {
		let owner = this.Owner,
			castrange = this.BaseCastRange

		switch (this.Name) {
			case "item_tango":
			case "item_tango_single": {
				castrange = this.GetSpecialValue("cast_range_ward")
				break
			}
			case "skywrath_mage_concussive_shot": {
				let unique = owner?.AbilitiesBook.GetAbilityByName("special_bonus_unique_skywrath_4")
				if (unique !== undefined && unique.Level !== 0)
					return Number.MAX_SAFE_INTEGER
				break
			}
			case "gyrocopter_call_down": {
				let unique = owner?.AbilitiesBook.GetAbilityByName("special_bonus_unique_gyrocopter_5")
				if (unique !== undefined && unique.Level !== 0)
					return Number.MAX_SAFE_INTEGER
				break
			}
			case "lion_impale": {
				castrange -= owner?.GetTalentValue("special_bonus_unique_lion_2") ?? 0
				break
			}
			case "lina_dragon_slave":
				castrange += this.GetSpecialValue("dragon_slave_width_initial")
				break
			default:
				break
		}
		return castrange + (owner !== undefined ? owner.CastRangeBonus : 0)
	}

	/**
	 * @param position Vector3
	 * @param turnRate boolean
	 * @returns Time in ms until the cast.
	 */
	public GetCastDelay(position: Vector3, turnRate: boolean = true): number {
		return this?.Owner ? (((Game.Ping / 2) / 1000) + (this.CastPoint + (turnRate ? this.Owner.TurnTime(position) : 0) * 1000)) : 0
	}
	/**
	 * @param position Vector3
	 * @returns Time in ms until the cast.
	 */
	public GetHitTime(position: Vector3): number {
		if (this.Owner === undefined)
			return 0

		if (this.Speed === Number.MAX_SAFE_INTEGER || this.Speed === 0)
			return this.GetCastDelay(position) + (this.ActivationDelay * 1000)

		let time = this.Owner.Distance2D(position) / this.Speed
		return this.GetCastDelay(position) + ((time + this.ActivationDelay) * 1000)
	}

	public GetDamage(target: Unit): number {
		return target.CalculateDamage((this.AbilityDamage || this.GetSpecialValue("damage")) * 1, this.DamageType, this.Owner)
	}

	public UseAbility(target?: Vector3 | Entity, checkToggled: boolean = false, queue?: boolean, showEffects?: boolean) {
		return this.Owner?.UseSmartAbility(this, target, checkToggled, queue, showEffects)
	}

	public UpgradeAbility() {
		return this.Owner?.TrainAbility(this)
	}

	public PingAbility() {
		return this.Owner?.PingAbility(this)
	}

	public GetSpecialValue(special_name: string, level = this.Level): number {
		return this.AbilityData.GetSpecialValue(special_name, level)
	}
	public IsManaEnough(bonusMana: number = 0): boolean {
		let owner = this.Owner
		if (owner === undefined)
			return true
		return (owner.Mana + bonusMana) >= this.ManaCost
	}
	public HasBehavior(flag: DOTA_ABILITY_BEHAVIOR): boolean {
		return HasMask(this.AbilityData.AbilityBehavior, flag)
	}
	public HasTargetFlags(flag: DOTA_UNIT_TARGET_FLAGS): boolean {
		return HasMask(this.AbilityData.TargetFlags, flag)
	}
	public HasTargetTeam(flag: DOTA_UNIT_TARGET_TEAM): boolean {
		return HasMask(this.AbilityData.TargetTeam, flag)
	}
	public HasTargetType(flag: DOTA_UNIT_TARGET_TYPE): boolean {
		return HasMask(this.AbilityData.TargetType, flag)
	}
	public CanHit(target: Unit): boolean {
		if (this.Owner === undefined)
			return false

		let range = 0
		if (this.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET) || this.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT)) {
			if (this.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET) && !target)
				return false
			switch (this.Name) {
				case "lion_impale":
					range += this.CastRange + this.GetSpecialValue("width") + this.GetSpecialValue("length_buffer")
					break
				case "nyx_assassin_impale":
					range += this.CastRange + this.GetSpecialValue("width")
					break
				case "queenofpain_scream_of_pain":
					range += this.CastRange + this.GetSpecialValue("area_of_effect")
					break
				case "vengefulspirit_wave_of_terror":
					range += this.CastRange + this.GetSpecialValue("wave_width")
					break
				case "venomancer_venomous_gale":
					range += this.CastRange + this.GetSpecialValue("radius")
					break
				case "monkey_king_boundless_strike":
					range += this.CastRange + this.GetSpecialValue("strike_radius")
					break
				case "magnataur_shockwave":
					range += this.CastRange + this.GetSpecialValue("shock_width")
					break
				case "tusk_ice_shards":
					range += this.CastRange + this.GetSpecialValue("shard_width")
					break
				default:
					range += this.CastRange
					break
			}
			range += this.Owner.HullRadius
		} else {
			range = this.CastRange
			if (range === 0)
				range = this.AOERadius
		}
		if (range > 0)
			range += target.HullRadius
		return this.Owner.Distance2D(target) < range
	}
	public CanBeCasted(bonusMana: number = 0): boolean {
		return this.IsValid
			&& this.Level !== 0
			&& this.IsCooldownReady
			&& !this.Owner?.IsSilenced
			&& this.IsManaEnough(bonusMana)
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTABaseAbility", Ability)

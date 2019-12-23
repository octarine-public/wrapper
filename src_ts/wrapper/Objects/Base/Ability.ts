import Vector3 from "../../Base/Vector3"
import { HasMask, HasMaskBigInt } from "../../Utils/BitsExtensions"
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
	public LastCastClickTime = 0
	public IsToggled = false
	public IsHidden = false

	constructor(m_pBaseEntity: C_BaseEntity) {
		super(m_pBaseEntity)
		this.LastCastClickTime = this.m_pBaseEntity.m_flLastCastClickTime
		this.IsToggled = this.m_pBaseEntity.m_bToggleState
		this.ChannelStartTime = this.m_pBaseEntity.m_flChannelStartTime
		this.CastStartTime = this.m_pBaseEntity.m_flCastStartTime
		this.IsInAbilityPhase = this.m_pBaseEntity.m_bInAbilityPhase
		this.CooldownLength = this.m_pBaseEntity.m_flCooldownLength
		this.Cooldown = this.m_pBaseEntity.m_fCooldown
		this.Level = this.m_pBaseEntity.m_iLevel
		this.IsHidden = this.m_pBaseEntity.m_bHidden
		this.AbilityData = new AbilityData(this.m_pBaseEntity.m_pAbilityData)
	}

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
	get GadgetCastRange(): number {
		let gadgetRange = EntityManager.GetEntitiesByClass(Unit,
			DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY).some(x =>
				x.HasBuffByName("modifier_item_spy_gadget_aura") && x.IsAlive && (x.IsHero || x.Name.includes("bear"))
				&& x.Distance2D(this.Owner) <= 1200)
		return (gadgetRange ? 125 : 0)
	}
	get AOERadius(): number {
		return this.m_pBaseEntity.m_fAOERadius + this.GadgetCastRange
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

	/**
	 * In real time cooldown (in fog)
	 */
	get CooldownTimeRemaining() {
		return Math.max(0, this.Cooldown - (Game.RawGameTime - this.Owner.LastVisibleTime))
	}

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
			case "lina_dragon_slave":
				castrange += this.GetSpecialValue("dragon_slave_width_initial")
				break
			case "lina_laguna_blade":
			case "lina_light_strike_array": {
				let unique = owner.AbilitiesBook.GetAbilityByName("special_bonus_cast_range_100")
				if (unique !== undefined && unique.Level > 0)
					castrange += 100
				break
			}
			default:
				break
		}
		return castrange + (owner !== undefined ? owner.CastRangeBonus : 0) + this.GadgetCastRange
	}

	public GetCastDelay(position: Vector3): number {
		return ((this.CastPoint + this.Owner.TurnTime(position)) + Game.Ping / 2000)
	}

	public GetHitTime(position: Vector3, ActivationDelay?: number): number {
		if (this.Owner.IdealSpeed === Number.MAX_VALUE || this.Owner.IdealSpeed === 0) {
			return this.GetCastDelay(position) + (ActivationDelay * 1000)
		}
		let time = this.Owner.Distance2D(position) / this.Owner.IdealSpeed
		return this.GetCastDelay(position) + ((time + ActivationDelay) * 1000)
	}

	public GetDamage(target: Unit): number {
		return target.CalculateDamage((this.AbilityDamage || this.GetSpecialValue("damage")) * 1, this.DamageType, this.Owner)
	}

	public UseAbility(target?: Vector3 | Entity, checkToggled: boolean = false, queue?: boolean, showEffects?: boolean) {
		this.Owner.UseSmartAbility(this, target, checkToggled, queue, showEffects)
	}

	public UpgradeAbility() {
		return this.Owner.TrainAbility(this)
	}

	public PingAbility() {
		return this.Owner.PingAbility(this)
	}

	public GetSpecialValue(special_name: string, level: number = this.Level - 1): number {
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
	public IsManaEnough(bonusMana: number = 0): boolean {
		let owner = this.Owner
		if (owner === undefined)
			return true
		return (owner.Mana + bonusMana) >= this.ManaCost
	}
	public HasBehavior(flag: DOTA_ABILITY_BEHAVIOR): boolean {
		return HasMaskBigInt(this.AbilityData.m_pAbilityData.m_iAbilityBehavior, BigInt(flag))
	}
	public HasTargetFlags(flag: DOTA_UNIT_TARGET_FLAGS): boolean {
		return HasMask(this.AbilityData.m_pAbilityData.m_iAbilityTargetFlags, flag)
	}
	public HasTargetTeam(flag: DOTA_UNIT_TARGET_TEAM): boolean {
		return HasMask(this.AbilityData.m_pAbilityData.m_iAbilityTargetTeam, flag)
	}
	public HasTargetType(flag: DOTA_UNIT_TARGET_TYPE): boolean {
		return HasMask(this.AbilityData.m_pAbilityData.m_iAbilityTargetType, flag)
	}
	public CanHit(target: Unit) {
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
			&& this.Level > 0
			&& this.IsCooldownReady
			&& !this.Owner.IsSilenced
			&& this.IsManaEnough(bonusMana)
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
import EntityManager from "../../Managers/EntityManager"
RegisterClass("C_DOTABaseAbility", Ability)

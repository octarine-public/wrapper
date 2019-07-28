import Vector3 from "../../Base/Vector3"
import { HasMask, HasMaskBigInt } from "../../Utils/Utils"
import AbilityData from "../DataBook/AbilityData"
import Game from "../GameResources/GameRules"
import Entity from "./Entity"
import Unit from "./Unit"

export default class Ability extends Entity {
	/* protected */ readonly m_pBaseEntity: C_DOTABaseAbility
	private m_AbilityData: AbilityData

	/* ============ BASE  ============ */

	get AbilityBehavior(): DOTA_ABILITY_BEHAVIOR[] {
		return this.AbilityData.AbilityBehavior
	}
	get AbilityDamage(): number {
		return this.m_pBaseEntity.m_iAbilityDamage
	}
	get AbilityData(): AbilityData {
		return this.m_AbilityData
			|| (this.m_AbilityData = new AbilityData(this.m_pBaseEntity.m_pAbilityData))
	}
	get AbilityType(): ABILITY_TYPES {
		return this.AbilityData.AbilityType
	}
	get AOERadius(): number {
		return this.m_pBaseEntity.m_fAOERadius
	}
	get BaseCastRange(): number {
		return this.m_pBaseEntity.m_iCastRange
	}
	get CastPoint(): number {
		return this.m_pBaseEntity.m_fCastPoint
	}
	get CastStartTime(): number {
		return this.m_pBaseEntity.m_flCastStartTime
	}
	get ChannelStartTime(): number {
		return this.m_pBaseEntity.m_flChannelStartTime
	}
	get ChannelTime(): number {
		return Math.max(Game.RawGameTime - this.ChannelStartTime, 0)
	}
	get Cooldown(): number {
		return this.m_pBaseEntity.m_fCooldown
	}
	get CooldownLenght(): number {
		return this.m_pBaseEntity.m_flCooldownLength
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
		const unit = this.Owner as Unit
		return this.IsCooldownReady && unit.Mana >= this.ManaCost && !unit.IsSilenced && this.Level>0
	}
	get IsGrantedByScepter(): boolean {
		return this.AbilityData.IsGrantedByScepter
	}
	get IsHidden(): boolean {
		return this.m_pBaseEntity.m_bHidden
	}
	get IsInAbilityPhase(): boolean {
		return this.m_pBaseEntity.m_bInAbilityPhase
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
	get IsToggled(): boolean {
		return this.m_pBaseEntity.m_bToggleState
	}
	get LastCastClickTime(): number {
		return this.m_pBaseEntity.m_flLastCastClickTime
	}
	get Level(): number {
		return this.m_pBaseEntity.m_iLevel
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
	get Name(): string {
		return this.AbilityData.Name
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

	/* ============ EXTENSIONS ============ */

	get CastRange(): number {
		let owner = this.Owner as Unit,
			castrange = this.BaseCastRange

		switch (this.Name) {
			case "skywrath_mage_concussive_shot": {
				let unique = owner.AbilitiesBook.GetAbilityByClass(C_DOTA_Ability_Special_Bonus_Unique_Skywrath_4)
				if (unique !== undefined && unique.Level > 0)
					return Number.MAX_SAFE_INTEGER

				break
			}
			case "gyrocopter_call_down": {
				let unique = owner.AbilitiesBook.GetAbilityByClass(C_DOTA_Ability_Special_Bonus_Unique_Gyrocopter_3)
				if (unique !== undefined && unique.Level > 0)
					return Number.MAX_SAFE_INTEGER

				break
			}
			case "lion_impale": {
				let unique = owner.AbilitiesBook.GetAbilityByClass(C_DOTA_Ability_Special_Bonus_Unique_Lion_2)
				if (unique !== undefined && unique.Level > 0)
					castrange += unique.GetSpecialValue("value")

				break
			}
		}

		return castrange + owner.CastRangeBonus
	}

	UseAbility(target?: Vector3 | Entity, checkToggled: boolean = false, queue?: boolean, showEffects?: boolean) {
		return (this.Owner as Unit).UseSmartAbility(this, target, checkToggled, queue, showEffects)
	}
	UpgradeAbility() {
		return (this.Owner as Unit).TrainAbility(this)
	}
	PingAbility() {
		return (this.Owner as Unit).PingAbility(this)
	}

	GetSpecialValue(special_name: string, level: number = -1): number {
		return this.m_pBaseEntity.GetSpecialValue(special_name, level)
	}
	IsManaEnough(bonusMana: number = 0): boolean {
		return ((this.Owner as Unit).Mana + bonusMana) >= this.ManaCost
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
		if (!this.IsValid)
			return false

		if (this.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_TOGGLE) && this.IsToggled)
			return false

		return this.Level > 0
			&& !(this.Owner as Unit).IsSilenced
			&& this.IsManaEnough(bonusMana)
			&& this.IsCooldownReady
	}
}

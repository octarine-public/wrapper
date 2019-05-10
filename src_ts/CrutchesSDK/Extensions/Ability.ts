import { SplitBigInt } from "Utils"
import Entity from "./Entity"
import Unit from "./Unit"

export default class Ability extends Entity {

	m_pBaseEntity: C_DOTABaseAbility

	// redefine

	IsManaEnough(bonusMana: number = 0): boolean {
		return ((this.Owner as Unit).Mana + bonusMana) >= this.ManaCost
	}

	// new

	get AbilityBehavior(): DOTA_ABILITY_BEHAVIOR[] {
		return SplitBigInt(this.AbilityData.m_iAbilityBehavior)
	}

	get AbilityDamage(): number {
		return this.m_pBaseEntity.m_iAbilityDamage
	}
	get AbilityData(): DOTAAbilityData_t {
		return this.m_pBaseEntity.m_pAbilityData
	}
	get AbilityType(): ABILITY_TYPES {
		return this.AbilityData.m_iAbilityType
	}
	get AOERadius(): number {
		return this.m_pBaseEntity.m_fAOERadius
	}
	get CastPoint(): number {
		return this.m_pBaseEntity.m_fCastPoint
	}
	get CastRange(): number {
		return this.m_pBaseEntity.m_iCastRange
	}
	get ChannelStartTime(): number {
		return this.m_pBaseEntity.m_flChannelStartTime
	}
	get ChannelTime(): number {
		return Math.max(GameRules.m_fGameTime - this.ChannelStartTime, 0)
		// return this.m_pBaseEntity.m_fChannelTime; // vfunc remove this
	}
	get Cooldown(): number {
		return this.m_pBaseEntity.m_fCooldown
	}
	get CooldownLenght(): number {
		return this.m_pBaseEntity.m_flCooldownLength
	}
	get DamageType(): DAMAGE_TYPES {
		return this.AbilityData.m_iAbilityDamageType
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
	get ID() {
		return this.AbilityData.m_iAbilityID
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
	get IsGrantedByScepter(): boolean {
		return this.AbilityData.m_bIsGrantedByScepter
	}
	get IsHidden(): boolean {
		return this.m_pBaseEntity.m_bHidden
	}
	get IsInAbilityPhase(): boolean {
		return this.m_pBaseEntity.m_bInAbilityPhase
	}
	get IsItem(): boolean {
		return this.AbilityData.m_bIsItem
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
		return this.AbilityData.m_iLevelsBetweenUpgrades
	}
	get ManaCost(): number {
		return this.m_pBaseEntity.m_iManaCost
	}
	get MaxLevel(): number {
		return this.m_pBaseEntity.m_iMaxLevel
	}
	get Name(): string {
		return this.AbilityData.m_pszAbilityName
	}
	get OverrideCastPoint(): number {
		return this.m_pBaseEntity.m_flOverrideCastPoint
	}
	get RequiredLevel(): number {
		return this.AbilityData.m_iRequiredLevel
	}
	get SharedCooldownName(): string {
		return this.AbilityData.m_pszSharedCooldownName
	}
	get AbilityImmunityType(): SPELL_IMMUNITY_TYPES {
		return this.AbilityData.m_iAbilityImmunityType
	}
	get TargetFlags(): DOTA_UNIT_TARGET_FLAGS {
		return this.AbilityData.m_iAbilityTargetFlags
	}
	get TargetTeam(): DOTA_UNIT_TARGET_TEAM {
		return this.AbilityData.m_iAbilityTargetTeam
	}
	get TargetType(): DOTA_UNIT_TARGET_TYPE {
		return this.AbilityData.m_iAbilityTargetType
	}
	get TextureName(): string {
		return this.AbilityData.m_pszTextureName
	}

	HasBehavior(flag: DOTA_ABILITY_BEHAVIOR): boolean {
		return ((this.AbilityData.m_iAbilityBehavior >> BigInt(flag)) & 1n) === 1n
	}
	HasTargetFlags(flag: DOTA_UNIT_TARGET_FLAGS): boolean {
		return (this.AbilityData.m_iAbilityTargetFlags & flag) === flag
	}
	HasTargetTeam(flag: DOTA_UNIT_TARGET_TEAM): boolean {
		return (this.AbilityData.m_iAbilityTargetTeam & flag) === flag
	}
	HasTargetType(flag: DOTA_UNIT_TARGET_TYPE): boolean {
		return (this.AbilityData.m_iAbilityTargetType & flag) === flag
	}
	CanBeCasted(bonusMana: number = 0): boolean {
		if (!this.m_pBaseEntity.m_bIsValid)
			return false

		/**
		 * need getting from entitymanager
		 */
		/* if (this.IsItem)
			return this.CanBeCasted(bonusMana); */

		if (this.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_TOGGLE) && this.IsToggled)
			return false

		return this.Level > 0
			&& !(this.Owner as Unit).IsSilenced
			&& this.IsManaEnough(bonusMana)
			&& this.IsCooldownReady
	}
}

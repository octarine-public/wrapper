// import * as Enums from "./Enums";
import { SplitBigInt } from "Utils"
import Entity from "./Entity"
import Hero from "./Hero"

// move to Buffs.ts
export const TrueSightBuffs = [
	"modifier_truesight",
	"modifier_item_dustofappearance",
	"modifier_bloodseeker_thirst_vision",
	"modifier_bounty_hunter_track",
]
// move to Buffs.ts
export const ScepterBuffs = [
	"modifier_item_ultimate_scepter",
	"modifier_item_ultimate_scepter_consumed",
	"modifier_wisp_tether_scepter",
]

const ScepterRegExp = /modifier_item_ultimate_scepter|modifier_wisp_tether_scepter/

export default class Unit extends Entity {

	m_pBaseEntity: C_DOTA_BaseNPC

	// Redefine

	get IsHero(): boolean {
		return (this.UnitType & 1) === 1
	}
	get IsTower(): boolean {
		return ((this.UnitType >> 2) & 1) === 1
	}
	get IsConsideredHero(): boolean {
		return ((this.UnitType >> 3) & 1) === 1
	}
	get IsBuilding(): boolean {
		return ((this.UnitType >> 4) & 1) === 1
	}
	get IsFort(): boolean {
		return ((this.UnitType >> 5) & 1) === 1
	}
	get IsBarracks(): boolean {
		return ((this.UnitType >> 6) & 1) === 1
	}
	get IsCreep(): boolean {
		return ((this.UnitType >> 7) & 1) === 1
	}
	get IsCourier(): boolean {
		return ((this.UnitType >> 8) & 1) === 1
	}
	get IsShop(): boolean {
		return ((this.UnitType >> 9) & 1) === 1
	}
	get IsLaneCreep(): boolean {
		return ((this.UnitType >> 10) & 1) === 1
	}
	get IsShrine(): boolean {
		return ((this.UnitType >> 12) & 1) === 1
	}
	get IsWard(): boolean {
		return ((this.UnitType >> 17) & 1) === 1
	}

	get IsRooted(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_ROOTED)
	}
	get IsDisarmed(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_DISARMED)
	}
	get IsAttackImmune(): boolean {
		return this.m_pBaseEntity.m_bIsAttackImmune
		// return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_ATTACK_IMMUNE);
	}
	get IsSilenced(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_SILENCED)
	}
	get IsMuted(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_MUTED)
	}
	get IsStunned(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_STUNNED)
	}
	get IsHexed(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_HEXED)
	}
	get IsInvisible(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_INVISIBLE)
	}
	get IsInvulnerable(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_INVULNERABLE)
	}
	get IsMagicImmune(): boolean {
		return this.m_pBaseEntity.m_bIsMagicImmune
		// return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_MAGIC_IMMUNE);
	}
	//
	get IsNoHealthBar(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_NO_HEALTH_BAR)
	}
	//
	get IsBlind(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_BLIND)
	}
	//
	get IsRealUnit(): boolean {
		return this.UnitType !== 0 && !this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_FAKE_ALLY)
	}
	//
	get IsTrueSightImmune(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_TRUESIGHT_IMMUNE)
	}

	get IsInFadeTime(): boolean {
		return this.m_pBaseEntity.m_flInvisibilityLevel > 0
	}

	get IsVisibleForEnemies(): boolean {
		const valid_teams = ~(1 | (1 << DOTATeam_t.DOTA_TEAM_SPECTATOR)
			| (1 << DOTATeam_t.DOTA_TEAM_NEUTRALS)
			| (1 << DOTATeam_t.DOTA_TEAM_NOTEAM)) // don't check not existing team (0), spectators (1), neutrals (4) and noteam (5)

		let local_team = this.m_pBaseEntity.m_iTeamNum,
			flags = this.m_pBaseEntity.m_iTaggedAsVisibleByTeam & valid_teams

		for (let i = 14; i--; )
			if (i !== local_team && ((flags >> i) & 1))
				return true
		return false
	}
	get IsTrueSightedForEnemies(): boolean {
		return this.m_pBaseEntity.m_ModifierManager.m_vecBuffs.some(buff => {
			if (buff === undefined || buff.m_bMarkedForDeletion)
				return false

			let name = buff.m_name
			if (name !== undefined)
				return false

			return TrueSightBuffs.some(nameBuff => nameBuff === name)
		})
	}
	get IsControllableByAnyPlayer(): boolean {
		return this.m_pBaseEntity.m_iIsControllableByPlayer64 !== 0n
	}
	get IsRangeAttacker(): boolean {
		return this.HasAttackCapability(DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_RANGED_ATTACK)
	}
	get HasScepter(): boolean {
		if (this.m_pBaseEntity.m_bStolenScepter)
			return true

		return this.m_pBaseEntity.m_ModifierManager.m_vecBuffs.some(buff => {
			if (buff === undefined || buff.m_bMarkedForDeletion)
				return false

			let name = buff.m_name
			if (name !== undefined)
				return false

			return ScepterRegExp.test(name)
		})
	}

	/**
	 * @param flag if not exists => is Melee or Range attack
	 */
	HasAttackCapability(flag?: DOTAUnitAttackCapability_t): boolean {
		let attackCap = this.m_pBaseEntity.m_iAttackCapabilities

		if (flag !== undefined)
			return (attackCap & flag) === flag

		return (attackCap & (
				DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_MELEE_ATTACK |
				DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_RANGED_ATTACK)
			) === flag
	}
	/**
	 * @param flag if not exists => isn't move NONE
	 */
	HasMoveCapabilit(flag: DOTAUnitMoveCapability_t): boolean {
		let moveCap = this.m_pBaseEntity.m_iMoveCapabilities

		if (flag !== undefined)
			return (moveCap & flag) === flag

		return flag !== DOTAUnitMoveCapability_t.DOTA_UNIT_CAP_MOVE_NONE
	}

	IsUnitStateFlagSet(flag: modifierstate): boolean {
		return (((this.m_pBaseEntity.m_nUnitState64 | this.m_pBaseEntity.m_nUnitDebuffState) >> BigInt(flag)) & 1n) === 1n
	}

	GetAbilityByName(name: string): C_DOTABaseAbility {
		let abils = this.m_pBaseEntity.m_hAbilities

		for (let i = 0, len = abils.length; i < len; i++) {
			let abil = (abils[i] as C_DOTABaseAbility)

			if (abil === undefined)
				continue

			if (abil.m_pAbilityData.m_pszAbilityName === name)
				return abil
		}

		return undefined
	}
	GetAbility(numSlot: number): C_DOTABaseAbility {
		return this.m_pBaseEntity.m_hAbilities[numSlot] as C_DOTABaseAbility
	}
	GetItemByName(name: string, icludeBackpack: boolean = false): C_DOTA_Item {

		let items = this.m_pBaseEntity.m_Inventory.m_hItems,
			len = Math.min(items.length, icludeBackpack ? 9 : 6)

		for (let i = 0; i < len; i++) {
			let item = items[i] as C_DOTA_Item

			if (item === undefined)
				continue

			if (item.m_pAbilityData.m_pszAbilityName === name)
				return item
		}

		return undefined
	}
	GetItemByNameInBackpack(name: string): C_DOTA_Item {

		let items = this.m_pBaseEntity.m_Inventory.m_hItems,
			len = Math.min(items.length, 9)

		for (let i = 6; i < len; i++) {
			let item = items[i] as C_DOTA_Item

			if (item === undefined)
				continue

			if (item.m_pAbilityData.m_pszAbilityName === name)
				return item
		}

		return undefined
	}
	GetItemInSlot(numSlot: number): C_DOTA_Item  {
		return this.m_pBaseEntity.m_Inventory.m_hItems[numSlot] as C_DOTA_Item
	}
	GetBuffByName(name: string): CDOTA_Buff {

		let buffs = this.m_pBaseEntity.m_ModifierManager.m_vecBuffs,
			len = Math.min(buffs.length, 9)

		for (let i = 6; i < len; i++) {
			let buff = buffs[i] as CDOTA_Buff

			if (buff === undefined || buff.m_bMarkedForDeletion)
				continue

			if (buff.m_name === name)
				return buff
		}

		return undefined
	}
	GetBuff(num: number): CDOTA_Buff {
		return this.m_pBaseEntity.m_ModifierManager.m_vecBuffs[num] as CDOTA_Buff
	}
	IsControllableByPlayer(playerID: number): boolean {
		return ((this.m_pBaseEntity.m_iIsControllableByPlayer64 >> BigInt(playerID)) & 1n) === 1n
	}
	// new

	get Armor(): number {
		return this.m_pBaseEntity.m_flPhysicalArmorValue
	}
	get ArmorType(): ArmorType {
		return this.m_pBaseEntity.m_iCombatClassDefend
	}
	get AttackCapability(): DOTAUnitAttackCapability_t {
		return this.m_pBaseEntity.m_iAttackCapabilities
	}
	get AttackDamageType(): AttackDamageType {
		return this.m_pBaseEntity.m_iCombatClassAttack
	}
	get AttackRange(): number {
		return this.m_pBaseEntity.m_fAttackRange
	}
	get AttacksPerSecond(): number {
		return 1 / this.m_pBaseEntity.m_fAttacksPerSecond
	}
	get AvailableShops(): DOTA_SHOP_TYPE /*Enums.ShopFlags*/ {
		return this.m_pBaseEntity.m_iNearShopMask
	}
	// BaseArmor
	get BaseAttackTime(): number {
		return this.m_pBaseEntity.m_flBaseAttackTime
	}
	// BaseHealthRegeneration
	// BaseManaRegeneration
	get BaseMoveSpeed(): number {
		return this.m_pBaseEntity.m_iMoveSpeed
	}
	get BKBChargesUsed(): number {
		return this.m_pBaseEntity.m_iBKBChargesUsed
	}
	get DamageBonus(): number {
		return this.m_pBaseEntity.m_iDamageBonus
	}
	get CollisionPadding(): number {
		return this.m_pBaseEntity.m_flCollisionPadding
	}
	get DayVision(): number {
		return this.m_pBaseEntity.m_iDayTimeVisionRange
	}
	get DeathTime(): number {
		return this.m_pBaseEntity.m_flDeathTime
	}
	get DebuffState(): bigint {
		return this.m_pBaseEntity.m_nUnitDebuffState
	}
	// check
	get HasArcana(): boolean {
		return this.m_pBaseEntity.m_nArcanaLevel > 0
	}
	get BaseStatsChanged(): boolean {
		return this.m_pBaseEntity.m_bBaseStatsChanged
	}
	get HasInventory(): boolean {
		return this.m_pBaseEntity.m_bHasInventory
	}
	get HasSharedAbilities(): boolean {
		return this.m_pBaseEntity.m_bHasSharedAbilities
	}
	// HasStolenScepter
	get HasUpgradeableAbilities(): boolean {
		return this.m_pBaseEntity.m_bHasUpgradeableAbilities
	}
	get HealthBarOffset(): number {
		return this.m_pBaseEntity.m_iHealthBarOffset
	}
	get HealthBarHighlightColor(): Color {
		return this.m_pBaseEntity.m_iHealthBarHighlightColor
	}
	get HPRegen(): number {
		return this.m_pBaseEntity.m_flHealthThinkRegen
	}
	get HullRadius(): number {
		return this.m_pBaseEntity.m_flHullRadius
	}
	get IncreasedAttackSpeed(): number {
		return this.m_pBaseEntity.m_fIncreasedAttackSpeed
	}
	// _Inventory: C_DOTA_UnitInventory
	get Inventory(): C_DOTA_UnitInventory {

		if (!this.HasInventory)
			return undefined

		return this.m_pBaseEntity.m_Inventory

		// return this._Inventory === undefined && this.HasInventory
		// 	? this._Inventory = new UnitInventory(this.ent)
		// 	: this._Inventory;
	}
	get InvisibleLevel(): number {
		return this.m_pBaseEntity.m_flInvisibilityLevel
	}
	get IsAncient(): boolean {
		return this.m_pBaseEntity.m_bIsAncient
	}
	/**
	 * IsControllable by LocalPlayer
	 */
	get IsControllable(): boolean {
		return LocalDOTAPlayer !== undefined && this.IsControllableByPlayer(LocalDOTAPlayer.m_iPlayerID)
	}
	get IsDominatable(): boolean {
		return this.m_pBaseEntity.m_bCanBeDominated
	}
	get IsIllusion(): boolean {

		var ent = this.m_pBaseEntity

		if (ent.m_bIsIllusion)
			return true

		// if (ent instanceof C_DOTA_Unit_Hero_Meepo)
		// 	(ent as C_DOTA_Unit_Hero_Meepo).
	}
	// get IsMeepoIllusion(): boolean {
	// 	return (this.ent as C_DOTA_Unit_Hero_Meepo).m_bIsClone;
	// }
	get IsMelee(): boolean {
		return this.AttackCapability === DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_MELEE_ATTACK
	}
	get IsMoving(): boolean {
		return this.m_pBaseEntity.m_bIsMoving
	}
	get IsNeutral(): boolean {
		return this.m_pBaseEntity.m_bIsNeutralUnitType
	}
	get IsPhantom(): boolean {
		return this.m_pBaseEntity.m_bIsPhantom
	}
	get IsRanged(): boolean {
		return this.AttackCapability === DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_RANGED_ATTACK
	}
	get IsSpawned(): boolean {
		return !this.IsWaitingToSpawn
	}
	get IsSummoned(): boolean {
		return this.m_pBaseEntity.m_bIsSummoned
	}
	get IsVisibleForTeam(): DOTATeam_t {
		return this.m_pBaseEntity.m_iTaggedAsVisibleByTeam
	}
	/* get IsTrueSightedForEnemies(): boolean {
		return this.ent.m_bIsTrueSightedForEnemies
	} */
	get IsWaitingToSpawn(): boolean {
		return this.m_pBaseEntity.m_bIsWaitingToSpawn
	}
	get Level(): number {
		return this.m_pBaseEntity.m_iCurrentLevel
	}
	get Mana(): number {
		return this.m_pBaseEntity.m_flMana
	}
	// ManaRegen(): number {
	// 	//return this.ent.manare
	// }
	get MaxDamage(): number {
		return this.m_pBaseEntity.m_iDamageMax
	}
	get MaxMana(): number {
		return this.m_pBaseEntity.m_flMaxMana
	}
	get MinimapIcon(): string {
		return this.m_pBaseEntity.m_iszMinimapIcon
	}
	get MinimapIconSize(): number {
		return this.m_pBaseEntity.m_flMinimapIconSize
	}
	get MinDamage(): number {
		return this.m_pBaseEntity.m_iDamageMin
	}
	get Modifiers(): CDOTA_ModifierManager {
		return this.m_pBaseEntity.m_ModifierManager
	}
	get MoveCapability(): DOTAUnitMoveCapability_t {
		return this.m_pBaseEntity.m_iMoveCapabilities
	}
	get IdealSpeed(): number {
		return this.m_pBaseEntity.m_fIdealSpeed
	}
	get Name(): string {
		return this.m_pBaseEntity.m_iszUnitName
	}
	get NetworkActivity(): GameActivity_t {
		return this.m_pBaseEntity.m_NetworkActivity
	}
	get NightVision(): number {
		return this.m_pBaseEntity.m_iNightTimeVisionRange
	}
	get ProjectileCollisionSize(): number {
		return this.m_pBaseEntity.m_flProjectileCollisionSize
	}
	get RingRadius(): number {
		return this.m_pBaseEntity.m_flRingRadius
	}
	get RotationDifference(): number {
		return this.m_pBaseEntity.m_anglediff
	}
	get SecondsPerAttack(): number {
		return this.m_pBaseEntity.m_fAttacksPerSecond
	}
	get TauntCooldown(): number {
		return this.m_pBaseEntity.m_flTauntCooldown
	}
	get TotalDamageTaken(): bigint {
		return this.m_pBaseEntity.m_nTotalDamageTaken
	}
	get UnitState(): modifierstate[] {
		return SplitBigInt(this.m_pBaseEntity.m_nUnitState64)
	}
	get UnitType(): number {
		return this.m_pBaseEntity.m_iUnitType
	}

	get Abilities(): C_DOTABaseAbility[] {
		return this.m_pBaseEntity.m_hAbilities as C_DOTABaseAbility[]
	}
	get Items(): C_DOTA_Item[] {
		let inv = this.Inventory

		if (inv === undefined)
			return undefined

		return inv.m_hItems as C_DOTA_Item[]
	}
	SpellAmplification(): number {
		let spellAmp = 0

		if (this instanceof Hero)
			spellAmp += this.TotalIntelligence * 0.07 / 100 // https://dota2.gamepedia.com/Intelligence

		let items = this.Items

		if (items !== undefined) {

			for (let i = 0; i < 6; i++) {
				let item = items[i]
				if (items === undefined)
					continue
				spellAmp += item.GetSpecialValue("spell_amp") / 100
			}
		}

		let abils = this.Abilities
		for (let i = 0, len = abils.length; i < len; i++) {
			let abil = abils[i]

			if (abil === undefined || abil.m_iLevel)
				continue

			let abilData = abil.m_pAbilityData
			if (abilData === undefined)
				continue

			let abilName = abilData.m_pszAbilityName
			if (abilName === undefined || !abilName.startsWith("special_bonus_spell_amplify"))
				continue

			spellAmp += abil.GetSpecialValue("value") / 100
		}

		return spellAmp
	}
}

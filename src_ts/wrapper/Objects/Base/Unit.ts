import Color from "../../Base/Color"
import Vector2 from "../../Base/Vector2"
import Vector3 from "../../Base/Vector3"
import { HasBit, HasBitBigInt, MaskToArrayBigInt } from "../../Utils/Utils"

import { LocalPlayer } from "../../Managers/EntityManager"

import Entity from "./Entity"
import Player from "./Player"
//import Creep from "./Creep";

import AbilitiesBook from "../DataBook/AbilitiesBook"
import Inventory from "../DataBook/Inventory"
import Ability from "./Ability"
import Item from "./Item"

import ModifiersBook from "../DataBook/ModifiersBook"
import Modifier from "./Modifier"

import PhysicalItem from "./PhysicalItem"
import Rune from "./Rune"
import Tree from "./Tree"

/* ================================  ================================ */
/* ================  ================ */
/* ========  ======== */
/* ==== ==== */

export default class Unit extends Entity {
	/* ================================ Static ================================ */

	static IsVisibleForEnemies(unit: Unit, newTagged: number): boolean {
		const valid_teams = ~(1 | (1 << DOTATeam_t.DOTA_TEAM_SPECTATOR)
			| (1 << DOTATeam_t.DOTA_TEAM_NEUTRALS)
			| (1 << DOTATeam_t.DOTA_TEAM_NOTEAM)) // don't check not existing team (0), spectators (1), neutrals (4) and noteam (5)

		let local_team = unit.Team,
			flags = newTagged & valid_teams

		for (let i = 14; i--; )
			if (i !== local_team && ((flags >> i) & 1))
				return true
		return false
	}

	/* ================================ Fields ================================ */

	/* protected */ readonly m_pBaseEntity: C_DOTA_BaseNPC
	private m_Inventory: Inventory
	private m_AbilitiesBook: AbilitiesBook
	private m_ModifiersBook: ModifiersBook

	private m_bIsVisibleForEnemies: boolean = false
	private m_bIsTrueSightedForEnemies: boolean = false
	private m_bHasScepterModifier: boolean = false

	/* ================================ BASE ================================ */

	/* ================ GETTERS ================ */

	get IsHero(): boolean {
		return HasBit(this.UnitType, 0)
	}
	get IsTower(): boolean {
		return HasBit(this.UnitType, 2)
	}
	get IsConsideredHero(): boolean {
		return HasBit(this.UnitType, 3)
	}
	get IsBuilding(): boolean {
		return HasBit(this.UnitType, 4)
	}
	get IsFort(): boolean {
		return HasBit(this.UnitType, 5)
	}
	get IsBarrack(): boolean {
		return HasBit(this.UnitType, 6)
	}
	get IsCreep(): boolean {
		return HasBit(this.UnitType, 7)
	}
	get IsCourier(): boolean {
		return HasBit(this.UnitType, 8)
	}
	get IsShop(): boolean {
		return HasBit(this.UnitType, 9)
	}
	get IsLaneCreep(): boolean {
		return HasBit(this.UnitType, 10)
	}
	get IsShrine(): boolean {
		return HasBit(this.UnitType, 12)
	}
	get IsWard(): boolean {
		return HasBit(this.UnitType, 17)
	}

	/* ======== modifierstate ======== */

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
			|| this.InvisibleLevel > 0.5
	}
	get IsInvulnerable(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_INVULNERABLE)
	}
	get IsMagicImmune(): boolean {
		return this.m_pBaseEntity.m_bIsMagicImmune
		// return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_MAGIC_IMMUNE);
	}
	get IsDeniable(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_SPECIALLY_DENIABLE)
	}
	//
	get IsNoHealthBar(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_NO_HEALTH_BAR)
	}
	//
	get IsNoCollision(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION)
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

	/* ======== base ======== */

	get IsInFadeTime(): boolean {
		return this.m_pBaseEntity.m_flInvisibilityLevel > 0
	}
	set IsVisibleForEnemies(value: boolean) {
		this.m_bIsVisibleForEnemies = value
	}
	get IsVisibleForEnemies(): boolean {
		return this.m_bIsVisibleForEnemies
	}
	set IsTrueSightedForEnemies(value: boolean) {
		this.m_bIsTrueSightedForEnemies = value
	}
	get IsTrueSightedForEnemies(): boolean {
		return this.m_bIsTrueSightedForEnemies
	}
	get IsControllableByAnyPlayer(): boolean {
		return this.m_pBaseEntity.m_iIsControllableByPlayer64 !== 0n
	}
	get IsRangeAttacker(): boolean {
		return this.HasAttackCapability(DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_RANGED_ATTACK)
	}
	set HasScepter(value: boolean) {
		this.m_bHasScepterModifier = value
	}
	get HasScepter(): boolean {
		if (this.HasStolenScepter)
			return true

		return this.m_bHasScepterModifier
	}

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
	get DamageAverage(): number {
		return (this.MinDamage + this.MaxDamage) / 2
	}
	get DamageBonus(): number {
		return this.m_pBaseEntity.m_iDamageBonus
	}
	/**
	 * https://dota2.gamepedia.com/Armor
	 */
	get DamageResist(): number {
		let armor = this.Armor
		return (0.052 * armor) / (0.9 + 0.048 * Math.abs(armor))
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
	get DebuffState(): modifierstate[] {
		return MaskToArrayBigInt(this.m_pBaseEntity.m_nUnitDebuffState)
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
	get HasStolenScepter(): boolean {
		return this.m_pBaseEntity.m_bStolenScepter
	}
	get HasUpgradeableAbilities(): boolean {
		return this.m_pBaseEntity.m_bHasUpgradeableAbilities
	}
	get HealthBarOffset(): number {
		return this.m_pBaseEntity.m_iHealthBarOffset
	}
	get HealthBarHighlightColor(): Color {
		return Color.fromIOBuffer(this.m_pBaseEntity.m_iHealthBarHighlightColor)
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
		return LocalPlayer !== undefined && this.IsControllableByPlayer(LocalPlayer.PlayerID)
	}
	get IsDominatable(): boolean {
		return this.m_pBaseEntity.m_bCanBeDominated
	}
	get IsIllusion(): boolean {
		return this.m_pBaseEntity.m_bIsIllusion
	}
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
	set IsVisibleForTeamMask(value: number) {
		this.m_pBaseEntity.m_iTaggedAsVisibleByTeam = value
	}
	get IsVisibleForTeamMask(): number {
		return this.m_pBaseEntity.m_iTaggedAsVisibleByTeam
	}
	get IsWaitingToSpawn(): boolean {
		return this.m_pBaseEntity.m_bIsWaitingToSpawn
	}
	get Level(): number {
		return this.m_pBaseEntity.m_iCurrentLevel
	}
	get MagicDamageResist(): number {
		return this.m_pBaseEntity.m_flMagicalResistanceValue
	}
	get Mana(): number {
		return this.m_pBaseEntity.m_flMana
	}
	get ManaPercent(): number {
		return Math.floor(this.Mana / this.MaxMana * 100) || 0
	}
	get ManaRegen(): number {
		return this.m_pBaseEntity.m_flManaRegen
	}
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
	get MoveCapability(): DOTAUnitMoveCapability_t {
		return this.m_pBaseEntity.m_iMoveCapabilities
	}
	get IdealSpeed(): number {
		return this.m_pBaseEntity.m_fIdealSpeed
	}
	get Name(): string {
		return this.m_pBaseEntity.m_iszUnitName || ""
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
		return MaskToArrayBigInt(this.m_pBaseEntity.m_nUnitState64)
	}
	get UnitType(): number {
		return this.m_pBaseEntity.m_iUnitType
	}

	get AbilitiesBook(): AbilitiesBook {
		return this.m_AbilitiesBook
			|| (this.m_AbilitiesBook = new AbilitiesBook(this))
	}
	get Spells(): Ability[] {
		return this.AbilitiesBook.Spells
	}
	get Inventory(): Inventory {
		return this.m_Inventory || (this.m_Inventory = new Inventory(this))
	}
	get Items(): Item[] {
		return this.Inventory.Items
	}

	GetItemByName(name: string  | RegExp, includeBackpack: boolean = false): Item {
		return this.Inventory.GetItemByName(name, includeBackpack)
	}

	get ModifiersBook(): ModifiersBook {
		return this.m_ModifiersBook
			|| (this.m_ModifiersBook = new ModifiersBook(this))
	}
	get Buffs(): Modifier[] {
		return this.ModifiersBook.Buffs
	}

	/* ================ METHODS ================ */

	/**
	 * @param flag if not exists => is Melee or Range attack
	 */
	HasAttackCapability(flag?: DOTAUnitAttackCapability_t): boolean {
		let attackCap = this.m_pBaseEntity.m_iAttackCapabilities

		if (flag !== undefined)
			return (attackCap & flag) !== 0

		return (attackCap & (
			DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_MELEE_ATTACK |
			DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_RANGED_ATTACK)
		) !== 0
	}
	/**
	 * @param flag if not exists => isn't move NONE
	 */
	HasMoveCapability(flag: DOTAUnitMoveCapability_t): boolean {
		let moveCap = this.m_pBaseEntity.m_iMoveCapabilities

		if (flag !== undefined)
			return (moveCap & flag) !== 0

		return flag !== DOTAUnitMoveCapability_t.DOTA_UNIT_CAP_MOVE_NONE
	}

	IsUnitStateFlagSet(flag: modifierstate): boolean {
		return HasBitBigInt((this.m_pBaseEntity.m_nUnitState64 | this.m_pBaseEntity.m_nUnitDebuffState), BigInt(flag))
	}
	IsControllableByPlayer(playerID: number): boolean {
		return HasBitBigInt(this.m_pBaseEntity.m_iIsControllableByPlayer64, BigInt(playerID))
	}

	/* ================================ EXTENSIONS ================================ */

	/* ================ GETTERS ================ */

	get IsRotating(): boolean {
		return this.RotationDifference !== 0
	}

	get IsChanneling(): boolean {
		if (this.HasInventory && this.Items.some(item => item.IsChanneling))
			return true

		return this.Spells.some(spell => spell.IsChanneling)
	}
	get CastRangeBonus(): number {
		let castrange = 0

		let lens = this.Inventory.GetItemByName("item_aether_lens")
		if (lens !== undefined)
			castrange += lens.GetSpecialValue("cast_range_bonus")

		this.Spells.forEach(spell => {
			if (spell.Level > 0 && /special_bonus_cast_range_/.test(spell.Name))
				castrange += spell.GetSpecialValue("value")
		})
		return castrange
	}
	get SpellAmplification(): number {
		let spellAmp = 0

		this.Items.forEach(item => spellAmp += item.GetSpecialValue("spell_amp") / 100)

		this.Spells.forEach(spell => {
			if (spell.Level > 0 && spell.Name.startsWith("special_bonus_spell_amplify"))
				spellAmp += spell.GetSpecialValue("value") / 100
		})

		return spellAmp
	}

	/* ================ METHODS ================ */

	/**
	 * @param fromCenterToCenter include HullRadiuses (for Units)
	 */
	Distance2D(vec: Vector3 | Vector2 | Entity, fromCenterToCenter: boolean = false): number {
		if (vec instanceof Vector3 || vec instanceof Vector2)
			return super.Distance2D(vec)

		return super.Distance2D(vec) - (fromCenterToCenter ? 0 : this.HullRadius + (vec instanceof Unit ? vec.HullRadius : 0))
	}
	GetAbilityByName(name: string | RegExp) {
		return this.AbilitiesBook.GetAbilityByName(name)
	}
	GetBuffByName(name: string) {
		return this.ModifiersBook.GetBuffByName(name)
	}

	GetTalentValue(name: string | RegExp) {
		let talent = this.AbilitiesBook.GetAbilityByName(name)
		return talent !== undefined && talent.Level > 0 ? talent.GetSpecialValue("value") : 0
	}
	GetTalentClassValue(class_: any) {
		let talent = this.AbilitiesBook.GetAbilityByClass(class_)
		return talent !== undefined && talent.Level > 0 ? talent.GetSpecialValue("value") : 0
	}
	/**
	 * faster (Distance <= range)
	 * @param fromCenterToCenter include HullRadiuses (for Units)
	 */
	IsInRange(ent: Vector3 | Vector2 | Entity, range: number, fromCenterToCenter: boolean = false): boolean {
		if (fromCenterToCenter === false) {

			range += this.HullRadius

			if (ent instanceof Unit)
				range += ent.HullRadius
		}

		return super.IsInRange(ent, range)
	}
	AttackDamage(target: Unit, useMinDamage: boolean = false, damageAmplifier: number = 0): number {

		let damage = (useMinDamage ? this.MinDamage : this.DamageAverage) + this.DamageBonus,
			damageType = this.AttackDamageType,
			armorType = target.ArmorType,
			mult = 1

		if (damageType === AttackDamageType.Hero && armorType === ArmorType.Structure)
			mult *= .5
		else if (damageType === AttackDamageType.Basic && armorType === ArmorType.Hero)
			mult *= .75
		else if (damageType === AttackDamageType.Basic && armorType === ArmorType.Structure)
			mult *= .7
		else if (damageType === AttackDamageType.Pierce && armorType === ArmorType.Hero)
			mult *= .5
		else if (damageType === AttackDamageType.Pierce && armorType === ArmorType.Basic)
			mult *= 1.5
		else if (damageType === AttackDamageType.Pierce && armorType === ArmorType.Structure)
			mult *= .35
		else if (damageType === AttackDamageType.Siege && armorType === ArmorType.Hero)
			mult *= .85
		else if (damageType === AttackDamageType.Siege && armorType === ArmorType.Structure)
			mult *= 2.5

		if (target.IsNeutral || (target.IsCreep && this.IsEnemy(target))) {

			let isMelee = this.IsMelee,
				inventory = this.Inventory

			let quellingBlade = inventory.GetItemByName("item_quelling_blade")
			if (quellingBlade !== undefined)
				damage += quellingBlade.GetSpecialValue(isMelee ? "damage_bonus" : "damage_bonus_ranged")

			let battleFury = inventory.GetItemByName("item_bfury")
			if (battleFury != undefined)
				mult *= battleFury.GetSpecialValue(isMelee ? "quelling_bonus" : "quelling_bonus_ranged") / 100
		}

		mult *= 1 - this.DamageResist
		mult *= (1 + damageAmplifier)

		return damage * mult
	}
	CanAttack(target?: Unit): boolean {
		if (!this.IsAlive || this.IsInvulnerable || this.IsDormant || !this.IsSpawned
			|| this.IsAttackImmune)
			return false

		if (target === undefined || !target.IsAlive || target.IsInvulnerable || target.IsDormant || !target.IsSpawned
			|| target.IsAttackImmune)
			return false

		if (target.Team === LocalPlayer.Team) {

			if (target.IsCreep)
				return target.HPPercent < 0.5

			if (target.IsHero)
				return target.IsDeniable && target.HPPercent < 0.25

			if (target.IsBuilding)
				return target.HPPercent < 0.1
		}

		return true
	}
	/* ================================ ORDERS ================================ */
	UseSmartAbility(ability: Ability, target?: Vector3 | Entity, checkToggled: boolean = false, queue?: boolean, showEffects?: boolean) {

		if (checkToggled && ability.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_TOGGLE) && !ability.IsToggled)
			return this.CastToggle(ability, queue, showEffects)

		if (ability.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET))
			return this.CastNoTarget(ability, queue, showEffects)

		if (ability.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT)) {
			if (target instanceof Entity)
				target = target.Position

			return this.CastPosition(ability, target, queue, showEffects)
		}

		if (ability.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET))
			return this.CastTarget(ability, target as Entity, showEffects)
	}

	MoveTo(position: Vector3 | Vector2, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION, unit: this, position, queue, showEffects })
	}
	MoveToTarget(target: Entity | number, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION, unit: this, target, queue, showEffects })
	}
	AttackMove(position: Vector3 | Vector2, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE, unit: this, position, queue, showEffects })
	}
	AttackTarget(target: Entity | number, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET, unit: this, target, queue, showEffects })
	}
	CastPosition(ability: Ability, position: Vector3 | Vector2, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION, unit: this, ability, position, queue, showEffects })
	}
	CastTarget(ability: Ability, target: Entity | number, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET, unit: this, target, ability, queue, showEffects })
	}
	CastTargetTree(ability: Ability, tree: Tree | number, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET_TREE, unit: this, target: tree, ability, queue, showEffects })
	}
	CastNoTarget(ability: Ability, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET, unit: this, ability, queue, showEffects })
	}
	CastToggle(ability: Ability, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE, unit: this, ability, queue, showEffects })
	}
	HoldPosition(position: Vector3 | Vector2, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_HOLD_POSITION, unit: this, position, queue, showEffects })
	}
	TrainAbility(ability: Ability) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_TRAIN_ABILITY, unit: this, ability })
	}
	DropItem(item: Item, position: Vector3 | Vector2, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_DROP_ITEM, unit: this, ability: item, position, queue, showEffects })
	}
	GiveItem(item: Item, target: Entity | number, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_GIVE_ITEM, unit: this, target, ability: item, queue, showEffects })
	}
	PickupItem(physicalItem: PhysicalItem | number, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_ITEM, unit: this, target: physicalItem, queue, showEffects })
	}
	PickupRune(rune: Rune | number, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_RUNE, unit: this, target: rune, queue, showEffects })
	}
	// check
	PurchaseItem(itemID: number, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_PURCHASE_ITEM, unit: this, target: itemID, queue, showEffects })
	}
	SellItem(item: Item) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_SELL_ITEM, unit: this, ability: item })
	}
	// check
	DisassembleItem(item: Item, queue?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_DISASSEMBLE_ITEM, unit: this, ability: item, queue })
	}
	MoveItem(item: Item, slot: DOTAScriptInventorySlot_t) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_ITEM, unit: this, target: slot, ability: item })
	}
	CastToggleAuto(item: Item, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO, unit: this, ability: item, queue, showEffects })
	}
	OrderStop(queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_STOP, unit: this, queue, showEffects })
	}
	UnitTaunt(queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_TAUNT, unit: this, queue, showEffects })
	}
	ItemFromStash(item: Item) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_EJECT_ITEM_FROM_STASH, unit: this, ability: item })
	}
	CastRune(runeItem: Item | number, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_RUNE, unit: this, target: runeItem, queue, showEffects })
	}
	PingAbility(ability: Ability) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_PING_ABILITY, unit: this, ability })
	}
	MoveToDirection(position: Vector3 | Vector2, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_DIRECTION, unit: this, position, queue, showEffects })
	}
	Patrol(position: Vector3 | Vector2, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_PATROL, unit: this, position, queue, showEffects })
	}
	VectorTargetPosition(ability: Ability, Direction: Vector3 | Vector2, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_VECTOR_TARGET_POSITION, unit: this, ability, position: Direction, queue, showEffects })
	}
	CastVectorTargetPosition(ability: Ability, position: Vector3 | Vector2 | Unit, Direction: Vector3 | Vector2, queue?: boolean, showEffects?: boolean): void {

		if (position instanceof Unit)
			position = position.Position

		this.VectorTargetPosition(ability, Direction, queue, showEffects)
		this.CastPosition(ability, position, queue, showEffects)
	}
	ItemLock(item: Item, state: boolean = true) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_SET_ITEM_COMBINE_LOCK, unit: this, ability: item, target: state === false ? 0 : undefined })
	}
	OrderContinue(item: Item, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CONTINUE, unit: this, ability: item, queue, showEffects })
	}
	VectorTargetCanceled(position: Vector3 | Vector2, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_VECTOR_TARGET_CANCELED, unit: this, position, queue, showEffects })
	}
}

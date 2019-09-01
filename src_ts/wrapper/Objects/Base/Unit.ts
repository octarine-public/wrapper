import Color from "../../Base/Color"
import Vector2 from "../../Base/Vector2"
import Vector3 from "../../Base/Vector3"
import { DamageIgnoreBuffs, HasBit, HasBitBigInt, MaskToArrayBigInt } from "../../Utils/Utils"

import { Game, LocalPlayer } from "../../Managers/EntityManager"

import Entity from "./Entity"
import Player from "./Player"
// import Creep from "./Creep";

import AbilitiesBook from "../DataBook/AbilitiesBook"
import Inventory from "../DataBook/Inventory"
import Ability from "./Ability"
import Item from "./Item"

import ModifiersBook from "../DataBook/ModifiersBook"
import Modifier from "./Modifier"

import PhysicalItem from "./PhysicalItem"
import Rune from "./Rune"
import Tree from "./Tree"

export default class Unit extends Entity {
	/* ================================ Static ================================ */
	public static IsVisibleForEnemies(unit: Unit, newTagged: number): boolean {
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
	public readonly m_pBaseEntity: C_DOTA_BaseNPC
	public readonly AbilitiesBook: AbilitiesBook
	public readonly Inventory: Inventory
	public readonly ModifiersBook: ModifiersBook
	public IsVisibleForEnemies: boolean = false
	public IsTrueSightedForEnemies: boolean = false

	private UnitName_: string
	private m_bHasScepterModifier: boolean = false

	constructor(m_pBaseEntity: C_BaseEntity, Index: number) {
		super(m_pBaseEntity, Index)
		this.AbilitiesBook = new AbilitiesBook(this)
		this.Inventory = new Inventory(this)
		this.ModifiersBook = new ModifiersBook(this)
	}

	/* ================ GETTERS ================ */
	public get IsHero(): boolean {
		return HasBit(this.UnitType, 0)
	}
	public get IsTower(): boolean {
		return HasBit(this.UnitType, 2)
	}
	public get IsConsideredHero(): boolean {
		return HasBit(this.UnitType, 3)
	}
	public get IsBuilding(): boolean {
		return HasBit(this.UnitType, 4)
	}
	public get IsFort(): boolean {
		return HasBit(this.UnitType, 5)
	}
	public get IsBarrack(): boolean {
		return HasBit(this.UnitType, 6)
	}
	public get IsCreep(): boolean {
		return HasBit(this.UnitType, 7)
	}
	public get IsCourier(): boolean {
		return HasBit(this.UnitType, 8)
	}
	public get IsShop(): boolean {
		return HasBit(this.UnitType, 9)
	}
	public get IsLaneCreep(): boolean {
		return HasBit(this.UnitType, 10)
	}
	public get IsShrine(): boolean {
		return HasBit(this.UnitType, 12)
	}
	public get IsWard(): boolean {
		return HasBit(this.UnitType, 17)
	}

	/* ======== modifierstate ======== */
	public get IsRooted(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_ROOTED)
	}
	public get IsDisarmed(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_DISARMED)
	}
	public get IsAttackImmune(): boolean {
		// return this.m_pBaseEntity.m_bIsAttackImmune
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_ATTACK_IMMUNE)
	}
	public get IsSilenced(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_SILENCED)
	}
	public get IsMuted(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_MUTED)
	}
	public get IsStunned(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_STUNNED)
	}
	public get IsHexed(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_HEXED)
	}
	public get IsInvisible(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_INVISIBLE) || this.InvisibleLevel > 0.5
	}
	public get IsInvulnerable(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_INVULNERABLE)
	}
	public get IsMagicImmune(): boolean {
		return this.m_pBaseEntity.m_bIsMagicImmune
		// return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_MAGIC_IMMUNE);
	}
	public get IsDeniable(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_SPECIALLY_DENIABLE)
	}
	//
	public get HasNoHealthBar(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_NO_HEALTH_BAR)
	}
	//
	public get HasNoCollision(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION)
	}
	//
	public get IsBlind(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_BLIND)
	}
	//
	public get IsRealUnit(): boolean {
		return this.UnitType !== 0 && !this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_FAKE_ALLY)
	}
	//
	public get IsTrueSightImmune(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_TRUESIGHT_IMMUNE)
	}

	/* ======== base ======== */
	public get IsInFadeTime(): boolean {
		return this.m_pBaseEntity.m_flInvisibilityLevel > 0
	}
	public get IsControllableByAnyPlayer(): boolean {
		return this.m_pBaseEntity.m_iIsControllableByPlayer64 !== 0n
	}
	public get IsRangeAttacker(): boolean {
		return this.HasAttackCapability(DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_RANGED_ATTACK)
	}
	public set HasScepter(value: boolean) {
		this.m_bHasScepterModifier = value
	}
	public get HasScepter(): boolean {
		return this.m_bHasScepterModifier || this.HasStolenScepter
	}

	public get Armor(): number {
		return this.m_pBaseEntity.m_flPhysicalArmorValue
	}
	public get ArmorType(): ArmorType {
		return this.m_pBaseEntity.m_iCombatClassDefend
	}
	public get AttackCapability(): DOTAUnitAttackCapability_t {
		return this.m_pBaseEntity.m_iAttackCapabilities
	}
	public get AttackDamageType(): AttackDamageType {
		return this.m_pBaseEntity.m_iCombatClassAttack
	}
	public get AttackRange(): number {
		return this.m_pBaseEntity.m_fAttackRange
	}
	public get AttacksPerSecond(): number {
		return 1 / this.m_pBaseEntity.m_fAttacksPerSecond
	}
	public get AvailableShops(): DOTA_SHOP_TYPE /*Enums.ShopFlags*/ {
		return this.m_pBaseEntity.m_iNearShopMask
	}
	// BaseArmor
	public get BaseAttackTime(): number {
		return this.m_pBaseEntity.m_flBaseAttackTime
	}
	// BaseHealthRegeneration
	// BaseManaRegeneration
	public get BaseMoveSpeed(): number {
		return this.m_pBaseEntity.m_iMoveSpeed
	}
	public get BKBChargesUsed(): number {
		return this.m_pBaseEntity.m_iBKBChargesUsed
	}
	public get DamageAverage(): number {
		return (this.MinDamage + this.MaxDamage) / 2
	}
	public get DamageBonus(): number {
		return this.m_pBaseEntity.m_iDamageBonus
	}
	/**
	 * https://dota2.gamepedia.com/Armor
	 */
	public get DamageResist(): number {
		let armor = this.Armor
		return (0.052 * armor) / (0.9 + 0.048 * Math.abs(armor))
	}
	public get CollisionPadding(): number {
		return this.m_pBaseEntity.m_flCollisionPadding
	}
	public get DayVision(): number {
		return this.m_pBaseEntity.m_iDayTimeVisionRange
	}
	public get DeathTime(): number {
		return this.m_pBaseEntity.m_flDeathTime
	}
	public get DebuffState(): modifierstate[] {
		return MaskToArrayBigInt(this.m_pBaseEntity.m_nUnitDebuffState)
	}
	// check
	public get HasArcana(): boolean {
		return this.m_pBaseEntity.m_nArcanaLevel > 0
	}
	public get BaseStatsChanged(): boolean {
		return this.m_pBaseEntity.m_bBaseStatsChanged
	}
	public get HasInventory(): boolean {
		return this.m_pBaseEntity.m_bHasInventory
	}
	public get HasSharedAbilities(): boolean {
		return this.m_pBaseEntity.m_bHasSharedAbilities
	}
	public get HasStolenScepter(): boolean {
		return this.m_pBaseEntity.m_bStolenScepter
	}
	public get HasUpgradeableAbilities(): boolean {
		return this.m_pBaseEntity.m_bHasUpgradeableAbilities
	}
	public get HealthBarOffset(): number {
		return this.m_pBaseEntity.m_iHealthBarOffset
	}
	public get HealthBarHighlightColor(): Color {
		return Color.fromIOBuffer(this.m_pBaseEntity.m_iHealthBarHighlightColor)
	}
	public get HPRegen(): number {
		return this.m_pBaseEntity.m_flHealthThinkRegen
	}
	public get HullRadius(): number {
		return this.m_pBaseEntity.m_flHullRadius
	}
	public get IncreasedAttackSpeed(): number {
		return this.m_pBaseEntity.m_fIncreasedAttackSpeed
	}

	public get InvisibleLevel(): number {
		return this.m_pBaseEntity.m_flInvisibilityLevel
	}
	public get IsAncient(): boolean {
		return this.m_pBaseEntity.m_bIsAncient
	}
	/**
	 * IsControllable by LocalPlayer
	 */
	public get IsControllable(): boolean {
		return this.IsValid && LocalPlayer !== undefined && this.IsControllableByPlayer(LocalPlayer.PlayerID)
	}
	public get IsDominatable(): boolean {
		return this.m_pBaseEntity.m_bCanBeDominated
	}
	public get IsIllusion(): boolean {
		return this.m_pBaseEntity.m_bIsIllusion
	}
	public get IsMelee(): boolean {
		return this.AttackCapability === DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_MELEE_ATTACK
	}
	public get IsMoving(): boolean {
		return this.m_pBaseEntity.m_bIsMoving
	}
	public get IsNeutral(): boolean {
		return this.m_pBaseEntity.m_bIsNeutralUnitType
	}
	public get IsPhantom(): boolean {
		return this.m_pBaseEntity.m_bIsPhantom
	}
	public get IsRanged(): boolean {
		return this.AttackCapability === DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_RANGED_ATTACK
	}
	public get IsSpawned(): boolean {
		return !this.IsWaitingToSpawn
	}
	public get IsSummoned(): boolean {
		return this.m_pBaseEntity.m_bIsSummoned
	}
	public set IsVisibleForTeamMask(value: number) {
		this.m_pBaseEntity.m_iTaggedAsVisibleByTeam = value
	}
	public get IsVisibleForTeamMask(): number {
		return this.m_pBaseEntity.m_iTaggedAsVisibleByTeam
	}
	public get IsWaitingToSpawn(): boolean {
		return this.m_pBaseEntity.m_bIsWaitingToSpawn
	}
	public get Level(): number {
		return this.m_pBaseEntity.m_iCurrentLevel
	}
	public get MagicDamageResist(): number {
		return this.m_pBaseEntity.m_flMagicalResistanceValue
	}
	public get Mana(): number {
		return this.m_pBaseEntity.m_flMana
	}
	public get ManaPercent(): number {
		return Math.floor(this.Mana / this.MaxMana * 100) || 0
	}
	public get ManaRegen(): number {
		return this.m_pBaseEntity.m_flManaRegen
	}
	public get MaxDamage(): number {
		return this.m_pBaseEntity.m_iDamageMax
	}
	public get MaxMana(): number {
		return this.m_pBaseEntity.m_flMaxMana
	}
	public get MinimapIcon(): string {
		return this.m_pBaseEntity.m_iszMinimapIcon
	}
	public get MinimapIconSize(): number {
		return this.m_pBaseEntity.m_flMinimapIconSize
	}
	public get MinDamage(): number {
		return this.m_pBaseEntity.m_iDamageMin
	}
	public get MoveCapability(): DOTAUnitMoveCapability_t {
		return this.m_pBaseEntity.m_iMoveCapabilities
	}
	public get IdealSpeed(): number {
		return this.m_pBaseEntity.m_fIdealSpeed
	}
	public VelocityWaypoint(time: number, movespeed: number = this.IsMoving ? this.IdealSpeed : 0): Vector3 {
		return this.InFront(movespeed * time)
	}
	public get NetworkActivity(): GameActivity_t {
		return this.m_pBaseEntity.m_NetworkActivity
	}
	public get NightVision(): number {
		return this.m_pBaseEntity.m_iNightTimeVisionRange
	}
	public get ProjectileCollisionSize(): number {
		return this.m_pBaseEntity.m_flProjectileCollisionSize
	}
	public get RingRadius(): number {
		return this.m_pBaseEntity.m_flRingRadius
	}
	public get RotationDifference(): number {
		return this.m_pBaseEntity.m_anglediff
	}
	public get SecondsPerAttack(): number {
		return this.m_pBaseEntity.m_fAttacksPerSecond
	}
	public get TauntCooldown(): number {
		return this.m_pBaseEntity.m_flTauntCooldown
	}
	public get TotalDamageTaken(): bigint {
		return this.m_pBaseEntity.m_nTotalDamageTaken
	}
	public get UnitState(): modifierstate[] {
		return MaskToArrayBigInt(this.m_pBaseEntity.m_nUnitState64)
	}
	public get UnitType(): number {
		return this.m_pBaseEntity.m_iUnitType
	}

	public get Spells(): Ability[] {
		return this.AbilitiesBook.Spells
	}
	public get Items(): Item[] {
		return this.Inventory.Items
	}

	public GetItemByName(name: string  | RegExp, includeBackpack: boolean = false): Item {
		return this.Inventory.GetItemByName(name, includeBackpack)
	}

	public HasItemInInventory(name: string  | RegExp, includeBackpack: boolean = false): boolean {
		return this.GetItemByName(name, includeBackpack) !== undefined
	}

	public get Buffs(): Modifier[] {
		return this.ModifiersBook.Buffs
	}

	/* ================ METHODS ================ */

	/**
	 * @param flag if not exists => is Melee or Range attack
	 */
	public HasAttackCapability(flag?: DOTAUnitAttackCapability_t): boolean {
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
	public HasMoveCapability(flag: DOTAUnitMoveCapability_t): boolean {
		let moveCap = this.m_pBaseEntity.m_iMoveCapabilities

		if (flag !== undefined)
			return (moveCap & flag) !== 0

		return flag !== DOTAUnitMoveCapability_t.DOTA_UNIT_CAP_MOVE_NONE
	}

	public IsUnitStateFlagSet(flag: modifierstate): boolean {
		return HasBitBigInt((this.m_pBaseEntity.m_nUnitState64 | this.m_pBaseEntity.m_nUnitDebuffState), BigInt(flag))
	}
	public IsControllableByPlayer(playerID: number): boolean {
		return HasBitBigInt(this.m_pBaseEntity.m_iIsControllableByPlayer64, BigInt(playerID))
	}

	/* ================================ EXTENSIONS ================================ */

	/* ================ GETTERS ================ */
	public get IsRotating(): boolean {
		return this.RotationDifference !== 0
	}

	public get IsChanneling(): boolean {
		if (this.HasInventory && this.Items.some(item => item.IsChanneling))
			return true

		return this.Spells.some(spell => spell !== undefined && spell.IsChanneling)
	}
	public get CastRangeBonus(): number {
		let castrange = 0

		let lens = this.GetItemByName("item_aether_lens")
		if (lens !== undefined)
			castrange += lens.GetSpecialValue("cast_range_bonus")

		/*this.Spells.forEach(spell => {
			if (spell.Level > 0 && /special_bonus_cast_range_/.test(spell.Name))
				castrange -= spell.GetSpecialValue("value")
		})*/
		return castrange
	}
	public get SpellAmplification(): number {
		let spellAmp = 0

		this.Items.forEach(item => spellAmp += item.GetSpecialValue("spell_amp") / 100)

		// loop-optimizer: POSSIBLE_UNDEFINED
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
	public Distance2D(vec: Vector3 | Vector2 | Entity, fromCenterToCenter: boolean = false): number {
		if (vec instanceof Vector3 || vec instanceof Vector2)
			return super.Distance2D(vec)

		return super.Distance2D(vec) - (fromCenterToCenter ? 0 : this.HullRadius + (vec instanceof Unit ? vec.HullRadius : 0))
	}
	public GetAbilityByName(name: string | RegExp) {
		return this.AbilitiesBook.GetAbilityByName(name)
	}
	public GetBuffByName(name: string) {
		return this.ModifiersBook.GetBuffByName(name)
	}

	public GetTalentValue(name: string | RegExp) {
		let talent = this.AbilitiesBook.GetAbilityByName(name)
		return talent !== undefined && talent.Level > 0 ? talent.GetSpecialValue("value") : 0
	}
	public GetTalentClassValue(class_: any) {
		let talent = this.AbilitiesBook.GetAbilityByNativeClass(class_)
		return talent !== undefined && talent.Level > 0 ? talent.GetSpecialValue("value") : 0
	}
	/**
	 * faster (Distance <= range)
	 * @param fromCenterToCenter include HullRadiuses (for Units)
	 */
	public IsInRange(ent: Vector3 | Vector2 | Entity, range: number, fromCenterToCenter: boolean = false): boolean {
		if (fromCenterToCenter === false) {

			range += this.HullRadius

			if (ent instanceof Unit)
				range += ent.HullRadius
		}

		return super.IsInRange(ent, range)
	}
	public WillIgnore(damage_type: DAMAGE_TYPES): boolean {
		if (damage_type === DAMAGE_TYPES.DAMAGE_TYPE_NONE)
			return true

		let ignore_buffs = DamageIgnoreBuffs[damage_type]
		return this.Buffs.some(buff => {
			let name = buff.Name
			if (name === undefined)
				return false
			return ignore_buffs.includes(name)
		})
	}
	public AbsorbedDamage(dmg: number, damage_type: DAMAGE_TYPES, source?: Unit): number {
		this.Buffs.forEach(buff => {
			let abil = buff.Ability
			if (abil === undefined)
				return
			if (damage_type === DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
				switch (buff.Name) {
					case "modifier_ember_spirit_flame_guard": {
						let talent = this.AbilitiesBook.GetAbilityByName("special_bonus_unique_ember_spirit_1")
						if (talent !== undefined && talent.Level > 0)
							dmg -= talent.GetSpecialValue("value")
						dmg -= abil.GetSpecialValue("absorb_amount")
						return
					}
					case "modifier_item_pipe_barrier":
					case "modifier_item_hood_of_defiance_barrier":
					case "modifier_item_infused_raindrop":
						dmg -= abil.GetSpecialValue("barrier_block")
						return
					default:
						break
				}
			switch (abil.Name) {
				case "abaddon_aphotic_shield": {
					let talent = this.AbilitiesBook.GetAbilityByName("special_bonus_unique_abaddon")
					if (talent !== undefined && talent.Level > 0)
						dmg -= talent.GetSpecialValue("value")
					dmg -= abil.GetSpecialValue("damage_absorb")
					return
				}
				case "bloodseeker_bloodrage":
					dmg *= abil.GetSpecialValue("damage_increase_pct") / 100
					return
				case "spectre_dispersion":
					dmg *= 1 - (abil.GetSpecialValue("damage_reflection_pct") / 100)
					return
				case "ursa_enrage":
				case "centaur_stampede":
					dmg *= 1 - (abil.GetSpecialValue("damage_reduction") / 100)
					return
				case "kunkka_ghostship":
					dmg *= 1 - (abil.GetSpecialValue("ghostship_absorb") / 100)
					return
				case "wisp_overcharge":
					dmg *= 1 + (abil.GetSpecialValue("bonus_damage_pct") / 100)
					return
				case "medusa_mana_shield": {
					let max_absorbed_dmg = this.Mana * abil.GetSpecialValue("damage_per_mana"),
						possible_absorbed = dmg * abil.GetSpecialValue("absorption_tooltip") / 100
					dmg -= Math.min(max_absorbed_dmg, possible_absorbed)
					return
				}
				case "bristleback_bristleback": {
					if (source !== undefined) {
						let rot_angle = source.FindRotationAngle(this)
						if (rot_angle > 1.90)
							dmg *= 1 - abil.GetSpecialValue("back_damage_reduction") / 100
						else if (rot_angle > 1.20)
							dmg *= 1 - abil.GetSpecialValue("side_damage_reduction") / 100
					}
					return
				}
				default:
					return
			}
		})
		return dmg
	}
	public CalculateDamage(damage: number, damage_type: DAMAGE_TYPES, source?: Unit): number {
		if (damage <= 0 || this.WillIgnore(damage_type))
			return 0
		damage = this.AbsorbedDamage(damage, damage_type, source)
		if (damage <= 0)
			return 0
		switch (damage_type) {
			case DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL:
				damage *= 1 - this.MagicDamageResist / 100
				break
			case DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL: {
				let armor = this.Armor
				damage *= Math.max(Math.min((1 - (0.052 * armor) / (0.9 + 0.048 * armor)), 2), 0)
				{
					let phys_damage_type = source === undefined ? AttackDamageType.Basic : source.AttackDamageType,
						phys_armor_type = this.ArmorType
					if (phys_damage_type === AttackDamageType.Hero && phys_armor_type === ArmorType.Structure)
						damage *= .5
					else if (phys_damage_type === AttackDamageType.Basic && phys_armor_type === ArmorType.Hero)
						damage *= .75
					else if (phys_damage_type === AttackDamageType.Basic && phys_armor_type === ArmorType.Structure)
						damage *= .7
					else if (phys_damage_type === AttackDamageType.Pierce && phys_armor_type === ArmorType.Hero)
						damage *= .5
					else if (phys_damage_type === AttackDamageType.Pierce && phys_armor_type === ArmorType.Basic)
						damage *= 1.5
					else if (phys_damage_type === AttackDamageType.Pierce && phys_armor_type === ArmorType.Structure)
						damage *= .35
					else if (phys_damage_type === AttackDamageType.Siege && phys_armor_type === ArmorType.Hero)
						damage *= .85
					else if (phys_damage_type === AttackDamageType.Siege && phys_armor_type === ArmorType.Structure)
						damage *= 2.5
				}
				break
			}
			default:
				break
		}
		return Math.max(damage, 0)
	}
	/*FindAttackingUnit(unit: Unit): Unit {
		if (!config.enabled)
			return
		if (unit === undefined)
			return undefined
		let is_default_creep = unit.IsCreep && !unit.IsControllableByAnyPlayer
		return ArrayExtensions.orderBy(EntityManager.AllEntities.filter(npc_ => {
			if (npc_ === unit || !(npc_ instanceof Unit))
				return false
			let npc_pos = npc_.NetworkPosition
			return (
				unit.Distance2D(npc_) <= (unit.AttackRange + unit.HullRadius + npc_.HullRadius) &&
				!unit.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_INVULNERABLE) &&
				unit.IsInside(npc_pos, npc_.HullRadius) &&
				(unit.IsEnemy(npc_) || (!is_default_creep && npc_.IsDeniable))
			)
		}), ent => unit.GetAngle(ent.NetworkPosition))[0] as Unit
	}*/
	GetHealthAfter(delay: number/*, include_projectiles: boolean = false, attacker?: Unit, melee_time_offset: number = 0*/): number {
		// let cur_time = Game.GameTime,
		let hpafter = this.HP
		/*// loop-optimizer: KEEP
		attacks.forEach((data, attacker_id) => {
			let attacker_ent = EntityManager.EntityByIndex(attacker_id) as Unit,
				[end_time, end_time_2, attack_target] = data
			if (attacker_ent !== attacker && attack_target === unit) {
				let end_time_delta = end_time - (cur_time + delay + melee_time_offset),
					dmg = attacker_ent.AttackDamage(unit)
				if (end_time_delta <= 0 && end_time_delta >= -Unit.melee_end_time_delta)
					hpafter -= dmg
				let end_time_2_delta = end_time_2 - (cur_time + delay + melee_time_offset)
				if (end_time_2_delta <= 0 && end_time_2_delta >= -Unit.melee_end_time_delta)
					hpafter -= dmg
			}
		})
		if (include_projectiles)
			Projectiles.GetAllTracking().forEach(proj => {
				let source = proj.m_hSource
				if (proj.m_hTarget === this && source !== undefined && proj.m_bIsAttack && !proj.m_bIsEvaded && (proj.m_vecPosition.Distance(proj.m_vecTarget) / proj.m_iSpeed) <= delay)
					hpafter -= this.AttackDamage(source)
			})*/
		return Math.min(hpafter + this.HPRegen * delay, this.MaxHP)
	}
	public IsInside(vec: Vector3, radius: number): boolean {
		const direction = this.Forward,
			npc_pos = this.NetworkPosition
		const npc_pos_x = npc_pos.x, npc_pos_y = npc_pos.y,
			vec_x = vec.x, vec_y = vec.y,
			direction_x = direction.x, direction_y = direction.y,
			radius_sqr = radius ** 2
		for (let i = Math.floor(vec.Distance2D(npc_pos) / radius) + 1; i--; )
			// if (npc_pos.Distance2D(new Vector3(vec.x - direction.x * i * radius, vec.y - direction.y * i * radius, vec.z - direction.z * i * radius)) <= radius)
			// optimized version, as V8 unable to optimize any native code by inlining
			if ((((vec_x - direction_x * i * radius - npc_pos_x) ** 2) + ((vec_y - direction_y * i * radius - npc_pos_y) ** 2)) <= radius_sqr)
				return true
		return false
	}
	public GetAngle(vec: Vector3): number {
		let npc_pos = this.NetworkPosition,
			angle = Math.abs(Math.atan2(npc_pos.y - vec.y, npc_pos.x - vec.x) - this.Forward.Angle)
		if (angle > Math.PI)
			angle = Math.abs((Math.PI * 2) - angle)
		return angle
	}
	public IsManaEnough(abil: Ability) {
		return this.Mana >= abil.ManaCost
	}
	public HasLinkenAtTime(time: number = 0): boolean {
		const sphere = this.GetItemByName("item_sphere")

		return (
			sphere !== undefined &&
			sphere.Cooldown - time <= 0
		) || (
			this.GetBuffByName("modifier_item_sphere_target") !== undefined
			&& this.GetBuffByName("modifier_item_sphere_target").DieTime - Game.RawGameTime - time <= 0
		)
	}
	public AttackDamage(target: Unit, useMinDamage: boolean = false, damageAmplifier: number = 0): number {
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
			if (battleFury !== undefined)
				mult *= battleFury.GetSpecialValue(isMelee ? "quelling_bonus" : "quelling_bonus_ranged") / 100
		}

		mult *= 1 - this.DamageResist
		mult *= (1 + damageAmplifier)

		return damage * mult
	}
	public CanAttack(target?: Unit): boolean {
		if (!this.IsAlive || this.IsInvulnerable || this.IsDormant || !this.IsSpawned || this.IsAttackImmune)
			return false

		if (target === undefined || !target.IsAlive || target.IsInvulnerable || target.IsDormant || !target.IsSpawned || target.IsAttackImmune)
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
	public UseSmartAbility(ability: Ability, target?: Vector3 | Entity, checkToggled: boolean = false, queue?: boolean, showEffects?: boolean) {
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
	public get Name(): string {
		if (this.UnitName_ === undefined)
			this.UnitName_ = this.m_pBaseEntity.m_iszUnitName
		return this.UnitName_ || super.Name
	}

	OnCreated() {
		super.OnCreated()
		this.UnitName_ = this.m_pBaseEntity.m_iszUnitName
	}

	/* ORDERS */

	public MoveTo(position: Vector3 | Vector2, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION, unit: this, position, queue, showEffects })
	}
	public MoveToTarget(target: Entity | number, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION, unit: this, target, queue, showEffects })
	}
	public AttackMove(position: Vector3 | Vector2, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE, unit: this, position, queue, showEffects })
	}
	public AttackTarget(target: Entity | number, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET, unit: this, target, queue, showEffects })
	}
	public CastPosition(ability: Ability, position: Vector3 | Vector2, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION, unit: this, ability, position, queue, showEffects })
	}
	public CastTarget(ability: Ability, target: Entity | number, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET, unit: this, target, ability, queue, showEffects })
	}
	public CastTargetTree(ability: Ability, tree: Tree | number, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET_TREE, unit: this, target: tree, ability, queue, showEffects })
	}
	public CastNoTarget(ability: Ability, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET, unit: this, ability, queue, showEffects })
	}
	public CastToggle(ability: Ability, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE, unit: this, ability, queue, showEffects })
	}
	public HoldPosition(position: Vector3 | Vector2, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_HOLD_POSITION, unit: this, position, queue, showEffects })
	}
	public TrainAbility(ability: Ability) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_TRAIN_ABILITY, unit: this, ability })
	}
	public DropItem(item: Item, position: Vector3 | Vector2, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_DROP_ITEM, unit: this, ability: item, position, queue, showEffects })
	}
	public GiveItem(item: Item, target: Entity | number, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_GIVE_ITEM, unit: this, target, ability: item, queue, showEffects })
	}
	public PickupItem(physicalItem: PhysicalItem | number, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_ITEM, unit: this, target: physicalItem, queue, showEffects })
	}
	public PickupRune(rune: Rune | number, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_RUNE, unit: this, target: rune, queue, showEffects })
	}
	// check
	public PurchaseItem(itemID: number, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_PURCHASE_ITEM, unit: this, target: itemID, queue, showEffects })
	}
	public SellItem(item: Item) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_SELL_ITEM, unit: this, ability: item })
	}
	// check
	public DisassembleItem(item: Item, queue?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_DISASSEMBLE_ITEM, unit: this, ability: item, queue })
	}
	public ItemSetCombineLock(item: Item, lock: boolean | number = true, queue?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_SET_ITEM_COMBINE_LOCK, unit: this, ability: item, target: (lock as number) + 0, queue })
	}
	public MoveItem(item: Item, slot: DOTAScriptInventorySlot_t) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_ITEM, unit: this, target: slot, ability: item })
	}
	public CastToggleAuto(item: Item, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO, unit: this, ability: item, queue, showEffects })
	}
	public OrderStop(queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_STOP, unit: this, queue, showEffects })
	}
	public UnitTaunt(queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_TAUNT, unit: this, queue, showEffects })
	}
	public ItemFromStash(item: Item) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_EJECT_ITEM_FROM_STASH, unit: this, ability: item })
	}
	public CastRune(runeItem: Item | number, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_RUNE, unit: this, target: runeItem, queue, showEffects })
	}
	public PingAbility(ability: Ability) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_PING_ABILITY, unit: this, ability })
	}
	public MoveToDirection(position: Vector3 | Vector2, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_DIRECTION, unit: this, position, queue, showEffects })
	}
	public Patrol(position: Vector3 | Vector2, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_PATROL, unit: this, position, queue, showEffects })
	}
	public VectorTargetPosition(ability: Ability, Direction: Vector3 | Vector2, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_VECTOR_TARGET_POSITION, unit: this, ability, position: Direction, queue, showEffects })
	}
	public CastVectorTargetPosition(ability: Ability, position: Vector3 | Vector2 | Unit, Direction: Vector3 | Vector2, queue?: boolean, showEffects?: boolean): void {
		if (position instanceof Unit)
			position = position.Position

		this.VectorTargetPosition(ability, Direction, queue, showEffects)
		this.CastPosition(ability, position, queue, showEffects)
	}
	public ItemLock(item: Item, state: boolean = true) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_SET_ITEM_COMBINE_LOCK, unit: this, ability: item, target: state === false ? 0 : undefined })
	}
	public OrderContinue(item: Item, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CONTINUE, unit: this, ability: item, queue, showEffects })
	}
	public VectorTargetCanceled(position: Vector3 | Vector2, queue?: boolean, showEffects?: boolean) {
		return Player.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_VECTOR_TARGET_CANCELED, unit: this, position, queue, showEffects })
	}
}

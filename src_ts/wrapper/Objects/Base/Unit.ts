import Color from "../../Base/Color"
import Vector2 from "../../Base/Vector2"
import Vector3 from "../../Base/Vector3"
import { HasBit, HasBitBigInt, MaskToArrayBigInt } from "../../Utils/BitsExtensions"
import { DamageIgnoreBuffs, parseKVFile } from "../../Utils/Utils"

import { LocalPlayer } from "../../Managers/EntityManager"

import Entity, { rotation_speed } from "./Entity"
import Player from "./Player"

import AbilitiesBook from "../DataBook/AbilitiesBook"
import Inventory from "../DataBook/Inventory"
import Ability from "./Ability"
import Item from "./Item"

import ModifiersBook from "../DataBook/ModifiersBook"
import Modifier from "./Modifier"

import { Team } from "../../Enums/Team"
import PhysicalItem from "./PhysicalItem"
import Rune from "./Rune"
import Tree from "./Tree"
import TreeTemp from "./TreeTemp"
import { dotaunitorder_t } from "../../Enums/dotaunitorder_t"
import { ArmorType } from "../../Enums/ArmorType"
import { AttackDamageType } from "../../Enums/AttackDamageType"
import { RecursiveMap } from "../../Utils/ParseKV"
import Game from "../GameResources/GameRules"

const attackAnimationPoint = new Map<string, number>()
const attackprojectileSpeed = new Map<string, number>()

let parseHeroes = parseKVFile("scripts/npc/npc_heroes.txt").get("DOTAHeroes") as RecursiveMap
for (let hero of parseHeroes.keys()) {
	const heroFields = parseHeroes.get(hero)
	if (!(heroFields instanceof Map))
		continue
	if (heroFields.has("AttackAnimationPoint"))
		attackAnimationPoint.set(hero, parseFloat(heroFields.get("AttackAnimationPoint") as string))
	if (heroFields.has("ProjectileSpeed"))
		attackprojectileSpeed.set(hero, parseFloat(heroFields.get("ProjectileSpeed") as string))
	// another values from script files. (i.e AttackRate, AttackRate)
}

export default class Unit extends Entity {
	/* ================================ Static ================================ */
	public static IsVisibleForEnemies(unit: Unit): boolean {
		const valid_teams = ~(// don't check not existing team (0), spectators (1), neutrals (4) and noteam (5)
			(1 << Team.None)
			| (1 << Team.Observer)
			| (1 << Team.Neutral)
			| (1 << Team.Undefined)
		)

		let local_team = unit.Team,
			flags = unit.IsVisibleForTeamMask & valid_teams

		for (let i = 14; i--;)
			if (i !== local_team && ((flags >> i) & 1))
				return true
		return false
	}

	/* ================================ Fields ================================ */
	public readonly m_pBaseEntity!: C_DOTA_BaseNPC

	public readonly AbilitiesBook = new AbilitiesBook(this)
	public readonly Inventory = new Inventory(this)
	public readonly ModifiersBook = new ModifiersBook(this)

	//public readonly DotaMap: DotaMap
	public IsVisibleForTeamMask = this.m_pBaseEntity.m_iTaggedAsVisibleByTeam
	public IsVisibleForEnemies = Unit.IsVisibleForEnemies(this)
	public IsTrueSightedForEnemies = false
	public NetworkActivity: GameActivity_t = this.m_pBaseEntity.m_NetworkActivity;
	public IsControllableByPlayerMask = this.m_pBaseEntity.m_iIsControllableByPlayer64
	public HPRegen = this.m_pBaseEntity.m_flHealthThinkRegen
	public ManaRegen = this.m_pBaseEntity.m_flManaThinkRegen
	public RotationDifference = this.m_pBaseEntity.m_anglediff
	public HasScepterModifier = false
	public LastVisibleTime = Game.RawGameTime
	public LastDormantTime = 0

	private UnitName_: string = ""
	private EtherealModifiers: string[] = [
		"modifier_ghost_state",
		"modifier_item_ethereal_blade_ethereal",
		"modifier_pugna_decrepify",
		"modifier_necrolyte_sadist_active",
	]
	private CanUseAbilitiesInInvis: string[] = [
		"modifier_broodmother_spin_web_invisible_applier",
		"modifier_riki_permanent_invisibility",
		"modifier_treant_natures_guise_invis",
	]

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
		if (this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_SPECIALLY_DENIABLE))
			return true
		let hp_percent = this.HPPercent
		if (hp_percent > 50) // nothing can be denied w/o losing half of max HP, so we'd skip unnecessary checks
			return false
		if (this.m_pBaseEntity instanceof C_DOTA_BaseNPC_Creep)
			return hp_percent <= 50
		if (this.m_pBaseEntity instanceof C_DOTA_BaseNPC_Tower)
			return hp_percent <= 10

		return hp_percent < 25 && this.Buffs.some(buff =>
			buff.Name === "modifier_doom_bringer_doom"
			|| buff.Name === "modifier_queenofpain_shadow_strike"
			|| buff.Name === "modifier_venomancer_venomous_gale",
		)
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
		return this.IsControllableByPlayerMask !== 0n
	}
	public get IsRangeAttacker(): boolean {
		return this.HasAttackCapability(DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_RANGED_ATTACK)
	}
	public get HasScepter(): boolean {
		return this.HasScepterModifier || this.HasStolenScepter
	}
	public get Armor(): number {
		return this.m_pBaseEntity.m_flPhysicalArmorValue
	}
	public get ArmorType(): ArmorType {
		return this.m_pBaseEntity.m_iCombatClassDefend
	}
	public get AttackDamageType(): AttackDamageType {
		return this.m_pBaseEntity.m_iCombatClassAttack
	}
	public get AttackRange(): number {
		return this.m_pBaseEntity.m_fAttackRange
	}
	public get AttacksPerSecond(): number {
		return this.m_pBaseEntity.m_fAttacksPerSecond
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
	public get HealthBarHighlightColor(): Nullable<Color> {
		return Color.fromIOBuffer(this.m_pBaseEntity.m_iHealthBarHighlightColor)
	}
	public get AttackSpeed(): number {
		return this.m_pBaseEntity.m_fAttackSpeed
	}
	public get IncreasedAttackSpeed(): number {
		return this.m_pBaseEntity.m_fIncreasedAttackSpeed
	}
	public get AttackSpeedBonus() {
		let attackSpeed = this.AttackSpeed
		// TODO
		if (this.IsHero) {
			switch (this.Name) {
				case "npc_dota_hero_ursa":
					let overpPower = this.GetAbilityByName("ursa_overpower")
					if (overpPower && this.GetAbilityByName("modifier_ursa_overpower"))
						attackSpeed += overpPower.GetSpecialValue("attack_speed_bonus_pct")
					break
			}
		}
		return Math.min(Math.max(20, attackSpeed * 100), 600)
	}
	public get AttackPoint(): number {
		return this.AttackAnimationPoint / (1 + ((this.AttackSpeedBonus - 100) / 100))
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
		return LocalPlayer !== undefined && this.IsControllableByPlayer(LocalPlayer.PlayerID)
	}
	public get IsDominatable(): boolean {
		return this.m_pBaseEntity.m_bCanBeDominated
	}
	public get IsIllusion(): boolean {
		return this.m_pBaseEntity.m_bIsIllusion
	}
	get MoveCapabilities() {
		return this.m_pBaseEntity.m_iMoveCapabilities
	}
	get AttackCapabilities() {
		return this.m_pBaseEntity.m_iAttackCapabilities
	}
	public get IsMelee(): boolean {
		return this.AttackCapabilities === DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_MELEE_ATTACK
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
		return this.AttackCapabilities === DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_RANGED_ATTACK
	}
	public get IsSpawned(): boolean {
		return !this.IsWaitingToSpawn
	}
	public get IsSummoned(): boolean {
		return this.m_pBaseEntity.m_bIsSummoned
	}
	public get IsWaitingToSpawn(): boolean {
		return this.m_pBaseEntity.m_bIsWaitingToSpawn
	}
	public get Level(): number {
		return this.m_pBaseEntity.m_iCurrentLevel
	}
	public get BaseMagicDamageResist(): number {
		return this.m_pBaseEntity.m_flMagicalResistanceValue
	}
	public get MagicDamageResist(): number {
		return this.m_pBaseEntity.m_flMagicalResistanceValueReal
	}
	public get Mana(): number {
		return this.m_pBaseEntity.m_flMana
	}
	public get ManaPercent(): number {
		return Math.floor(this.Mana / this.MaxMana * 100) || 0
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
	public get IdealSpeed(): number {
		return this.m_pBaseEntity.m_fIdealSpeed
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
	public get SecondsPerAttack(): number {
		return 1 / this.m_pBaseEntity.m_fAttacksPerSecond
	}
	public get TauntCooldown(): number {
		return this.m_pBaseEntity.m_flTauntCooldown
	}
	public get TotalDamageTaken(): bigint {
		return this.m_pBaseEntity.m_nTotalDamageTaken
	}
	public get UnitStateMask(): bigint {
		return this.m_pBaseEntity.m_nUnitState64 | this.m_pBaseEntity.m_nUnitDebuffState
	}
	public get UnitState(): modifierstate[] {
		return MaskToArrayBigInt(this.UnitStateMask)
	}
	public get UnitType(): number {
		return this.m_pBaseEntity.m_iUnitType
	}
	public get IsEthereal(): boolean {
		return this.ModifiersBook.HasAnyBuffByNames(this.EtherealModifiers)
	}
	public get CanUseAbilitiesInInvisibility(): boolean {
		return this.ModifiersBook.HasAnyBuffByNames(this.CanUseAbilitiesInInvis)
	}
	public get Spells(): Nullable<Ability>[] {
		return this.AbilitiesBook.Spells
	}
	public get Items(): Item[] {
		return this.Inventory.Items
	}

	public get Buffs(): Modifier[] {
		return this.ModifiersBook.Buffs
	}

	public get HullRadius(): number {
		return this.m_pBaseEntity.m_flHullRadius
	}
	public get CollisionPadding(): number {
		return this.m_pBaseEntity.m_flCollisionPadding
	}

	/* ================================ EXTENSIONS ================================ */

	/* ================ GETTERS ================ */
	public get AttackAnimationPoint(): number {
		return attackAnimationPoint.get(this.Name) ?? 0
	}
	public get AttackProjectileSpeed(): number {
		return attackprojectileSpeed.get(this.Name) ?? 0
	}
	public get IsRotating(): boolean {
		return this.RotationDifference !== 0
	}
	public get IsChanneling(): boolean {
		if (this.HasInventory && this.Items.some(item => item.IsChanneling))
			return true

		return this.Spells.some(spell => spell !== undefined && spell.IsChanneling)
	}
	public get IsInAbilityPhase(): boolean {
		return this.Spells.some(spell => spell !== undefined && spell.IsInAbilityPhase)
	}
	public get CastRangeBonus(): number {
		let castrange = 0

		let lens = this.GetItemByName("item_aether_lens")
		if (lens !== undefined)
			castrange += lens.GetSpecialValue("cast_range_bonus")

		let gadget_aura = this.GetBuffByName("modifier_item_spy_gadget_aura")
		if (gadget_aura !== undefined) {
			let gadget = gadget_aura.Ability
			if (gadget !== undefined)
				castrange += gadget.GetSpecialValue("cast_range")
		}

		// loop-optimizer: POSSIBLE_UNDEFINED
		this.Spells.forEach(spell => {
			if (spell!.Level !== 0 && spell!.Name.startsWith("special_bonus_cast_range"))
				castrange += spell!.GetSpecialValue("value")
		})
		return castrange
	}
	public get SpellAmplification(): number {
		let spellAmp = 0

		this.Items.forEach(item => spellAmp += item.GetSpecialValue("spell_amp") / 100)

		// loop-optimizer: POSSIBLE_UNDEFINED
		this.Spells.forEach(spell => {
			if (spell!.Level !== 0 && spell!.Name.startsWith("special_bonus_spell_amplify"))
				spellAmp += spell!.GetSpecialValue("value") / 100
		})

		return spellAmp
	}
	public get Name(): string {
		if (!this.UnitName_)
			this.UnitName_ = this.m_pBaseEntity.m_iszUnitName
		return this.UnitName_ || super.Name
	}
	public VelocityWaypoint(time: number, movespeed: number = this.IsMoving ? this.IdealSpeed : 0): Vector3 {
		return this.InFront(movespeed * time)
	}
	public GetItemByName(name: string | RegExp, includeBackpack: boolean = false) {
		return this.Inventory.GetItemByName(name, includeBackpack)
	}
	public GetItemByClass<T extends Item>(class_: Constructor<T>, includeBackpack: boolean = false): Nullable<T> {
		return this.Inventory.GetItemByClass(class_, includeBackpack)
	}
	public HasItemInInventory(name: string | RegExp, includeBackpack: boolean = false): boolean {
		return this.Inventory.GetItemByName(name, includeBackpack) !== undefined
	}
	/* ================ METHODS ================ */

	/**
	 * @param flag if not exists => is Melee or Range attack
	 */
	public HasAttackCapability(flag: DOTAUnitAttackCapability_t = DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_MELEE_ATTACK | DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_RANGED_ATTACK): boolean {
		return (this.AttackCapabilities & flag) !== 0
	}
	/**
	 * @param flag if not exists => isn't move NONE
	 */
	public HasMoveCapability(flag: DOTAUnitMoveCapability_t = DOTAUnitMoveCapability_t.DOTA_UNIT_CAP_MOVE_GROUND | DOTAUnitMoveCapability_t.DOTA_UNIT_CAP_MOVE_FLY): boolean {
		return (this.MoveCapabilities & flag) !== 0
	}

	public IsUnitStateFlagSet(flag: modifierstate): boolean {
		return HasBitBigInt((this.UnitStateMask), BigInt(flag))
	}
	public IsControllableByPlayer(playerID: number): boolean {
		return HasBitBigInt(this.IsControllableByPlayerMask, BigInt(playerID))
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
	public GetAbilityByClass<T extends Ability>(class_: Constructor<T>): Nullable<T> {
		return this.AbilitiesBook.GetAbilityByClass(class_)
	}
	public GetBuffByName(name: string) {
		return this.ModifiersBook.GetBuffByName(name)
	}
	public HasBuffByName(name: string): boolean {
		return this.ModifiersBook.GetBuffByName(name) !== undefined
	}
	public GetTalentValue(name: string | RegExp) {
		let talent = this.AbilitiesBook.GetAbilityByName(name)
		return talent !== undefined && talent.Level !== 0 ? talent.GetSpecialValue("value") : 0
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
		return ignore_buffs !== undefined && this.Buffs.some(buff => {
			let name = buff.Name
			if (name === undefined)
				return false
			return ignore_buffs.includes(name)
		})
	}

	public TurnRate(currentTurnRate: boolean = true): number {
		let turnRate = rotation_speed[this.Name] || 0.5

		if (currentTurnRate) {
			if (this.HasBuffByName("modifier_medusa_stone_gaze_slow"))
				turnRate *= 0.65

			if (this.HasBuffByName("modifier_batrider_sticky_napalm"))
				turnRate *= 0.3
		}

		return turnRate
	}

	public TurnTime(angle: number | Vector3) {
		if (angle instanceof Vector3) {
			angle = this.FindRotationAngle(angle)
			if (isNaN(angle)) // face palm
				return 0
		}
		let name = this.Name
		if (name === "npc_dota_hero_wisp" || name === "npc_dota_hero_pangolier" || name === "npc_dota_hero_clinkz")
			return 0

		if (angle <= 0.2)
			return 0

		return this.TurnRate() / 30 * angle
	}

	public AbsorbedDamage(dmg: number, damage_type: DAMAGE_TYPES, source?: Unit): number {
		this.Buffs.forEach(buff => {
			let abil = buff.Ability
			if (!(abil instanceof Ability))
				return
			if (damage_type === DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
				switch (buff.Name) {
					case "modifier_ember_spirit_flame_guard": {
						dmg -= this.GetTalentValue("special_bonus_unique_ember_spirit_1")
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
					dmg -= this.GetTalentValue("special_bonus_unique_abaddon")
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
						if (rot_angle <= 1.90)
							dmg *= 1 - abil.GetSpecialValue("back_damage_reduction") / 100
						else if (rot_angle <= 1.20)
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

	public CalculateDamageByHand(source: Unit): number {
		if (source.GetBuffByName("modifier_tinker_laser_blind") !== undefined || this.WillIgnore(DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL))
			return 0
		let mult = 1
		{
			let damage_type = source.AttackDamageType,
				armor_type = this.ArmorType
			if (damage_type === AttackDamageType.Hero && armor_type === ArmorType.Structure)
				mult *= .5
			else if (damage_type === AttackDamageType.Basic && armor_type === ArmorType.Hero)
				mult *= .75
			else if (damage_type === AttackDamageType.Basic && armor_type === ArmorType.Structure)
				mult *= .7
			else if (damage_type === AttackDamageType.Pierce && armor_type === ArmorType.Hero)
				mult *= .5
			else if (damage_type === AttackDamageType.Pierce && armor_type === ArmorType.Basic)
				mult *= 1.5
			else if (damage_type === AttackDamageType.Pierce && armor_type === ArmorType.Structure)
				mult *= .35
			else if (damage_type === AttackDamageType.Siege && armor_type === ArmorType.Hero)
				mult *= .85
			else if (damage_type === AttackDamageType.Siege && armor_type === ArmorType.Structure)
				mult *= 2.5
		}
		let damage = source.MinDamage + source.DamageBonus
		damage = this.AbsorbedDamage(damage, DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL)
		if (damage <= 0)
			return 0
		let armor = this.Armor,
			is_enemy = this.IsEnemy(source)
		if (is_enemy) {
			{
				if (!this.HasBuffByName("modifier_blight_stone_buff")) {
					let item = source.GetItemByName("item_blight_stone")
					if (item !== undefined)
						armor += item.GetSpecialValue("corruption_armor")
				}
			}
			{
				if (!this.HasBuffByName("modifier_desolator_buff")) {
					let item = source.GetItemByName("item_desolator")
					if (item !== undefined)
						armor += item.GetSpecialValue("corruption_armor")
				}
			}
			{
				let item = source.GetItemByName("item_quelling_blade")
				if (item !== undefined)
					damage += item.GetSpecialValue(source.HasAttackCapability(DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_RANGED_ATTACK) ? "damage_bonus_ranged" : "damage_bonus")
			}
			{
				let item = source.GetItemByName("item_bfury")
				if (item !== undefined)
					damage += item.GetSpecialValue(source.HasAttackCapability(DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_RANGED_ATTACK) ? "damage_bonus_ranged" : "damage_bonus")
			}
			{
				let abil = source.GetAbilityByName("clinkz_searing_arrows")
				if (abil !== undefined && abil.m_pBaseEntity.m_bAutoCastState && abil.IsManaEnough())
					damage += abil.GetSpecialValue("damage_bonus")
			}
			{
				let abil = source.GetAbilityByName("antimage_mana_break")
				if (abil !== undefined && this.MaxMana > 0)
					damage += Math.min(this.Mana, abil.GetSpecialValue("mana_per_hit")) * abil.GetSpecialValue("damage_per_burn")
			}
			{
				let abil = source.GetAbilityByName("ursa_fury_swipes")
				if (abil !== undefined) {
					let buff = this.GetBuffByName("modifier_ursa_fury_swipes_damage_increase")
					damage += abil.GetSpecialValue("damage_per_stack") * (1 + (buff !== undefined ? buff.StackCount : 0))
				}
			}
			{
				let abil = source.GetAbilityByName("bounty_hunter_jinada")
				if (abil !== undefined && abil.Cooldown === 0)
					damage += abil.GetSpecialValue("bonus_damage")
			}
		}
		{
			let abil = source.GetAbilityByName("kunkka_tidebringer")
			if (abil !== undefined && abil.m_pBaseEntity.m_bAutoCastState && abil.Cooldown === 0)
				damage += abil.GetSpecialValue("damage_bonus")
		}
		{
			let buff = source.GetBuffByName("modifier_storm_spirit_overload_passive")
			if (buff !== undefined) {
				let abil = buff.Ability
				if (abil instanceof Ability)
					damage += abil.AbilityDamage
			}
		}
		{
			let abil = source.GetAbilityByName("riki_permanent_invisibility")
			if (abil !== undefined && (source.Forward.AngleBetweenFaces(this.Forward) * 180 / Math.PI) < abil.GetSpecialValue("backstab_angle"))
				damage += abil.GetSpecialValue("damage_multiplier") * source.TotalAgility
		}
		damage *= 1 - (armor * 0.05) / (1 + Math.abs(armor) * 0.05)
		if (is_enemy) {
			{
				let abil = source.GetAbilityByName("silencer_glaives_of_wisdom")
				if (abil !== undefined && abil.m_pBaseEntity.m_bAutoCastState && abil.IsManaEnough())
					damage += abil.GetSpecialValue("intellect_damage_pct") * source.TotalIntellect / 100
			}
			{
				let abil = source.GetAbilityByName("obsidian_destroyer_arcane_orb")
				if (abil !== undefined && abil.IsAutoCastEnebled && abil.IsManaEnough())
					damage += abil.GetSpecialValue("mana_pool_damage_pct") * source.MaxMana / 100
			}
		}
		{
			let abil = source.GetAbilityByName("spectre_desolate")
			if (abil !== undefined)
				damage += abil.GetSpecialValue("bonus_damage")
		}
		{
			let buff = source.GetBuffByName("modifier_bloodseeker_bloodrage")
			if (buff !== undefined) {
				let abil = buff.Ability
				if (abil instanceof Ability)
					mult *= 1 + abil.GetSpecialValue("damage_increase_pct") / 100
			}
		}
		{
			let buff = this.GetBuffByName("modifier_bloodseeker_bloodrage")
			if (buff !== undefined) {
				let abil = buff.Ability
				if (abil instanceof Ability)
					mult *= 1 + abil.GetSpecialValue("damage_increase_pct") / 100
			}
		}

		return Math.max(damage * mult, 0)
	}

	public IsInside(vec: Vector3, radius: number): boolean {
		const direction = this.Forward,
			npc_pos = this.Position
		for (let i = Math.floor(vec.Distance2D(npc_pos) / radius) + 1; i--;)
			if (npc_pos.Distance2D(new Vector3(vec.x - direction.x * i * radius, vec.y - direction.y * i * radius, vec.z - direction.z * i * radius)) <= radius)
				return true
		return false
	}

	public GetAngle(vec: Vector3): number {
		let npc_pos = this.Position,
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

		if (sphere !== undefined && sphere.Cooldown - time <= 0)
			return true

		const sphereTarget = this.GetBuffByName("modifier_item_sphere_target")

		return sphereTarget !== undefined && sphereTarget.RemainingTime - time <= 0
	}

	public AttackDamage(target: Unit, useMinDamage: boolean = true, damageAmplifier: number = 0): number {
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

	public CanAttack(target: Unit): boolean {
		return (
			this.IsAlive
			&& this.IsVisible
			&& this.IsSpawned
			&& !this.IsEthereal
			&& target.IsAlive
			&& !target.IsInvulnerable
			&& target.IsVisible
			&& target.IsSpawned
			&& !target.IsAttackImmune
			&& !this.IsEthereal
			&& (this.IsEnemy(target) || target.IsDeniable)
		)
	}

	/* ================================ ORDERS ================================ */
	public UseSmartAbility(ability: Ability, target?: Vector3 | Entity, checkToggled: boolean = false, queue?: boolean, showEffects?: boolean) {
		if (checkToggled && ability.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_TOGGLE) && !ability.IsToggled) {
			return this.CastToggle(ability, queue, showEffects)
		}

		if (ability.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET)) {
			return this.CastNoTarget(ability, queue, showEffects)
		}

		if (ability.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT)) {
			if (target instanceof Entity) {
				target = target.Position
			}

			return this.CastPosition(ability, target as Vector3, queue, showEffects)
		}

		if (ability.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET)) {
			return this.CastTarget(ability, target as Entity, showEffects)
		}
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
	public CastTargetTree(ability: Ability, tree: Tree | TreeTemp | number, queue?: boolean, showEffects?: boolean) {
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

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_BaseNPC", Unit)

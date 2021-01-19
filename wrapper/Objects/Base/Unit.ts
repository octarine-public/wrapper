import Vector2 from "../../Base/Vector2"
import Vector3 from "../../Base/Vector3"
import { NetworkedBasicField, NetworkedBigIntField, WrapperClass } from "../../Decorators"
import { ArmorType } from "../../Enums/ArmorType"
import { AttackDamageType } from "../../Enums/AttackDamageType"
import { dotaunitorder_t } from "../../Enums/dotaunitorder_t"
import { Team } from "../../Enums/Team"
import EntityManager from "../../Managers/EntityManager"
import EventsSDK from "../../Managers/EventsSDK"
import * as StringTables from "../../Managers/StringTables"
import ExecuteOrder from "../../Native/ExecuteOrder"
import RendererSDK from "../../Native/RendererSDK"
import { HasBitBigInt, MaskToArrayBigInt } from "../../Utils/BitsExtensions"
import GameState from "../../Utils/GameState"
import { DamageIgnoreBuffs, parseKVFile } from "../../Utils/Utils"
import Inventory from "../DataBook/Inventory"
import ModifiersBook from "../DataBook/ModifiersBook"
import UnitData from "../DataBook/UnitData"
import Ability from "./Ability"
import Entity, { LocalPlayer } from "./Entity"
import GameRules from "./GameRules"
import Item from "./Item"
import Modifier from "./Modifier"
import NeutralSpawner from "./NeutralSpawner"
import PhysicalItem from "./PhysicalItem"
import Rune from "./Rune"
import Tree from "./Tree"
import TreeTemp from "./TreeTemp"

const MAX_SPELLS = 31
const MAX_ITEMS = 16
const UnitHealthBar_Hero = parseKVFile("resource/ui/unithealthbar_hero.res").get("Resource/UI/UnitHealthBar_Hero.res") as RecursiveMap

/*const UnitHealthBar = UnitHealthBar_Hero.get("UnitHealthBar") as RecursiveMap
const healthbar_size_noscale = new Vector2(parseInt(UnitHealthBar.get("xpos") as string) * 2.25, parseInt(UnitHealthBar.get("ypos") as string) * 1.5)*/

const UnitManaBar = UnitHealthBar_Hero.get("UnitManaBar") as RecursiveMap
const manabar_size_noscale = new Vector2(parseInt(UnitManaBar.get("xpos") as string) * 2.25, parseInt(UnitManaBar.get("ypos") as string))

@WrapperClass("C_DOTA_BaseNPC")
export default class Unit extends Entity {
	public static IsVisibleForEnemies(unit: Unit): boolean {
		// don't check not existing team (0), spectators (1), neutrals (4) and noteam (5)
		const valid_teams = ~(
			(1 << Team.None)
			| (1 << Team.Observer)
			| (1 << Team.Neutral)
			| (1 << Team.Undefined)
		)

		const local_team = unit.Team,
			flags = unit.IsVisibleForTeamMask & valid_teams

		for (let i = 14; i--;)
			if (i !== local_team && ((flags >> i) & 1))
				return true
		return false
	}

	public UnitData = UnitData.empty

	public readonly Inventory = new Inventory(this)
	public readonly ModifiersBook = new ModifiersBook(this)

	//public readonly DotaMap: DotaMap
	public IsVisibleForEnemies = Unit.IsVisibleForEnemies(this)
	public IsTrueSightedForEnemies = false
	public HasScepterModifier = false
	public UnitName_ = ""
	public IsVisibleForTeamMask = 0
	@NetworkedBasicField("m_anglediff")
	public RotationDifference = 0
	@NetworkedBigIntField("m_iIsControllableByPlayer64")
	public IsControllableByPlayerMask = 0n
	public NetworkActivity = 0
	@NetworkedBasicField("m_flHealthThinkRegen")
	public HPRegen = 0
	@NetworkedBasicField("m_flManaThinkRegen")
	public ManaRegen = 0
	@NetworkedBasicField("m_bIsAncient")
	public IsAncient = false
	@NetworkedBasicField("m_flPhysicalArmorValue")
	public Armor = 0
	@NetworkedBasicField("m_iCurShop")
	public CurrentShop = DOTA_SHOP_TYPE.DOTA_SHOP_NONE
	@NetworkedBasicField("m_iMoveSpeed")
	public BaseMoveSpeed = 0
	@NetworkedBasicField("m_iBKBChargesUsed")
	public BKBChargesUsed = 0
	@NetworkedBasicField("m_iDamageMin")
	public MinDamage = 0
	@NetworkedBasicField("m_iDamageMax")
	public MaxDamage = 0
	@NetworkedBasicField("m_iDamageBonus")
	public BonusDamage = 0
	@NetworkedBasicField("m_iDayTimeVisionRange")
	public DayVision = 0
	@NetworkedBasicField("m_flDeathTime")
	public DeathTime = 0
	@NetworkedBasicField("m_nArcanaLevel")
	public ArcanaLevel = 0
	@NetworkedBasicField("m_bStolenScepter")
	public HasStolenScepter = false
	@NetworkedBasicField("m_bHasUpgradeableAbilities")
	public HasUpgradeableAbilities = false
	@NetworkedBasicField("m_bCanBeDominated")
	public IsDominatable = false
	@NetworkedBasicField("m_bIsIllusion")
	public IsIllusion_ = false
	@NetworkedBasicField("m_iAttackCapabilities")
	public AttackCapabilities = 0
	@NetworkedBasicField("m_iDamageMin")
	public AttackDamageMin = 0
	@NetworkedBasicField("m_iDamageMax")
	public AttackDamageMax = 0
	@NetworkedBasicField("m_bIsMoving")
	public IsMoving = false
	@NetworkedBasicField("m_bIsPhantom")
	public IsPhantom = false
	@NetworkedBasicField("m_bIsSummoned")
	public IsSummoned = false
	@NetworkedBasicField("m_bIsWaitingToSpawn")
	public IsWaitingToSpawn = false
	@NetworkedBasicField("m_iCurrentLevel")
	public Level = 0
	@NetworkedBasicField("m_flMagicalResistanceValue")
	public BaseMagicDamageResist = 0
	@NetworkedBasicField("m_flMana")
	public Mana = 0
	@NetworkedBasicField("m_flMaxMana")
	public MaxMana = 0
	@NetworkedBasicField("m_iNightTimeVisionRange")
	public NightVision = 0
	@NetworkedBasicField("m_flTauntCooldown")
	public TauntCooldown = 0
	@NetworkedBigIntField("m_nUnitState64")
	public UnitStateNetworked = 0n
	@NetworkedBasicField("m_nHealthBarOffsetOverride")
	public HealthBarOffsetOverride = 0
	public Spells_ = new Array<number>(MAX_SPELLS).fill(0)
	public Spells = new Array<Nullable<Ability>>(MAX_SPELLS).fill(undefined)
	public TotalItems_ = new Array<number>(MAX_ITEMS).fill(0)
	public TotalItems = new Array<Nullable<Item>>(MAX_SPELLS).fill(undefined)
	@NetworkedBasicField("m_iXPBounty")
	public XPBounty = 0
	@NetworkedBasicField("m_iXPBountyExtra")
	public XPBountyExtra = 0
	@NetworkedBasicField("m_iGoldBountyMin")
	public GoldBountyMin = 0
	@NetworkedBasicField("m_iGoldBountyMax")
	public GoldBountyMax = 0
	public LastActivity = 0
	public LastActivityEndTime = 0
	public readonly SpawnPosition = new Vector3()
	public Spawner: Nullable<NeutralSpawner>

	private EtherealModifiers: string[] = [
		"modifier_ghost_state",
		"modifier_item_ethereal_blade_ethereal",
		"modifier_pugna_decrepify",
		"modifier_necrolyte_sadist_active",
	]
	private CanUseAbilitiesInInvis: string[] = [
		"modifier_riki_permanent_invisibility",
		"modifier_treant_natures_guise_invis",
	]

	/* ======== modifierstate ======== */
	public get IsIllusion(): boolean {
		return this.IsIllusion_
	}
	public get IsTempestDouble(): boolean {
		return this.HasBuffByName("modifier_arc_warden_tempest_double")
	}
	public get CanBeMainHero(): boolean {
		return !this.IsIllusion && !this.IsTempestDouble
	}
	public get IsRooted(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_ROOTED)
	}
	public get IsDisarmed(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_DISARMED)
	}
	public get IsAttackImmune(): boolean {
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
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_INVISIBLE) || this.InvisibilityLevel > 0.5
	}
	public get IsInvulnerable(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_INVULNERABLE)
	}
	public get IsMagicImmune(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_MAGIC_IMMUNE)
	}
	public get IsDeniable(): boolean {
		if (this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_SPECIALLY_DENIABLE))
			return true
		return this.HPPercent < 25 && this.Buffs.some(buff =>
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
	public get IsTrueSightImmune(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_TRUESIGHT_IMMUNE)
	}
	/* ======== base ======== */
	public get IsInFadeTime(): boolean {
		const level = this.InvisibilityLevel
		return level > 0 && level <= 0.5
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
	public get AttackDamageType(): AttackDamageType {
		return this.UnitData.AttackDamageType
	}
	public get ArmorType(): ArmorType {
		return this.UnitData.ArmorType
	}
	// TODO: parse from KV + use buffs + items
	public get AttackRange(): number {
		return GetUnitNumberPropertyByName(this.Index, "m_fAttackRange") ?? 0
	}
	public get AttacksPerSecond(): number {
		return GetUnitNumberPropertyByName(this.Index, "m_fAttacksPerSecond") ?? 0
	}
	// BaseArmor
	public get BaseAttackTime(): number {
		return GetUnitNumberPropertyByName(this.Index, "m_flBaseAttackTime") ?? 0
	}
	// BaseHealthRegeneration
	// BaseManaRegeneration
	public get DamageAverage(): number {
		return (this.MinDamage + this.MaxDamage) / 2
	}
	/**
	 * https://dota2.gamepedia.com/Armor
	 */
	public get DamageResist(): number {
		const armor = this.Armor
		return (0.052 * armor) / (0.9 + 0.048 * Math.abs(armor))
	}
	public get HasArcana(): boolean {
		return this.ArcanaLevel > 0
	}
	public get HasInventory(): boolean {
		return this.UnitData.HasInventory
	}
	public get HealthBarOffset(): number {
		let offset = this.HealthBarOffsetOverride
		if (offset === -1)
			offset = GetUnitNumberPropertyByName(this.Index, "m_iHealthBarOffset") ?? this.UnitData.HealthBarOffset
		// TODO: smoothing by Unit#Think
		for (const buff of this.Buffs) {
			const delta_z = buff.DeltaZ
			if (delta_z !== 0)
				return offset + delta_z
		}
		if (this.IsFlyingVisually)
			offset += 150
		if (this.HasBuffByName("modifier_monkey_king_bounce_perch"))
			offset += 100
		return offset
	}
	public get WorkshopName(): string {
		return this.UnitData.WorkshopName
	}
	/**
	 * @returns [Position: Vector2, Size: Vector2]
	 */
	/*public get HealthBarOnScreen(): Nullable<[Vector2, Vector2]> {
		let wts = RendererSDK.WorldToScreen(this.Position.AddScalarZ(this.HealthBarOffset))
		if (wts === undefined)
			return undefined

		let healthbar_size = RendererSDK.GetProportionalScaledVector(healthbar_size_noscale, false).SubtractScalarX(1)
		wts.SubtractForThis(healthbar_size.Divide(new Vector2(1.95, 0.32))).AddScalarY(healthbar_size.y).FloorForThis()
		return [wts, healthbar_size]
	}*/
	/**
	 * @returns [Position: Vector2, Size: Vector2]
	 */
	public get ManaBarOnScreen(): Nullable<[Vector2, Vector2]> {
		const wts = RendererSDK.WorldToScreen(this.Position.AddScalarZ(this.HealthBarOffset))
		if (wts === undefined)
			return undefined

		const manabar_size = RendererSDK.GetProportionalScaledVector(manabar_size_noscale, false).SubtractScalarX(1)
		wts.SubtractForThis(manabar_size.Divide(new Vector2(1.95, 0.42))).FloorForThis()
		return [wts, manabar_size]
	}
	// TODO: parse KV, use buffs and items for calculation
	public get AttackSpeed(): number {
		return GetUnitNumberPropertyByName(this.Index, "m_fAttackSpeed") ?? 0
	}
	public get IncreasedAttackSpeed(): number {
		return GetUnitNumberPropertyByName(this.Index, "m_fIncreasedAttackSpeed") ?? 0
	}
	public get AttackSpeedBonus() {
		let attackSpeed = this.AttackSpeed
		attackSpeed += this.GetBuffByName("modifier_ursa_overpower")?.Ability?.GetSpecialValue("attack_speed_bonus_pct") ?? 0
		return Math.min(Math.max(20, attackSpeed * 100), 600)
	}
	public get AttackPoint(): number {
		return this.AttackAnimationPoint / (1 + ((this.AttackSpeedBonus - 100) / 100))
	}
	public get InvisibilityLevel(): number {
		return this.Buffs.reduce((prev, buff) => Math.max(prev, buff.InvisibilityLevel), 0)
	}
	/**
	 * IsControllable by LocalPlayer
	 */
	public get IsControllable(): boolean {
		return LocalPlayer !== undefined && this.IsControllableByPlayer(LocalPlayer.PlayerID)
	}
	// TODO: parse KV, use buffs for this
	get MoveCapabilities(): DOTAUnitMoveCapability_t {
		return GetUnitNumberPropertyByName(this.Index, "m_iMoveCapabilities") ?? 0
	}
	public get IsMelee(): boolean {
		return this.AttackCapabilities === DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_MELEE_ATTACK
	}
	public get IsRanged(): boolean {
		return this.AttackCapabilities === DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_RANGED_ATTACK
	}
	public get IsSpawned(): boolean {
		return !this.IsWaitingToSpawn
	}
	public get MagicDamageResist(): number {
		return GetUnitNumberPropertyByName(this.Index, "m_flMagicalResistanceValueReal") ?? this.BaseMagicDamageResist
	}
	public get ManaPercent(): number {
		return Math.floor(this.Mana / this.MaxMana * 100) || 0
	}
	public get MinimapIcon(): string {
		return this.UnitData.MinimapIcon
	}
	public get MinimapIconSize(): number {
		return this.UnitData.MinimapIconSize
	}
	// TODO: parse KV, use buffs & items to calculate this
	public get IdealSpeed(): number {
		return GetUnitNumberPropertyByName(this.Index, "m_fIdealSpeed") ?? this.BaseMoveSpeed
	}
	public get RingRadius(): number {
		return this.UnitData.RingRadius
	}
	public get SecondsPerAttack(): number {
		return 1 / (this.AttacksPerSecond ?? 0)
	}
	public get UnitStateMask(): bigint {
		// TODO: use buffs to calculate this
		return GetEntityUnitState(this.Index) ?? this.UnitStateNetworked
	}
	public get UnitState(): modifierstate[] {
		return MaskToArrayBigInt(this.UnitStateMask)
	}
	public get IsEthereal(): boolean {
		return this.ModifiersBook.HasAnyBuffByNames(this.EtherealModifiers)
	}
	public get CanUseAbilitiesInInvisibility(): boolean {
		return this.ModifiersBook.HasAnyBuffByNames(this.CanUseAbilitiesInInvis)
	}
	public get Items(): Item[] {
		return this.Inventory.Items
	}

	public get Buffs(): Modifier[] {
		return this.ModifiersBook.Buffs
	}

	public get HullRadius(): number {
		return this.UnitData.BoundsHull
	}
	public get ProjectileCollisionSize(): number {
		let ProjectileCollisionSize = this.UnitData.ProjectileCollisionSize
		if (ProjectileCollisionSize === 0)
			ProjectileCollisionSize = this.HullRadius
		return ProjectileCollisionSize
	}

	public get MovementTurnRate(): number {
		return this.UnitData.MovementTurnRate
	}
	public get AttackAnimationPoint(): number {
		return this.UnitData.AttackAnimationPoint
	}
	public get AttackProjectileSpeed(): number {
		return this.UnitData.ProjectileSpeed
	}
	public get PrimaryAtribute(): Attributes {
		return this.UnitData.AttributePrimary
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

		const lens = this.GetItemByName("item_aether_lens")
		if (lens !== undefined)
			castrange += lens.GetSpecialValue("cast_range_bonus")

		const gadget_aura = this.GetBuffByName("modifier_item_spy_gadget_aura")
		if (gadget_aura !== undefined) {
			const gadget = gadget_aura.Ability
			if (gadget !== undefined)
				castrange += gadget.GetSpecialValue("cast_range")
		}

		this.Spells.forEach(spell => {
			if (spell !== undefined && spell.Level !== 0 && spell.Name.startsWith("special_bonus_cast_range"))
				castrange += spell.GetSpecialValue("value")
		})
		return castrange
	}
	public get SpellAmplification(): number {
		const itemsSpellAmp = this.Items.reduce((val, item) => val + item.SpellAmplification, 0)
		const spellsSpellAmp = this.Spells.reduce((val, spell) => {
			if (spell !== undefined)
				val += spell.SpellAmplification
			return val
		}, 0)
		return itemsSpellAmp + spellsSpellAmp
	}
	public get Name(): string {
		return this.UnitName_
	}
	public get HasFlyingVision(): boolean {
		return this.HasMoveCapability(DOTAUnitMoveCapability_t.DOTA_UNIT_CAP_MOVE_FLY) || this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_FLYING)
	}
	public get IsFlyingVisually(): boolean {
		return this.Buffs.some(buff => buff.ShouldDoFlyHeightVisual)
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
		return HasBitBigInt(this.UnitStateMask, BigInt(flag))
	}
	public IsControllableByPlayer(playerID: number): boolean {
		return HasBitBigInt(this.IsControllableByPlayerMask, BigInt(playerID))
	}

	/**
	 * @param fromCenterToCenter include HullRadiuses (for Units)
	 */
	public Distance(vec: Vector3 | Entity, fromCenterToCenter = false): number {
		let dist = super.Distance(vec)
		if (fromCenterToCenter && vec instanceof Entity)
			dist -= this.HullRadius + (vec instanceof Unit ? vec.HullRadius : 0)
		return dist
	}
	/**
	 * @param fromCenterToCenter include HullRadiuses (for Units)
	 */
	public Distance2D(vec: Vector3 | Vector2 | Entity, fromCenterToCenter = false): number {
		let dist = super.Distance2D(vec)
		if (fromCenterToCenter && vec instanceof Entity)
			dist -= this.HullRadius + (vec instanceof Unit ? vec.HullRadius : 0)
		return dist
	}
	public GetActivityForAbility(abil: Nullable<Ability>): Nullable<GameActivity_t> {
		if (abil === undefined)
			return undefined
		switch (this.Spells.indexOf(abil)) {
			case 0:
				return GameActivity_t.ACT_DOTA_CAST_ABILITY_1
			case 1:
				return GameActivity_t.ACT_DOTA_CAST_ABILITY_2
			case 2:
				return GameActivity_t.ACT_DOTA_CAST_ABILITY_3
			case 3:
				return GameActivity_t.ACT_DOTA_CAST_ABILITY_4
			case 4:
				return GameActivity_t.ACT_DOTA_CAST_ABILITY_5
			case 5:
				return GameActivity_t.ACT_DOTA_CAST_ABILITY_6
			default:
				return undefined
		}
	}
	public GetAbilityByName(name: string | RegExp): Nullable<Ability> {
		return this.Spells.find(abil =>
			abil !== undefined
			&& (
				name instanceof RegExp
					? name.test(abil.Name)
					: abil.Name === name
			),
		)
	}
	public GetActivityForAbilityName(name: string | RegExp): Nullable<GameActivity_t> {
		return this.GetActivityForAbility(this.GetAbilityByName(name))
	}
	public GetAbilityByClass<T extends Ability>(class_: Constructor<T>): Nullable<T> {
		return this.Spells.find(abil => abil instanceof class_) as Nullable<T>
	}
	public GetActivityForAbilityClass<T extends Ability>(class_: Constructor<T>): Nullable<GameActivity_t> {
		return this.GetActivityForAbility(this.GetAbilityByClass(class_))
	}
	public GetBuffByName(name: string) {
		return this.ModifiersBook.GetBuffByName(name)
	}
	public HasBuffByName(name: string): boolean {
		return this.ModifiersBook.HasBuffByName(name)
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

		const ignore_buffs = DamageIgnoreBuffs[damage_type]
		return ignore_buffs !== undefined && this.Buffs.some(buff => {
			const name = buff.Name
			if (name === undefined)
				return false
			return ignore_buffs.includes(name)
		})
	}

	public GetRotationTime(vec: Vector3): number {
		const turn_rad = Math.PI - 0.25
		const ang = this.FindRotationAngle(vec)
		return ang <= turn_rad ? 30 * ang / this.MovementTurnRate : 0
	}

	public TurnRate(currentTurnRate: boolean = true): number {
		let turnRate = this.MovementTurnRate || 0.5

		if (currentTurnRate) {
			if (this.HasBuffByName("modifier_medusa_stone_gaze_slow"))
				turnRate *= 0.65

			if (this.HasBuffByName("modifier_batrider_sticky_napalm"))
				turnRate *= 0.3
		}

		return turnRate
	}

	public TurnTime(angle: number | Vector3) {
		if (angle instanceof Vector3)
			angle = this.FindRotationAngle(angle)

		const name = this.Name
		if (name === "npc_dota_hero_wisp" || name === "npc_dota_hero_pangolier" || name === "npc_dota_hero_clinkz")
			return 0

		if (angle <= 0.2)
			return 0

		return (0.03 / this.TurnRate()) * angle
	}

	public AbsorbedDamage(dmg: number, damage_type: DAMAGE_TYPES, source?: Unit): number {
		this.Buffs.forEach(buff => {
			const abil = buff.Ability
			if (!(abil instanceof Ability))
				return
			if (damage_type === DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL) {
				switch (buff.Name) {
					case "modifier_ember_spirit_flame_guard":
						dmg -= abil.GetSpecialValue("absorb_amount")
						break
					case "modifier_item_pipe_barrier":
					case "modifier_item_hood_of_defiance_barrier":
						dmg -= abil.GetSpecialValue("barrier_block")
						break
					case "modifier_item_infused_raindrop":
						if (!abil.IsCooldownReady)
							return
						dmg -= abil.GetSpecialValue("magic_damage_block")
						break
				}
			}

			switch (abil.Name) {
				case "abaddon_aphotic_shield":
					dmg -= abil.GetSpecialValue("damage_absorb")
					break
				case "bloodseeker_bloodrage":
					dmg *= 1 + (abil.GetSpecialValue("damage_increase_incoming_pct") / 100)
					break
				case "spectre_dispersion":
					dmg *= 1 - (abil.GetSpecialValue("damage_reflection_pct") / 100)
					break
				case "ursa_enrage":
				case "centaur_stampede":
					dmg *= 1 - (abil.GetSpecialValue("damage_reduction") / 100)
					break
				case "kunkka_ghostship":
					dmg *= 1 - (abil.GetSpecialValue("ghostship_absorb") / 100)
					break
				case "wisp_overcharge":
					dmg *= 1 + (abil.GetSpecialValue("bonus_damage_pct") / 100)
					break
				case "medusa_mana_shield": {
					const max_absorbed_dmg = this.Mana * abil.GetSpecialValue("damage_per_mana"),
						possible_absorbed = dmg * abil.GetSpecialValue("absorption_tooltip") / 100
					dmg -= Math.min(max_absorbed_dmg, possible_absorbed)
					break
				}
				case "bristleback_bristleback": {
					if (source !== undefined) {
						const rot_angle = source.FindRotationAngle(this)
						if (rot_angle <= 1.90)
							dmg *= 1 - abil.GetSpecialValue("back_damage_reduction") / 100
						else if (rot_angle <= 1.20)
							dmg *= 1 - abil.GetSpecialValue("side_damage_reduction") / 100
					}
					break
				}
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
				const armor = this.Armor
				damage *= Math.max(Math.min((1 - (0.06 * armor) / (1 + 0.06 * armor)), 25 / 12), 0)
				{
					const phys_damage_type = source === undefined ? AttackDamageType.Basic : source.AttackDamageType,
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
			const damage_type = source.AttackDamageType,
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
		let damage = source.MinDamage + source.BonusDamage
		damage = this.AbsorbedDamage(damage, DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL)
		if (damage <= 0)
			return 0
		const is_enemy = this.IsEnemy(source)
		let armor = this.Armor
		if (is_enemy) {
			{
				if (!this.HasBuffByName("modifier_blight_stone_buff")) {
					const item = source.GetItemByName("item_blight_stone")
					if (item !== undefined)
						armor += item.GetSpecialValue("corruption_armor")
				}
			}
			{
				if (!this.HasBuffByName("modifier_desolator_buff")) {
					const item = source.GetItemByName("item_desolator")
					if (item !== undefined)
						armor += item.GetSpecialValue("corruption_armor")
				}
			}
			{
				const item = source.GetItemByName("item_quelling_blade")
				if (item !== undefined)
					damage += item.GetSpecialValue(source.HasAttackCapability(DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_RANGED_ATTACK) ? "damage_bonus_ranged" : "damage_bonus")
			}
			{
				const item = source.GetItemByName("item_bfury")
				if (item !== undefined)
					damage += item.GetSpecialValue(source.HasAttackCapability(DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_RANGED_ATTACK) ? "damage_bonus_ranged" : "damage_bonus")
			}
			{
				const abil = source.GetAbilityByName("clinkz_searing_arrows")
				if (abil !== undefined && abil.IsAutoCastEnabled && abil.IsManaEnough())
					damage += abil.GetSpecialValue("damage_bonus")
			}
			{
				const abil = source.GetAbilityByName("antimage_mana_break")
				if (abil !== undefined && this.MaxMana > 0)
					damage += Math.min(this.Mana, abil.GetSpecialValue("mana_per_hit")) * abil.GetSpecialValue("damage_per_burn")
			}
			{
				const abil = source.GetAbilityByName("ursa_fury_swipes")
				if (abil !== undefined) {
					const buff = this.GetBuffByName("modifier_ursa_fury_swipes_damage_increase")
					damage += abil.GetSpecialValue("damage_per_stack") * (1 + (buff !== undefined ? buff.StackCount : 0))
				}
			}
			{
				const abil = source.GetAbilityByName("bounty_hunter_jinada")
				if (abil !== undefined && abil.Cooldown === 0)
					damage += abil.GetSpecialValue("bonus_damage")
			}
		}
		{
			const abil = source.GetAbilityByName("kunkka_tidebringer")
			if (abil !== undefined && abil.IsAutoCastEnabled && abil.Cooldown === 0)
				damage += abil.GetSpecialValue("damage_bonus")
		}
		{
			const buff = source.GetBuffByName("modifier_storm_spirit_overload_passive")
			if (buff !== undefined) {
				const abil = buff.Ability
				if (abil instanceof Ability)
					damage += abil.AbilityDamage
			}
		}
		{
			const abil = source.GetAbilityByName("riki_permanent_invisibility")
			if (abil !== undefined && (source.Forward.AngleBetweenFaces(this.Forward) * 180 / Math.PI) < abil.GetSpecialValue("backstab_angle"))
				damage += abil.GetSpecialValue("damage_multiplier") * source.TotalAgility
		}
		damage *= 1 - (armor * 0.05) / (1 + Math.abs(armor) * 0.05)
		if (is_enemy) {
			{
				const abil = source.GetAbilityByName("silencer_glaives_of_wisdom")
				if (abil !== undefined && abil.IsAutoCastEnabled && abil.IsManaEnough())
					damage += abil.GetSpecialValue("intellect_damage_pct") * source.TotalIntellect / 100
			}
			{
				const abil = source.GetAbilityByName("obsidian_destroyer_arcane_orb")
				if (abil !== undefined && abil.IsAutoCastEnabled && abil.IsManaEnough())
					damage += abil.GetSpecialValue("mana_pool_damage_pct") * source.MaxMana / 100
			}
		}
		{
			const abil = source.GetAbilityByName("spectre_desolate")
			if (abil !== undefined)
				damage += abil.GetSpecialValue("bonus_damage")
		}
		{
			const buff = source.GetBuffByName("modifier_bloodseeker_bloodrage")
			if (buff !== undefined) {
				const abil = buff.Ability
				if (abil instanceof Ability)
					mult *= 1 + abil.GetSpecialValue("damage_increase_pct") / 100
			}
		}
		{
			const buff = this.GetBuffByName("modifier_bloodseeker_bloodrage")
			if (buff !== undefined) {
				const abil = buff.Ability
				if (abil instanceof Ability)
					mult *= 1 + abil.GetSpecialValue("damage_increase_pct") / 100
			}
		}

		return Math.max(damage * mult, 0)
	}

	// TODO: rewrite this
	public IsInside(vec: Vector3, radius: number): boolean {
		const direction = this.Forward,
			npc_pos = this.Position
		for (let i = Math.floor(vec.Distance2D(npc_pos) / radius) + 1; i--;)
			if (npc_pos.Distance2D(new Vector3(vec.x - direction.x * i * radius, vec.y - direction.y * i * radius, vec.z - direction.z * i * radius)) <= radius)
				return true
		return false
	}

	public GetAngle(vec: Vector3): number {
		const npc_pos = this.Position
		let angle = Math.abs(Math.atan2(npc_pos.y - vec.y, npc_pos.x - vec.x) - this.Forward.Angle)
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
		const damageType = this.AttackDamageType,
			armorType = target.ArmorType
		let damage = (useMinDamage ? this.MinDamage : this.DamageAverage) + this.BonusDamage,
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

		damage += target.GetAdditionalAttackDamageMultiplier(this)
		mult *= target.GetAdditionalAttackDamageMultiplier(this)

		mult *= 1 - this.DamageResist
		mult *= (1 + damageAmplifier)

		return damage * mult
	}
	public GetAdditionalAttackDamage(source: Unit): number {
		return 0
	}
	public GetAdditionalAttackDamageMultiplier(source: Unit): number {
		return 1
	}

	public AttackRangeBonus(ent?: Unit) {
		return (ent?.HullRadius ?? 0) + this.AttackRange + this.HullRadius
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
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION, issuers: [this], position, queue, showEffects })
	}
	public MoveToTarget(target: Entity | number, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION, issuers: [this], target, queue, showEffects })
	}
	public AttackMove(position: Vector3 | Vector2, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE, issuers: [this], position, queue, showEffects })
	}
	public AttackTarget(target: Entity | number, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET, issuers: [this], target, queue, showEffects })
	}
	public CastPosition(ability: Ability, position: Vector3 | Vector2, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION, issuers: [this], ability, position, queue, showEffects })
	}
	public PurchaseItem(itemID: number, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_PURCHASE_ITEM, issuers: [this], ability: itemID, queue, showEffects })
	}
	public CastTarget(ability: Ability, target: Entity | number, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET, issuers: [this], target, ability, queue, showEffects })
	}
	public CastTargetTree(ability: Ability, tree: Tree | TreeTemp | number, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET_TREE, issuers: [this], target: tree, ability, queue, showEffects })
	}
	public CastNoTarget(ability: Ability, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET, issuers: [this], ability, queue, showEffects })
	}
	public CastToggle(ability: Ability, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE, issuers: [this], ability, queue, showEffects })
	}
	public HoldPosition(position: Vector3 | Vector2, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_HOLD_POSITION, issuers: [this], position, queue, showEffects })
	}
	public TrainAbility(ability: Ability) {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_TRAIN_ABILITY, issuers: [this], ability })
	}
	public DropItemAtFountain(item: Item, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_DROP_ITEM_AT_FOUNTAIN, issuers: [this], ability: item, queue, showEffects })
	}
	public DropItem(item: Item, position: Vector3 | Vector2, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_DROP_ITEM, issuers: [this], ability: item, position, queue, showEffects })
	}
	public GiveItem(item: Item, target: Entity | number, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_GIVE_ITEM, issuers: [this], target, ability: item, queue, showEffects })
	}
	public PickupItem(physicalItem: PhysicalItem | number, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_ITEM, issuers: [this], target: physicalItem, queue, showEffects })
	}
	public PickupRune(rune: Rune | number, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_RUNE, issuers: [this], target: rune, queue, showEffects })
	}
	public SellItem(item: Item) {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_SELL_ITEM, issuers: [this], ability: item })
	}
	public DisassembleItem(item: Item, queue?: boolean) {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_DISASSEMBLE_ITEM, issuers: [this], ability: item, queue })
	}
	public ItemSetCombineLock(item: Item, lock: boolean | number = true, queue?: boolean) {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_SET_ITEM_COMBINE_LOCK, issuers: [this], ability: item, target: (lock as number) + 0, queue })
	}
	public MoveItem(item: Item, slot: DOTAScriptInventorySlot_t) {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_ITEM, issuers: [this], target: slot, ability: item })
	}
	public CastToggleAuto(item: Item, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO, issuers: [this], ability: item, queue, showEffects })
	}
	public OrderStop(queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_STOP, issuers: [this], queue, showEffects })
	}
	public UnitTaunt(queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_TAUNT, issuers: [this], queue, showEffects })
	}
	public EjectItemFromStash(item: Item) {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_EJECT_ITEM_FROM_STASH, issuers: [this], ability: item })
	}
	public CastRune(runeItem: Item | number, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_RUNE, issuers: [this], target: runeItem, queue, showEffects })
	}
	public PingAbility(ability: Ability) {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_PING_ABILITY, issuers: [this], ability })
	}
	public MoveToDirection(position: Vector3 | Vector2, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_DIRECTION, issuers: [this], position, queue, showEffects })
	}
	public Patrol(position: Vector3 | Vector2, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_PATROL, issuers: [this], position, queue, showEffects })
	}
	public VectorTargetPosition(ability: Ability, Direction: Vector3 | Vector2, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_VECTOR_TARGET_POSITION, issuers: [this], ability, position: Direction, queue, showEffects })
	}
	public CastVectorTargetPosition(ability: Ability, position: Vector3 | Vector2 | Unit, Direction: Vector3 | Vector2, queue?: boolean, showEffects?: boolean): void {
		if (position instanceof Unit)
			position = position.Position

		this.VectorTargetPosition(ability, Direction, queue, showEffects)
		this.CastPosition(ability, position, queue, showEffects)
	}
	public ItemLock(item: Item, state: boolean = true) {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_SET_ITEM_COMBINE_LOCK, issuers: [this], ability: item, target: state === false ? 0 : undefined })
	}
	public OrderContinue(item: Item, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CONTINUE, issuers: [this], ability: item, queue, showEffects })
	}
	public VectorTargetCanceled(position: Vector3 | Vector2, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_VECTOR_TARGET_CANCELED, issuers: [this], position, queue, showEffects })
	}
}

function UnitNameChanged(unit: Unit) {
	unit.UnitData = UnitData.global_storage.get(unit.Name) ?? UnitData.empty
	if (unit.IsValid)
		EventsSDK.emit("EntityNameChanged", false, unit)
}

import { RegisterFieldHandler, ReplaceFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterFieldHandler(Unit, "m_iUnitNameIndex", (unit, new_value) => {
	const old_name = unit.Name
	unit.UnitName_ = new_value >= 0 ? (UnitData.GetUnitNameByNameIndex(new_value as number) ?? "") : ""
	if (unit.UnitName_ === "")
		unit.UnitName_ = unit.Name_
	if (old_name !== unit.Name)
		UnitNameChanged(unit)
})
ReplaceFieldHandler(Unit, "m_nameStringableIndex", (unit, new_val) => {
	const old_name = unit.Name
	unit.Name_ = StringTables.GetString("EntityNames", new_val as number) ?? unit.Name_
	if (unit.UnitName_ === "")
		unit.UnitName_ = unit.Name_
	if (old_name !== unit.Name)
		UnitNameChanged(unit)
})
RegisterFieldHandler(Unit, "m_iTaggedAsVisibleByTeam", (unit, new_value) => {
	unit.IsVisibleForTeamMask = new_value as number
	unit.IsVisibleForEnemies = Unit.IsVisibleForEnemies(unit)
	if (unit.IsValid)
		EventsSDK.emit("TeamVisibilityChanged", false, unit)
})
ReplaceFieldHandler(Unit, "m_iTeamNum", (unit, new_val) => {
	const old_visibility = unit.IsVisibleForEnemies

	{ // we're overriding parent m_iTeamNum handler, so we should handle it here
		const old_team = unit.Team
		unit.Team = new_val as Team
		if (old_team !== unit.Team && unit.IsValid)
			EventsSDK.emit("EntityTeamChanged", false, unit)
	}

	unit.IsVisibleForEnemies = Unit.IsVisibleForEnemies(unit)
	if (unit.IsVisibleForEnemies !== old_visibility && unit.IsValid)
		EventsSDK.emit("TeamVisibilityChanged", false, unit)
})
RegisterFieldHandler(Unit, "m_NetworkActivity", (unit, new_value) => {
	unit.NetworkActivity = new_value as number
	if (unit.IsValid)
		EventsSDK.emit("NetworkActivityChanged", false, unit)
})
RegisterFieldHandler(Unit, "m_hAbilities", (unit, new_value) => {
	const ar = new_value as number[]
	for (let i = 0; i < ar.length; i++) {
		unit.Spells_[i] = ar[i] & 0x3FFF
		const ent = EntityManager.EntityByIndex(ar[i])
		unit.Spells[i] = ent instanceof Ability ? ent : undefined
	}
	for (let i = ar.length; i < unit.Spells_.length; i++) {
		unit.Spells_[i] = 0
		unit.Spells[i] = undefined
	}
})
RegisterFieldHandler(Unit, "m_hItems", (unit, new_value) => {
	const ar = new_value as number[]
	for (let i = 0; i < ar.length; i++) {
		unit.TotalItems_[i] = ar[i] & 0x3FFF
		const ent = EntityManager.EntityByIndex(ar[i])
		unit.TotalItems[i] = ent instanceof Item ? ent : undefined
	}
	for (let i = ar.length; i < unit.TotalItems_.length; i++) {
		unit.TotalItems_[i] = 0
		unit.TotalItems[i] = undefined
	}
})

EventsSDK.on("EntityCreated", ent => {
	if (ent instanceof Unit) {
		ent.SpawnPosition.CopyFrom(ent.Position)
		if (ent.IsNeutral) {
			const pos_2d = Vector2.FromVector3(ent.SpawnPosition)
			ent.Spawner = EntityManager.GetEntitiesByClass(NeutralSpawner).find(spawner => spawner.SpawnBox?.Includes2D(pos_2d))
		}
	}
	if (ent instanceof NeutralSpawner || ent instanceof GameRules) {
		EntityManager.GetEntitiesByClass(Unit).forEach(unit => {
			if (!unit.IsNeutral || unit.Spawner !== undefined)
				return
			const pos_2d = Vector2.FromVector3(unit.SpawnPosition)
			unit.Spawner = EntityManager.GetEntitiesByClass(NeutralSpawner).find(spawner => spawner.SpawnBox?.Includes2D(pos_2d))
		})
	}

	const owner = ent.Owner
	if (!(owner instanceof Unit))
		return
	if (ent instanceof Item) {
		owner.TotalItems_.some((id, i) => {
			if (id === ent.Index) {
				owner.TotalItems[i] = ent
				return true
			}
			return false
		})
	} else if (ent instanceof Ability) {
		owner.Spells_.some((id, i) => {
			if (id === ent.Index) {
				owner.Spells[i] = ent
				return true
			}
			return false
		})
	}
})

EventsSDK.on("EntityDestroyed", ent => {
	const owner = ent.Owner
	if (!(owner instanceof Unit))
		return
	if (ent instanceof Item) {
		owner.TotalItems_.some((id, i) => {
			if (id === ent.Index) {
				owner.TotalItems[i] = undefined
				return true
			}
			return false
		})
	} else if (ent instanceof Ability) {
		owner.Spells_.some((id, i) => {
			if (id === ent.Index) {
				owner.Spells[i] = undefined
				return true
			}
			return false
		})
	}
})

EventsSDK.on("UnitAnimation", (unit, _sequence_variant, _playback_rate, castpoint, _type, activity) => {
	unit.LastActivity = activity
	unit.LastActivityEndTime = GameState.RawGameTime + castpoint
})

import { Color } from "../../Base/Color"
import { Vector2 } from "../../Base/Vector2"
import { Vector3 } from "../../Base/Vector3"
import { MoveSpeedData } from "../../Data/GameData"
import { GetUnitTexture } from "../../Data/ImageData"
import { NetworkedBasicField, ReencodeProperty, WrapperClass } from "../../Decorators"
import { ArmorType } from "../../Enums/ArmorType"
import { AttackDamageType } from "../../Enums/AttackDamageType"
import { Attributes } from "../../Enums/Attributes"
import { DOTA_ABILITY_BEHAVIOR } from "../../Enums/DOTA_ABILITY_BEHAVIOR"
import { DOTA_SHOP_TYPE } from "../../Enums/DOTA_SHOP_TYPE"
import { DOTAScriptInventorySlot } from "../../Enums/DOTAScriptInventorySlot"
import { DOTAUnitAttackCapability } from "../../Enums/DOTAUnitAttackCapability"
import { DOTAUnitMoveCapability } from "../../Enums/DOTAUnitMoveCapability"
import { dotaunitorder_t } from "../../Enums/dotaunitorder_t"
import { GameActivity } from "../../Enums/GameActivity"
import { GridNavCellFlags } from "../../Enums/GridNavCellFlags"
import { modifierstate } from "../../Enums/modifierstate"
import { EPropertyType } from "../../Enums/PropertyType"
import { Team } from "../../Enums/Team"
import { GUIInfo } from "../../GUI/GUIInfo"
import { EntityManager } from "../../Managers/EntityManager"
import { EventsSDK } from "../../Managers/EventsSDK"
import { ExecuteOrder } from "../../Native/ExecuteOrder"
import { RendererSDK } from "../../Native/RendererSDK"
import { RegisterFieldHandler } from "../../Objects/NativeToSDK"
import { GridNav } from "../../Resources/ParseGNV"
import { GameState } from "../../Utils/GameState"
import { toPercentage } from "../../Utils/Math"
import { Inventory } from "../DataBook/Inventory"
import { PlayerCustomData } from "../DataBook/PlayerCustomData"
import { UnitData } from "../DataBook/UnitData"
import { Ability } from "./Ability"
import { Entity, GameRules, LocalPlayer } from "./Entity"
import { Item } from "./Item"
import { Modifier } from "./Modifier"
import { NeutralSpawner } from "./NeutralSpawner"
import { PhysicalItem } from "./PhysicalItem"
import { Rune } from "./Rune"
import { TempTree } from "./TempTree"
import { Tree } from "./Tree"
import { Wearable } from "./Wearable"

const MAX_SPELLS = 31
const MAX_ITEMS = 16

@WrapperClass("CDOTA_BaseNPC")
export class Unit extends Entity {
	public static IsVisibleForEnemies(unit: Unit): boolean {
		// don't check not existing team (0), spectators (1), neutrals (4) and shop (5)
		const validTeams = ~(
			(1 << Team.None) |
			(1 << Team.Observer) |
			(1 << Team.Neutral) |
			(1 << Team.Shop)
		)
		const entTeam = unit.Team
		const localTeam = GameState.LocalTeam
		const flags = unit.IsVisibleForTeamMask & validTeams
		for (let i = 14; i--; ) {
			if (i !== localTeam && i !== entTeam && (flags >> i) & 1) {
				return true
			}
		}
		return false
	}

	public IsVisibleForTeamMask = 0
	public UnitData = UnitData.empty
	public readonly Inventory = new Inventory(this)
	public IsTrueSightedForEnemies = false
	public HasScepterModifier = false
	public HasShardModifier = false

	public UnitName_ = ""
	public IsControllableByPlayerMask = 0n
	public NetworkActivity = GameActivity.ACT_DOTA_IDLE
	public NetworkActivityStartTime = 0
	public NetworkSequenceIndex = 0
	public HPRegenCounter = 0
	/**
	 * @readonly
	 * @description The target angle of the unit, NOTE: need test only local hero?
	 */
	@NetworkedBasicField("m_nTargetAngle")
	public TargetAngle = 0
	@NetworkedBasicField("m_flHealthThinkRegen")
	public HPRegen = 0
	@NetworkedBasicField("m_flManaThinkRegen")
	public ManaRegen = 0
	@NetworkedBasicField("m_bIsAncient")
	public IsAncient = false
	@NetworkedBasicField("m_flPhysicalArmorValue")
	public BaseArmor = 0
	@NetworkedBasicField("m_iCurShop", EPropertyType.UINT32)
	public CurrentShop = DOTA_SHOP_TYPE.DOTA_SHOP_NONE
	@NetworkedBasicField("m_iBKBChargesUsed")
	public BKBChargesUsed = 0
	@NetworkedBasicField("m_iAeonChargesUsed")
	public AeonChargesUsed = 0
	@NetworkedBasicField("m_iDamageBonus")
	public BonusDamage = 0
	@NetworkedBasicField("m_iDayTimeVisionRange")
	public NetworkedDayVision = 0
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
	@NetworkedBasicField("m_iRecentDamage")
	public RecentDamage = 0
	@NetworkedBasicField("m_flLastAttackTime")
	public LastAttackTime = 0
	@NetworkedBasicField("m_flLastDamageTime")
	public LastDamageTime = 0
	@NetworkedBasicField("m_flLastDealtDamageTime")
	public LastDealtDamageTime = 0
	@NetworkedBasicField("m_iMoveSpeed")
	public readonly NetworkBaseMoveSpeed = 0
	@NetworkedBasicField("m_bIsWaitingToSpawn")
	public IsWaitingToSpawn = false
	public PredictedIsWaitingToSpawn = true
	/** @readonly */
	@NetworkedBasicField("m_iCurrentLevel")
	public Level = 0
	@NetworkedBasicField("m_flMagicalResistanceValue")
	public BaseMagicDamageResist = 0
	@NetworkedBasicField("m_flMana")
	public Mana = 0
	@NetworkedBasicField("m_flMaxMana")
	public MaxMana = 0
	@NetworkedBasicField("m_iNightTimeVisionRange")
	public NetworkedNightVision = 0
	@NetworkedBasicField("m_flTauntCooldown")
	public TauntCooldown = 0
	@NetworkedBasicField("m_nUnitState64", EPropertyType.UINT64)
	public UnitStateNetworked = 0n
	@NetworkedBasicField("m_iXPBounty")
	public XPBounty = 0
	@NetworkedBasicField("m_iXPBountyExtra")
	public XPBountyExtra = 0
	@NetworkedBasicField("m_iGoldBountyMin")
	public GoldBountyMin = 0
	@NetworkedBasicField("m_iGoldBountyMax")
	public GoldBountyMax = 0
	@NetworkedBasicField("m_nHealthBarOffsetOverride")
	public HealthBarOffsetOverride = 0
	public HealthBarOffset_: Nullable<number>

	public readonly Spells_ = new Array<number>(MAX_SPELLS).fill(0)
	public readonly Spells = new Array<Nullable<Ability>>(MAX_SPELLS).fill(undefined)
	public readonly TotalItems_ = new Array<number>(MAX_ITEMS).fill(0)
	public readonly TotalItems = new Array<Nullable<Item>>(MAX_ITEMS).fill(undefined)
	public MyWearables: Wearable[] = []
	public MyWearables_: number[] = []
	public LastActivity = 0 as GameActivity
	public LastActivitySequenceVariant = 0
	public LastActivityEndTime = 0
	public LastActivityAnimationPoint = 0
	public Spawner: Nullable<NeutralSpawner>
	/** includes all buffs */
	public readonly Buffs: Modifier[] = []

	/**
	 * @description added for compatibility (icore)
	 * @deprecated
	 */
	public HideHud = false
	/**
	 * @description added for compatibility (icore)
	 * @deprecated
	 */
	public IsFogVisible = false

	/** @readonly */
	public CanUseItems = false
	/** @readonly */
	public CanUseAbilities = false
	/** @readonly */
	public IsVisibleForEnemiesLastTime = 0
	/**
	 * Demarcate recursions.
	 * Recommended: use instanceof for get unique property
	 */
	/** @readonly */
	public IsRoshan = false
	/** @readonly */
	public IsCourier = false
	/** @readonly */
	public PlayerID = -1
	/** @readonly */
	public OwnerPlayerID = -1
	/** @readonly */
	public IsHero = false
	/** @readonly */
	public IsSpiritBear = false
	/** @readonly */
	public IsCreep = false
	/** @readonly */
	public IsTower = false
	/** @readonly */
	public IsBuilding = false
	/** @readonly */
	public IsOutpost = false

	/**
	 * @readonly
	 * @description The owner of the Unit. (example: Spirit Bear)
	 */
	public OwnerNPC: Nullable<Unit> = undefined

	public TPStartTime = -1
	/**
	 * @ignore
	 * @internal
	 */
	public IsIllusion_ = false
	/**
	 * @ignore
	 * @internal
	 */
	public IsClone_ = false
	/**
	 * @ignore
	 * @internal
	 */
	public OwnerNPC_ = 0
	/**
	 * @ignore
	 * @internal
	 */
	public Spawner_ = 0
	/**
	 * @ignore
	 * @internal
	 */
	public IsVisibleForEnemies_ = false
	/**
	 * @ignore
	 * @internal
	 */
	public cellIsVisibleForEnemies_ = false // TODO: calculate grid nav from enemies

	public readonly PredictedPosition = new Vector3().Invalidate()
	public readonly TPStartPosition = new Vector3().Invalidate()
	public readonly TPEndPosition = new Vector3().Invalidate()
	public readonly LastTPStartPosition = new Vector3().Invalidate()
	public readonly LastTPEndPosition = new Vector3().Invalidate()

	private LastPredictedPositionUpdate_ = 0
	private LastRealPredictedPositionUpdate_ = 0

	// private cellPositions: Vector2[] = []

	/**
	 * @deprecated
	 * @description only support for icore (remove after delete icore)
	 */
	public get BaseMoveSpeed() {
		return this.NetworkBaseMoveSpeed
	}

	public get NightVision() {
		let totalBonus = this.NetworkedNightVision
		const arrBuffs = this.Buffs
		const names = new Set<string>()
		for (let index = arrBuffs.length - 1; index > -1; index--) {
			const buff = arrBuffs[index]
			if (!buff.BonusNightVision) {
				continue
			}
			if (buff.BonusNightVisionStack && names.has(buff.Name)) {
				continue
			}
			names.add(buff.Name)
			totalBonus += buff.BonusNightVision
		}
		return totalBonus
	}

	public get DayVisionAmplify() {
		let totalBonus = 1
		const arrBuffs = this.Buffs
		const names = new Set<string>()
		for (let index = arrBuffs.length - 1; index > -1; index--) {
			const buff = arrBuffs[index]
			if (!buff.BonusDayVisionAmplifier) {
				continue
			}
			if (buff.BonusDayVisionAmplifierStack && names.has(buff.Name)) {
				continue
			}
			names.add(buff.Name)
			totalBonus += buff.BonusDayVisionAmplifier
		}
		return totalBonus
	}

	public get DayVisionBonus() {
		let totalBonus = this.NetworkedDayVision
		const arrBuffs = this.Buffs
		const names = new Set<string>()
		for (let index = arrBuffs.length - 1; index > -1; index--) {
			const buff = arrBuffs[index]
			if (!buff.BonusDayVision) {
				continue
			}
			if (buff.BonusDayVisionStack && names.has(buff.Name)) {
				continue
			}
			names.add(buff.Name)
			totalBonus += buff.BonusDayVision
		}
		return totalBonus
	}

	public get DayVision() {
		const amp = this.DayVisionAmplify
		const bonus = this.DayVisionBonus
		return bonus * amp
	}

	/**
	 * The vision value
	 * @description Returns the vision value based on the current game state.
	 * @return {number}
	 */
	public get Vision(): number {
		return GameRules?.IsNight ? this.NightVision : this.DayVision
	}
	/**
	 * @description The color assigned to the player.
	 * @return {Color}
	 */
	public get Color(): Color {
		return PlayerCustomData.get(this.PlayerID)?.Color ?? Color.Red
	}

	public get Armor() {
		return 0
	}

	public get AbsoluteAttack() {
		return 0
	}

	// ===================================== Move Speed ===================================== //
	public get IsMoveSpeedLimit() {
		return this.Buffs.find(buff => !buff.IsMoveSpeedLimit)?.IsMoveSpeedLimit ?? true
	}

	public get MoveSpeedBaseData() {
		return this.UnitData.BaseMovementSpeed
	}

	public get MoveSpeedBase() {
		return this.CalcualteBaseMoveSpeed()
	}

	public get MoveSpeedFixed() {
		return this.CalculateFixedMoveSpeed()
	}

	public get MoveSpeedBonus() {
		return this.CalculateBonusMoveSpeed()
	}

	public get MoveSpeedResistance() {
		return this.CalcualteResistanceMoveSpeed()
	}

	public get MoveSpeedAmplifier() {
		return this.CalculateMoveSpeedAmplifier()
	}

	public get Speed() {
		const isLimit = this.IsMoveSpeedLimit
		const amp = this.MoveSpeedAmplifier
		const baseSpeed = this.MoveSpeedBase + this.MoveSpeedBonus
		const calculateSpeed = Math.max(baseSpeed * amp, MoveSpeedData.Min)

		const totalSpeed = isLimit
			? Math.min(MoveSpeedData.Max, Math.max(MoveSpeedData.Min, calculateSpeed))
			: Math.max(MoveSpeedData.Min, calculateSpeed)

		return totalSpeed >> 0
	}
	// ===================================== Move Speed ===================================== //

	public get LastRealPredictedPositionUpdate(): number {
		if (this.TPStartTime !== -1 && this.TPStartPosition.IsValid) {
			this.LastRealPredictedPositionUpdate_ = GameState.RawGameTime
		}
		return this.LastRealPredictedPositionUpdate_
	}

	public set LastRealPredictedPositionUpdate(val: number) {
		this.LastRealPredictedPositionUpdate_ = val
	}

	public get LastPredictedPositionUpdate(): number {
		if (this.TPStartTime !== -1 && this.TPStartPosition.IsValid) {
			this.LastRealPredictedPositionUpdate_ = GameState.RawGameTime
		}
		return this.LastPredictedPositionUpdate_
	}

	public set LastPredictedPositionUpdate(val: number) {
		this.LastPredictedPositionUpdate_ = val
	}
	/**
	 * Returns a boolean value indicating if the Unit is a clone.
	 * @returns {boolean}
	 */
	public get IsClone(): boolean {
		return this.IsClone_
	}
	/**
	 * @description Determines if the instance is the current player's hero.
	 * @returns {boolean}
	 */
	public get IsMyHero(): boolean {
		return false
	}
	public get GoldBountyAverage(): number {
		return (this.GoldBountyMin + this.GoldBountyMax) / 2
	}

	public get IsIllusion(): boolean {
		return this.IsIllusion_
	}
	// TODO: by classes
	public get IsThirst(): boolean {
		return this.HasBuffByName("modifier_bloodseeker_thirst")
	}
	// TODO: by classes
	public get IsTempestDouble(): boolean {
		return this.HasBuffByName("modifier_arc_warden_tempest_double")
	}
	// TODO: by classes
	public get IsCharge(): boolean {
		return this.HasBuffByName("modifier_spirit_breaker_charge_of_darkness")
	}
	public get CanBeMainHero(): boolean {
		return !this.IsIllusion && !this.IsTempestDouble
	}
	public get IsRooted(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_ROOTED)
	}
	public get IsUnslowable(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_UNSLOWABLE)
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
	public get IsPassiveDisabled(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_PASSIVES_DISABLED)
	}
	public get IsInvisible(): boolean {
		return (
			this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_INVISIBLE) ||
			this.InvisibilityLevel > 0.5
		)
	}
	public get IsNoTeamMoveTo() {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_NO_TEAM_MOVE_TO)
	}
	public get IsInvulnerable(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_INVULNERABLE)
	}
	public get IsMagicImmune(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_MAGIC_IMMUNE)
	}
	public get IsDebuffImmune(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_DEBUFF_IMMUNE)
	}
	public get IsDeniable(): boolean {
		if (this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_SPECIALLY_DENIABLE)) {
			return true
		}
		return (
			this.HPPercent < 25 &&
			this.Buffs.some(
				buff =>
					buff.Name === "modifier_doom_bringer_doom" ||
					buff.Name === "modifier_queenofpain_shadow_strike" ||
					buff.Name === "modifier_venomancer_venomous_gale"
			)
		)
	}
	public get HasModifierVisibleForEnemies(): boolean {
		for (let index = this.Buffs.length - 1; index > -1; index--) {
			return this.Buffs[index].IsVisibleForEnemies
		}
		return false
	}
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
	/** @deprecated */
	public get IsRangeAttacker(): boolean {
		return this.HasAttackCapability(
			DOTAUnitAttackCapability.DOTA_UNIT_CAP_RANGED_ATTACK
		)
	}
	public get HasShard(): boolean {
		return this.HasShardModifier
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
	public get BaseAttackRange(): number {
		return this.UnitData.BaseAttackRange
	}
	public get AttackDamageAverage(): number {
		return (this.AttackDamageMin + this.AttackDamageMax) / 2
	}
	public get HasArcana(): boolean {
		return this.ArcanaLevel > 0
	}
	public get HasInventory(): boolean {
		return this.UnitData.HasInventory
	}
	public get HealthBarOffset(): number {
		let offset = this.HealthBarOffsetOverride
		if (offset === -1) {
			offset =
				this.HealthBarOffset_ ??
				this.MyWearables.find(wearable => wearable.HealthBarOffset !== undefined)
					?.HealthBarOffset ??
				this.UnitData.HealthBarOffset
		}
		return this.DeltaZ + offset
	}
	public get WorkshopName(): string {
		return this.UnitData.WorkshopName
	}
	public get BaseAttackTime() {
		return this.UnitData.BaseAttackTime
	}
	public get InvisibilityLevel(): number {
		return this.Buffs.reduce(
			(prev, buff) => Math.max(prev, buff.InvisibilityLevel),
			0
		)
	}
	/**
	 * IsControllable by LocalPlayer
	 */
	public get IsControllable(): boolean {
		return (
			LocalPlayer !== undefined && this.IsControllableByPlayer(LocalPlayer.PlayerID)
		)
	}
	public get IsMelee(): boolean {
		return this.HasAttackCapability(
			DOTAUnitAttackCapability.DOTA_UNIT_CAP_MELEE_ATTACK
		)
	}
	public get IsRanged(): boolean {
		return this.HasAttackCapability(
			DOTAUnitAttackCapability.DOTA_UNIT_CAP_RANGED_ATTACK
		)
	}
	public get IsSpawned(): boolean {
		return !this.IsWaitingToSpawn
	}
	/**
	 * The percentage of MP remaining.
	 * @description Calculates the percentage of MP remaining.
	 * @returns {number}
	 */
	public get ManaPercent(): number {
		return toPercentage(this.Mana, this.MaxMana)
	}
	/**
	 * The decimal representation of the mana percentage.
	 * @description Calculates the decimal representation of the mana percentage
	 * @return {number}
	 */
	public get ManaPercentDecimal(): number {
		return this.ManaPercent / 100
	}
	public get MinimapIcon(): string {
		return this.UnitData.MinimapIcon
	}
	public get MinimapIconSize(): number {
		return this.UnitData.MinimapIconSize
	}
	public get UnitStateMask(): bigint {
		// TODO: add prediction cast order + maybe calculate modifiers
		return this.UnitStateNetworked
	}
	public get UnitState(): modifierstate[] {
		return this.UnitStateMask.toMask
	}
	public get IsGhost(): boolean {
		for (let index = this.Buffs.length - 1; index > -1; index--) {
			return this.Buffs[index].IsGhost
		}
		return false
	}
	public get IsEthereal(): boolean {
		return this.IsGhost
	}
	public get CanUseAbilitiesInInvisibility(): boolean {
		for (let index = this.Buffs.length - 1; index > -1; index--) {
			const buff = this.Buffs[index]
			switch (buff.Name) {
				case "modifier_riki_permanent_invisibility":
				case "modifier_treant_natures_guise_invis":
					return true
				default:
					break
			}
		}
		return false
	}
	public get Items(): Item[] {
		return this.Inventory.Items
	}
	public get HullRadius(): number {
		return this.UnitData.HullRadius
	}
	public get ProjectileCollisionSize(): number {
		let projectileCollisionSize = this.UnitData.ProjectileCollisionSize
		if (projectileCollisionSize === 0) {
			projectileCollisionSize = this.HullRadius
		}
		return projectileCollisionSize
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
		if (this.HasInventory && this.Items.some(item => item.IsChanneling)) {
			return true
		}
		return this.Spells.some(spell => spell !== undefined && spell.IsChanneling)
	}
	public get IsInAbilityPhase(): boolean {
		return this.Spells.some(spell => spell !== undefined && spell.IsInAbilityPhase)
	}
	public get CastRangeBonus(): number {
		let castrange = 0
		// todo buffs
		const gadgetAura = this.GetBuffByName("modifier_item_spy_gadget_aura")
		if (gadgetAura !== undefined) {
			const gadget = gadgetAura.Ability
			if (gadget !== undefined) {
				castrange += gadget.GetSpecialValue("cast_range")
			}
		}
		for (let i = 0, end = this.Spells.length; i < end; i++) {
			const spell = this.Spells[i]
			if (spell !== undefined) {
				castrange += spell.BonusCastRange
			}
		}
		for (let i = 0, end = this.Items.length; i < end; i++) {
			const item = this.Items[i]
			if (item !== undefined) {
				castrange += item.BonusCastRange
			}
		}
		return castrange
	}
	public get SpellAmplification(): number {
		const itemsSpellAmp = this.Items.reduce(
			(val, item) => val + item.SpellAmplification,
			0
		)
		const spellsSpellAmp = this.Spells.reduce((val, spell) => {
			if (spell !== undefined) {
				val += spell.SpellAmplification
			}
			return val
		}, 0)
		return itemsSpellAmp + spellsSpellAmp
	}
	public get Name(): string {
		return this.UnitName_
	}
	public get RealPosition(): Vector3 {
		return GameState.IsInDraw ? this.VisualPosition : this.NetworkedPosition
	}

	public get Position(): Vector3 {
		if (this.IsVisible || (this.PredictedIsWaitingToSpawn && this.IsWaitingToSpawn)) {
			return this.RealPosition
		}

		if (this.TPStartTime !== -1 && this.TPStartPosition.IsValid) {
			return this.TPStartPosition
		}
		return this.PredictedPosition
	}
	public get HasFlyingVision(): boolean {
		return (
			(this.UnitData.MovementCapabilities &
				DOTAUnitMoveCapability.DOTA_UNIT_CAP_MOVE_FLY) !==
				0 || this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_FLYING)
		)
	}

	public get IsShield(): boolean {
		return this.Buffs.some(buff => buff.IsShield)
	}

	public get IsFlyingVisually(): boolean {
		return this.Buffs.some(buff => buff.ShouldDoFlyHeightVisual)
	}

	public get IsGloballyTargetable(): boolean {
		return false
	}

	public get ShouldUnifyOrders(): boolean {
		return true
	}

	public get HealthBarSize() {
		return new Vector2(GUIInfo.ScaleHeight(78), GUIInfo.ScaleHeight(6))
	}

	public get HealthBarPositionCorrection() {
		return new Vector2(this.HealthBarSize.x / 2, GUIInfo.ScaleHeight(11))
	}

	protected get MoveSpeedBonusBoots() {
		const sortBuffs = this.Buffs.toOrderBy(
			// exclude 0 and boots
			x => x.IsBoots && x.BonusMoveSpeed === 0,
			// sort by max
			x => -x.BonusMoveSpeed
		)
		const buff = sortBuffs.find(x => x.IsBoots && x.BonusMoveSpeed !== 0)
		return buff?.BonusMoveSpeed ?? 0
	}

	protected get MoveSpeedAmpBoots() {
		const sortBuffs = this.Buffs.toOrderBy(
			// exclude 0 and boots
			x => x.IsBoots && x.BonusMoveSpeedAmplifier === 0,
			// sort by max
			x => -x.BonusMoveSpeedAmplifier
		)
		const buff = sortBuffs.find(x => x.IsBoots && x.BonusMoveSpeedAmplifier !== 0)
		return buff?.BonusMoveSpeedAmplifier ?? 0
	}

	public HealthBarPosition(useHpBarOffset = true, override?: Vector3) {
		// if (RendererSDK.IsInDraw) {
		// 	throw "HealthBarPosition outside in draw"
		// }
		const position = (override ?? this.Position).Clone() // need clone ?
		if (useHpBarOffset) {
			position.AddScalarZ(this.HealthBarOffset)
		}
		const screenPosition = RendererSDK.WorldToScreen(position)
		if (screenPosition === undefined) {
			return undefined
		}
		if (this.IsShield) {
			screenPosition.AddScalarY(5)
		}
		return screenPosition.SubtractForThis(this.HealthBarPositionCorrection)
	}

	// TODO
	public GetAttacksPerSecond(_target?: Unit): number {
		return 0
	}

	public TexturePath(small?: boolean, team = this.Team): Nullable<string> {
		return GetUnitTexture(this.Name, small, team)
	}
	/**
	 * @description  Check if the unit is visible for enemies.
	 * @param seconds - The duration in seconds for which the unit should be visible.
	 * @param method - The method of checking visibility.
	 *     - 0: Old method (default).
	 *     - 1: Predicted method (buffs / cell / etc..).
	 * @returns {boolean}
	 */
	public IsVisibleForEnemies(seconds: number = 2, method: number = 0): boolean {
		switch (method) {
			default:
			case 0: // old method
				return this.IsVisibleForEnemies_
			case 1: {
				// new method
				// predicted (buffs / cell / etc..) method
				// Check if the Unit is visible for enemies in the current cell
				// Check if the Unit has any buff that makes it visible for enemies
				if (this.cellIsVisibleForEnemies_ || this.HasModifierVisibleForEnemies) {
					return true
				}
				// Check if the current game time is less than the time when the Unit
				// was last visible for enemies plus the given duration
				if (this.IsVisibleForEnemiesLastTime + seconds > GameState.RawGameTime) {
					return true
				}
				return false
			}
		}
	}

	// need optimize UpdateVisibleCellsPosition or move to c++
	// public UpdatePositions(parentTransform?: Matrix3x4) {
	// 	super.UpdatePositions(parentTransform)
	// 	GridNav?.UpdateVisibleCellsPosition(
	// 		this.Position,
	// 		this.Vision,
	// 		this.IsFlyingVisually || this.HasFlyingVision,
	// 		this.cellPositions
	// 	)
	// }

	public VelocityWaypoint(time: number, movespeed: number): Vector3 {
		return this.InFront(movespeed * time)
	}
	public GetItemByName(name: string | RegExp, includeBackpack = false) {
		return this.Inventory.GetItemByName(name, includeBackpack)
	}
	public GetItemByClass<T extends Item>(
		class_: Constructor<T>,
		includeBackpack = false
	): Nullable<T> {
		return this.Inventory.GetItemByClass(class_, includeBackpack)
	}
	public HasItemInInventory(name: string | RegExp, includeBackpack = false): boolean {
		return this.GetItemByName(name, includeBackpack) !== undefined
	}

	/**
	 * @param flag if not exists => is Melee or Range attack
	 */
	public HasAttackCapability(
		flag: DOTAUnitAttackCapability = DOTAUnitAttackCapability.DOTA_UNIT_CAP_MELEE_ATTACK |
			DOTAUnitAttackCapability.DOTA_UNIT_CAP_RANGED_ATTACK
	): boolean {
		return (this.AttackCapabilities & flag) !== 0
	}
	/**
	 * @param flag if not exists => isn't move NONE
	 */
	public HasMoveCapability(
		flag: DOTAUnitMoveCapability = DOTAUnitMoveCapability.DOTA_UNIT_CAP_MOVE_GROUND |
			DOTAUnitMoveCapability.DOTA_UNIT_CAP_MOVE_FLY
	): boolean {
		if (
			(flag & DOTAUnitMoveCapability.DOTA_UNIT_CAP_MOVE_FLY) !== 0 &&
			(this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_FLYING) ||
				this.IsUnitStateFlagSet(
					modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY
				))
		) {
			return true
		}
		return (this.UnitData.MovementCapabilities & flag) !== 0
	}

	public IsUnitStateFlagSet(flag: modifierstate): boolean {
		return this.UnitStateMask.hasBit(BigInt(flag))
	}
	public IsControllableByPlayer(playerID: number): boolean {
		return this.IsControllableByPlayerMask.hasBit(BigInt(playerID))
	}
	/**
	 * @deprecated
	 */
	public ForwardNativeProperties(healthBarOffset: number) {
		this.HealthBarOffset_ = healthBarOffset
	}

	/**
	 * @param fromCenterToCenter include HullRadiuses (for Units)
	 */
	public Distance(vec: Vector3 | Entity, fromCenterToCenter = false): number {
		let dist = super.Distance(vec)
		if (fromCenterToCenter && vec instanceof Entity) {
			dist -= this.HullRadius + (vec instanceof Unit ? vec.HullRadius : 0)
		}
		return dist
	}
	/**
	 * @param fromCenterToCenter include HullRadiuses (for Units)
	 */
	public Distance2D(
		vec: Vector3 | Vector2 | Entity,
		fromCenterToCenter = false
	): number {
		let dist = super.Distance2D(vec)
		if (fromCenterToCenter && vec instanceof Entity) {
			dist -= this.HullRadius + (vec instanceof Unit ? vec.HullRadius : 0)
		}
		return dist
	}
	public GetAbilityByName(name: string | RegExp): Nullable<Ability> {
		return this.Spells.find(
			abil =>
				abil !== undefined &&
				(name instanceof RegExp ? name.test(abil.Name) : abil.Name === name)
		)
	}
	public GetAbilityByClass<T extends Ability>(class_: Constructor<T>): Nullable<T> {
		return this.Spells.find(abil => abil instanceof class_) as Nullable<T>
	}
	public GetBuffByName(name: string): Nullable<Modifier> {
		return this.Buffs.find(buff => buff.Name === name)
	}
	public HasBuffByName(name: string): boolean {
		return this.Buffs.some(buff => buff.Name === name)
	}
	public GetBuffByRegexp(regex: RegExp): Nullable<Modifier> {
		return this.Buffs.find(buff => regex.test(buff.Name))
	}
	public GetAnyBuffByNames(names: string[]): Nullable<Modifier> {
		let buff: Nullable<Modifier>
		names.some(name => (buff = this.GetBuffByName(name)) !== undefined)
		return buff
	}
	public HasAnyBuffByNames(names: string[]): boolean {
		return names.some(name => this.GetBuffByName(name) !== undefined)
	}
	/**
	 * faster (Distance <= range)
	 *
	 * @param fromCenterToCenter include HullRadiuses (for Units)
	 */
	public IsInRange(
		ent: Vector3 | Entity,
		range: number,
		fromCenterToCenter = false
	): boolean {
		if (fromCenterToCenter === false) {
			range += this.HullRadius
			if (ent instanceof Unit) {
				range += ent.HullRadius
			}
		}

		return super.IsInRange(ent, range)
	}

	public GetRotationTime(vec: Vector3): number {
		const turnRad = Math.PI - 0.25
		const ang = this.FindRotationAngle(vec)
		return ang <= turnRad ? (30 * ang) / this.MovementTurnRate : 0
	}

	public TurnRate(currentTurnRate = true): number {
		let turnRate = this.MovementTurnRate || 0.5

		if (currentTurnRate) {
			const buff = this.GetBuffByName("modifier_batrider_sticky_napalm")
			if (buff !== undefined && buff.Ability !== undefined) {
				turnRate *=
					1 +
					buff.Ability.GetSpecialValue("turn_rate_pct", buff.AbilityLevel) / 100
			}
		}

		const legs = this.GetItemByName("item_spider_legs")
		if (legs !== undefined) {
			turnRate *= 1 + legs.GetSpecialValue("turn_rate") / 100
		}

		return turnRate
	}

	public TurnTime(angle: number | Vector3) {
		if (angle instanceof Vector3) {
			angle = this.FindRotationAngle(angle)
		}

		const name = this.Name
		if (name === "npc_dota_hero_wisp" || name === "npc_dota_hero_pangolier") {
			return 0
		}

		if (angle <= 0.2) {
			return 0
		}

		return angle / (30 * this.TurnRate())
	}

	// TODO: rewrite this
	public IsInside(vec: Vector3, radius: number): boolean {
		const direction = this.Forward,
			npcPos = this.Position
		for (let i = Math.floor(vec.Distance2D(npcPos) / radius) + 1; i--; ) {
			if (
				npcPos.Distance2D(
					new Vector3(
						vec.x - direction.x * i * radius,
						vec.y - direction.y * i * radius,
						vec.z - direction.z * i * radius
					)
				) <= radius
			) {
				return true
			}
		}
		return false
	}

	public IsManaEnough(abil: Ability) {
		return this.Mana >= abil.ManaCost
	}

	public HasLinkenAtTime(time: number = 0): boolean {
		const sphere = this.GetItemByName("item_sphere")

		if (sphere !== undefined && sphere.Cooldown - time <= 0) {
			return true
		}

		const sphereTarget = this.GetBuffByName("modifier_item_sphere_target")

		return sphereTarget !== undefined && sphereTarget.RemainingTime - time <= 0
	}

	public CalculateActivityModifiers(activity: GameActivity, ar: string[]): void {
		super.CalculateActivityModifiers(activity, ar)
		if (this.IsIllusion) {
			ar.push("illusion")
		}
		if (
			this.HPPercent <= 25 &&
			!this.HasBuffByName("modifier_skeleton_king_reincarnation_scepter_active")
		) {
			ar.push("injured")
		}
		if (!this.HasBuffByName("modifier_marci_unleash_flurry_cooldown")) {
			const buff = this.GetBuffByName("modifier_marci_unleash_flurry")
			if (buff !== undefined) {
				if (buff.StackCount === 1) {
					ar.push("flurry_pulse_attack")
				} else if (buff.StackCount % 2 === 0) {
					ar.push("flurry_attack_a")
				} else {
					ar.push("flurry_attack_b")
				}
			}
		} else {
			ar.push("unleash")
		}

		// TODO: AttackSpeedActivityModifiers, MovementSpeedActivityModifiers, AttackRangeActivityModifiers
	}

	public GetAnimationID(
		activity = this.NetworkActivity,
		sequenceNum = this.NetworkSequenceIndex,
		findBestMatch = true
	): Nullable<number> {
		return super.GetAnimationID(activity, sequenceNum, findBestMatch)
	}

	public GetAttachmentPosition(
		name: string,
		activity = this.NetworkActivity,
		sequenceNum = this.NetworkSequenceIndex,
		time = Infinity,
		pos = this.Position,
		ang = this.Angles,
		scale = this.ModelScale
	): Vector3 {
		return super.GetAttachmentPosition(
			name,
			activity,
			sequenceNum,
			time,
			pos,
			ang,
			scale
		)
	}

	public CanAttack(target: Unit): boolean {
		return (
			this.IsAlive &&
			this.IsVisible &&
			this.IsSpawned &&
			!this.IsEthereal &&
			target.IsAlive &&
			!target.IsInvulnerable &&
			target.IsVisible &&
			target.IsSpawned &&
			!target.IsAttackImmune &&
			!this.IsEthereal &&
			(this.IsEnemy(target) || target.IsDeniable)
		)
	}

	public ExtendUntilWall(
		start: Vector3,
		direction: Vector3,
		distance: number
	): Vector3 {
		if (GridNav === undefined) {
			return start.Add(direction.MultiplyScalar(distance))
		}
		if (distance < 0) {
			direction = direction.Clone().Negate()
		}
		distance = Math.abs(distance)
		const step = GridNav.EdgeSize / 2,
			stepVec = direction.MultiplyScalar(step),
			testPoint = start.Clone(),
			origDistance = distance,
			flying = this.HasFlyingVision
		while (distance > 0) {
			const flags = GridNav.GetCellFlagsForPos(testPoint)
			if (
				(!flying &&
					(!flags.hasBit(GridNavCellFlags.Walkable) ||
						flags.hasBit(GridNavCellFlags.Tree))) ||
				flags.hasBit(GridNavCellFlags.MovementBlocker)
			) {
				break
			}
			if (distance < step) {
				return start.Add(direction.MultiplyScalar(origDistance))
			}
			testPoint.AddForThis(stepVec)
			distance -= step
		}

		return testPoint
	}

	public ChangeFieldsByEvents() {
		const buffs = this.Buffs

		{
			// IsTrueSightedForEnemies
			const lastIsTrueSighted = this.IsTrueSightedForEnemies
			const isTrueSighted = Modifier.HasTrueSightBuff(buffs)

			if (isTrueSighted !== lastIsTrueSighted) {
				this.IsTrueSightedForEnemies = isTrueSighted
				EventsSDK.emit("TrueSightedChanged", false, this)
			}
		}

		{
			// HasScepter
			const lastHasScepter = this.HasScepter
			const hasScepter = Modifier.HasScepterBuff(buffs)

			if (hasScepter !== lastHasScepter) {
				this.HasScepterModifier = hasScepter
				EventsSDK.emit("HasScepterChanged", false, this)
			}
		}

		{
			// HasShard
			const lastHasShard = this.HasShard
			const hasShard = Modifier.HasShardBuff(buffs)

			if (hasShard !== lastHasShard) {
				this.HasShardModifier = hasShard
				EventsSDK.emit("HasShardChanged", false, this)
			}
		}
	}

	/* ================================ ORDERS ================================ */
	public UseSmartAbility(
		ability: Ability,
		target?: Vector3 | Entity,
		checkAutoCast = false,
		checkToggled = false,
		queue?: boolean,
		showEffects?: boolean
	) {
		if (
			checkAutoCast &&
			ability.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST) &&
			!ability.IsAutoCastEnabled
		) {
			return this.CastToggleAuto(ability, queue, showEffects)
		}

		if (
			checkToggled &&
			ability.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_TOGGLE) &&
			!ability.IsToggled
		) {
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

		if (
			ability.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET)
		) {
			return this.CastTarget(ability, target as Entity, showEffects)
		}
	}

	public MoveTo(position: Vector3, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION,
			issuers: [this],
			position,
			queue,
			showEffects
		})
	}
	public MoveToTarget(target: Entity | number, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_TARGET,
			issuers: [this],
			target,
			queue,
			showEffects
		})
	}
	public AttackMove(position: Vector3, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE,
			issuers: [this],
			position,
			queue,
			showEffects
		})
	}
	public AttackTarget(target: Entity | number, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET,
			issuers: [this],
			target,
			queue,
			showEffects
		})
	}
	public CastPosition(
		ability: Ability,
		position: Vector3,
		queue?: boolean,
		showEffects?: boolean
	) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
			issuers: [this],
			ability,
			position,
			queue,
			showEffects
		})
	}
	public PurchaseItem(itemID: number, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_PURCHASE_ITEM,
			issuers: [this],
			ability: itemID,
			queue,
			showEffects
		})
	}
	public CastTarget(
		ability: Ability,
		target: Entity | number,
		queue?: boolean,
		showEffects?: boolean
	) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
			issuers: [this],
			target,
			ability,
			queue,
			showEffects
		})
	}
	public CastTargetTree(
		ability: Ability,
		tree: Tree | TempTree | number,
		queue?: boolean,
		showEffects?: boolean
	) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET_TREE,
			issuers: [this],
			target: tree,
			ability,
			queue,
			showEffects
		})
	}
	public CastNoTarget(ability: Ability, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
			issuers: [this],
			ability,
			queue,
			showEffects
		})
	}
	public CastToggle(ability: Ability, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE,
			issuers: [this],
			ability,
			queue,
			showEffects
		})
	}
	public CastAltToggle(ability: Ability, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_ALT,
			issuers: [this],
			ability,
			queue,
			showEffects
		})
	}
	public HoldPosition(position: Vector3, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_HOLD_POSITION,
			issuers: [this],
			position,
			queue,
			showEffects
		})
	}

	public TrainAbility(ability: Ability) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_TRAIN_ABILITY,
			issuers: [this],
			ability
		})
	}

	public DropItemAtFountain(
		item: Item,
		queue?: boolean,
		showEffects?: boolean,
		slot?: DOTAScriptInventorySlot
	) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_DROP_ITEM_AT_FOUNTAIN,
			issuers: [this],
			target: slot,
			ability: item,
			queue,
			showEffects
		})
	}

	public DropItem(
		item: Item,
		position: Vector3,
		queue?: boolean,
		showEffects?: boolean
	) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_DROP_ITEM,
			issuers: [this],
			ability: item,
			position,
			queue,
			showEffects
		})
	}

	public GiveItem(
		item: Item,
		target: Entity | number,
		queue?: boolean,
		showEffects?: boolean
	) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_GIVE_ITEM,
			issuers: [this],
			target,
			ability: item,
			queue,
			showEffects
		})
	}

	public PickupItem(
		physicalItem: PhysicalItem | number,
		queue?: boolean,
		showEffects?: boolean
	) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_ITEM,
			issuers: [this],
			target: physicalItem,
			queue,
			showEffects
		})
	}

	public PickupRune(rune: Rune | number, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_RUNE,
			issuers: [this],
			target: rune,
			queue,
			showEffects
		})
	}

	public SellItem(item: Item) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_SELL_ITEM,
			issuers: [this],
			ability: item
		})
	}

	public DisassembleItem(item: Item, queue?: boolean) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_DISASSEMBLE_ITEM,
			issuers: [this],
			ability: item,
			queue
		})
	}

	public ItemSetCombineLock(
		item: Item,
		lock: boolean | number = true,
		queue?: boolean
	) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_SET_ITEM_COMBINE_LOCK,
			issuers: [this],
			ability: item,
			target: (lock as number) + 0,
			queue
		})
	}

	public TakeItemFromNeutralStash(item: Item) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_TAKE_ITEM_FROM_NEUTRAL_ITEM_STASH,
			issuers: [this],
			ability: item
		})
	}

	public MoveItem(item: Item, slot: DOTAScriptInventorySlot) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_ITEM,
			issuers: [this],
			target: slot,
			ability: item
		})
	}

	public CastToggleAuto(item: Ability, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO,
			issuers: [this],
			ability: item,
			queue,
			showEffects
		})
	}

	public OrderStop(queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_STOP,
			issuers: [this],
			queue,
			showEffects
		})
	}

	public UnitTaunt(queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_TAUNT,
			issuers: [this],
			queue,
			showEffects
		})
	}

	public EjectItemFromStash(item: Item) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_EJECT_ITEM_FROM_STASH,
			issuers: [this],
			ability: item
		})
	}

	public CastRune(runeItem: Item | number, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_RUNE,
			issuers: [this],
			target: runeItem,
			queue,
			showEffects
		})
	}

	public PingAbility(ability: Ability) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_PING_ABILITY,
			issuers: [this],
			ability
		})
	}

	public MoveToDirection(position: Vector3, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_DIRECTION,
			issuers: [this],
			position,
			queue,
			showEffects
		})
	}

	public Patrol(position: Vector3, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_PATROL,
			issuers: [this],
			position,
			queue,
			showEffects
		})
	}

	public VectorTargetPosition(
		ability: Ability,
		direction: Vector3,
		target?: Nullable<Entity | number>,
		queue?: boolean,
		showEffects?: boolean
	) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_VECTOR_TARGET_POSITION,
			issuers: [this],
			ability,
			target,
			position: direction,
			queue,
			showEffects
		})
	}

	public CastVectorTargetPosition(
		ability: Ability,
		position: Vector3 | Unit,
		direction: Vector3,
		queue?: boolean,
		showEffects?: boolean
	): void {
		if (position instanceof Unit) {
			position = position.Position
		}

		this.VectorTargetPosition(
			ability,
			direction,
			position instanceof Unit ? position : 0,
			queue,
			showEffects
		)
		this.CastPosition(ability, position, queue, showEffects)
	}

	public ItemLock(item: Item, state = true) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_SET_ITEM_COMBINE_LOCK,
			issuers: [this],
			ability: item,
			target: state === false ? 0 : undefined
		})
	}
	public OrderContinue(item: Item, queue?: boolean, showEffects?: boolean) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CONTINUE,
			issuers: [this],
			ability: item,
			queue,
			showEffects
		})
	}

	public VectorTargetCanceled(
		position: Vector3,
		queue?: boolean,
		showEffects?: boolean
	) {
		return ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_VECTOR_TARGET_CANCELED,
			issuers: [this],
			position,
			queue,
			showEffects
		})
	}

	protected ShouldCheckMaxSpeed(modifier: Modifier) {
		const hasBuffByName = this.IsThirst || this.IsCharge
		return !(hasBuffByName && modifier.BonusMoveSpeed >= MoveSpeedData.Max)
	}

	protected CalculateFixedMoveSpeed() {
		return (
			this.Buffs.toOrderBy(
				// exclude 0
				x => x.MoveSpeedFixed === 0,
				// sort by min
				x => x.MoveSpeedFixed
			).find(x => x.MoveSpeedFixed !== 0)?.MoveSpeedFixed ?? 0
		)
	}

	protected CalcualteBaseMoveSpeed() {
		if (this.MoveSpeedFixed !== 0) {
			return this.MoveSpeedFixed
		}
		let baseSpeed = this.NetworkBaseMoveSpeed
		if (baseSpeed === 0) {
			baseSpeed = this.MoveSpeedBaseData
		}
		let totalBonus = 0,
			totalBonusAmp = 1
		const arrBuffs = this.Buffs,
			namesBonus = new Set<string>(),
			namesAmplifier = new Set<string>(),
			bonusBaseSpeed = baseSpeed + totalBonus
		for (let index = arrBuffs.length - 1; index > -1; index--) {
			const buff = arrBuffs[index]
			// if not bonus skip
			if (buff.MoveSpeedBase !== 0) {
				if (buff.MoveSpeedBaseStack && namesBonus.has(buff.Name)) {
					continue
				}
				namesBonus.add(buff.Name)
				totalBonus += buff.MoveSpeedBase
				continue
			}
			// if not amplifier skip
			if (!buff.MoveSpeedBaseAmplifier) {
				continue
			}
			if (buff.MoveSpeedBaseAmplifierStack && namesAmplifier.has(buff.Name)) {
				continue
			}
			namesAmplifier.add(buff.Name)
			totalBonusAmp += buff.MoveSpeedBaseAmplifier
		}

		// need check min speed data from base move speed ?
		return bonusBaseSpeed * totalBonusAmp
	}

	protected CalculateBonusMoveSpeed() {
		let totalBonus = 0
		const names = new Set<string>()
		const arrBuffs = this.Buffs
		for (let index = arrBuffs.length - 1; index > -1; index--) {
			const buff = arrBuffs[index]
			if (buff.IsBoots || !buff.BonusMoveSpeed) {
				continue
			}
			if (!this.ShouldCheckMaxSpeed(buff)) {
				continue
			}
			if (buff.BonusMoveSpeedStack && names.has(buff.Name)) {
				continue
			}
			names.add(buff.Name)
			totalBonus += buff.BonusMoveSpeed
		}
		const nightBonus = 0 // TODO: this.CalcualteNightMoveSpeed()
		return totalBonus + nightBonus + this.MoveSpeedBonusBoots
	}

	protected CalculateMoveSpeedAmplifier() {
		let amp = 1
		const arrBuffs = this.Buffs,
			names = new Set<string>()
		// TODO: modifier_muerta_dead_shot_fear
		for (let index = arrBuffs.length - 1; index > -1; index--) {
			const buff = arrBuffs[index]
			if (buff.IsBoots || !buff.BonusMoveSpeedAmplifier) {
				continue
			}
			if (buff.BonusMoveSpeedAmplifierStack && names.has(buff.Name)) {
				continue
			}
			let res = buff.BonusMoveSpeedAmplifier
			if (buff.IsDebuff) {
				res *= this.CalcualteResistanceMoveSpeed()
			}
			names.add(buff.Name)
			amp += res
		}
		return amp + this.MoveSpeedAmpBoots
	}

	// TODO: refactor
	protected CalcualteNightMoveSpeed() {
		if (!GameRules?.IsNight) {
			return 0
		}

		const speed = 30 // fixed value
		const lastDamageTime = this.LastDamageTime + 5
		const lastAttackTime = this.LastAttackTime + 5
		const lastDealtDamageTime = this.LastDealtDamageTime + 5

		const gameRawTime = GameState.RawGameTime
		if (
			lastAttackTime > gameRawTime ||
			(lastDamageTime > gameRawTime && lastDealtDamageTime > gameRawTime)
		) {
			return 0
		}

		return speed
	}

	protected CalcualteResistanceMoveSpeed() {
		let totalRes = 1
		const names = new Set<string>(),
			arrBuffs = this.Buffs
		for (let index = arrBuffs.length - 1; index > -1; index--) {
			const buff = arrBuffs[index]
			if (!buff.StatusResistanceSpeed) {
				continue
			}
			if (buff.StatusResistanceSpeedStack && names.has(buff.Name)) {
				continue
			}
			names.add(buff.Name)
			totalRes += buff.StatusResistanceSpeed
		}
		return totalRes
	}
}
export const Units = EntityManager.GetEntitiesByClass(Unit)

function UnitNameChanged(unit: Unit) {
	unit.UnitData = UnitData.globalStorage.get(unit.Name) ?? UnitData.empty
}

RegisterFieldHandler(Unit, "m_iUnitNameIndex", (unit, newVal) => {
	const oldName = unit.Name
	const newValue = newVal as number
	unit.UnitName_ = newValue >= 0 ? UnitData.GetUnitNameByNameIndex(newValue) ?? "" : ""
	if (unit.UnitName_ === "") {
		unit.UnitName_ = unit.Name_
	}
	if (oldName !== unit.Name) {
		UnitNameChanged(unit)
	}
})
RegisterFieldHandler(Unit, "m_nameStringableIndex", unit => {
	if (unit.UnitName_ === "") {
		unit.UnitName_ = unit.Name_
	}
	UnitNameChanged(unit)
})
RegisterFieldHandler(Unit, "m_iTaggedAsVisibleByTeam", (unit, newValue) => {
	unit.IsVisibleForTeamMask = newValue as number
	unit.IsVisibleForEnemies_ = Unit.IsVisibleForEnemies(unit)
	if (unit.IsValid) {
		EventsSDK.emit("UnitTeamVisibilityChanged", false, unit)
	}
})
RegisterFieldHandler(Unit, "m_iPlayerID", (unit, newVal) => {
	unit.PlayerID = ReencodeProperty(newVal, EPropertyType.INT32) as number
	PlayerCustomData.set(unit.PlayerID)
})
RegisterFieldHandler(Unit, "m_nUnitState64", (unit, newVal) => {
	unit.UnitStateNetworked = ReencodeProperty(newVal, EPropertyType.UINT64) as bigint
	for (let index = unit.Buffs.length - 1; index > -1; index--) {
		unit.Buffs[index].OnUnitStateChaged()
	}
	EventsSDK.emit("UnitStateChanged", false, unit)
})
RegisterFieldHandler(Unit, "m_hOwnerNPC", (unit, newVal) => {
	unit.OwnerNPC_ = newVal as number
	unit.OwnerNPC = EntityManager.EntityByIndex(unit.OwnerNPC_)
})
RegisterFieldHandler(Unit, "m_nPlayerOwnerID", (unit, newVal) => {
	unit.OwnerPlayerID = ReencodeProperty(newVal, EPropertyType.INT32) as number
})
RegisterFieldHandler(Unit, "m_bIsIllusion", (unit, newVal) => {
	unit.IsIllusion_ = newVal as boolean
	EventsSDK.emit("UnitPropertyChanged", false, unit)
})
EventsSDK.on("LocalTeamChanged", () => {
	for (let index = Units.length - 1; index > -1; index--) {
		const unit = Units[index]
		unit.IsVisibleForEnemies_ = Unit.IsVisibleForEnemies(unit)
	}
})
RegisterFieldHandler(Unit, "m_iIsControllableByPlayer64", (unit, newVal) => {
	unit.IsControllableByPlayerMask = newVal as bigint
	if (unit.IsValid) {
		EventsSDK.emit("ControllableByPlayerMaskChanged", false, unit)
	}
})
RegisterFieldHandler(Unit, "m_NetworkActivity", (unit, newVal) => {
	unit.NetworkActivity = newVal as number
	unit.NetworkActivityStartTime = GameState.RawGameTime
	unit.AnimationTime = 0
	if (unit.IsValid) {
		EventsSDK.emit("NetworkActivityChanged", false, unit)
	}
})
RegisterFieldHandler(Unit, "m_nResetEventsParity", unit => {
	unit.AnimationTime = 0
})
RegisterFieldHandler(Unit, "m_NetworkSequenceIndex", (unit, newVal) => {
	unit.NetworkSequenceIndex = newVal as number
	if (unit.IsValid) {
		EventsSDK.emit("NetworkActivityChanged", false, unit)
	}
})
RegisterFieldHandler(Unit, "m_hAbilities", (unit, newVal) => {
	const prevSpells = [...unit.Spells]
	const ar = newVal as number[]
	for (let i = 0; i < ar.length; i++) {
		unit.Spells_[i] = ar[i]
		const ent = EntityManager.EntityByIndex(ar[i])
		if (ent instanceof Ability) {
			ent.Owner_ = unit.Handle
			ent.OwnerEntity = unit
			unit.Spells[i] = ent
		} else {
			unit.Spells[i] = undefined
		}
	}
	for (let i = ar.length; i < unit.Spells_.length; i++) {
		unit.Spells_[i] = 0
		unit.Spells[i] = undefined
	}
	if (unit.Spells.some((abil, i) => prevSpells[i] !== abil)) {
		EventsSDK.emit("UnitAbilitiesChanged", false, unit)
	}
})
RegisterFieldHandler(Unit, "m_hItems", (unit, newVal) => {
	const prevTotalItems = [...unit.TotalItems]
	const ar = newVal as number[]
	for (let i = 0; i < ar.length; i++) {
		unit.TotalItems_[i] = ar[i]
		const ent = EntityManager.EntityByIndex(ar[i])
		if (ent instanceof Item) {
			ent.Slot = i
			ent.Owner_ = unit.Handle
			ent.OwnerEntity = unit
			unit.TotalItems[i] = ent
		} else {
			unit.TotalItems[i] = undefined
		}
	}
	for (let i = ar.length; i < unit.TotalItems_.length; i++) {
		unit.TotalItems_[i] = 0
		unit.TotalItems[i] = undefined
	}
	if (unit.TotalItems.some((item, i) => prevTotalItems[i] !== item)) {
		EventsSDK.emit("UnitItemsChanged", false, unit)
	}
})
RegisterFieldHandler(Unit, "m_hMyWearables", (unit, newVal) => {
	unit.MyWearables_ = newVal as number[]
	unit.MyWearables = unit.MyWearables_.map(id =>
		EntityManager.EntityByIndex<Wearable>(id)
	).filter(ent => ent !== undefined) as Wearable[]
})
RegisterFieldHandler(Unit, "m_anglediff", (unit, newVal) => {
	unit.NetworkedAngles.SubtractScalarY(unit.RotationDifference)
	unit.RotationDifference = newVal as number
	unit.NetworkedAngles.AddScalarY(unit.RotationDifference)
})
RegisterFieldHandler(Unit, "m_hNeutralSpawner", (unit, newVal) => {
	unit.Spawner_ = newVal as number
	const ent = EntityManager.EntityByIndex(unit.Spawner_)
	if (ent instanceof NeutralSpawner) {
		unit.Spawner = ent
	}
})

EventsSDK.on("PreEntityCreated", ent => {
	if (ent instanceof Unit) {
		ent.CanUseItems = !ent.IsIllusion
		ent.CanUseAbilities = !ent.IsIllusion
		ent.PredictedPosition.CopyFrom(ent.NetworkedPosition)
		ent.LastRealPredictedPositionUpdate = GameState.RawGameTime
		ent.LastPredictedPositionUpdate = GameState.RawGameTime
	}
	if (ent instanceof NeutralSpawner) {
		for (let index = Units.length - 1; index > -1; index--) {
			const unit = Units[index]
			if (ent.HandleMatches(unit.Spawner_)) {
				unit.Spawner = ent
			}
		}
	}

	const owner = ent.Owner
	if (!(owner instanceof Unit)) {
		return
	}
	if (ent instanceof Item) {
		for (let i = 0, end = owner.TotalItems_.length; i < end; i++) {
			if (ent.HandleMatches(owner.TotalItems_[i])) {
				owner.TotalItems[i] = ent
				EventsSDK.emit("UnitItemsChanged", false, owner)
				break
			}
		}
	} else if (ent instanceof Ability) {
		for (let i = 0, end = owner.Spells_.length; i < end; i++) {
			if (ent.HandleMatches(owner.Spells_[i])) {
				owner.Spells[i] = ent
				EventsSDK.emit("UnitAbilitiesChanged", false, owner)
				break
			}
		}
	} else if (ent instanceof Wearable) {
		for (let i = 0, end = owner.MyWearables_.length; i < end; i++) {
			if (ent.HandleMatches(owner.MyWearables_[i])) {
				owner.MyWearables.push(ent)
				EventsSDK.emit("UnitWearablesChanged", false, owner)
				break
			}
		}
	}
})

EventsSDK.on("EntityDestroyed", ent => {
	const owner = ent.Owner
	if (!(owner instanceof Unit)) {
		return
	}
	if (ent instanceof Item) {
		for (let i = 0, end = owner.TotalItems.length; i < end; i++) {
			if (ent === owner.TotalItems[i]) {
				owner.TotalItems[i] = undefined
				EventsSDK.emit("UnitItemsChanged", false, owner)
				break
			}
		}
	} else if (ent instanceof Ability) {
		for (let i = 0, end = owner.Spells.length; i < end; i++) {
			if (ent === owner.Spells[i]) {
				owner.Spells[i] = undefined
				EventsSDK.emit("UnitAbilitiesChanged", false, owner)
				break
			}
		}
	} else if (ent instanceof Wearable) {
		if (owner.MyWearables.remove(ent)) {
			EventsSDK.emit("UnitWearablesChanged", false, owner)
		}
	}
})

EventsSDK.on(
	"UnitAnimation",
	(unit, sequenceVariant, playbackRate, castpoint, _type, activity) => {
		unit.LastActivity = activity
		unit.LastActivitySequenceVariant = sequenceVariant
		unit.LastActivityEndTime = GameState.RawGameTime + castpoint
		unit.LastActivityAnimationPoint = playbackRate * castpoint
	}
)

EventsSDK.on("Tick", dt => {
	for (let index = Units.length - 1; index > -1; index--) {
		const unit = Units[index]
		unit.HPRegenCounter += unit.HPRegen * Math.min(dt, 0.1)
		const regenAmountFloor = Math.floor(unit.HPRegenCounter)
		unit.HPRegenCounter -= regenAmountFloor
		if (!unit.IsVisible) {
			unit.HP = Math.max(Math.min(unit.MaxHP, unit.HP + regenAmountFloor), 0)
			unit.Mana = Math.max(
				Math.min(unit.MaxMana, unit.Mana + unit.ManaRegen * Math.min(dt, 0.1)),
				0
			)
		}
		if (!unit.IsWaitingToSpawn) {
			unit.PredictedIsWaitingToSpawn = false
		}
		if (unit.IsVisible) {
			unit.PredictedPosition.CopyFrom(unit.NetworkedPosition)
			unit.LastRealPredictedPositionUpdate = GameState.RawGameTime
			unit.LastPredictedPositionUpdate = GameState.RawGameTime
		}
		unit.AnimationTime += dt * unit.PlaybackRate
		// TODO: interpolate DeltaZ from OnModifierUpdated?
	}
})

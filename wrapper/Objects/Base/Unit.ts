import { Color } from "../../Base/Color"
import { QAngle } from "../../Base/QAngle"
import { Vector2 } from "../../Base/Vector2"
import { Vector3 } from "../../Base/Vector3"
import { GetArmorResistInternal } from "../../Data/GameData"
import { GetUnitTexture } from "../../Data/ImageData"
import {
	GetAngleToFacePath,
	GetCastAngle,
	GetTurnData,
	UpdateFacing
} from "../../Data/TurnData"
import { NetworkedBasicField, ReencodeProperty, WrapperClass } from "../../Decorators"
import { ArmorType } from "../../Enums/ArmorType"
import { ATTACK_DAMAGE_STRENGTH } from "../../Enums/ATTACK_DAMAGE_STRENGTH"
import { AttackDamageType } from "../../Enums/AttackDamageType"
import { Attributes } from "../../Enums/Attributes"
import { DAMAGE_TYPES } from "../../Enums/DAMAGE_TYPES"
import { DOTA_ABILITY_BEHAVIOR } from "../../Enums/DOTA_ABILITY_BEHAVIOR"
import { DOTA_SHOP_TYPE } from "../../Enums/DOTA_SHOP_TYPE"
import { DOTAScriptInventorySlot } from "../../Enums/DOTAScriptInventorySlot"
import { DOTAUnitAttackCapability } from "../../Enums/DOTAUnitAttackCapability"
import { DOTAUnitMoveCapability } from "../../Enums/DOTAUnitMoveCapability"
import { dotaunitorder_t } from "../../Enums/dotaunitorder_t"
import { EAbilitySlot } from "../../Enums/EAbilitySlot"
import { GameActivity } from "../../Enums/GameActivity"
import { GridNavCellFlags } from "../../Enums/GridNavCellFlags"
import { modifierstate } from "../../Enums/modifierstate"
import { EPropertyType } from "../../Enums/PropertyType"
import { Team } from "../../Enums/Team"
import { ScaleHeight } from "../../GUI/Helpers"
import { EntityManager } from "../../Managers/EntityManager"
import { EventsSDK } from "../../Managers/EventsSDK"
import { ExecuteOrder } from "../../Native/ExecuteOrder"
import { RendererSDK } from "../../Native/RendererSDK"
import { RegisterFieldHandler } from "../../Objects/NativeToSDK"
import { GridNav } from "../../Resources/ParseGNV"
import { GameState } from "../../Utils/GameState"
import { toPercentage } from "../../Utils/Math"
import { QuantizePlaybackRate } from "../../Utils/QuantizeUtils"
import { Inventory } from "../DataBook/Inventory"
import { PlayerCustomData } from "../DataBook/PlayerCustomData"
import { UnitData } from "../DataBook/UnitData"
import { UnitModifierManager } from "../DataBook/UnitModifierManager"
import { modifier_item_angels_demise } from "../Modifiers/Items/modifier_item_angels_demise"
import { modifier_item_phylactery } from "../Modifiers/Items/modifier_item_phylactery"
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

const MAX_ITEMS = 16
const MAX_SPELLS = 31

function UnitNameChanged(unit: Unit) {
	unit.UnitData = UnitData.globalStorage.get(unit.Name) ?? UnitData.empty
}

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
	@NetworkedBasicField("m_flHealthThinkRegen")
	public readonly BaseHPRegen: number = 0
	@NetworkedBasicField("m_flManaThinkRegen")
	public readonly ManaRegen: number = 0
	@NetworkedBasicField("m_bIsAncient")
	public readonly IsAncient: boolean = false
	@NetworkedBasicField("m_flPhysicalArmorValue")
	public readonly NetworkedBaseArmor: number = 0
	@NetworkedBasicField("m_flMagicalResistanceValue")
	public readonly NetworkedBaseMagicResist: number = 0
	@NetworkedBasicField("m_iCurShop", EPropertyType.UINT32)
	public readonly CurrentShop: DOTA_SHOP_TYPE = DOTA_SHOP_TYPE.DOTA_SHOP_NONE
	@NetworkedBasicField("m_iBKBChargesUsed")
	public readonly BKBChargesUsed: number = 0
	@NetworkedBasicField("m_iAeonChargesUsed")
	public readonly AeonChargesUsed: number = 0
	@NetworkedBasicField("m_flRefresherUseTime")
	public readonly RefresherUseTime: number = 0
	@NetworkedBasicField("m_flRefresherLastCooldown")
	public readonly RefresherLastCooldown: number = 0
	@NetworkedBasicField("m_iDayTimeVisionRange")
	public readonly NetworkedBaseDayVision: number = 0
	@NetworkedBasicField("m_flDeathTime")
	public readonly DeathTime: number = 0
	@NetworkedBasicField("m_bStolenScepter")
	public readonly HasStolenScepter: boolean = false
	@NetworkedBasicField("m_bHasUpgradeableAbilities")
	public readonly HasUpgradeableAbilities: boolean = false
	@NetworkedBasicField("m_bCanBeDominated")
	public readonly IsDominatable: boolean = false
	@NetworkedBasicField("m_bCanRespawn")
	public readonly CanBeRespawn: boolean = false
	@NetworkedBasicField("m_iBaseDamageMin")
	public readonly BaseDamageMin: number = 0
	@NetworkedBasicField("m_iBaseDamageMax")
	public readonly BaseDamageMax: number = 0
	@NetworkedBasicField("m_iDamageMin")
	public readonly AttackDamageMin: number = 0
	@NetworkedBasicField("m_iDamageMax")
	public readonly AttackDamageMax: number = 0
	@NetworkedBasicField("m_bIsMoving")
	public readonly IsMoving: boolean = false
	@NetworkedBasicField("m_bIsPhantom")
	public readonly IsPhantom: boolean = false
	@NetworkedBasicField("m_bIsSummoned")
	public readonly IsSummoned: boolean = false
	@NetworkedBasicField("m_flLastAttackTime")
	public readonly LastAttackTime: number = 0
	@NetworkedBasicField("m_flLastDealtDamageTime")
	public readonly LastDealtDamageTime: number = 0
	@NetworkedBasicField("m_iMoveSpeed")
	public readonly NetworkBaseMoveSpeed: number = 0
	@NetworkedBasicField("m_iAttackRange")
	public readonly NetworkBaseAttackRange: number = 0
	@NetworkedBasicField("m_flBaseAttackTime")
	public readonly NetworkBaseAttackTime: number = 0
	public PredictedIsWaitingToSpawn = true
	@NetworkedBasicField("m_flMana")
	public Mana: number = 0
	@NetworkedBasicField("m_flMaxMana")
	public readonly MaxMana: number = 0
	@NetworkedBasicField("m_iNightTimeVisionRange")
	public readonly NetworkedBaseNightVision: number = 0
	@NetworkedBasicField("m_flTauntCooldown")
	public readonly TauntCooldown: number = 0
	@NetworkedBasicField("m_flTauntCooldown2")
	public readonly TauntCooldown2: number = 0
	@NetworkedBasicField("m_iXPBounty")
	public readonly XPBounty: number = 0
	@NetworkedBasicField("m_iXPBountyExtra")
	public readonly XPBountyExtra: number = 0
	@NetworkedBasicField("m_iGoldBountyMin")
	public readonly GoldBountyMin: number = 0
	@NetworkedBasicField("m_iGoldBountyMax")
	public readonly GoldBountyMax: number = 0
	@NetworkedBasicField("m_nHealthBarOffsetOverride")
	public readonly HealthBarOffsetOverride: number = 0
	public HealthBarOffset_: Nullable<number>
	@NetworkedBasicField("m_NetworkActivity")
	public readonly NetworkActivity: GameActivity = 0 as GameActivity
	public NetworkActivityPrev: GameActivity = 0 as GameActivity
	public NetworkActivityStartTime: number = 0
	@NetworkedBasicField("m_NetworkSequenceIndex")
	public readonly NetworkSequenceIndex: number = 0
	public NetworkSequenceIndexPrev: number = 0
	@NetworkedBasicField("m_nResetEventsParity")
	public SequenceParity: number = 0
	public SequenceParityPrev: number = 0
	@NetworkedBasicField("m_flStartSequenceCycle")
	public StartSequenceCycle: number = 0
	@NetworkedBasicField("m_nPlayerOwnerID")
	public readonly OwnerPlayerID: number = -1
	@NetworkedBasicField("m_iParity")
	public readonly Parity: number = 0
	@NetworkedBasicField("m_iDamageBonus")
	public readonly NetworkAttackDamageBonus: number = 0
	@NetworkedBasicField("m_iUnitType")
	public readonly UnitType: number = 0
	/** @private NOTE: this is internal field use LastDamageTime */
	@NetworkedBasicField("m_flLastDamageTime")
	public LastDamageTime_: number = 0

	public Level: number = 0
	public Agility: number = 0
	public Intellect: number = 0
	public Strength: number = 0
	public TotalAgility: number = 0
	public BaseTotalIntellect: number = 0
	public TotalStrength: number = 0
	public AttackCapabilities: number = 0
	public UnitStateNetworked: bigint = 0n
	public IsWaitingToSpawn: boolean = false

	/** @private NOTE: this is internal field, use Spawner */
	public Spawner_: number = 0
	public Spawner: Nullable<NeutralSpawner>
	public LastActivity: GameActivity = 0 as GameActivity
	public LastActivitySequenceVariant: number = 0
	public LastAnimationStartTime: number = 0
	public LastAnimationEndTime: number = 0
	public LastAnimationRawCastPoint: number = 0
	public LastAnimationCastPoint: number = 0
	public LastAnimationPlaybackRate: number = 0
	public LastAnimationIsAttack: boolean = false
	public LastAnimationCasted: boolean = false
	public IsInAnimation: boolean = false

	public AttackTimeAtLastTick: number = 0
	public AttackTimeLostToLastTick: number = 0
	public LastPredictedPositionUpdate: number = 0
	public LastRealPredictedPositionUpdate: number = 0

	public YawVelocity = 0

	/**
	 * @description added for compatibility (icore)
	 * @deprecated
	 */
	public HideHud = false
	/**
	 * @description added for compatibility (icore)
	 * @deprecated
	 */
	public IsFogVisible: boolean = false
	public IsAttacking: boolean = false
	public IsVisibleForEnemiesLastTime = 0

	public IsRoshan: boolean = false
	public IsCourier: boolean = false
	public IsHero: boolean = false
	public IsSpiritBear: boolean = false
	public IsCreep: boolean = false
	public IsTower: boolean = false
	public IsOutpost: boolean = false
	public IsBuilding: boolean = false
	public IsUnit: boolean = true

	public IsVisibleForTeamMask = 0
	public UnitData = UnitData.empty
	public IsTrueSightedForEnemies: boolean = false
	public HasScepterModifier: boolean = false
	public HasShardModifier: boolean = false
	public CanBeHealed: boolean = true

	/** @private NOTE: this is internal field use Name */
	public UnitName_: string = ""
	public PlayerID: number = -1
	public HPRegenCounter: number = 0
	public IsControllableByPlayerMask: bigint = 0n

	/** @private NOTE: this is internal field use MyWearables */
	public MyWearables_: number[] = []
	public MyWearables: Wearable[] = []

	/** @private NOTE: this is internal field use OwnerNPC */
	public OwnerNPC_: number = 0
	/** @description The owner of the Unit. (example: Spirit Bear) */
	public OwnerNPC: Nullable<Unit> = undefined
	/** @private NOTE: this is internal field use IsVisibleForEnemies(...) */
	public IsVisibleForEnemies_: boolean = false
	public cellIsVisibleForEnemies_: boolean = false // TODO: calculate grid nav from enemies

	public readonly Buffs: Modifier[] = []
	public readonly Inventory = new Inventory(this)
	public readonly ModifierManager = new UnitModifierManager(this)

	public readonly Spells_ = new Array<number>(MAX_SPELLS).fill(0)
	public readonly Spells = new Array<Nullable<Ability>>(MAX_SPELLS).fill(undefined)
	public readonly TotalItems_ = new Array<number>(MAX_ITEMS).fill(0)
	public readonly TotalItems = new Array<Nullable<Item>>(MAX_ITEMS).fill(undefined)
	public readonly PredictedPosition = new Vector3().Invalidate()

	/**
	 * @description added for compatibility (icore)
	 * @deprecated
	 */
	public readonly FogVisiblePosition = new Vector3().Invalidate()

	public get Armor() {
		return this.GetPhysicalArmorModifier()
	}
	public get ArmorType(): ArmorType {
		return this.UnitData.ArmorType
	}
	public get HPRegen() {
		return this.BaseHPRegen
	}
	public get AttacksPerSecond(): number {
		return this.ModifierManager.AttacksPerSecond
	}
	public get AttackAnimationPoint(): number {
		return this.ModifierManager.GetAttackAnimationPoint(this.BaseAttackAnimationPoint)
	}
	public get AttackHasteFactor(): number {
		const baseTime = this.BaseAttackTime
		return baseTime === 0 ? 1 : this.AttacksPerSecond / (1 / baseTime)
	}
	public get AttackPoint(): number {
		return Math.max(this.AttackAnimationPoint / this.AttackHasteFactor, 0)
	}
	public get AttackBackswing(): number {
		const tick = GameState.TickInterval
		return Math.floor((this.SecondsPerAttack - this.AttackPoint - tick) / tick) * tick
	}
	/** @deprecated Use SecondsPerAttack */
	public get AttackRate() {
		return this.SecondsPerAttack
	}
	public get AttackSpeed(): number {
		return this.GetAttackSpeedModifier()
	}
	public AttackDamageType(target: Unit): DAMAGE_TYPES {
		return this.IsMagicAttackDamage(target)
			? DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
			: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
	}
	public get AttackDamageClassType(): AttackDamageType {
		return this.UnitData.AttackDamageType
	}
	public get AttackDamageAverage(): number {
		return (this.AttackDamageMin + this.AttackDamageMax) / 2
	}
	public get AttackProjectileSpeed(): number {
		return this.BaseAttackProjectileSpeed
	}
	public get BaseAttackTime(): number {
		return this.ModifierManager.GetBaseAttackTime(this.NetworkBaseAttackTime)
	}
	public get BaseAttackRange(): number {
		return this.ModifierManager.GetBaseAttackRange(this.NetworkBaseAttackRange)
	}
	public get BaseAttackSpeed(): number {
		return this.ModifierManager.GetBaseAttackSpeed(this.UnitData.BaseAttackSpeed)
	}
	public get BaseAttackSpeedIncrease(): number {
		return this.BaseAttackSpeed + this.TotalAgility
	}
	public get BaseAttackProjectileSpeed(): number {
		return this.UnitData.ProjectileSpeed
	}
	public get BaseAttackAnimationPoint(): number {
		return this.UnitData.AttackAnimationPoint
	}
	public get BaseTurnRate(): number {
		return this.ModifierManager.GetBaseTurnRate(this.UnitData.MovementTurnRate)
	}
	public get BaseMoveSpeed(): number {
		return this.ModifierManager.GetBaseMoveSpeed(this.NetworkBaseMoveSpeed)
	}
	public get BaseArmor(): number {
		return this.NetworkedBaseArmor
	}
	public get BaseBonusArmor(): number {
		return this.ModifierManager.GetBaseBonusPhysicalArmor(this.BaseArmor)
	}
	public get BonusArmorPerAgility() {
		return this.ModifierManager.ArmorPerAgility
	}
	public get BaseMagicalResist(): number {
		return this.ModifierManager.GetBaseMagicResistance(this.NetworkedBaseMagicResist)
	}
	public get DayVisionRange() {
		return !this.IsBlind && this.IsSpawned
			? this.GetTimeVisionModifier(this.NetworkedBaseDayVision, false)
			: 0
	}
	public get LastDamageTime() {
		return this.LastDamageTime_
	}
	public get MoveSpeed(): number {
		return this.GetMoveSpeedModifier()
	}
	public get MagicalDamageResist(): number {
		return this.GetMagicalDamageResist()
	}
	/** @deprecated Use MoveSpeed */
	public get Speed(): number {
		return this.MoveSpeed
	}
	public get SecondsPerAttack(): number {
		return 1 / this.AttacksPerSecond
	}
	public get StatusResistance(): number {
		return this.ModifierManager.StatusResistance
	}
	public get SpellAmp(): number {
		return this.ModifierManager.SpellAmplification
	}
	public get SpellAmpTarget(): number {
		return this.ModifierManager.SpellAmplificationTarget
	}
	public get EffSpellAmp(): number {
		return 1 + this.ModifierManager.SpellAmplification / 100
	}
	public get EffSpellAmpTarget(): number {
		return 1 + this.ModifierManager.SpellAmplificationTarget / 100
	}
	public get TotalIntellect() {
		return this.HasIntellect ? this.BaseTotalIntellect : 0
	}
	public get NightVisionRange() {
		return !this.IsBlind && this.IsSpawned
			? this.GetTimeVisionModifier(this.NetworkedBaseNightVision, true)
			: 0
	}
	public get VisionRange(): number {
		return GameRules?.IsNight ? this.NightVisionRange : this.DayVisionRange
	}
	/** @deprecated Use DayVisionRange */
	public get DayVision() {
		return this.DayVisionRange
	}
	/** @deprecated Use NightVisionRange */
	public get NightVision() {
		return this.NightVisionRange
	}
	/** @deprecated Use VisionRange */
	public get Vision(): number {
		return this.VisionRange
	}
	public get Color(): Color {
		return PlayerCustomData.get(this.PlayerID)?.Color ?? Color.Red
	}
	public get MovementTurnRate(): number {
		return this.ModifierManager.GetTurnRate(this.BaseTurnRate)
	}
	/**
	 * Returns a boolean value indicating if the Unit is a clone.
	 * @returns {boolean}
	 */
	public get IsClone(): boolean {
		return this.ModifierManager.IsClone_
	}
	/**
	 * @description Determines if the instance is the current player's hero.
	 * @returns {boolean}
	 */
	public get IsMyHero(): boolean {
		return false
	}
	public get IsMovementImpaired(): boolean {
		return this.IsRooted || this.IsStunned || this.IsNightmared
	}
	public get GoldBountyAverage(): number {
		return (this.GoldBountyMin + this.GoldBountyMax) / 2
	}
	public get IsIllusion(): boolean {
		return this.ModifierManager.IsIllusion_ || this.ModifierManager.IsReflection_
	}
	/** @description e.g: Terror Blade conjure image */
	public get IsReflection(): boolean {
		return this.ModifierManager.IsReflection_
	}
	public get IsSuppressCrit(): boolean {
		return this.ModifierManager.IsSuppressCrit
	}
	public get IsStrongIllusion(): boolean {
		return this.ModifierManager.IsStrongIllusion_
	}
	/** @deprecated use IsIllusion or IsStrongIllusion */
	public get IsHiddenIllusion(): boolean {
		return this.IsIllusion
	}
	public get CanReincarnate() {
		return this.HasAegis
	}
	public get CanUseAllItems(): boolean {
		return this.ModifierManager.CanUseAllItems_
	}
	public get IsFountainInvulnerable(): boolean {
		return this.ModifierManager.IsFountainInvulnerable_
	}
	public get IsTempestDouble(): boolean {
		return this.ModifierManager.IsTempestDouble_
	}
	/** @deprecated use IsChargeOfDarkness */
	public get IsCharge(): boolean {
		return this.ModifierManager.IsChargeOfDarkness_
	}
	public get IsChargeOfDarkness(): boolean {
		return this.ModifierManager.IsChargeOfDarkness_
	}
	public get CanBeMainHero(): boolean {
		return !this.IsIllusion && !this.IsTempestDouble
	}
	public get IsRooted(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_ROOTED)
	}
	public get IsCommandRestricted(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED)
	}
	public get CanUseBackpack(): boolean {
		return this.IsUnitStateFlagSet(
			modifierstate.MODIFIER_STATE_CAN_USE_BACKPACK_ITEMS
		)
	}
	public get IgnoreMoveAndAttackOrders(): boolean {
		return this.IsUnitStateFlagSet(
			modifierstate.MODIFIER_STATE_IGNORING_MOVE_AND_ATTACK_ORDERS
		)
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
	public get IsAttacksAreMelee(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_ATTACKS_ARE_MELEE)
	}
	public get IsStunned(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_STUNNED)
	}
	public get IsNightmared(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_NIGHTMARED)
	}
	public get IsHexed(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_HEXED)
	}
	public get IsPassiveDisabled(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_PASSIVES_DISABLED)
	}
	public get IsTethered(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_TETHERED)
	}
	public get IsInvisible(): boolean {
		return (
			this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_INVISIBLE) ||
			this.InvisibilityLevel > 0.5
		)
	}
	public get IsNoTeamMoveTo(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_NO_TEAM_MOVE_TO)
	}
	public get IsInvulnerable(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_INVULNERABLE)
	}
	public get IsUntargetable() {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_UNTARGETABLE)
	}
	public get IsMagicImmune(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_MAGIC_IMMUNE)
	}
	public get IsDebuffImmune(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_DEBUFF_IMMUNE)
	}
	public get IsDeniable(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_SPECIALLY_DENIABLE)
	}
	public get IsAttackReady(): boolean {
		return GameState.RawGameTime >= this.LastAttackTime + this.AttackBackswing
	}
	public get IsAttackImpaired(): boolean {
		if (this.IsInvulnerable && !this.IsFountainInvulnerable) {
			return true
		}
		return (
			this.IsDisarmed ||
			this.IgnoreMoveAndAttackOrders ||
			this.HasAttackCapability(DOTAUnitAttackCapability.DOTA_UNIT_CAP_NO_ATTACK)
		)
	}
	public get HasAegis(): boolean {
		return this.ModifierManager.HasAeigs_
	}
	public get HasIntellect(): boolean {
		return !this.ModifierManager.NoIntellect_
	}
	public get HasModifierVisibleForEnemies(): boolean {
		return false
	}
	public get HasNoHealthBar(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_NO_HEALTH_BAR)
	}
	public get HasNoCollision(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION)
	}
	public get IsBlind(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_BLIND)
	}
	public get IsTrueSightImmune(): boolean {
		return this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_TRUESIGHT_IMMUNE)
	}
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
	public get InvisibilityLevel(): number {
		return this.Buffs.reduce(
			(prev, buff) => Math.max(prev, buff.InvisibilityLevel),
			0
		)
	}
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
	public get ManaPercent(): number {
		return toPercentage(this.Mana, this.MaxMana)
	}
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
		return this.Buffs.some(buff => buff.IsGhost)
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
	public get CollisionPadding(): number {
		return this.UnitData.CollisionPadding
	}
	public get PaddedCollisionRadius(): number {
		return this.HullRadius + this.CollisionPadding
	}
	public get ProjectileCollisionSize(): number {
		let projectileCollisionSize = this.UnitData.ProjectileCollisionSize
		if (projectileCollisionSize === 0) {
			projectileCollisionSize = this.HullRadius
		}
		return projectileCollisionSize
	}
	public get PrimaryAttribute(): Attributes {
		return this.ModifierManager.GetBaseAttributePrimary(
			this.UnitData.AttributePrimary
		)
	}
	/** @deprecated use PrimaryAttribute */
	public get PrimaryAtribute(): Attributes {
		return this.PrimaryAttribute
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
	public get PhysicalDamageResist(): number {
		return GetArmorResistInternal(this.Armor)
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
		return this.PredictedPosition
	}
	public get HasFlyingVision(): boolean {
		return (
			(this.UnitData.MovementCapabilities &
				DOTAUnitMoveCapability.DOTA_UNIT_CAP_MOVE_FLY) !==
				0 || this.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_FLYING)
		)
	}
	public get HasVisualShield(): boolean {
		return this.Buffs.some(buff => buff.HasVisualShield)
	}
	public get ShouldDoFlyHeightVisual(): boolean {
		return this.Buffs.some(buff => buff.ShouldDoFlyHeightVisual)
	}
	public get SlowResistance(): number {
		return this.ModifierManager.SlowResistance
	}
	/** @deprecated use HasVisualShield */
	public get IsShield(): boolean {
		return this.HasVisualShield
	}
	public get IsFlyingVisually(): boolean {
		return this.ShouldDoFlyHeightVisual
	}
	public get IsGloballyTargetable(): boolean {
		return false
	}
	public get ShouldUnifyOrders(): boolean {
		return true
	}
	public get HealthBarSize(): Vector2 {
		return new Vector2(ScaleHeight(78), ScaleHeight(6))
	}
	public get HealthBarPositionCorrection(): Vector2 {
		return new Vector2(this.HealthBarSize.x / 2, ScaleHeight(11))
	}
	public get HeroFacet(): string {
		return ""
	}
	public get IsConvertManaCostToHPCost(): boolean {
		return this.ModifierManager.IsConvertManaCostToHPCost
	}
	public IsMagicAttackDamage(target: Unit): boolean {
		return this.ModifierManager.GetAttackDamageConvertPhysicalToMagical(target)
	}
	public get IsAvoidTotalDamage(): boolean {
		return this.ModifierManager.IsAvoidTotalDamage
	}
	/**
	 * @description example: panorama/images/heroes/npc_dota_hero_windrunner_png.vtex_c
	 */
	public TexturePath(small?: boolean, team = this.Team): Nullable<string> {
		return GetUnitTexture(this.Name, small, team)
	}
	public IsAbsoluteNoDamage(damageType: DAMAGE_TYPES, target: Unit): boolean {
		return this.ModifierManager.GetAbsoluteNoDamage(damageType, target)
	}
	public IsVisibleForEnemies(method: number = 0, seconds: number = 2): boolean {
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
	public GetMagicalDamageResist(ignoreMagicResist: boolean = false): number {
		return this.ModifierManager.GetMagicResistance(
			this.BaseMagicalResist,
			ignoreMagicResist
		)
	}
	public GetMoveSpeedModifier(
		baseSpeed: number = this.BaseMoveSpeed,
		isUnslowable: boolean = false
	): number {
		return this.ModifierManager.GetMoveSpeed(baseSpeed, isUnslowable)
	}
	public GetAttackRangeModifier(
		baseAttackRange: number = this.BaseAttackRange
	): number {
		return this.ModifierManager.GetAttackRange(baseAttackRange)
	}
	public GetCastRangeBonus(baseCastRange: number): number {
		return this.ModifierManager.GetCastRangeBonus(baseCastRange)
	}
	public GetAttackSpeedModifier(
		baseAttackSpeed: number = this.BaseAttackSpeedIncrease
	): number {
		return this.ModifierManager.GetAttackSpeed(baseAttackSpeed)
	}
	public GetPhysicalArmorModifier(baseArmor: number = this.BaseArmor): number {
		return this.ModifierManager.GetPhysicalArmor(baseArmor)
	}
	public GetPredictiveArmorModifier(target: Unit): number {
		return this.ModifierManager.GetPredictiveArmor(target)
	}
	public GetPhysicalDamageResist(predictiveArmor: number = 0): number {
		return GetArmorResistInternal(this.Armor + predictiveArmor)
	}
	public GetAttackDamageBase(damageValue?: ATTACK_DAMAGE_STRENGTH): number {
		switch (damageValue) {
			default:
			case ATTACK_DAMAGE_STRENGTH.DAMAGE_MIN:
				return this.AttackDamageMin
			case ATTACK_DAMAGE_STRENGTH.DAMAGE_AVG:
				return this.AttackDamageAverage
			case ATTACK_DAMAGE_STRENGTH.DAMAGE_MAX:
				return this.AttackDamageMax
		}
	}
	public GetAttackDamageBonus(baseDamage?: number, target?: Unit): number {
		return this.ModifierManager.GetPreAttackDamageBonus(baseDamage, target)
	}
	public GetEffectiveIncomingDamage(target: Unit, damageType: DAMAGE_TYPES): number {
		return this.ModifierManager.GetIncomingDamage(target, damageType)
	}
	public GetEffectiveOutgoingDamage(target: Unit, damageType: DAMAGE_TYPES): number {
		return this.ModifierManager.GetOutgoingDamage(target, damageType)
	}
	public GetTimeVisionModifier(
		baseVision: number,
		isNight: boolean,
		ignoreFixedVision: boolean = false
	): number {
		return this.ModifierManager.GetTimeVisionRange(
			baseVision,
			isNight,
			ignoreFixedVision
		)
	}
	public GetNextAttackPoint(delay: number, nth = 0): number {
		const baseAttackPoint = this.AttackPoint
		let attackPoint =
			this.IsInAnimation && this.LastAnimationIsAttack
				? this.LastAnimationRawCastPoint
				: baseAttackPoint
		if (
			!(this.IsInAnimation && this.LastAnimationIsAttack) &&
			this.AttackTimeAtLastTick !== 0 &&
			GameState.RawServerTime + delay - this.AttackTimeAtLastTick <
				this.SecondsPerAttack
		) {
			attackPoint -= this.AttackTimeLostToLastTick
		}
		for (let i = 0; i < nth; i++) {
			const lost =
				Math.ceil(attackPoint / GameState.TickInterval) * GameState.TickInterval -
				attackPoint
			attackPoint = baseAttackPoint - lost
		}
		return Math.ceil(attackPoint / GameState.TickInterval) * GameState.TickInterval
	}
	public GetProjectileStartingPosition(
		activity: GameActivity,
		seqVariant: number,
		attackPoint: number,
		hasteFactor: number,
		pos: Vector3,
		ang: QAngle,
		scale?: number
	): Vector3 {
		return this.GetAttachmentPosition(
			activity === GameActivity.ACT_DOTA_ATTACK
				? "attach_attack1"
				: "attach_attack2",
			activity,
			seqVariant,
			Math.max(attackPoint - GameState.TickInterval, 0) *
				QuantizePlaybackRate(hasteFactor),
			pos,
			ang,
			scale
		)
	}
	public CanMove(
		checkChanneling: boolean = true,
		checkAbilityPhase: boolean = true
	): boolean {
		if (this.IsRooted || this.IsStunned || !this.IsSpawned) {
			return false
		}
		if (this.IsInvulnerable && !this.IsFountainInvulnerable) {
			return false
		}
		if (checkChanneling && this.IsChanneling) {
			return false
		}
		if (checkAbilityPhase && this.IsInAbilityPhase) {
			return false
		}
		if (this.IgnoreMoveAndAttackOrders) {
			return false
		}
		return this.HasMoveCapability()
	}
	public CanAttack(
		target?: Unit,
		checkChanneling: boolean = true,
		checkAbilityPhase: boolean = true,
		additionalRange?: number,
		checkAttackRange?: boolean
	): boolean {
		if (checkChanneling && this.IsChanneling) {
			return false
		}
		if (checkAbilityPhase && this.IsInAbilityPhase) {
			return false
		}
		if (target === undefined) {
			return this.IsAttackReady && !this.IsAttackImpaired
		}
		if (this === target || !this.IsAlive || !this.IsSpawned || this.IsDisarmed) {
			return false
		}
		if (!target.IsAlive || !target.IsSpawned || !target.IsVisible) {
			return false
		}
		if (target.IsInvulnerable || target.IsUntargetable) {
			return false
		}
		if (!this.CanHitAttackImmune(target)) {
			return false
		}
		const distance = this.Distance2D(target),
			attackRange = this.GetAttackRange(target, additionalRange)
		if ((checkAttackRange ?? true) && distance > attackRange) {
			return false
		}
		return this.IsAttackReady && !this.IsAttackImpaired
	}
	public CanHitAttackImmune(target: Unit): boolean {
		return !target.IsAttackImmune || this.IsMagicAttackDamage(target)
	}
	/** @deprecated - use custom logic in script */
	public HealthBarPosition(
		useHpBarOffset = true,
		overridePosition?: Vector3
	): Nullable<Vector2> {
		// if (RendererSDK.IsInDraw) {
		// 	throw "HealthBarPosition outside in draw"
		// }
		const position = (overridePosition ?? this.Position).Clone()
		if (
			(this.IsFogVisible || this.HideHud) &&
			this.FogVisiblePosition.IsValid &&
			!this.IsVisible
		) {
			position.CopyFrom(this.FogVisiblePosition)
		}
		if (useHpBarOffset) {
			position.AddScalarZ(this.HealthBarOffset)
		}
		const screenPosition = RendererSDK.WorldToScreen(position)
		if (screenPosition === undefined) {
			return undefined
		}
		if (this.HasVisualShield) {
			screenPosition.AddScalarY(5)
		}
		return screenPosition.SubtractForThis(this.HealthBarPositionCorrection)
	}
	public GetAttackRange(
		target?: Entity,
		additional: number = 0,
		includeHull: boolean = true
	): number {
		let tRadius = target?.RingRadius ?? 0
		if (target instanceof Unit) {
			tRadius = target.HullRadius
		}
		const hullRadius = includeHull ? this.HullRadius + tRadius : 0
		return this.GetAttackRangeModifier() + hullRadius + additional
	}
	public GetDamageBlock(
		damage: number,
		damageType: DAMAGE_TYPES,
		isRaw: boolean = false
	): number {
		return this.ModifierManager.GetDamageBlock(damage, damageType, isRaw)
	}
	public GetPassiveDamageBlock(damageType: DAMAGE_TYPES): number {
		return this.ModifierManager.GetPassiveDamageBlock(damageType)
	}
	public GetEffectiveDamageResist(
		target: Unit,
		ignoreMagicAttack: boolean = false,
		predictiveArmor?: number
	): number {
		if (!ignoreMagicAttack && this.IsMagicAttackDamage(target)) {
			return 1 - target.MagicalDamageResist
		}
		if (target.IsEthereal) {
			return 0
		}
		const predictive = this.GetPredictiveArmorModifier(target)
		return 1 - target.GetPhysicalDamageResist(predictive + (predictiveArmor ?? 0))
	}
	public GetIncomingAttackDamage(target: Unit, isRaw: boolean): number {
		return this.ModifierManager.GetIncomingAttackDamage(target, isRaw)
	}
	public GetRawAttackDamage(
		target: Unit,
		damageValueType?: ATTACK_DAMAGE_STRENGTH,
		critMulDamage?: number
	): number {
		let rawDamage = this.GetAttackDamageBonus(
			this.GetAttackDamageBase(damageValueType),
			target
		)
		if (!this.IsSuppressCrit) {
			rawDamage *= critMulDamage || 1
		}
		return rawDamage
	}
	public GetAttackDamageTypeResist(target: Unit, damageType: DAMAGE_TYPES): number {
		let resist = 1
		let damage = this.ModifierManager.GetProcAttackDamageBonus(target, damageType)
		switch (damageType) {
			case DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL:
				resist *= 1 - target.MagicalDamageResist
				break
		}
		if (this.IsMagicAttackDamage(target)) {
			damage *= this.EffSpellAmp
		}
		damage -= target.GetDamageBlock(damage, damageType, true)
		damage *= target.GetEffectiveIncomingDamage(this, damageType)
		return Math.max(damage * resist - target.GetDamageBlock(damage, damageType), 0)
	}
	public GetAttackDamagePure(target: Unit): number {
		return this.GetAttackDamageTypeResist(target, DAMAGE_TYPES.DAMAGE_TYPE_PURE)
	}
	public GetAttackDamageMagic(target: Unit): number {
		return this.GetAttackDamageTypeResist(target, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
	}
	public GetAttackDamage(
		target: Unit,
		damageValue?: ATTACK_DAMAGE_STRENGTH,
		overrideRawDamage?: number,
		damageType?: DAMAGE_TYPES,
		predictedArmor?: number,
		canDamageBlockMelee?: boolean
	): number {
		damageType ??= this.AttackDamageType(target)
		if (target.IsAvoidTotalDamage || target.IsAbsoluteNoDamage(damageType, this)) {
			return 0
		}
		overrideRawDamage ??= this.GetRawAttackDamage(target, damageValue)
		if (overrideRawDamage === 0) {
			return 0
		}
		const isMagicAttack = this.IsMagicAttackDamage(target)
		if ((canDamageBlockMelee ?? true) && !isMagicAttack) {
			overrideRawDamage -= target.GetPassiveDamageBlock(damageType)
		}
		if (!this.IsSuppressCrit) {
			overrideRawDamage *= target.ModifierManager.GetCritDamageBonusTarget(this)
		}
		overrideRawDamage *= isMagicAttack
			? this.EffSpellAmp
			: target.GetIncomingAttackDamage(this, true)
		overrideRawDamage -= target.GetDamageBlock(overrideRawDamage, damageType, true)

		const damageAmpType = DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
			amp = target.GetDamageAmplification(this, damageAmpType, predictedArmor)

		const calculatedDamage = overrideRawDamage * amp,
			damageBlock = target.GetDamageBlock(calculatedDamage, damageType)

		const pureDamage = this.GetAttackDamagePure(target),
			magicDamage = this.GetAttackDamageMagic(target)

		const totalDamage = calculatedDamage + magicDamage + pureDamage,
			incomingDamage = target.GetIncomingAttackDamage(this, false)

		return Math.max(totalDamage * incomingDamage - damageBlock, 0)
	}
	public GetDamageAmplification(
		source: Unit,
		damageType: DAMAGE_TYPES,
		predictiveArmor: number = 0,
		ignoreMagicResist: boolean = false,
		ignoreMagicAttack: boolean = false
	): number {
		let totalAmp = 1
		switch (damageType) {
			case DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL:
				totalAmp *= 1 - this.GetMagicalDamageResist(ignoreMagicResist)
				break
			case DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL: {
				totalAmp *= source.ModifierManager.GetCritDamageBonus(this)
				totalAmp *= source.GetEffectiveDamageResist(
					this,
					ignoreMagicAttack,
					predictiveArmor
				)
				break
			}
		}
		totalAmp *= this.GetEffectiveIncomingDamage(source, damageType)
		totalAmp *= source.GetEffectiveOutgoingDamage(this, damageType)
		return totalAmp
	}
	public GetDamageSpellEmpower(target: Unit): number {
		let modifier: Nullable<modifier_item_angels_demise | modifier_item_phylactery> =
			this.GetBuffByClass(modifier_item_angels_demise)
		if (modifier === undefined) {
			modifier = this.GetBuffByClass(modifier_item_phylactery)
		}
		if (modifier === undefined || modifier.CachedTotalSpells === 0) {
			return 0
		}
		return (
			modifier.CachedBonusDamage *
			this.EffSpellAmp *
			target.EffSpellAmpTarget *
			target.GetDamageAmplification(this, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
		)
	}
	public VelocityWaypoint(delay: number, movespeed: number = this.MoveSpeed): Vector3 {
		return this.InFront(movespeed * delay)
	}
	public GetItemByName(name: string | RegExp, includeBackpack = false): Nullable<Item> {
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
	 * @internal
	 * @deprecated
	 */
	public ForwardNativeProperties(healthBarOffset: number): void {
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
	public GetBuffByClass<T extends Modifier>(class_: Constructor<T>): Nullable<T> {
		return this.Buffs.find(modifier => modifier instanceof class_) as Nullable<T>
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
	 * @description faster (Distance <= range)
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
	/** ================================ Turn Time ======================================= */
	public GetTurnTime(
		angle: number | Vector3,
		currentTurnRate: boolean = true,
		rotationDiff: boolean = false
	): number {
		if (angle instanceof Vector3) {
			angle = this.GetAngle(angle, rotationDiff)
		}
		return this.TurnTime(angle, currentTurnRate)
	}
	public GetRotationTime(vec: Vector3, currentTurnRate = true): number {
		const turnRad = Math.PI - 0.25
		const ang = this.FindRotationAngle(vec)
		return ang <= turnRad ? (30 * ang) / this.TurnRate(currentTurnRate) : 0
	}
	public TurnRate(currentTurnRate: boolean = true): number {
		return currentTurnRate ? this.MovementTurnRate : this.BaseTurnRate || 0.5
	}
	public TurnTime(angle: number, currentTurnRate: boolean = true): number {
		return Math.max(angle / (30 * this.TurnRate(currentTurnRate)), 0)
	}
	public TurnTimeNew(
		target: Vector3,
		movement: boolean,
		directionalMovement: boolean = false,
		currentTurnRate: boolean = true
	): number {
		let targetAng = 0
		let angDiff = Math.radianToDegrees(this.GetAngle(target, false))
		const turnData = GetTurnData(this.TurnRate(currentTurnRate))
		if (!directionalMovement) {
			targetAng = movement
				? GetAngleToFacePath(turnData, angDiff)
				: GetCastAngle(turnData, angDiff, this.Position.DistanceSqr2D(target))
		}
		let time = 0,
			yawVelocity = this.YawVelocity
		while (angDiff > targetAng) {
			const [change, yawVelocityNew] = UpdateFacing(
				turnData,
				yawVelocity,
				angDiff,
				GameState.TickInterval
			)
			angDiff -= change
			yawVelocity = yawVelocityNew
			time += GameState.TickInterval
		}
		return time
	}
	public IsInside(vec: Vector3, radius: number): boolean {
		const position = this.Position
		const direction = this.Forward

		const distance = vec.Distance2D(position)
		const steps = Math.floor(distance / radius) + 1

		for (let i = steps; i-- > 0; ) {
			const offset = i * radius
			const targetPos = new Vector3(
				vec.x - direction.x * offset,
				vec.y - direction.y * offset,
				vec.z - direction.z * offset
			)
			if (position.Distance2D(targetPos) <= radius) {
				return true
			}
		}
		return false
	}
	public IsManaEnough(abil: Ability): boolean {
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

		// TODO: move to modifiers
		if (this.HasScepter) {
			ar.push("ultimate_scepter")
		}
		if (this.HasBuffByName("modifier_roshan_inherent_buffs")) {
			ar.push("roshan")
		}
		if (this.HasBuffByName("modifier_monkey_king_unperched_stunned")) {
			ar.push("unperched_stunned")
		}
		if (this.HasBuffByName("modifier_monkey_king_fur_army_soldier")) {
			ar.push("fur_army_soldier")
		}
		if (this.HasBuffByName("modifier_monkey_king_bounce_perch")) {
			ar.push("perch")
		}
		if (this.HasBuffByName("modifier_batrider_firefly")) {
			ar.push("firefly")
		}
		if (this.HasBuffByName("modifier_monkeyking_cloudrun")) {
			ar.push("cloudrun")
		}
		if (this.HasBuffByName("modifier_monkeyking_cloudrunstart")) {
			ar.push("cloudrun_start")
		}
		if (this.HasBuffByName("modifier_phantom_assassin_phantom_strike")) {
			ar.push("phantom_attack")
		}
		{
			const mod = this.GetBuffByName("modifier_sven_warcry")
			if (mod !== undefined && mod.Caster === mod.Parent) {
				ar.push("sven_warcry")
			}
		}
		if (this.HasBuffByName("modifier_winter_wyvern_arctic_burn_flight")) {
			ar.push("flying")
		}

		const attackSpeed = this.AttackSpeed
		const asMod = this.UnitData.AttackSpeedActivityModifiers.find(
			mod => attackSpeed >= mod[0]
		)
		if (asMod !== undefined) {
			ar.push(asMod[1])
		}

		const moveSpeed = this.MoveSpeed
		const msMod = this.UnitData.MovementSpeedActivityModifiers.find(
			mod => moveSpeed >= mod[0]
		)
		if (msMod !== undefined) {
			ar.push(msMod[1])
		}

		// TODO: AttackRangeActivityModifiers
	}

	public GetAnimationID(
		activity = this.NetworkActivity,
		sequenceNum = this.NetworkSequenceIndex,
		findBestMatch = true
	): Nullable<number> {
		return super.GetAnimationID(activity, sequenceNum, findBestMatch)
	}

	public GetAnimation(
		activity = this.NetworkActivity,
		sequenceNum = this.NetworkSequenceIndex,
		findBestMatch = true
	): Nullable<AnimationData> {
		return super.GetAnimation(activity, sequenceNum, findBestMatch)
	}

	public GetAttachmentPosition(
		name: string,
		activity = this.NetworkActivity,
		sequenceNum = this.NetworkSequenceIndex,
		time = this.AnimationTime,
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

	public GetPredictionPosition(
		delay = 0,
		useUntilWall = true,
		forceMovement = false
	): Vector3 {
		if (!forceMovement && (!this.IsMoving || delay <= 0)) {
			return this.Position
		}
		if (!useUntilWall) {
			return this.VelocityWaypoint(delay, this.MoveSpeed)
		}
		return this.ExtendUntilWall(this.Position, this.Forward, delay * this.MoveSpeed)
	}

	public ChangeFieldsByEvents(): void {
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
			const hasScepter =
				Modifier.HasScepterBuff(buffs) ||
				this.HasItemInInventory("item_ultimate_scepter")

			if ((hasScepter || this.HasStolenScepter) !== lastHasScepter) {
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
		{
			// CanBeHealed
			const lastCanBeHealed = this.CanBeHealed
			const newCanBeHealed = Modifier.CanBeHealed(buffs)
			if (newCanBeHealed !== lastCanBeHealed) {
				this.CanBeHealed = newCanBeHealed
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
	): void {
		if (
			checkAutoCast &&
			ability.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST) &&
			!ability.IsAutoCastEnabled
		) {
			this.CastToggleAuto(ability, queue, showEffects)
			return
		}

		if (
			checkToggled &&
			ability.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_TOGGLE) &&
			!ability.IsToggled
		) {
			this.CastToggle(ability, queue, showEffects)
			return
		}

		if (ability.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET)) {
			this.CastNoTarget(ability, queue, showEffects)
			return
		}

		if (ability.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT)) {
			if (target instanceof Entity) {
				target = target.Position
			}
			this.CastPosition(ability, target as Vector3, queue, showEffects)
			return
		}

		if (
			ability.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET)
		) {
			this.CastTarget(ability, target as Entity, showEffects)
		}
	}

	public MoveTo(position: Vector3, queue?: boolean, showEffects?: boolean): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION,
			issuers: [this],
			position,
			queue,
			showEffects,
			isPlayerInput: false
		})
	}

	public MoveToTarget(
		target: Entity | number,
		queue?: boolean,
		showEffects?: boolean
	): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_TARGET,
			issuers: [this],
			target,
			queue,
			showEffects,
			isPlayerInput: false
		})
	}

	public AttackMove(position: Vector3, queue?: boolean, showEffects?: boolean): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE,
			issuers: [this],
			position,
			queue,
			showEffects,
			isPlayerInput: false
		})
	}

	public AttackTarget(
		target: Entity | number,
		queue?: boolean,
		showEffects?: boolean
	): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET,
			issuers: [this],
			target,
			queue,
			showEffects,
			isPlayerInput: false
		})
	}

	public CastPosition(
		ability: Ability,
		position: Vector3,
		queue?: boolean,
		showEffects?: boolean
	): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
			issuers: [this],
			ability,
			position,
			queue,
			showEffects,
			isPlayerInput: false
		})
	}

	public PurchaseItem(itemID: number, queue?: boolean, showEffects?: boolean): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_PURCHASE_ITEM,
			issuers: [this],
			ability: itemID,
			queue,
			showEffects,
			isPlayerInput: false
		})
	}

	public CastTarget(
		ability: Ability,
		target: Entity | number,
		queue?: boolean,
		showEffects?: boolean
	): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
			issuers: [this],
			target,
			ability,
			queue,
			showEffects,
			isPlayerInput: false
		})
	}

	public CastTargetTree(
		ability: Ability,
		tree: Tree | TempTree | number,
		queue?: boolean,
		showEffects?: boolean
	): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET_TREE,
			issuers: [this],
			target: tree,
			ability,
			queue,
			showEffects,
			isPlayerInput: false
		})
	}

	public CastNoTarget(ability: Ability, queue?: boolean, showEffects?: boolean): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
			issuers: [this],
			ability,
			queue,
			showEffects,
			isPlayerInput: false
		})
	}

	public CastToggle(ability: Ability, queue?: boolean, showEffects?: boolean): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE,
			issuers: [this],
			ability,
			queue,
			showEffects,
			isPlayerInput: false
		})
	}

	public CastAltToggle(ability: Ability, queue?: boolean, showEffects?: boolean): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_ALT,
			issuers: [this],
			ability,
			queue,
			showEffects,
			isPlayerInput: false
		})
	}

	public HoldPosition(position: Vector3, queue?: boolean, showEffects?: boolean): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_HOLD_POSITION,
			issuers: [this],
			position,
			queue,
			showEffects,
			isPlayerInput: false
		})
	}

	public TrainAbility(ability: Ability): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_TRAIN_ABILITY,
			issuers: [this],
			ability,
			isPlayerInput: false
		})
	}

	public DropItemAtFountain(
		item: Item,
		queue?: boolean,
		showEffects?: boolean,
		slot?: DOTAScriptInventorySlot
	): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_DROP_ITEM_AT_FOUNTAIN,
			issuers: [this],
			target: slot,
			ability: item,
			queue,
			showEffects,
			isPlayerInput: false
		})
	}

	public DropItem(
		item: Item,
		position: Vector3,
		queue?: boolean,
		showEffects?: boolean
	): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_DROP_ITEM,
			issuers: [this],
			ability: item,
			position,
			queue,
			showEffects,
			isPlayerInput: false
		})
	}

	public GiveItem(
		item: Item,
		target: Entity | number,
		queue?: boolean,
		showEffects?: boolean
	): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_GIVE_ITEM,
			issuers: [this],
			target,
			ability: item,
			queue,
			showEffects,
			isPlayerInput: false
		})
	}

	public PickupItem(
		physicalItem: PhysicalItem | number,
		queue?: boolean,
		showEffects?: boolean
	): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_ITEM,
			issuers: [this],
			target: physicalItem,
			queue,
			showEffects,
			isPlayerInput: false
		})
	}

	public PickupRune(rune: Rune | number, queue?: boolean, showEffects?: boolean): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_RUNE,
			issuers: [this],
			target: rune,
			queue,
			showEffects,
			isPlayerInput: false
		})
	}

	public SellItem(item: Item): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_SELL_ITEM,
			issuers: [this],
			ability: item,
			isPlayerInput: false
		})
	}

	public DisassembleItem(item: Item, queue?: boolean): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_DISASSEMBLE_ITEM,
			issuers: [this],
			ability: item,
			queue,
			isPlayerInput: false
		})
	}

	public ItemSetCombineLock(
		item: Item,
		lock: boolean | number = true,
		queue?: boolean
	): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_SET_ITEM_COMBINE_LOCK,
			issuers: [this],
			ability: item,
			target: (lock as number) + 0,
			queue,
			isPlayerInput: false
		})
	}

	public TakeItemFromNeutralStash(item: Item): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_TAKE_ITEM_FROM_NEUTRAL_ITEM_STASH,
			issuers: [this],
			ability: item,
			isPlayerInput: false
		})
	}

	public MoveItem(item: Item, slot: DOTAScriptInventorySlot): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_ITEM,
			issuers: [this],
			target: slot,
			ability: item,
			isPlayerInput: false
		})
	}

	public CastToggleAuto(item: Ability, queue?: boolean, showEffects?: boolean): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO,
			issuers: [this],
			ability: item,
			queue,
			showEffects,
			isPlayerInput: false
		})
	}

	public OrderStop(queue?: boolean, showEffects?: boolean): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_STOP,
			issuers: [this],
			queue,
			showEffects,
			isPlayerInput: false
		})
	}

	public UnitTaunt(queue?: boolean, showEffects?: boolean): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_TAUNT,
			issuers: [this],
			queue,
			showEffects,
			isPlayerInput: false
		})
	}

	public EjectItemFromStash(item: Item): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_EJECT_ITEM_FROM_STASH,
			issuers: [this],
			ability: item,
			isPlayerInput: false
		})
	}

	public CastRune(
		runeItem: Item | number,
		queue?: boolean,
		showEffects?: boolean
	): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_RUNE,
			issuers: [this],
			target: runeItem,
			queue,
			showEffects,
			isPlayerInput: false
		})
	}

	public PingAbility(ability: Ability): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_PING_ABILITY,
			issuers: [this],
			ability,
			isPlayerInput: false
		})
	}

	public MoveToDirection(
		position: Vector3,
		queue?: boolean,
		showEffects?: boolean
	): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_DIRECTION,
			issuers: [this],
			position,
			queue,
			showEffects,
			isPlayerInput: false
		})
	}

	public Patrol(position: Vector3, queue?: boolean, showEffects?: boolean): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_PATROL,
			issuers: [this],
			position,
			queue,
			showEffects,
			isPlayerInput: false
		})
	}

	public VectorTargetPosition(
		ability: Ability,
		direction: Vector3,
		target?: Nullable<Entity | number>,
		queue?: boolean,
		showEffects?: boolean
	): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_VECTOR_TARGET_POSITION,
			issuers: [this],
			ability,
			target,
			position: direction,
			queue,
			showEffects,
			isPlayerInput: false
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

	public ItemLock(item: Item, state = true): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_SET_ITEM_COMBINE_LOCK,
			issuers: [this],
			ability: item,
			target: state === false ? 0 : undefined,
			isPlayerInput: false
		})
	}

	public OrderContinue(item: Item, queue?: boolean, showEffects?: boolean): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CONTINUE,
			issuers: [this],
			ability: item,
			queue,
			showEffects,
			isPlayerInput: false
		})
	}

	public VectorTargetCanceled(
		position: Vector3,
		queue?: boolean,
		showEffects?: boolean
	): void {
		ExecuteOrder.PrepareOrder({
			orderType: dotaunitorder_t.DOTA_UNIT_ORDER_VECTOR_TARGET_CANCELED,
			issuers: [this],
			position,
			queue,
			showEffects,
			isPlayerInput: false
		})
	}
}

RegisterFieldHandler(Unit, "m_iUnitNameIndex", (unit, newVal) => {
	const oldName = unit.Name
	const newValue = newVal as number
	unit.UnitName_ =
		newValue >= 0 ? (UnitData.GetUnitNameByNameIndex(newValue) ?? "") : ""
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
	unit.PlayerID = newVal as number
	PlayerCustomData.set(unit.PlayerID)
})
RegisterFieldHandler(Unit, "m_hOwnerNPC", (unit, newVal) => {
	unit.OwnerNPC_ = newVal as number
	unit.OwnerNPC = EntityManager.EntityByIndex(unit.OwnerNPC_)
})
RegisterFieldHandler(Unit, "m_bIsIllusion", (unit, newVal) => {
	const oldValue = unit.ModifierManager.IsIllusion_
	if (oldValue !== newVal) {
		unit.ModifierManager.IsIllusion_ = newVal as boolean
		EventsSDK.emit("UnitPropertyChanged", false, unit)
	}
})
RegisterFieldHandler(Unit, "m_iIsControllableByPlayer64", (unit, newVal) => {
	unit.IsControllableByPlayerMask = newVal as bigint
	if (unit.IsValid) {
		EventsSDK.emit("ControllableByPlayerMaskChanged", false, unit)
	}
})
RegisterFieldHandler(Unit, "m_vecAbilities", (unit, newVal) => {
	const prevSpells = [...unit.Spells]
	const ar = newVal as number[]
	for (let i = 0; i < ar.length; i++) {
		unit.Spells_[i] = ar[i]
		const ent = EntityManager.EntityByIndex(ar[i])
		if (ent instanceof Ability) {
			ent.Owner_ = unit.Handle
			ent.OwnerEntity = unit
			ent.AbilitySlot = ent.IsHidden ? EAbilitySlot.DOTA_SPELL_SLOT_HIDDEN : i
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
			ent.ItemSlot = i
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
	for (const ent of unit.MyWearables) {
		ent.Parent_ = 0
		const prevParentEnt = ent.ParentEntity
		if (prevParentEnt !== undefined) {
			prevParentEnt.Children.remove(ent)
			ent.ParentEntity = undefined
			ent.UpdatePositions()
		}
	}

	unit.MyWearables_ = newVal as number[]
	unit.MyWearables = unit.MyWearables_.map(id =>
		EntityManager.EntityByIndex<Wearable>(id)
	).filter(ent => ent !== undefined)

	for (const ent of unit.MyWearables) {
		ent.Parent_ = unit.Handle
		const prevParentEnt = ent.ParentEntity
		if (unit !== prevParentEnt) {
			if (prevParentEnt !== undefined) {
				prevParentEnt.Children.remove(ent)
			}
			unit.Children.push(ent)
			ent.ParentEntity = unit
			ent.UpdatePositions()
		}
	}
})
RegisterFieldHandler<Unit, number>(Unit, "m_anglediff", (unit, newVal) => {
	const oldValue = unit.RotationDifference
	if (oldValue !== newVal) {
		unit.RotationDifference = newVal
	}
})
RegisterFieldHandler<Unit, number>(Unit, "m_hNeutralSpawner", (unit, newVal) => {
	unit.Spawner_ = newVal
	const ent = EntityManager.EntityByIndex(unit.Spawner_)
	if (ent instanceof NeutralSpawner) {
		unit.Spawner = ent
	}
})
RegisterFieldHandler<Unit, number>(Unit, "m_iAttackCapabilities", (unit, newVal) => {
	if (unit.AttackCapabilities !== newVal) {
		unit.AttackCapabilities = newVal
		EventsSDK.emit("UnitPropertyChanged", false, unit)
	}
})
RegisterFieldHandler<Unit, boolean>(Unit, "m_bIsClone", (unit, newVal) => {
	if (unit.ModifierManager.IsClone_ !== newVal) {
		unit.ModifierManager.IsClone_ = newVal
		EventsSDK.emit("UnitPropertyChanged", false, unit)
	}
})
RegisterFieldHandler<Unit, number>(Unit, "m_iCurrentLevel", (unit, newVal) => {
	const oldValue = unit.Level
	if (oldValue !== newVal) {
		unit.Level = newVal
		EventsSDK.emit("UnitLevelChanged", false, unit)
	}
})
RegisterFieldHandler<Unit, bigint>(Unit, "m_nUnitState64", (unit, newVal) => {
	const oldValue = unit.UnitStateNetworked,
		newValue = ReencodeProperty(newVal, EPropertyType.UINT64)
	if (oldValue !== newValue) {
		unit.UnitStateNetworked = newVal
		EventsSDK.emit("UnitStateChanged", false, unit)
	}
})
RegisterFieldHandler<Unit, boolean>(Unit, "m_bIsWaitingToSpawn", (unit, newValue) => {
	if (unit.IsWaitingToSpawn !== newValue) {
		unit.IsWaitingToSpawn = newValue
		EventsSDK.emit("UnitPropertyChanged", false, unit)
	}
})
export const Units = EntityManager.GetEntitiesByClass(Unit)

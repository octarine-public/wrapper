import { QAngle } from "../../Base/QAngle"
import { Vector3 } from "../../Base/Vector3"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { ABILITY_TYPES } from "../../Enums/ABILITY_TYPES"
import { DAMAGE_TYPES } from "../../Enums/DAMAGE_TYPES"
import { DOTA_ABILITY_BEHAVIOR } from "../../Enums/DOTA_ABILITY_BEHAVIOR"
import { DOTA_UNIT_TARGET_FLAGS } from "../../Enums/DOTA_UNIT_TARGET_FLAGS"
import { DOTA_UNIT_TARGET_TEAM } from "../../Enums/DOTA_UNIT_TARGET_TEAM"
import { DOTA_UNIT_TARGET_TYPE } from "../../Enums/DOTA_UNIT_TARGET_TYPE"
import { EAbilitySlot } from "../../Enums/EAbilitySlot"
import { EDOTASpecialBonusStats } from "../../Enums/EDOTASpecialBonusStats"
import { EModifierfunction } from "../../Enums/EModifierfunction"
import { EPropertyType } from "../../Enums/PropertyType"
import { SPELL_DISPELLABLE_TYPES } from "../../Enums/SPELL_DISPELLABLE_TYPES"
import { SPELL_IMMUNITY_TYPES } from "../../Enums/SPELL_IMMUNITY_TYPES"
import { EventsSDK } from "../../Managers/EventsSDK"
import { IPrediction } from "../../Managers/Prediction/IPrediction"
import { ExecuteOrder } from "../../Native/ExecuteOrder"
import { RegisterFieldHandler } from "../../Objects/NativeToSDK"
import { GameState } from "../../Utils/GameState"
import { toPercentage } from "../../Utils/Math"
import { QuantizePlaybackRate } from "../../Utils/QuantizeUtils"
import { AbilityData } from "../DataBook/AbilityData"
import { modifier_crystal_maiden_arcane_overflow_active } from "../Modifiers/Abilities/CrystalMaiden/modifier_crystal_maiden_arcane_overflow_active"
import { modifier_rubick_spell_steal } from "../Modifiers/Abilities/Rubick/modifier_rubick_spell_steal"
import { Entity } from "./Entity"
import { Unit } from "./Unit"

@WrapperClass("CDOTABaseAbility")
export class Ability extends Entity {
	public readonly AbilityData: AbilityData
	@NetworkedBasicField("m_bInIndefiniteCooldown")
	public readonly IsInIndefiniteCooldown: boolean = false
	@NetworkedBasicField("m_nMaxLevelOverride")
	public readonly MaxLevelOverride: number = -1
	@NetworkedBasicField("m_bActivated")
	public readonly IsActivated: boolean = false
	@NetworkedBasicField("m_bAltCastState")
	public readonly AltCastState: boolean = false
	@NetworkedBasicField("m_bAutoCastState")
	public readonly IsAutoCastEnabled: boolean = false
	@NetworkedBasicField("m_bFrozenCooldown")
	public readonly IsCooldownFrozen: boolean = false
	@NetworkedBasicField("m_bReplicated")
	public readonly IsReplicated: boolean = false
	@NetworkedBasicField("m_bStolen")
	public readonly IsStolen: boolean = false
	@NetworkedBasicField("m_iManaCost")
	public readonly NetworkedManaCost: number = 0
	@NetworkedBasicField("m_flOverrideCastPoint")
	public readonly OverrideCastPoint: number = -1
	@NetworkedBasicField("m_flCastStartTime")
	public readonly CastStartTime: number = 0
	@NetworkedBasicField("m_bToggleState")
	public readonly IsToggled: boolean = false
	@NetworkedBasicField("m_iDirtyButtons")
	public readonly DirtyButtons: number = 0
	@NetworkedBasicField("m_bGrantedByFacet")
	public readonly GrantedByFacet: boolean = false
	@NetworkedBasicField("m_bStealable")
	public readonly IsStealable: boolean = false
	@NetworkedBasicField("m_nHeroFacetKey", EPropertyType.UINT32)
	public readonly HeroFacetKey: number = -1

	public Level = 0
	public IsEmpty = false
	public IsAbility = true
	public IsHidden = false
	public ChannelStartTime = 0
	public AbilityChargeRestoreTimeRemaining = 0
	/** @deprecated use by index */
	public AbilitySlot = EAbilitySlot.DOTA_SPELL_SLOT_HIDDEN
	public Prediction: Nullable<IPrediction>

	/** @private NOTE: this is internal field, use IsInAbilityPhase */
	public IsInAbilityPhase_ = false
	public IsInAbilityPhaseChangeTime = 0

	/** @private NOTE: this is internal field, use Owner or Cooldown */
	public Cooldown_ = 0
	public CooldownChangeTime = 0

	/** @private NOTE: this is internal field, use CooldownRestore */
	public CooldownRestore_ = 0
	public CooldownRestoreTime = 0

	/**@deprecated */
	public readonly ProjectilePath: Nullable<string>

	/**@private fields */
	@NetworkedBasicField("m_nAbilityCurrentCharges")
	private abilityCurrentCharges: number = 0
	@NetworkedBasicField("m_flCooldownLength")
	private readonly cooldownLength_: number = 0

	constructor(index: number, serial: number, name: string) {
		super(index, serial)
		this.Name_ = name
		this.AbilityData = AbilityData.globalStorage.get(name) ?? AbilityData.empty
	}
	public get ProjectileAttachment(): string {
		return "attach_hitloc"
	}
	public get CastDelay() {
		return this.CastPoint + GameState.InputLag
	}
	public get IsInvisibility(): boolean {
		return false
	}
	/** NOTE: @override in child classes */
	public get ShouldBeDrawable(): boolean {
		return (
			this.AbilityData !== AbilityData.empty &&
			!this.IsAttributes &&
			!this.IsInnateHidden &&
			!this.Name.startsWith("seasonal_")
		)
	}
	public get IsUltimate(): boolean {
		return this.AbilityType === ABILITY_TYPES.ABILITY_TYPE_ULTIMATE
	}
	public get IsBreakable(): boolean {
		return this.AbilityData.IsBreakable
	}
	public get IsAttributes(): boolean {
		return this.AbilityType === ABILITY_TYPES.ABILITY_TYPE_ATTRIBUTES
	}
	public get CanHitSpellImmuneEnemy(): boolean {
		switch (this.AbilityImmunityType) {
			case SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_ALLIES_YES:
			case SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_ENEMIES_YES:
				return true
			default:
				return false
		}
	}
	public get CanHitSpellImmuneAlly(): boolean {
		switch (this.AbilityImmunityType) {
			case SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_NONE:
			case SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_ALLIES_YES_ENEMIES_NO:
				return true
			default:
				return this.CanHitSpellImmuneEnemy
		}
	}
	public get CanBeUsable(): boolean {
		return this.IsValid && !this.IsHidden && this.IsActivated
	}
	public get Owner(): Nullable<Unit> {
		return this.OwnerEntity as Nullable<Unit>
	}
	public get OwnerHasShard(): boolean {
		return this.Owner?.HasShard ?? false
	}
	public get OwnerHasScepter(): boolean {
		return this.Owner?.HasScepter ?? false
	}
	public get AbilityBehaviorMask(): DOTA_ABILITY_BEHAVIOR {
		return this.AbilityData.AbilityBehavior
	}
	public get TargetTypeMask(): DOTA_UNIT_TARGET_TYPE {
		return this.AbilityData.TargetType
	}
	public get TargetTeamMask(): DOTA_UNIT_TARGET_TEAM {
		return this.AbilityData.TargetTeam
	}
	public get TargetFlagsMask(): DOTA_UNIT_TARGET_FLAGS {
		return this.AbilityData.TargetFlags
	}
	public get SpellDispellableType(): SPELL_DISPELLABLE_TYPES {
		return this.AbilityData.SpellDispellableType
	}
	public get BonusStatsMask(): EDOTASpecialBonusStats {
		return this.AbilityData.BonusStats
	}
	public get AbilityDamage(): number {
		return this.GetBaseDamageForLevel(this.Level)
	}
	public get AbilityType(): ABILITY_TYPES {
		return this.AbilityData.AbilityType
	}
	public get IsInnate(): boolean {
		return this.AbilityData.IsInnate
	}
	public get IsDispellable(): boolean {
		switch (this.SpellDispellableType) {
			case SPELL_DISPELLABLE_TYPES.SPELL_DISPELLABLE_NONE:
			case SPELL_DISPELLABLE_TYPES.SPELL_DISPELLABLE_YES:
			case SPELL_DISPELLABLE_TYPES.SPELL_DISPELLABLE_YES_STRONG:
				return true
			case SPELL_DISPELLABLE_TYPES.SPELL_DISPELLABLE_NO:
				return false
			default:
				return false
		}
	}
	public get IsInnateHidden(): boolean {
		return this.IsUIInnate || (this.IsInnate && this.DependentOnAbility.length !== 0)
	}
	public get EndRadius(): number {
		// TODO: fix me
		return this.GetSpecialValue("final_aoe")
	}
	public get CastPoint(): number {
		let castPoint = this.OverrideCastPoint
		if (castPoint === -1) {
			castPoint = this.GetCastPointModifier(
				this.GetBaseCastPointForLevel(this.Level)
			)
			if (this.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_ATTACK)) {
				castPoint = this.Owner?.AttackPoint ?? 0
			}
		}
		return Math.ceil(castPoint / GameState.TickInterval) * GameState.TickInterval
	}
	public get ActivationDelay() {
		return this.GetBaseActivationDelayForLevel(this.Level)
	}
	public get MaxChannelTime(): number {
		return this.GetBaseChannelTimeForLevel(this.Level)
	}
	public get ChannelTime(): number {
		return Math.max(GameState.RawGameTime - this.ChannelStartTime, 0)
	}
	public get ChannelEndTime(): number {
		const channelTime = this.ChannelStartTime + this.MaxChannelTime
		return Math.max(channelTime - GameState.RawGameTime, 0)
	}
	public get MaxCharges(): number {
		return this.GetMaxChargesForLevel(this.Level)
	}
	public get MaxChargeRestoreTime(): number {
		return this.GetChargeRestoreTimeForLevel(this.Level)
	}
	public get DamageType(): DAMAGE_TYPES {
		return this.AbilityData.DamageType
	}
	public get ID(): number {
		return this.AbilityData.ID
	}
	public get IsChanneling(): boolean {
		return this.ChannelStartTime > 0 && this.ChannelTime <= this.MaxChannelTime
	}
	public get IsInAbilityPhase(): boolean {
		return (
			this.IsInAbilityPhase_ &&
			GameState.RawGameTime - this.IsInAbilityPhaseChangeTime <= this.CastPoint
		)
	}
	public get CooldownLength(): number {
		const chargeRestoreTime = this.MaxChargeRestoreTime
		if (chargeRestoreTime !== 0) {
			return chargeRestoreTime
		} // workaround of bad m_flCooldownLength, TODO: use cooldown reductions
		return this.cooldownLength_
	}
	public get IsCooldownReady(): boolean {
		return this.Cooldown === 0
	}
	public get IsReady(): boolean {
		return this.Level !== 0 && this.IsCooldownReady && this.IsManaEnough()
	}
	public get BaseManaCost(): number {
		return Math.max(this.NetworkedManaCost, this.GetBaseManaCostForLevel(this.Level))
	}
	public get ManaCost(): number {
		return this.GetManaCostModifier(this.GetHealthCost(this.BaseManaCost))
	}
	public get HealthCost(): number {
		return this.ManaCost
	}
	public get IsGrantedByScepter(): boolean {
		return this.AbilityData.IsGrantedByScepter
	}
	public get IsItem(): boolean {
		return this.AbilityData.IsItem
	}
	public get LevelsBetweenUpgrades(): number {
		return this.AbilityData.LevelsBetweenUpgrades
	}
	public get MaxLevel(): number {
		return this.MaxLevelOverride !== -1
			? this.MaxLevelOverride
			: this.AbilityData.MaxLevel
	}
	public get RequiredLevel(): number {
		return this.AbilityData.RequiredLevel
	}
	public get SharedCooldownName(): string {
		return this.AbilityData.SharedCooldownName
	}
	public get DependentOnAbility(): string {
		return this.AbilityData.DependentOnAbility
	}
	public get AbilityImmunityType(): SPELL_IMMUNITY_TYPES {
		return this.AbilityData.AbilityImmunityType
	}
	public get TargetFlags() {
		return this.AbilityData.TargetFlags.toMask
	}
	public get TargetTeam() {
		return this.AbilityData.TargetTeam.toMask
	}
	public get TargetType() {
		return this.AbilityData.TargetType.toMask
	}
	public get TexturePath(): string {
		return this.AbilityData.GetTexturePath(this.AltCastState, this.Name)
	}
	public get IsPassive(): boolean {
		return this.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE)
	}
	public get IsNotLearnable(): boolean {
		return this.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE)
	}
	public get NoTarget(): boolean {
		return this.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET)
	}
	public get IgnoreBackSwing(): boolean {
		return this.HasBehavior(
			DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING
		)
	}
	public get IsUIInnate(): boolean {
		return this.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_INNATE_UI)
	}
	public get CooldownRestore(): number {
		return Math.max(
			this.CooldownRestore_ - (GameState.RawGameTime - this.CooldownRestoreTime),
			0
		)
	}
	public get Cooldown(): number {
		if (this.IsCooldownFrozen) {
			return this.CooldownLength
		}
		if (!this.CurrentCharges && this.CooldownRestore > 0) {
			return this.CooldownRestore
		}
		return Math.max(
			this.Cooldown_ - (GameState.RawGameTime - this.CooldownChangeTime),
			0
		)
	}
	public get CooldownPercent(): number {
		return !this.CurrentCharges && this.CooldownRestore > 0
			? toPercentage(this.CooldownRestore, this.MaxChargeRestoreTime)
			: toPercentage(this.Cooldown, this.MaxCooldown)
	}
	public get CooldownPercentDecimal(): number {
		return this.CooldownPercent / 100
	}
	public get CooldownDuration(): number {
		return Math.max(
			this.MaxDuration - (GameState.RawGameTime - this.CastStartTime),
			0
		)
	}
	public get CooldownDurationPercent(): number {
		return toPercentage(this.CooldownDuration, this.MaxDuration)
	}
	public get CooldownDurationPercentDecimal(): number {
		return this.CooldownDurationPercent / 100
	}
	public get StackCount(): number {
		return 0
	}
	public get Speed() {
		return this.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_ATTACK)
			? (this.Owner?.BaseAttackProjectileSpeed ?? 0)
			: this.GetBaseSpeedForLevel(this.Level)
	}
	public get MaxDuration(): number {
		return this.GetMaxDurationForLevel(this.Level)
	}
	public get MaxCooldown(): number {
		return this.GetMaxCooldownForLevel(this.Level)
	}
	public get BaseCastRange(): number {
		return this.GetBaseCastRangeForLevel(this.Level)
	}
	public get CastRange(): number {
		if (this.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_ATTACK)) {
			return this.Owner?.GetAttackRange() ?? 0
		}
		const baseCastRange = this.BaseCastRange
		if (baseCastRange === 0 || baseCastRange === -1) {
			return 0
		}
		return this.GetCastRangeModifier(baseCastRange)
	}
	public get AOERadius(): number {
		return this.GetBaseAOERadiusForLevel(this.Level)
	}
	public get MinAOERadius(): number {
		return this.GetBaseMinAOERadiusForLevel(this.Level)
	}
	public get SkillshotRange(): number {
		return this.CastRange
	}
	public get IsCastRangeFake(): boolean {
		return false
	}
	public get UsesRotation() {
		return false
	}
	public get CurrentCharges() {
		return this.abilityCurrentCharges
	}
	public set CurrentCharges(newVal: number) {
		this.abilityCurrentCharges = newVal
	}
	public get SpellAmplify(): number {
		const owner = this.Owner
		if (owner === undefined) {
			return 1
		}
		return (
			this.GetSpellAmpModifierSpellSteal(owner) *
			this.GetSpellAmpModifierBrillianceAura(owner)
		)
	}
	protected get CanBeCastedWhileRooted() {
		return this.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES)
	}
	protected get CanBeCastedWhileStunned() {
		return false
	}
	protected get CanBeCastedWhileSilenced() {
		return false
	}
	public GetProjectileStartingPosition(
		pos: Vector3,
		ang: QAngle,
		scale?: number
	): Vector3 {
		const owner = this.Owner
		if (owner === undefined) {
			return pos
		}
		scale ??= owner.ModelScale
		const playbackRate = QuantizePlaybackRate(1 / Math.sqrt(scale))
		const castAnim = this.AbilityData.CastAnimation
		return owner.GetAttachmentPosition(
			this.ProjectileAttachment,
			castAnim,
			-1,
			Math.max(this.CastPoint - GameState.TickInterval, 0) * playbackRate,
			pos,
			ang,
			scale
		)
	}
	public GetMaxCooldownForLevel(level: number): number {
		if (this.AbilityData.HasMaxCooldownSpecial) {
			return this.GetSpecialValue("AbilityCooldown", level)
		}
		return this.AbilityData.GetMaxCooldownForLevel(level)
	}
	public GetChargeRestoreTimeForLevel(level: number): number {
		if (this.AbilityData.HasChargeRestoreTimeSpecial) {
			return this.GetSpecialValue("AbilityChargeRestoreTime", level)
		}
		return this.AbilityData.GetChargeRestoreTime(level)
	}
	public GetMaxChargesForLevel(level: number): number {
		if (this.AbilityData.HasMaxChargesSpecial) {
			return this.GetSpecialValue("AbilityCharges", level)
		}
		return this.AbilityData.GetMaxCharges(level)
	}
	public GetMaxDurationForLevel(level: number): number {
		if (this.AbilityData.HasMaxDurationSpecial) {
			return this.GetSpecialValue("AbilityDuration", level)
		}
		return this.AbilityData.GetMaxDurationForLevel(level)
	}
	public GetBaseCastPointForLevel(level: number): number {
		if (this.AbilityData.HasCastPointSpecial) {
			return this.GetSpecialValue("AbilityCastPoint", level)
		}
		return this.AbilityData.GetCastPoint(level)
	}
	public GetBaseDamageForLevel(level: number): number {
		if (this.AbilityData.HasAbilityDamageSpecial) {
			return this.GetSpecialValue("AbilityDamage", level)
		}
		return this.AbilityData.GetAbilityDamage(level)
	}
	public GetBaseManaCostForLevel(level: number): number {
		if (this.AbilityData.HasManaCostSpecial) {
			return this.GetSpecialValue("AbilityManaCost", level)
		}
		return this.AbilityData.GetManaCost(level)
	}
	public GetBaseHealthCostForLevel(level: number): number {
		if (this.AbilityData.HasHealthCostSpecial) {
			return this.GetSpecialValue("AbilityHealthCost", level)
		}
		return this.AbilityData.GetHealthCost(level)
	}
	public GetCastRangeForLevel(level: number): number {
		return this.GetBaseCastRangeForLevel(level)
	}
	public GetBaseCastRangeForLevel(level: number): number {
		if (this.AbilityData.HasCastRangeSpecial) {
			return this.GetSpecialValue("AbilityCastRange", level)
		}
		return this.AbilityData.GetCastRange(level)
	}
	public GetBaseActivationDelayForLevel(_level: number): number {
		return 0 // child classes should override
	}
	public GetBaseSpeedForLevel(_level: number): number {
		return 0 // child classes should override
	}
	public GetBaseAOERadiusForLevel(_level: number): number {
		return 0 // child classes should override
	}
	public GetBaseMinAOERadiusForLevel(_level: number): number {
		return 0 // child classes should override
	}
	public GetBaseChannelTimeForLevel(level: number): number {
		if (this.AbilityData.HasChannelTimeSpecial) {
			return this.GetSpecialValue("AbilityChannelTime", level)
		}
		return this.AbilityData.GetChannelTime(level)
	}
	public GetCastDelay(
		unit?: Unit | Vector3,
		movement: boolean = false,
		directionalMovement: boolean = false,
		currentTurnRate: boolean = true
	): number {
		const owner = this.Owner
		if (owner === undefined) {
			return 0
		}
		const delay = this.CastDelay
		if (unit === undefined) {
			return delay
		}
		if (this.NoTarget || (unit instanceof Entity && owner === unit)) {
			return delay
		}
		if (unit instanceof Entity) {
			unit = unit.Position
		}
		const turnTime = owner.TurnTimeNew(
			unit,
			movement,
			directionalMovement,
			currentTurnRate
		)
		return turnTime + delay
	}
	public GetHitTime(
		unit: Unit | Vector3,
		movement: boolean = false,
		directionalMovement: boolean = false,
		currentTurnRate: boolean = true
	): number {
		const owner = this.Owner
		if (owner === undefined) {
			return 0
		}
		const activationDelay = this.ActivationDelay
		if (unit instanceof Entity && owner === unit) {
			return this.CastDelay + activationDelay
		}
		const speed = this.Speed
		const castDelay = this.GetCastDelay(
			unit,
			movement,
			directionalMovement,
			currentTurnRate
		)
		const delay = castDelay + activationDelay
		return speed !== 0 ? owner.Distance2D(unit) / speed + delay : delay
	}
	/**
	 * @description Returns the raw damage of the ability without any amplification
	 */
	public GetRawDamage(_target: Unit): number {
		return this.AbilityDamage
	}
	public GetDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || target.IsAvoidTotalDamage) {
			return 0
		}
		const damageType = this.DamageType
		if (this.IsAbsoluteNoDamage(owner, target, damageType)) {
			return 0
		}
		const ignoreMres = target.IsEnemy(owner)
			? this.CanHitSpellImmuneEnemy
			: this.CanHitSpellImmuneAlly
		let rawDamage = this.GetRawDamage(target)
		if (rawDamage !== 0) {
			rawDamage -= target.GetDamageBlock(rawDamage, damageType, true)
		}
		const effSpellAmp = this.SpellAmplify,
			spellAmp = effSpellAmp * target.EffSpellAmpTarget,
			damageAmp = target.GetDamageAmplification(owner, damageType, 0, ignoreMres),
			totalDamage = rawDamage * damageAmp * spellAmp
		return Math.max(totalDamage - target.GetDamageBlock(totalDamage, damageType), 0)
	}
	public UseAbility(
		target?: Vector3 | Entity,
		checkAutoCast: boolean = false,
		checkToggled: boolean = false,
		queue?: boolean,
		showEffects?: boolean
	) {
		return this.Owner?.UseSmartAbility(
			this,
			target,
			checkAutoCast,
			checkToggled,
			queue,
			showEffects
		)
	}
	public UpgradeAbility() {
		return this.Owner?.TrainAbility(this)
	}
	public PingAbility() {
		return this.Owner?.PingAbility(this)
	}
	public GetSpecialValue(
		specialName: string,
		level: number = this.Level,
		includeFacet = !(this.IsStolen || this.IsReplicated)
	): number {
		const owner = this.Owner,
			abilityData = this.AbilityData
		if (owner === undefined) {
			return abilityData.GetSpecialValue(specialName, level, this.Name)
		}
		return abilityData.GetSpecialValueWithTalent(
			owner,
			specialName,
			level,
			this.Name,
			includeFacet
		)
	}
	public IsManaEnough(bonusMana: number = 0): boolean {
		const owner = this.Owner
		if (owner === undefined) {
			return true
		}
		let mana = owner.IsConvertManaCostToHPCost ? owner.HP : owner.Mana
		if (!owner.IsConvertManaCostToHPCost && bonusMana !== 0) {
			mana += bonusMana
		}
		return mana >= this.ManaCost
	}
	public HasBehavior(flag: DOTA_ABILITY_BEHAVIOR): boolean {
		// don't use AbilityData.HasBehavior() here
		// because it will be overridden by the child classes for AbilityBehaviorMask
		return this.AbilityBehaviorMask.hasMask(flag)
	}
	public HasBonusStats(flag: EDOTASpecialBonusStats): boolean {
		// don't use AbilityData.HasBonusStats() here
		// because it will be overridden by the child classes for BonusStatsMask
		return this.BonusStatsMask.hasMask(flag)
	}
	public HasTargetFlags(flag: DOTA_UNIT_TARGET_FLAGS): boolean {
		// don't use AbilityData.HasTargetFlags() here
		// because it will be overridden by the child classes for TargetFlagsMask
		return this.TargetFlagsMask.hasMask(flag)
	}
	public HasTargetTeam(flag: DOTA_UNIT_TARGET_TEAM): boolean {
		// don't use AbilityData.HasTargetTeam() here
		// because it will be overridden by the child classes for TargetTeamMask
		return this.TargetTeamMask.hasMask(flag)
	}
	public HasTargetType(flag: DOTA_UNIT_TARGET_TYPE): boolean {
		// don't use AbilityData.HasTargetType() here
		// because it will be overridden by the child classes for TargetTypeMask
		return this.TargetTypeMask.hasMask(flag)
	}

	public CanHit(target: Unit | Vector3): boolean {
		if (this.Owner === undefined) {
			return false
		}
		let range = 0
		if (
			!this.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET) &&
			!this.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT)
		) {
			range = this.CastRange
			if (range === 0) {
				range = this.AOERadius
			}
		} else {
			range += this.SkillshotRange + this.Owner.HullRadius
		}
		if (range > 0 && !(target instanceof Vector3)) {
			range += target.HullRadius
		}
		return this.Owner.Distance2D(target) < range
	}
	// TODO: fix and improve me
	public CanBeCasted(bonusMana: number = 0): boolean {
		if (!this.CanBeUsable || !this.IsReady) {
			return false
		}
		const canBeCasted = this.IsManaEnough(bonusMana)
		if (this.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_ATTACK)) {
			return canBeCasted && (this.Owner?.CanAttack() ?? false)
		}
		// TODO: Add other checks
		return canBeCasted
	}
	public IsDoubleTap(_order: ExecuteOrder): boolean {
		return false
	}
	public IsNuke(): this is INuke {
		return false
	}
	public IsBuff(): this is IBuff {
		return false
	}
	public IsShield(): this is IShield {
		return false
	}
	public IsDebuff(): this is IDebuff {
		return false
	}
	public IsHealthCost(): this is IHealthCost {
		return false
	}
	public IsManaRestore(): this is IManaRestore<Unit> {
		return false
	}
	public IsHealthRestore(): this is IHealthRestore<Unit> {
		return false
	}
	public GetHealthCost(baseManaCost: number): number {
		const owner = this.Owner
		if (owner === undefined || !owner.IsConvertManaCostToHPCost) {
			return baseManaCost
		}
		return baseManaCost * (1 - owner.MagicalDamageResist)
	}
	public GetManaCostModifier(baseManaCost: number): number {
		const owner = this.Owner
		if (owner === undefined) {
			return baseManaCost
		}
		const modifierManager = owner.ModifierManager,
			reductionConstant = modifierManager.GetConstantHighestInternal(
				EModifierfunction.MODIFIER_PROPERTY_MANACOST_REDUCTION_CONSTANT
			),
			percentage = modifierManager.GetPercentageHighestInternal(
				EModifierfunction.MODIFIER_PROPERTY_MANACOST_PERCENTAGE
			),
			stacking = modifierManager.GetPercentageMultiplicativeInternal(
				EModifierfunction.MODIFIER_PROPERTY_MANACOST_PERCENTAGE_STACKING
			)
		if (reductionConstant !== 0) {
			baseManaCost = baseManaCost - reductionConstant
		}
		const spellStealReduction = this.GetManaCostModifierSpellSteal(owner)
		return baseManaCost * (2 - stacking) * (2 - percentage) * spellStealReduction
	}
	protected GetCastPointModifier(baseCastPoint: number): number {
		const owner = this.Owner
		if (owner === undefined) {
			return baseCastPoint
		}
		const percentage = owner.ModifierManager.GetPercentageMultiplicativeInternal(
			EModifierfunction.MODIFIER_PROPERTY_CASTTIME_PERCENTAGE
		)
		return baseCastPoint * (2 - percentage)
	}
	protected GetCastRangeModifier(baseCastRange: number): number {
		const owner = this.Owner
		if (owner === undefined) {
			return baseCastRange
		}
		const bonus = owner.ModifierManager.GetConstantHighestInternal(
			EModifierfunction.MODIFIER_PROPERTY_CAST_RANGE_BONUS
		)
		const bonusTarget = owner.ModifierManager.GetConstantHighestInternal(
			EModifierfunction.MODIFIER_PROPERTY_CAST_RANGE_BONUS_TARGET
		)
		const bonusStacking = owner.ModifierManager.GetConditionalAdditiveInternal(
			EModifierfunction.MODIFIER_PROPERTY_CAST_RANGE_BONUS_STACKING,
			false,
			1,
			1
		)
		const bonusPercentage = owner.ModifierManager.GetConditionalPercentageInternal(
			EModifierfunction.MODIFIER_PROPERTY_CAST_RANGE_BONUS_PERCENTAGE,
			false,
			1,
			1
		)
		const bonuses = baseCastRange + (bonus + bonusTarget) + bonusStacking
		const totalResult = bonuses * bonusPercentage
		if (totalResult < 150 && baseCastRange > 0) {
			return 150 - baseCastRange
		}
		return totalResult
	}
	protected GetManaCostModifierSpellSteal(owner: Unit): number {
		if (!this.IsStolen) {
			return 1
		}
		const modifier = owner.GetBuffByClass(modifier_rubick_spell_steal)
		return (100 - (modifier?.CachedManaCostReduction ?? 0)) / 100
	}
	protected GetSpellAmpModifierSpellSteal(owner: Nullable<Unit>): number {
		if (owner === undefined) {
			return 1
		}
		const baseSpellAmp = owner.EffSpellAmp
		if (!this.IsStolen) {
			return baseSpellAmp
		}
		const modifier = owner.GetBuffByClass(modifier_rubick_spell_steal)
		if (modifier === undefined) {
			return baseSpellAmp
		}
		return baseSpellAmp + (1 + modifier.CachedSpellAmpDamage / 100)
	}
	protected GetSpellAmpModifierBrillianceAura(owner: Nullable<Unit>): number {
		if (owner === undefined || this.IsItem) {
			return 1
		}
		const modifier = owner.GetBuffByClass(
			modifier_crystal_maiden_arcane_overflow_active
		)
		if (modifier === undefined) {
			return 1
		}
		return 1 + modifier.CachedSpellAmplify / 100
	}
	protected IsAbsoluteNoDamage(
		source: Unit,
		target: Unit,
		damageType: DAMAGE_TYPES
	): boolean {
		if (!target.IsAbsoluteNoDamage(damageType, source)) {
			return false
		}
		if (target.IsEnemy(source)) {
			return !this.CanHitSpellImmuneEnemy
		}
		return !target.IsEnemy(source) && !this.CanHitSpellImmuneAlly
	}
}

RegisterFieldHandler(
	Ability,
	"m_fAbilityChargeRestoreTimeRemaining",
	(abil, newValue) => {
		const oldValue = abil.CooldownRestore_
		if (oldValue !== newValue) {
			abil.CooldownRestore_ = newValue as number
			abil.CooldownRestoreTime = GameState.RawGameTime
			EventsSDK.emit("AbilityCooldownChanged", false, abil)
		}
	}
)
RegisterFieldHandler(Ability, "m_bHidden", (abil, newValue) => {
	const oldValue = abil.IsHidden
	if (oldValue !== newValue) {
		abil.IsHidden = newValue as boolean
		EventsSDK.emit("AbilityHiddenChanged", false, abil)
	}
})
RegisterFieldHandler(Ability, "m_iLevel", (abil, newValue) => {
	const oldValue = abil.Level
	if (oldValue !== newValue) {
		abil.Level = newValue as number
		EventsSDK.emit("AbilityLevelChanged", false, abil)
	}
})
RegisterFieldHandler(Ability, "m_bInAbilityPhase", (abil, newValue) => {
	const oldValue = abil.IsInAbilityPhase_
	if (oldValue !== newValue) {
		abil.IsInAbilityPhase_ = newValue as boolean
		abil.IsInAbilityPhaseChangeTime = GameState.RawGameTime
		EventsSDK.emit("AbilityPhaseChanged", false, abil)
	}
})
RegisterFieldHandler(Ability, "m_flChannelStartTime", (abil, newValue) => {
	const oldValue = abil.ChannelStartTime
	if (oldValue !== newValue) {
		abil.ChannelStartTime = newValue as number
		EventsSDK.emit("AbilityChannelingChanged", false, abil)
	}
})
RegisterFieldHandler(Ability, "m_fCooldown", (abil, newValue) => {
	const oldValue = abil.Cooldown_
	if (oldValue !== newValue) {
		abil.Cooldown_ = newValue as number
		abil.CooldownChangeTime = GameState.RawGameTime
		EventsSDK.emit("AbilityCooldownChanged", false, abil)
	}
})

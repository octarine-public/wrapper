import { QAngle } from "../../Base/QAngle"
import { Vector3 } from "../../Base/Vector3"
import { GetSpellTexture, GetUnitTexture } from "../../Data/ImageData"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { ABILITY_TYPES } from "../../Enums/ABILITY_TYPES"
import { DAMAGE_TYPES } from "../../Enums/DAMAGE_TYPES"
import { DOTA_ABILITY_BEHAVIOR } from "../../Enums/DOTA_ABILITY_BEHAVIOR"
import { DOTA_UNIT_TARGET_FLAGS } from "../../Enums/DOTA_UNIT_TARGET_FLAGS"
import { DOTA_UNIT_TARGET_TEAM } from "../../Enums/DOTA_UNIT_TARGET_TEAM"
import { DOTA_UNIT_TARGET_TYPE } from "../../Enums/DOTA_UNIT_TARGET_TYPE"
import { EAbilitySlot } from "../../Enums/EAbilitySlot"
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
import { Entity } from "./Entity"
import { Unit } from "./Unit"

@WrapperClass("CDOTABaseAbility")
export class Ability extends Entity {
	public readonly AbilityData: AbilityData
	@NetworkedBasicField("m_bInIndefiniteCooldown")
	public IsInIndefiniteCooldown = false
	@NetworkedBasicField("m_nMaxLevelOverride")
	public MaxLevelOverride = -1
	@NetworkedBasicField("m_bActivated")
	public IsActivated = false
	@NetworkedBasicField("m_bAltCastState")
	public AltCastState = false
	@NetworkedBasicField("m_bAutoCastState")
	public IsAutoCastEnabled = false
	@NetworkedBasicField("m_bFrozenCooldown")
	public IsCooldownFrozen = false
	@NetworkedBasicField("m_bReplicated")
	public IsReplicated = false
	@NetworkedBasicField("m_bStolen")
	public IsStolen = false
	@NetworkedBasicField("m_iManaCost")
	public NetworkedManaCost = 0
	@NetworkedBasicField("m_flOverrideCastPoint")
	public OverrideCastPoint = -1
	@NetworkedBasicField("m_flCooldownLength")
	public CooldownLength_ = 0
	@NetworkedBasicField("m_flCastStartTime")
	public CastStartTime = 0
	@NetworkedBasicField("m_bToggleState")
	public IsToggled = false
	@NetworkedBasicField("m_nAbilityCurrentCharges")
	public AbilityCurrentCharges = 0
	@NetworkedBasicField("m_iDirtyButtons")
	public DirtyButtons = 0
	@NetworkedBasicField("m_bGrantedByFacet")
	public GrantedByFacet = false

	public Level = 0
	public IsEmpty = false
	public IsHidden = false
	public IsSpellAmplify = true
	public ChannelStartTime = 0
	public AbilityChargeRestoreTimeRemaining = 0
	public AbilitySlot = EAbilitySlot.DOTA_SPELL_SLOT_HIDDEN

	public IsInAbilityPhase_ = false
	public IsInAbilityPhaseChangeTime = 0

	public Cooldown_ = 0
	public CooldownChangeTime = 0
	public CooldownRestore_ = 0
	public CooldownRestoreTime = 0

	public Prediction: Nullable<IPrediction>

	/**@deprecated */
	public readonly ProjectilePath: Nullable<string>

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
			!this.IsAttributes &&
			!this.IsInnateHidden &&
			!this.Name.startsWith("seasonal_")
		)
	}
	public get IsUltimate(): boolean {
		return this.AbilityType === ABILITY_TYPES.ABILITY_TYPE_ULTIMATE
	}
	public get IsAttributes(): boolean {
		return this.AbilityType === ABILITY_TYPES.ABILITY_TYPE_ATTRIBUTES
	}
	public get CanHitSpellImmuneEnemy(): boolean {
		return (
			this.AbilityImmunityType === SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_ALLIES_YES ||
			this.AbilityImmunityType === SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_ENEMIES_YES
		)
	}
	public get CanHitSpellImmuneAlly(): boolean {
		return (
			this.AbilityImmunityType === SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_NONE ||
			this.AbilityImmunityType === SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_ALLIES_YES ||
			this.AbilityImmunityType === SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_ENEMIES_YES
		)
	}
	public get CanBeUsable(): boolean {
		return this.IsValid && !this.IsHidden && this.IsActivated
	}
	public get Owner(): Nullable<Unit> {
		return this.OwnerEntity as Nullable<Unit>
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
	public get SpellDispellableTypeMask(): SPELL_DISPELLABLE_TYPES {
		return this.AbilityData.SpellDispellableType
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
			const amp = this.CastPointAmplifier
			castPoint = amp * this.GetBaseCastPointForLevel(this.Level)
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
		return this.CooldownLength_
	}
	public get IsCooldownReady(): boolean {
		return this.Cooldown === 0
	}
	public get ManaCost(): number {
		const value = Math.max(
			this.NetworkedManaCost,
			this.GetBaseManaCostForLevel(this.Level)
		)
		return value * this.ManaCostAmplifier
	}
	public get IsReady(): boolean {
		if (!this.IsCooldownReady || this.Level === 0) {
			return false
		}
		const owner = this.Owner
		if (owner === undefined || owner.Mana < this.ManaCost) {
			return false
		}
		return true
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
		const owner = this.Owner
		const abilityTexture = GetSpellTexture(this.Name)
		if (owner === undefined) {
			return abilityTexture
		}
		const unitTexture = GetUnitTexture(owner.Name)
		return this.IsInnate && this.IsHidden
			? unitTexture ?? abilityTexture
			: abilityTexture
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
		return this.GetBaseSpeedForLevel(this.Level)
	}
	public get HasAffectedByAOEIncrease() {
		return this.AbilityData.HasAffectedByAOEIncrease
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
	public get BonusCastRange(): number {
		return this.Owner?.BonusCastRange ?? 0
	}
	public get CastPointAmplifier(): number {
		return this.Owner?.BonusCastPointAmplifier ?? 1
	}
	public get ManaCostAmplifier(): number {
		return this.Owner?.BonusManaCostAmplifier ?? 1
	}
	public get CastRangeAmplifier(): number {
		return this.Owner?.CastRangeAmplifier ?? 1
	}
	public get CastRange(): number {
		const amp = this.CastRangeAmplifier,
			bonus = this.GetCastRangeForLevel(this.Level)
		let calculateBonus = bonus * amp
		if (
			calculateBonus !== 0 &&
			this.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET)
		) {
			calculateBonus += this.Owner?.HullRadius ?? 0
		}
		return calculateBonus
	}
	public get BonusAOERadius(): number {
		if (this.Owner === undefined || !this.HasAffectedByAOEIncrease) {
			return 0
		}
		return this.Owner.BonusAOERadius
	}
	public get BonusAOERadiusAmplifier(): number {
		if (this.Owner === undefined || !this.HasAffectedByAOEIncrease) {
			return 1
		}
		return this.Owner.BonusAOERadiusAmplifier
	}
	public get AOERadius(): number {
		const value = this.GetBaseAOERadiusForLevel(this.Level) + this.BonusAOERadius
		return value * this.BonusAOERadiusAmplifier
	}
	public get SkillshotRange(): number {
		return this.CastRange
	}
	// TODO Fix me
	public get SpellAmplification(): number {
		if (this.Name.startsWith("special_bonus_spell_amplify")) {
			return this.GetSpecialValue("value") / 100
		}
		return 0
	}
	public get IsCastRangeFake(): boolean {
		return false
	}
	public get UsesRotation() {
		return false
	}
	public get CurrentCharges() {
		return this.AbilityCurrentCharges
	}
	public set CurrentCharges(newVal: number) {
		this.AbilityCurrentCharges = newVal
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
		return this.GetBaseCastRangeForLevel(level) + this.BonusCastRange
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
	public GetBaseChannelTimeForLevel(level: number): number {
		if (this.AbilityData.HasChannelTimeSpecial) {
			return this.GetSpecialValue("AbilityChannelTime", level)
		}
		return this.AbilityData.GetChannelTime(level)
	}
	public GetCastDelay(
		unit?: Unit | Vector3,
		currentTurnRate: boolean = true,
		rotationDiff: boolean = false
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
		return owner.GetTurnTime(unit, currentTurnRate, rotationDiff) + delay
	}
	public GetHitTime(
		unit: Unit | Vector3,
		currentTurnRate: boolean = true,
		rotationDiff: boolean = false
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
		const castDelay = this.GetCastDelay(unit, currentTurnRate, rotationDiff)
		const delay = castDelay + activationDelay
		return speed > 0 ? owner.Distance2D(unit) / speed + delay : delay
	}
	public GetRawDamage(target: Unit, _health?: number) {
		return !this.IsDebuffImmune(target) ? this.AbilityDamage : 0
	}
	public GetDamage(target: Unit, _manaCost?: number) {
		const owner = this.Owner
		if (owner === undefined) {
			return 0
		}
		const rawDamage = this.GetRawDamage(target, target.HP),
			amplification = target.GetDamageAmplification(
				owner,
				this.DamageType,
				this.IsSpellAmplify,
				this.IsStolen,
				rawDamage
			)
		// TODO: damage block, ex. rune shield etc
		return rawDamage * amplification
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
	public GetSpecialValue(specialName: string, level: number = this.Level): number {
		const owner = this.Owner,
			abilName = this.Name,
			abilityData = this.AbilityData
		return owner === undefined
			? abilityData.GetSpecialValue(specialName, level, abilName)
			: abilityData.GetSpecialValueWithTalent(owner, specialName, level, abilName)
	}
	public IsManaEnough(bonusMana: number = 0): boolean {
		const owner = this.Owner
		if (owner === undefined) {
			return true
		}
		return owner.Mana + bonusMana >= this.ManaCost
	}
	public HasBehavior(flag: DOTA_ABILITY_BEHAVIOR): boolean {
		// don't use AbilityData.HasBehavior() here
		// because it will be overridden by the child classes for AbilityBehaviorMask
		return this.AbilityBehaviorMask.hasMask(flag)
	}
	public HasTargetFlags(flag: DOTA_UNIT_TARGET_FLAGS): boolean {
		return this.TargetFlagsMask.hasMask(flag)
	}
	public HasTargetTeam(flag: DOTA_UNIT_TARGET_TEAM): boolean {
		return this.TargetTeamMask.hasMask(flag)
	}
	public HasTargetType(flag: DOTA_UNIT_TARGET_TYPE): boolean {
		return this.TargetTypeMask.hasMask(flag)
	}
	public HasDispellableType(flag: SPELL_DISPELLABLE_TYPES): boolean {
		return this.SpellDispellableTypeMask.hasMask(flag)
	}
	public CanHit(target: Unit): boolean {
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
		if (range > 0) {
			range += target.HullRadius
		}
		return this.Owner.Distance2D(target) < range
	}
	public CanBeCasted(bonusMana: number = 0): boolean {
		if (!this.CanBeUsable || !this.IsReady) {
			return false
		}
		// TODO: Add other checks
		return this.IsManaEnough(bonusMana)
	}
	public IsDoubleTap(_order: ExecuteOrder): boolean {
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
	protected IsDebuffImmune(target?: Unit): boolean {
		return (
			(target?.IsDebuffImmune ?? false) &&
			this.DamageType === DAMAGE_TYPES.DAMAGE_TYPE_PURE
		)
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
